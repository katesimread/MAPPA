<script>
  import { activeMarkerCoords, locale } from '../../stores';
  import { rtlLocales, t } from '../i18n.js';
  import { categories } from '../categories.js';
  import ActionButton from '../ActionButton.svelte';
  import MobileSheet from './MobileSheet.svelte';
  import { activeSheet } from './mobileStore.js';
  import { turnstile } from '@svelte-put/cloudflare-turnstile';
  import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';

  let momentTitle = '';
  let momentDescription = '';
  /** @type {string[]} */
  let momentCategories = [];
  let momentLink = '';
  let captchaToken = '';
  let requestCaptcha = false;

  function close() {
    activeSheet.set(null);
  }

  function toggleCategory(value) {
    momentCategories = momentCategories.includes(value)
      ? momentCategories.filter((v) => v !== value)
      : [...momentCategories, value];
  }

  const showSubmissionSuccessNotification = () => {
    toast.push(t[$locale].toast_success, {
      theme: {
        '--toastBarHeight': 0
      },
      duration: 5000
    });
  };

  $: isAddButtonDisabled =
    !$activeMarkerCoords?.lng ||
    !$activeMarkerCoords?.lat ||
    !momentTitle ||
    !momentDescription ||
    !momentCategories.length;

  async function handleAddMoment() {
    if (!captchaToken) {
      alert('Please complete the CAPTCHA.');
      return;
    }

    const payload = JSON.stringify({
      lng: $activeMarkerCoords?.lng,
      lat: $activeMarkerCoords?.lat,
      title: momentTitle,
      description: momentDescription,
      category: momentCategories,
      link: momentLink,
      captchaToken
    });

    const response = await fetch('/moments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });

    if (response.status === 201) {
      close();
      showSubmissionSuccessNotification();
    } else {
      const result = await response.json();
      alert(`Error: ${result.error}`);
    }
  }

  const handleTurnstile = (e) => {
    captchaToken = e.detail.token;
    handleAddMoment();
  };

  new SvelteToast({
    target: document.body
  });
</script>

<MobileSheet
  title={t[$locale].add_section_title}
  onClose={close}
  maxHeight="80vh"
>
  <div dir={rtlLocales.has($locale) ? 'rtl' : 'ltr'}>
    {#each t[$locale].add_steps as step, i}
      <div class="step"><span>{i + 1}.</span>{step}</div>
    {/each}

    <form>
      <input
        type="text"
        bind:value={momentTitle}
        class="field"
        placeholder={t[$locale].title_placeholder}
      />

      <textarea
        bind:value={momentDescription}
        class="field textarea"
        placeholder={t[$locale].info_placeholder}
      ></textarea>

      <div class="category-grid">
        {#each categories as category}
          <button
            type="button"
            class="chip"
            class:active={momentCategories.includes(category.value)}
            on:click={() => toggleCategory(category.value)}
          >
            {category.labels[$locale]}
          </button>
        {/each}
      </div>

      <input
        type="text"
        bind:value={momentLink}
        class="field"
        placeholder={t[$locale].link_placeholder}
      />

      {#if requestCaptcha}
        <div
          class="turnstile"
          use:turnstile
          turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
          on:turnstile={handleTurnstile}
        ></div>
      {/if}

      <ActionButton
        functionOnClick={() => (requestCaptcha = true)}
        isDisabled={isAddButtonDisabled}
        >{t[$locale].add_button}</ActionButton
      >
    </form>
  </div>
</MobileSheet>

<style>
  .step {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 4px 0;
    font-size: 1rem;
    color: var(--color-dark, #231f20);
  }

  .field {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-top: 12px;
    padding: 14px;
    font-family: 'Geist Mono', monospace;
    font-size: 1rem;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1.5px solid var(--color-dark, #231f20);
    border-radius: 8px;
  }

  .textarea {
    height: 8em;
    resize: vertical;
  }

  .category-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .chip {
    padding: 12px 16px;
    min-height: 48px;
    font-size: 0.95rem;
    font-family: inherit;
    background: rgba(255, 255, 255, 0.75);
    color: var(--color-dark, #231f20);
    border: 1.5px solid var(--color-dark, #231f20);
    border-radius: 999px;
    cursor: pointer;
  }

  .chip.active {
    background: var(--color-dark, #231f20);
    color: white;
  }

  .turnstile {
    margin-top: 14px;
  }

  /* Reused ActionButton, sized up for touch without editing the component. */
  form :global(.button) {
    min-height: 56px;
    font-size: 1.1rem;
    border-radius: 8px;
    margin-top: 18px;
  }
</style>
