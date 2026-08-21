<script>
  import { fly, fade } from 'svelte/transition';

  export let title = '';
  export let onClose;
  export let maxHeight = '70vh';
</script>

<div
  class="sheet-backdrop"
  role="button"
  tabindex="0"
  aria-label="close"
  on:click={onClose}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
  transition:fade={{ duration: 200 }}
></div>
<div
  class="sheet"
  style="max-height: {maxHeight}"
  transition:fly={{ y: 320, duration: 250 }}
  role="dialog"
  aria-modal="true"
  aria-label={title}
>
  <button class="sheet-handle" on:click={onClose} aria-label="close"></button>
  <div class="sheet-header">
    <span class="sheet-title">{title}</span>
    <button class="sheet-close" on:click={onClose} aria-label="close">
      &times;
    </button>
  </div>
  <div class="sheet-body">
    <slot />
  </div>
</div>

<style>
  .sheet-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 900;
  }

  .sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 901;
    display: flex;
    flex-direction: column;
    background: #f0f0f0;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
  }

  .sheet-handle {
    width: 100%;
    padding: 12px 0 6px;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  .sheet-handle::after {
    content: '';
    display: block;
    width: 44px;
    height: 5px;
    margin: 0 auto;
    border-radius: 3px;
    background: #ccc;
  }

  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 20px 14px;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
  }

  .sheet-title {
    font-weight: bold;
    font-size: 1.15rem;
    color: var(--color-dark, #231f20);
    line-height: 1.3;
  }

  .sheet-close {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.06);
    color: var(--color-dark, #231f20);
    font-size: 1.6rem;
    line-height: 1;
    cursor: pointer;
  }

  .sheet-body {
    overflow-y: auto;
    padding: 18px 20px calc(20px + env(safe-area-inset-bottom));
    -webkit-overflow-scrolling: touch;
  }
</style>
