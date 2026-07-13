<script>
  import AddButton from './AddButton.svelte';
  import { addOverlayVisible } from '../stores';

  function openAddOverlay() {
    addOverlayVisible.update(() => true);
  }
</script>

<nav>
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
</style>
