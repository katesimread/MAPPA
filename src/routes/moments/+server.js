import { json } from '@sveltejs/kit';
import { supabase } from '$lib/clients/supabaseClient';
import { CLOUDFLARE_TURNSTILE_SECRET } from '$env/static/private';

export async function POST({ request }) {
  const { lng, lat, description, category, link, captchaToken } =
    await request.json();

  if (!captchaToken) {
    return json({ error: 'CAPTCHA token is missing.' }, { status: 400 });
  }

  if (!description?.trim()) {
    return json({ error: 'Description cannot be empty.' }, { status: 400 });
  }

  const BRITISH_ISLES_BOUNDS = {
    minLng: -10.6,
    maxLng: 1.8,
    minLat: 49.9,
    maxLat: 60.9
  };
  if (
    lng < BRITISH_ISLES_BOUNDS.minLng ||
    lng > BRITISH_ISLES_BOUNDS.maxLng ||
    lat < BRITISH_ISLES_BOUNDS.minLat ||
    lat > BRITISH_ISLES_BOUNDS.maxLat
  ) {
    return json(
      { error: 'Location must be within the British Isles.' },
      { status: 400 }
    );
  }

  const captchaVerifyUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const captchaSecret = CLOUDFLARE_TURNSTILE_SECRET;

  const verifyResponse = await fetch(captchaVerifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      secret: captchaSecret,
      response: captchaToken
    })
  });

  const captchaResult = await verifyResponse.json();

  if (!captchaResult.success) {
    return json({ error: 'CAPTCHA verification failed.' }, { status: 400 });
  }

  const { error } = await supabase.from('moments').insert([
    {
      description,
      category,
      link: link || null,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      status: 'pending'
    }
  ]);

  if (error) {
    console.error('Error saving new moment:', error);
    return json({ error: 'Error saving new moment' }, { status: 500 });
  }

  return json({}, { status: 201 });
}
