<script>
  import { categoryFilter } from '../stores';

  const options = [
    { value: null, label: 'All' },
    { value: 'housing', label: 'Housing' },
    { value: 'english-lessons', label: 'English Lessons' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'skills', label: 'Skills' },
    { value: 'legal-support', label: 'Legal Support' },
    { value: 'other', label: 'Other' }
  ];

  function select(value) {
    categoryFilter.set(value);
  }
</script>

<div class="category-filter">
  {#each options as option}
    <button
      class:active={$categoryFilter === option.value}
      on:click={() => select(option.value)}
    >
      {option.label}
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
