import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/clients/supabaseClient';
import { locales } from '$lib/i18n.js';

const LOCALE_CODES = new Set(locales.map((l) => l.code));

export async function GET({ params, url }) {
  const { id } = params;
  const lang = url.searchParams.get('lang');

  const { data, error: dbError } = await supabase
    .from('moments')
    .select('title, description, link, translations')
    .eq('short_id', Number(id))
    .eq('status', 'approved')
    .single();

  if (dbError || !data) {
    throw error(404, 'Description not found');
  }

  const translation =
    lang && lang !== 'en' && LOCALE_CODES.has(lang)
      ? data.translations?.[lang]
      : null;

  return json({
    short_id: id,
    title: translation?.title || data.title,
    description: translation?.description || data.description,
    link: data.link
  });
}
