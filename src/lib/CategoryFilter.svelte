<script>
  import { categoryFilter, translatedToArabic } from '../stores';
  import { categories } from './categories.js';

  const options = [{ value: null, en: 'All', ar: 'الكل' }, ...categories];

  function select(value) {
    categoryFilter.set(value);
  }
</script>

<div class="category-filter" dir={$translatedToArabic ? 'rtl' : 'ltr'}>
  {#each options as option}
    <button
      class:active={$categoryFilter === option.value}
      on:click={() => select(option.value)}
    >
      {$translatedToArabic ? option.ar : option.en}
    </button>
  {/each}
</div>

<style>
  .category-filter {
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 10;
    display: flex;
    gap: 4px;
  }

  button {
    padding: 8px 12px;
    background: white;
    color: #422232;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  button.active {
    background: #422232;
    color: white;
  }
</style>
