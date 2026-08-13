<script>
  import targetButtonImage from '$lib/assets/target-button.png';
  import searchButtonImage from '$lib/assets/search-button.png';
  import { addOverlayVisible, sidePanelVisible } from '../stores';

  function toggleAddOverlay() {
    addOverlayVisible.update((visible) => !visible);
  }

  function toggleSidePanel() {
    sidePanelVisible.update((visible) => !visible);
  }
</script>

<nav>
  {#if !$sidePanelVisible}
    <button
      on:click={toggleSidePanel}
      class="overlay-trigger overlay-trigger--info-toggle"
      id="info-toggle"
      aria-label="toggle side panel"
    >
      <img
        class="general_button__fadein"
        src={searchButtonImage}
        alt=""
        width="45"
        height="45"
      />
    </button>
  {/if}
  {#if !$addOverlayVisible}
    <button
      on:click={toggleAddOverlay}
      class="overlay-trigger overlay-trigger--add"
      id="add"
      aria-label="toggle add overlay"
    >
      <img
        class="general_button__fadein"
        src={targetButtonImage}
        alt=""
        width="45"
        height="45"
      />
    </button>
  {/if}
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
    z-index: 200;
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
</style>
