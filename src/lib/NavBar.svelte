<script>
  import AddButton from './AddButton.svelte';
  import {
    addOverlayVisible,
    infoPanelVisible,
    translatedToArabic
  } from '../stores';

  function openAddOverlay() {
    addOverlayVisible.update(() => true);
  }

  function toggleInfoPanel() {
    infoPanelVisible.update((visible) => !visible);
  }

  function toggleTranslation() {
    translatedToArabic.update((isTranslated) => !isTranslated);
  }
</script>

<nav>
  <button
    on:click={toggleInfoPanel}
    class="overlay-trigger overlay-trigger--info-toggle"
    id="info-toggle"
    aria-label="toggle information panel"
  >
    <AddButton />
  </button>
  <button
    on:click={toggleTranslation}
    class="overlay-trigger overlay-trigger--translate"
    id="translate"
    aria-label="toggle Arabic translation"
  >
    {$translatedToArabic ? 'English' : 'العربية'}
  </button>
  <button
    on:click={openAddOverlay}
    class="overlay-trigger overlay-trigger--add"
    id="add"
    aria-label="open add overlay"
  >
    <AddButton />
  </button>
</nav>

<style>
  /****************************************************************************/
  /* The menu buttons (info and add). */
  /****************************************************************************/
  .overlay-trigger {
    border: none;
    background-color: transparent;
    padding: 0;
    top: 0;
    font-size: 2.4em;
    cursor: pointer;
    font-weight: bold;
    position: fixed;
    z-index: var(--overlay-trigger-z-index);
    color: var(--color-dark);
  }

  @media (min-width: 800px) {
    .overlay-trigger {
      top: 0.5em;
    }
  }
  /* Specifically for the add button  */
  .overlay-trigger.overlay-trigger--add {
    right: 9px;
    top: 9px;
  }

  /* Specifically for the info panel toggle button  */
  .overlay-trigger.overlay-trigger--info-toggle {
    left: 9px;
    top: 9px;
  }

  /* Specifically for the translate button  */
  .overlay-trigger.overlay-trigger--translate {
    left: 9px;
    top: 63px;
    font-size: 0.6em;
    background: #fff;
    border-radius: 4px;
    padding: 6px 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    color: var(--color-dark);
    min-width: 60px;
    text-align: center;
  }
</style>
