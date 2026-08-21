<script>
  import '$lib/mobile/mobile.css';
  import MobileMap from '$lib/mobile/MobileMap.svelte';
  import MobileTopBar from '$lib/mobile/MobileTopBar.svelte';
  import MobileDock from '$lib/mobile/MobileDock.svelte';
  import MobileCategorySheet from '$lib/mobile/MobileCategorySheet.svelte';
  import MobileAddSheet from '$lib/mobile/MobileAddSheet.svelte';
  import MobileInfoSheet from '$lib/mobile/MobileInfoSheet.svelte';
  import MobileMomentSheet from '$lib/mobile/MobileMomentSheet.svelte';
  import { activeSheet } from '$lib/mobile/mobileStore.js';
  import qtm_sharing_image from '$lib/assets/qtm_sharing_image.jpg';
</script>

<svelte:head>
  <title>MAPPA</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta
    name="description"
    content="Queering the Map is a community generated counter-mapping platform for digitally archiving LGBTQ2IA+ experience in relation to physical space."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.queeringthemap.com/mobile" />
  <meta property="og:title" content="Queering The Map" />
  <meta property="og:image" content={qtm_sharing_image} />
  <meta
    property="og:description"
    content="Queering the Map is a community generated counter-mapping platform for digitally archiving LGBTQ2IA+ experience in relation to physical space."
  />
  <meta property="og:site_name" content="Queering The Map" />
  <meta property="og:locale" content="en_US" />
</svelte:head>

<div class="mobile-app">
  <MobileMap></MobileMap>
  <MobileTopBar></MobileTopBar>
  <MobileDock></MobileDock>

  {#if $activeSheet === 'filter'}
    <MobileCategorySheet></MobileCategorySheet>
  {:else if $activeSheet === 'add'}
    <MobileAddSheet></MobileAddSheet>
  {:else if $activeSheet === 'info'}
    <MobileInfoSheet></MobileInfoSheet>
  {:else if $activeSheet === 'moment'}
    <MobileMomentSheet></MobileMomentSheet>
  {/if}
</div>

<style>
  .mobile-app {
    position: fixed;
    inset: 0;
    overflow: hidden;
  }
</style>
