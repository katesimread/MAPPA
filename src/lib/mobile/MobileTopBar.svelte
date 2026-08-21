<script>
  import { locale } from '../../stores';
  import { locales, t } from '../i18n.js';
  import SearchBox from '../SearchBox.svelte';
  import { activeSheet } from './mobileStore.js';

  function openInfo() {
    activeSheet.set('info');
  }
</script>

<header class="topbar">
  <select
    bind:value={$locale}
    class="lang"
    aria-label="choose language"
  >
    {#each locales as l}
      <option value={l.code}>{l.label}</option>
    {/each}
  </select>
  <div class="search-wrap">
    <SearchBox></SearchBox>
  </div>
  <button
    class="info-btn"
    on:click={openInfo}
    aria-label={t[$locale].info_button}
  >
    i
  </button>
</header>

<style>
  .topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 300;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: calc(10px + env(safe-area-inset-top)) 10px 10px;
    background: #f0f0f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }

  .lang {
    flex: 0 0 auto;
    width: 68px;
    height: 48px;
    font-size: 0.95rem;
    font-weight: bold;
    border: 1.5px solid var(--color-dark, #231f20);
    border-radius: 8px;
    background: transparent;
    color: var(--color-dark, #231f20);
  }

  .search-wrap {
    flex: 1;
    min-width: 0;
  }

  .info-btn {
    flex: 0 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1.5px solid var(--color-dark, #231f20);
    background: var(--color-pink, #f4b9d6);
    color: var(--color-dark, #231f20);
    font-weight: bold;
    font-size: 1.3rem;
    font-style: italic;
    font-family: Georgia, serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Enlarge the reused SearchBox's inner controls for touch, without
     modifying SearchBox.svelte itself. */
  .search-wrap :global(.search-box input) {
    height: 48px;
    box-sizing: border-box;
    font-size: 1rem;
    border-radius: 8px;
  }

  .search-wrap :global(.search-box button) {
    height: 48px;
    box-sizing: border-box;
    padding: 0 16px;
    font-size: 1rem;
    border-radius: 8px;
  }

  .search-wrap :global(.search-results) {
    border-radius: 8px;
  }

  .search-wrap :global(.search-results li button) {
    min-height: 52px;
    font-size: 1rem;
  }
</style>
