import { json } from '@sveltejs/kit';
import { GOOGLE_PLACES_API_KEY } from '$env/static/private';

// Keep in sync with BRITISH_ISLES_BOUNDS in src/lib/Map.svelte
const BRITISH_ISLES_BOUNDS = {
  minLng: -10.6,
  maxLng: 1.8,
  minLat: 49.9,
  maxLat: 60.9
};

export async function GET({ url, fetch }) {
  const query = url.searchParams.get('q')?.trim();

  if (!query) {
    return json({ results: [] });
  }

  const response = await fetch(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask':
          'places.displayName,places.formattedAddress,places.location,places.types'
      },
      body: JSON.stringify({
        textQuery: query,
        regionCode: 'GB',
        locationRestriction: {
          rectangle: {
            low: {
              latitude: BRITISH_ISLES_BOUNDS.minLat,
              longitude: BRITISH_ISLES_BOUNDS.minLng
            },
            high: {
              latitude: BRITISH_ISLES_BOUNDS.maxLat,
              longitude: BRITISH_ISLES_BOUNDS.maxLng
            }
          }
        }
      })
    }
  );

  if (!response.ok) {
    return json({ results: [] });
  }

  const data = await response.json();
  const results = (data.places ?? []).map((place) => ({
    label: place.displayName?.text ?? '',
    detail: place.formattedAddress ?? '',
    lng: place.location?.longitude,
    lat: place.location?.latitude,
    type: place.types?.[0] ?? '',
    source: 'google'
  }));

  return json({ results });
}
