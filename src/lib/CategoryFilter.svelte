<script>
  import { categoryFilter, locale } from '../stores';
  import { rtlLocales } from './i18n.js';
  import { categories } from './categories.js';
  import suppliesIcon from '$lib/assets/category-supplies.png';
  import housingIcon from '$lib/assets/category-housing.png';
  import englishLessonsIcon from '$lib/assets/category-english-lessons.png';
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

  const otherCategory = categories.find((category) => category.value === 'other');

  const options = [
    ...categories.filter((category) => category.value !== 'other'),
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
</script>

<div class="category-filter" dir={rtlLocales.has($locale) ? 'rtl' : 'ltr'}>
  {#each options as option}
    <button
      class:active={option.value !== null &&
        $categoryFilter.includes(option.value)}
      on:click={() => select(option.value)}
    >
      {#if option.value === null}
        <img src={otherIcon} alt="" />
      {:else if icons[option.value]}
        <img src={icons[option.value]} alt="" />
      {/if}
      <span>{option.labels[$locale]}</span>
    </button>
  {/each}
</div>

<style>
  .category-filter {
    display: grid;
    grid-template-columns: max-content;
    justify-content: center;
    gap: 8px;
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    padding: 6px 8px;
    background: white;
    color: #422232;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    text-align: center;
  }

  button img {
    width: 40px;
    height: auto;
  }

  button.active {
    background: #422232;
    color: white;
  }
</style>
