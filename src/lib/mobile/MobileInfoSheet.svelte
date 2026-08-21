<script>
  import { locale } from '../../stores';
  import { t } from '../i18n.js';
  import MobileSheet from './MobileSheet.svelte';
  import { activeSheet } from './mobileStore.js';

  function close() {
    activeSheet.set(null);
  }
</script>

<MobileSheet title={t[$locale].info_button} onClose={close} maxHeight="70vh">
  <div class="content">
    {#each t[$locale].info_paragraphs as paragraph}
      <p>{paragraph}</p>
    {/each}
  </div>
</MobileSheet>

<style>
  .content {
    color: var(--color-dark, #231f20);
    font-size: 1rem;
    line-height: 1.5;
  }

  .content p:first-child {
    margin-top: 0;
  }
</style>
