<script>
  import '$lib/style.css';
  import '$lib/maplibre_style.css';
  import '$lib/navbar_buttons.css';
  import AddOverlay from '$lib/AddOverlay.svelte';
  import InfoOverlay from '$lib/InfoOverlay.svelte';
  import Map from '$lib/Map.svelte';
  import NavBar from '$lib/NavBar.svelte';
  import { addOverlayVisible, infoOverlayVisible } from '../stores';
  import qtm_sharing_image from '$lib/assets/qtm_sharing_image.jpg';
  import SearchBox from '$lib/SearchBox.svelte';
  import CategoryFilter from '$lib/CategoryFilter.svelte';
</script>

<svelte:head>
  <title>MAPPA</title>
  <meta
    name="description"
    content="Queering the Map is a community generated counter-mapping platform for digitally archiving LGBTQ2IA+ experience in relation to physical space."
  />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.queeringthemap.com/" />
  <meta property="og:title" content="Queering The Map" />
  <meta property="og:image" content={qtm_sharing_image} />
  <meta
    property="og:description"
    content="Queering the Map is a community generated counter-mapping platform for digitally archiving LGBTQ2IA+ experience in relation to physical space."
  />
  <meta property="og:site_name" content="Queering The Map" />
  <meta property="og:locale" content="en_US" />
  <meta
    name="google-site-verification"
    content="J-oUgPBYWRXkPhvqF8XBrDtrA-qu8pXiMiYPd3QrfhE"
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Queering The Map" />
  <meta
    name="twitter:description"
    content="Queering the Map is a community generated counter-mapping platform for digitally archiving LGBTQ2IA+ experience in relation to physical space."
  />
  <meta name="twitter:image" content={qtm_sharing_image} />
</svelte:head>

<div class="layout">
  <aside class="info-panel">
    <h1>MAPPA</h1>
    <p>
      MAPPA is a project that helps refugees and asylum seekers find services
      in the UK.
    </p>
    <p>
      You can use the interactive map to search for charities and other
      organisations in your area, as well as to leave suggestions for other
      people.
    </p>
    <p>
      You can use the filter buttons below to look for help with housing,
      English lessons, supplies (clothes, toiletries etc.), skills, legal
      support, or anything else.
    </p>
    <p>
      The aim is to create a community map where people can share knowledge to
      make accessing help easier.
    </p>
  </aside>

  <div class="map-panel">
    <NavBar></NavBar>
    {#if $infoOverlayVisible}
      <InfoOverlay></InfoOverlay>
    {/if}
    {#if $addOverlayVisible}
      <AddOverlay></AddOverlay>
    {/if}
    <Map></Map>
    <SearchBox></SearchBox>
    <CategoryFilter></CategoryFilter>
  </div>
</div>

<style>
  :global(html, body) {
    height: 100%;
    overflow: hidden;
  }

  .layout {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  .info-panel {
    width: 33.333%;
    height: 100%;
    overflow-y: auto;
    padding: 2rem;
    box-sizing: border-box;
    background: #fff;
    border-right: 1px solid #e0e0e0;
  }

  .info-panel h1 {
    margin-top: 0;
    font-size: 1.4rem;
  }

  .map-panel {
    width: 66.666%;
    height: 100%;
    position: relative;
  }
</style>
