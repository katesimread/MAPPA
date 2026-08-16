import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { locales } from '../i18n.js';

if (!process.env.VITE_SUPABASE_URL) {
  config();
}

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

if (!googleApiKey) {
  console.error('Missing GOOGLE_TRANSLATE_API_KEY.');
  process.exit(1);
}

// Service role key bypasses RLS, needed because the anon key (used
// everywhere else) has no UPDATE policy on moments.
const supabaseAdmin = createClient(url, serviceRoleKey);

const TARGET_LOCALES = locales
  .map((l) => l.code)
  .filter((code) => code !== 'en');

async function detectLanguage(text) {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2/detect?key=${googleApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text })
    }
  );
  const result = await response.json();
  return result?.data?.detections?.[0]?.[0]?.language ?? null;
}

async function translateTexts(texts, target, source) {
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        target,
        source: source || undefined,
        format: 'text'
      })
    }
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result?.error?.message || `Translation failed for target "${target}"`
    );
  }
  return result.data.translations.map((t) => t.translatedText);
}

async function translateMoment(moment) {
  const existing = moment.translations || {};
  const missingLocales = TARGET_LOCALES.filter((code) => !existing[code]);
  if (missingLocales.length === 0) {
    return null;
  }

  const sourceText = moment.title || moment.description || '';
  const sourceLanguage = sourceText ? await detectLanguage(sourceText) : null;

  // No need to translate into the language the moment was already written in
  // - the popup falls back to the original title/description for that locale.
  const localesToTranslate = missingLocales.filter(
    (code) => code !== sourceLanguage
  );
  if (localesToTranslate.length === 0) {
    return existing;
  }

  const translations = { ...existing };
  for (const code of localesToTranslate) {
    const [translatedTitle, translatedDescription] = await translateTexts(
      [moment.title || '', moment.description || ''],
      code,
      sourceLanguage
    );
    translations[code] = {
      title: moment.title ? translatedTitle : null,
      description: moment.description ? translatedDescription : null
    };
  }

  return translations;
}

async function run() {
  const { data: moments, error } = await supabaseAdmin
    .from('moments')
    .select('id, short_id, title, description, translations')
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching approved moments:', error);
    process.exit(1);
  }

  let translatedCount = 0;

  for (const moment of moments) {
    try {
      const translations = await translateMoment(moment);
      if (!translations) {
        continue;
      }

      const { error: updateError } = await supabaseAdmin
        .from('moments')
        .update({ translations })
        .eq('id', moment.id);

      if (updateError) {
        console.error(
          `Error saving translations for moment ${moment.short_id}:`,
          updateError
        );
        continue;
      }
      translatedCount++;
    } catch (err) {
      console.error(`Error translating moment ${moment.short_id}:`, err);
    }
  }

  console.log(`Translated ${translatedCount} moment(s).`);
}

run();
