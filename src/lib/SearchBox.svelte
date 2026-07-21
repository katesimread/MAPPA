<script>
  import { PUBLIC_OS_API_KEY } from '$env/static/public';
  import { searchLocation, translatedToArabic } from '../stores';
  import proj4 from 'proj4';

  proj4.defs(
    'EPSG:27700',
    '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.1502,0.247,0.8421,-20.4894 +units=m +no_defs'
  );

  function bngToWgs84(easting, northing) {
    const [lng, lat] = proj4('EPSG:27700', 'EPSG:4326', [easting, northing]);
    return { lng, lat };
  }

  // Keep in sync with BRITISH_ISLES_BOUNDS in src/lib/Map.svelte
  const NOMINATIM_VIEWBOX = '-10.6,60.9,1.8,49.9';

  let query = '';
  let results = [];
  let error = '';
  let loading = false;

  async function searchOS() {
    const res = await fetch(
      `https://api.os.uk/search/names/v1/find?query=${encodeURIComponent(query)}&key=${PUBLIC_OS_API_KEY}`
    );
    const data = await res.json();
    return (data.results ?? []).map((result) => {
      const entry = result.GAZETTEER_ENTRY;
      const { lng, lat } = bngToWgs84(entry.GEOMETRY_X, entry.GEOMETRY_Y);
      return {
        label: entry.NAME1,
        detail: entry.COUNTY_UNITARY ?? '',
        lng,
        lat,
        type: entry.LOCAL_TYPE,
        source: 'os'
      };
    });
  }

  async function searchNominatim() {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=gb&bounded=1&viewbox=${NOMINATIM_VIEWBOX}&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.map((result) => {
      const parts = result.display_name.split(',').map((part) => part.trim());
      return {
        label: parts[0],
        detail: parts.slice(1, 3).join(', '),
        lng: parseFloat(result.lon),
        lat: parseFloat(result.lat),
        type: result.type,
        source: 'osm'
      };
    });
  }

  async function searchGoogle() {
    const res = await fetch(`/places-search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results ?? [];
  }

  async function search() {
    if (!query.trim()) return;
    loading = true;
    error = '';
    results = [];

    try {
      const [osResults, osmResults, googleResults] = await Promise.all([
        searchOS().catch(() => []),
        searchNominatim().catch(() => []),
        searchGoogle().catch(() => [])
      ]);
      results = [
        ...googleResults.slice(0, 5),
        ...osResults.slice(0, 5),
        ...osmResults.slice(0, 5)
      ];
      if (results.length === 0) error = 'No results found.';
    } catch (e) {
      error = 'Search failed. Please try again.';
    } finally {
      loading = false;
    }
  }

  function select(result) {
    searchLocation.set({
      lng: result.lng,
      lat: result.lat,
      type: result.type,
      source: result.source,
      label: result.label
    });
    results = [];
    query = result.label;
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') search();
  }
</script>

<div class="search-box">
  <div class="search-input-row">
    <input
      type="text"
      placeholder={$translatedToArabic
        ? 'ابحث عن مكان أو شارع أو متجر'
        : 'Search for a place, street, or shop...'}
      dir={$translatedToArabic ? 'rtl' : 'ltr'}
      bind:value={query}
      on:keydown={handleKeydown}
    />
    <button on:click={search} disabled={loading}>
      {loading ? '...' : $translatedToArabic ? 'بحث' : 'Search'}
    </button>
  </div>

  {#if error}
    <p class="search-error">{error}</p>
  {/if}

  {#if results.length > 0}
    <ul class="search-results">
      {#each results as result}
        <li>
          <button on:click={() => select(result)}>
            {result.label}
            {#if result.detail}
              <span class="result-detail">{result.detail}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .search-box {
    position: relative;
    width: 100%;
  }

  .search-input-row {
    display: flex;
    gap: 4px;
  }

  input {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  button {
    padding: 8px 12px;
    background: #422232;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  button:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
    background: white;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .search-results li button {
    width: 100%;
    text-align: left;
    background: white;
    color: #222;
    padding: 10px 12px;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-results li button:hover {
    background: #f5e6ed;
  }

  .result-detail {
    font-size: 12px;
    color: #888;
  }

  .search-error {
    margin: 4px 0 0;
    padding: 8px 12px;
    background: white;
    border-radius: 4px;
    font-size: 13px;
    color: #c00;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
</style>
