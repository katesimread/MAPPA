import { json, error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

let descriptionsCache = null;
let loadingPromise = null;

async function loadDescriptions() {
  if (descriptionsCache) {
    return descriptionsCache;
  }

  if (!loadingPromise) {
    const descriptionsFilePath = path.resolve(
      'static/data',
      'descriptions.json'
    );

    loadingPromise = fs
      .readFile(descriptionsFilePath, 'utf8')
      .then((fileContent) => {
        descriptionsCache = JSON.parse(fileContent);
        return descriptionsCache;
      })
      .catch((err) => {
        console.error('Error reading descriptions file:', err);
        throw error(500, 'Error fetching moment text');
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
}

export async function GET({ params }) {
  const { id } = params;

  try {
    const descriptions = await loadDescriptions();

    if (!descriptions) {
      throw error(500, 'Descriptions cache is empty');
    }

    const description = descriptions[Number(id)];

    if (!description) {
      throw error(404, 'Description not found');
    }

    return json({ short_id: id, description });
  } catch (err) {
    console.error('Error fetching moment text:', err);
    throw error(500, 'Error fetching moment text');
  }
}
