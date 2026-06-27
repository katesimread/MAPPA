import { supabase } from '../clients/supabaseClient';
import fs from 'fs';
import path from 'path';
import { roundCoordinates } from '$lib/utils/utils';

export async function fetchIdCoords() {
  const { data, error } = await supabase
    .from('moments')
    .select('short_id, location')
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching id and coordinate pairs:', error);
    return null;
  }

  const geoJson = {
    type: 'FeatureCollection',
    features: data.map((moment) => ({
      type: 'Feature',
      id: moment.short_id,
      geometry: {
        type: 'Point',
        coordinates: roundCoordinates(moment.location.coordinates, 6)
      },
      properties: {}
    }))
  };

  return geoJson;
}

export async function fetchIdDescriptions() {
  const { data, error } = await supabase
    .from('moments')
    .select('short_id, description')
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching id and description pairs:', error);
    return null;
  }

  const descriptions = data.reduce((acc, moment) => {
    acc[moment.short_id] = moment.description;
    return acc;
  }, {});

  return descriptions;
}

export async function writeGeoJsonToFile(geoJson) {
  const outputDir = path.resolve('static/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const simplifiedGeoJson = {
    ...geoJson,
    // eslint-disable-next-line no-unused-vars
    features: geoJson.features.map(({ properties, ...rest }) => rest)
  };

  const filePath = path.resolve(outputDir, 'moments.json');
  await fs.promises.writeFile(filePath, JSON.stringify(simplifiedGeoJson));
  return filePath;
}

export async function writeDescriptionsToFile(descriptions) {
  const outputDir = path.resolve('static/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.resolve(outputDir, 'descriptions.json');
  await fs.promises.writeFile(filePath, JSON.stringify(descriptions));
  return filePath;
}

export async function fetchAndWriteData() {
  const geoJson = await fetchIdCoords();
  const descriptions = await fetchIdDescriptions();

  if (!geoJson || !descriptions) {
    console.error('Failed to fetch data, aborting file write.');
    process.exit(1);
  }

  const geoJsonFilePath = await writeGeoJsonToFile(geoJson);
  const descriptionsFilePath = await writeDescriptionsToFile(descriptions);

  console.log(
    `Fetched ${geoJson.features.length} moments and saved to ${geoJsonFilePath}`
  );
  console.log(
    `Fetched ${Object.keys(descriptions).length} descriptions and saved to ${descriptionsFilePath}`
  );
}

fetchAndWriteData().catch((err) => {
  console.error('Error in fetchAndWriteData:', err);
  process.exit(1);
});
