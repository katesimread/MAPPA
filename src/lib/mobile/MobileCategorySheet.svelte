<script>
  import { categoryFilter, locale } from '../../stores';
  import { categories } from '../categories.js';
  import { t } from '../i18n.js';
  import MobileSheet from './MobileSheet.svelte';
  import { activeSheet } from './mobileStore.js';
  import housingIcon from '$lib/assets/category-housing.png';
  import englishLessonsIcon from '$lib/assets/category-english-lessons.png';
  import suppliesIcon from '$lib/assets/category-supplies.png';
  import skillsIcon from '$lib/assets/category-skills.png';
  import legalSupportIcon from '$lib/assets/category-legal-support.png';
  import otherIcon from '$lib/assets/category-other.png';

  const icons = {
    housing: housingIcon,
    'english-lessons': englishLessonsIcon,
    supplies: suppliesIcon,
    skills: skillsIcon,
    'legal-support': legalSupportIcon
  };

  // Same behaviour as the desktop CategoryFilter: the last row (labelled
  // "Other") clears every active filter rather than filtering to a
  // dedicated "other" category.
  const otherCategory = categories.find((c) => c.value === 'other');
  const options = [
    ...categories.filter((c) => c.value !== 'other'),
    { value: null, labels: otherCategory.labels }
  ];

  function select(value) {
    if (value === null) {
      categoryFilter.set([]);
      return;
    }
    categoryFilter.update((selected) =>
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }

  function close() {
    activeSheet.set(null);
  }
</script>

<MobileSheet
  title={t[$locale].side_panel_title}
  onClose={close}
  maxHeight="75vh"
>
  <div class="list">
    {#each options as option}
      <button
        class="row"
        class:active={option.value !== null &&
          $categoryFilter.includes(option.value)}
        on:click={() => select(option.value)}
      >
        {#if option.value === null}
          <img src={otherIcon} alt="" />
        {:else if icons[option.value]}
          <img src={icons[option.value]} alt="" />
        {/if}
        <span class="label">{option.labels[$locale]}</span>
        {#if option.value !== null && $categoryFilter.includes(option.value)}
          <span class="check">&#10003;</span>
        {/if}
      </button>
    {/each}
  </div>
</MobileSheet>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 60px;
    padding: 10px 16px;
    box-sizing: border-box;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1.05rem;
    color: #422232;
    cursor: pointer;
    text-align: left;
  }

  .row img {
    width: 38px;
    height: auto;
    flex-shrink: 0;
  }

  .row .label {
    flex: 1;
  }

  .row .check {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .row.active {
    background: #422232;
    color: white;
    border-color: #422232;
  }
</style>
