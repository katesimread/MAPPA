<script>
  import { locale } from '../../stores';
  import { t } from '../i18n.js';
  import MobileSheet from './MobileSheet.svelte';
  import { activeSheet, activeMoment } from './mobileStore.js';

  function close() {
    activeSheet.set(null);
    activeMoment.set(null);
  }
</script>

{#if $activeMoment}
  <MobileSheet
    title={$activeMoment.title || ''}
    onClose={close}
    maxHeight="55vh"
  >
    <p class="description">{$activeMoment.description}</p>
    {#if $activeMoment.link}
      <a
        class="link-btn"
        href={$activeMoment.link}
        target="_blank"
        rel="noopener"
      >
        {t[$locale].website_link}
      </a>
    {/if}
  </MobileSheet>
{/if}

<style>
  .description {
    color: var(--color-dark, #231f20);
    font-size: 1.05rem;
    line-height: 1.5;
    white-space: pre-wrap;
    margin-top: 0;
  }

  .link-btn {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 14px;
    padding: 14px 0;
    text-align: center;
    font-size: 1.05rem;
    font-weight: bold;
    text-decoration: none;
    color: var(--color-dark, #231f20);
    background: transparent;
    border: 1.5px solid var(--color-dark, #231f20);
    border-radius: 10px;
  }
</style>
