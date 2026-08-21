<script>
  import searchButtonImage from '$lib/assets/search-button.png';
  import targetButtonImage from '$lib/assets/target-button.png';
  import { locale } from '../../stores';
  import { t } from '../i18n.js';
  import { activeSheet } from './mobileStore.js';

  function openFilter() {
    activeSheet.set('filter');
  }

  function openAdd() {
    activeSheet.set('add');
  }
</script>

<!-- Hidden while a sheet is open so it can never sit on top of / overlap one. -->
{#if $activeSheet === null}
  <nav class="dock">
    <button
      class="dock-btn"
      on:click={openFilter}
      aria-label={t[$locale].side_panel_title}
    >
      <img src={searchButtonImage} alt="" />
    </button>
    <button
      class="dock-btn dock-btn--add"
      on:click={openAdd}
      aria-label={t[$locale].add_button}
    >
      <img src={targetButtonImage} alt="" />
    </button>
  </nav>
{/if}

<style>
  .dock {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
    pointer-events: none;
    box-sizing: border-box;
  }

  .dock-btn {
    pointer-events: all;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid var(--color-dark, #231f20);
    background: var(--color-pink, #f4b9d6);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    padding: 0;
  }

  .dock-btn img {
    width: 34px;
    height: 34px;
  }

  .dock-btn:active {
    transform: scale(0.95);
  }
</style>
