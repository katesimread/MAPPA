<script>
  import '$lib/style.css';
  import '$lib/maplibre_style.css';
  import '$lib/navbar_buttons.css';
  import AddOverlay from '$lib/AddOverlay.svelte';
  import InfoOverlay from '$lib/InfoOverlay.svelte';
  import Map from '$lib/Map.svelte';
  import NavBar from '$lib/NavBar.svelte';
  import {
    addOverlayVisible,
    infoOverlayVisible,
    infoPanelVisible,
    sidePanelVisible,
    locale
  } from '../stores';
  import { locales, rtlLocales, t } from '$lib/i18n.js';
  import qtm_sharing_image from '$lib/assets/qtm_sharing_image.jpg';
  import logo from '$lib/assets/logo.png';
  import SearchBox from '$lib/SearchBox.svelte';
  import CategoryFilter from '$lib/CategoryFilter.svelte';
  import { fade, fly } from 'svelte/transition';

  function closeInfoPanel() {
    infoPanelVisible.set(false);
  }

  function openInfoPanel() {
    infoPanelVisible.set(true);
  }

  function closeSidePanel() {
    sidePanelVisible.set(false);
  }

  $: isRTL = rtlLocales.has($locale);
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

<header class="top-bar">
  <select
    bind:value={$locale}
    class="top-bar__translate"
    aria-label="choose language"
  >
    {#each locales as l}
      <option value={l.code}>{l.label}</option>
    {/each}
  </select>
  <div class="top-bar__search">
    <SearchBox></SearchBox>
  </div>
  <button
    on:click={openInfoPanel}
    class="top-bar__info"
    aria-label="show information panel"
  >
    {t[$locale].info_button}
  </button>
</header>

<div class="layout">
  {#if $sidePanelVisible}
    <aside class="side-panel" transition:fly={{ x: -100, duration: 300 }}>
      <button
        class="side-panel-close"
        on:click={closeSidePanel}
        aria-label="close side panel"
      >
        &times;
      </button>
      <span class="side-panel-title">
        {t[$locale].side_panel_title}
      </span>
      <div class="side-panel-content">
        <CategoryFilter></CategoryFilter>
      </div>
    </aside>
  {/if}

  {#if $infoPanelVisible}
    <div class="info-panel-backdrop" transition:fade={{ duration: 300 }}></div>
    <aside
      class="info-panel"
      class:info-panel--shifted={$addOverlayVisible}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <button
        class="info-panel-close"
        on:click={closeInfoPanel}
        aria-label="close information panel"
      >
        &times;
      </button>
      <img class="info-panel-logo" src={logo} alt="MAPPA" />
      <div class="info-content">
        {#each t[$locale].info_paragraphs as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>
    </aside>
  {/if}

  <div class="map-panel">
    <NavBar></NavBar>
    {#if $infoOverlayVisible}
      <InfoOverlay></InfoOverlay>
    {/if}
    <Map></Map>
  </div>

  {#if $addOverlayVisible}
    <AddOverlay></AddOverlay>
  {/if}
</div>

<style>
  :global(html, body) {
    height: 100%;
    overflow: hidden;
  }

  .top-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--top-bar-height);
    z-index: var(--logo-z-index);
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0 16px;
    background: #f0f0f0;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
  }

  .top-bar__translate,
  .top-bar__info {
    border: none;
    background: transparent;
    color: var(--color-dark);
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    padding: 6px 10px;
    border: 1px solid var(--color-dark);
    border-radius: 4px;
  }

  .top-bar__translate {
    font-family: inherit;
    max-width: 120px;
  }

  .top-bar__search {
    width: min(320px, 100%);
  }

  .layout {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  .side-panel {
    position: fixed;
    top: 9px;
    left: 9px;
    width: fit-content;
    max-width: 33.333%;
    max-height: calc(100% - 9px - var(--top-bar-height) - 9px);
    z-index: var(--overlay-z-index);
    overflow-y: auto;
    padding: 0.5rem 1rem 16px 0.5rem;
    box-sizing: border-box;
    background: #f0f0f0;
    border: 1px solid #e0e0e0;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
  }

  .side-panel-title {
    display: block;
    max-width: 100px;
    margin: 0 auto 0.5rem;
    text-align: center;
    padding-top: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: #422232;
  }

  .side-panel-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    padding: 0;
    color: var(--color-dark);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
  }

  .side-panel-content {
    flex: 1;
  }

  .info-panel-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000000;
  }

  .info-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: left 300ms ease;
    z-index: 1000001;
    width: min(90vw, 480px);
    max-height: 85vh;
    overflow-y: auto;
    padding: 2rem;
    box-sizing: border-box;
    background: #f0f0f0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
  }

  .info-panel-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    padding: 0;
    color: var(--color-dark);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
  }

  .info-panel-logo {
    display: block;
    margin: 0 auto 1.5rem;
    height: 3.5rem;
    width: auto;
  }

  .info-content {
    flex: 1;
  }

  .map-panel {
    flex: 1;
    height: 100%;
    position: relative;
    min-width: 0;
    transition: flex 300ms ease;
  }

  @media (max-width: 800px) {
    .top-bar {
      padding: 0 8px;
      gap: 0.5rem;
    }

    .top-bar__translate,
    .top-bar__info {
      font-size: 0.8rem;
      padding: 4px 8px;
    }

    .top-bar__search {
      flex: 1;
      width: auto;
    }

    .side-panel {
      width: calc(100% - 18px);
      max-width: none;
      max-height: 70vh;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
      padding: 1.25rem 1.25rem 16px 1.25rem;
    }

    .info-panel {
      width: calc(100vw - 2.5rem);
      max-height: 80vh;
      padding: 1.25rem;
    }
  }

  @media (min-width: 800px) {
    .info-panel--shifted {
      left: 25%;
    }
  }
</style>
