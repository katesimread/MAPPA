<script>
  import { onMount, onDestroy } from 'svelte';
  import { addOverlayVisible, locale } from '../stores';
  import { rtlLocales, t } from './i18n.js';
  import ActionButton from './ActionButton.svelte';
  import { activeMarkerCoords } from '../stores';
  import { fly } from 'svelte/transition';
  import { turnstile } from '@svelte-put/cloudflare-turnstile';
  import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { categories } from './categories.js';

  let momentTitle = '';
  let momentDescription = '';
  /** @type {string[]} */
  let momentCategories = [];
  let momentLink = '';
  let captchaToken = '';
  let isAddButtonDisabled = true;
  let requestCaptcha = false;
  /** @type {HTMLDetailsElement} */
  let categoryDropdownEl;

  function closeAddOverlay() {
    addOverlayVisible.update(() => false);
  }

  function toggleCategory(value) {
    momentCategories = momentCategories.includes(value)
      ? momentCategories.filter((v) => v !== value)
      : [...momentCategories, value];
  }

  function handleDocumentClick(e) {
    if (categoryDropdownEl && !categoryDropdownEl.contains(e.target)) {
      categoryDropdownEl.open = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleDocumentClick);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleDocumentClick);
  });

  $: selectedCategoryLabel = momentCategories.length
    ? momentCategories
        .map(
          (value) => categories.find((c) => c.value === value)?.labels[$locale]
        )
        .join(', ')
    : t[$locale].category_placeholder;

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

    const response = await fetch('moments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });

    if (response.status === 201) {
      closeAddOverlay();
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

<aside class="overlay overlay--add" transition:fly={{ x: 100, duration: 300 }}>
  <button
    class="add-panel-close"
    on:click={closeAddOverlay}
    aria-label="close add overlay"
  >
    &times;
  </button>
  <div class="overlay__outer">
    <div class="overlay__content" dir={rtlLocales.has($locale) ? 'rtl' : 'ltr'}>
      <section>
        <div class="overlay__section-title">
          {t[$locale].add_section_title}
        </div>
        <div class="overlay__section-text">
          {#each t[$locale].add_steps as step, i}
            <div class="partial_div-numbered">
              <span>{i + 1}.</span>{step}
            </div>
          {/each}
          <form>
            <input
              type="text"
              bind:value={momentTitle}
              id="txt_title"
              class="title-input"
              placeholder={t[$locale].title_placeholder}
            />

            <textarea
              bind:value={momentDescription}
              id="txt_contents"
              class="subform"
              placeholder={t[$locale].info_placeholder}
            ></textarea>

            <details class="category-select" bind:this={categoryDropdownEl}>
              <summary class="category-select__summary"
                >{selectedCategoryLabel}</summary
              >
              <div class="category-select__options">
                {#each categories as category}
                  <label class="category-select__option">
                    <input
                      type="checkbox"
                      checked={momentCategories.includes(category.value)}
                      on:change={() => toggleCategory(category.value)}
                    />
                    {category.labels[$locale]}
                  </label>
                {/each}
              </div>
            </details>

            <input
              type="text"
              bind:value={momentLink}
              class="link-input"
              placeholder={t[$locale].link_placeholder}
            />

            {#if requestCaptcha}
              <div
                style="margin-top: 16px"
                use:turnstile
                turnstile-sitekey={PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
                on:turnstile={handleTurnstile}
              ></div>
            {/if}
            <!-- <div class="recaptcha-text">
							This site is protected by Turnstile and Cloudflare
							<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener"
								>Privacy Policy</a
							>
							and
							<a href="https://www.cloudflare.com/website-terms/" target="_blank" rel="noopener"
								>Terms of Service</a
							>
							apply.
						</div> -->

            <ActionButton
              functionOnClick={() => (requestCaptcha = true)}
              isDisabled={isAddButtonDisabled}
              >{t[$locale].add_button}</ActionButton
            >
          </form>
        </div>
      </section>
    </div>
  </div>
</aside>

<style>
  .partial_div-numbered span {
    margin-right: 10px;
  }

  .overlay__section-text .partial_div-numbered {
    min-height: 39px;
  }

  .overlay {
    position: fixed;
    z-index: var(--overlay-z-index);
    top: 0;
    background-color: #f0f0f0;
    overflow-x: hidden;
  }

  .add-panel-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    padding: 0;
    color: var(--color-dark);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    z-index: 1;
  }

  .overlay__outer {
    width: calc(40vw);
    padding: 0.8em;
  }

  .overlay__section-title {
    text-decoration: none;
    font-size: 19px;
    color: var(--color-dark);
    display: block;
    font-weight: 500;
    padding-bottom: 4px;
    padding-top: 1em;
    padding-left: 2.05rem;
    font-weight: bold;
  }

  .overlay__section-text {
    text-decoration: none;
    color: var(--color-dark);
    display: block;
    margin-top: 1em;
    font-size: 15px;
  }

  .overlay__section-text > div {
    display: flex;
    align-items: center;
  }

  .overlay__section-text > *:first-child {
    margin-top: 0;
  }

  .overlay__section-text > *:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 800px) {
    .overlay__section-title {
      padding-left: 1.05rem;
    }

    .partial_div-numbered {
      padding-left: 0.5em;
    }
    .overlay--add,
    .overlay__outer {
      width: 100%;
    }
    .overlay__outer {
      max-width: 100% !important;
      padding-top: 0px;
      box-sizing: border-box;
    }
    .overlay__content {
      max-width: 100%;
    }
    .overlay--add textarea {
      padding: 10px;
      width: 99%;
      height: 125px;
      margin-top: 10px;
    }
    .overlay--add {
      border: 1.01px solid var(--color-dark);
      position: fixed;
      top: unset;
      width: calc(100vw - 18px);
      left: 50%;
      bottom: calc(var(--top-bar-height) + 8px);
      transform: translateX(-50%);
      z-index: 999999;
    }
  }

  @media (min-width: 800px) {
    .overlay__outer {
      width: calc(40vw);
      padding: 0em;
    }

    .overlay__outer form {
      padding: 0.8em;
      margin-bottom: 0.8em;
    }

    .overlay--add {
      position: fixed;
      top: 9px;
      right: 9px;
      border: 1.01px solid var(--color-dark);
      box-shadow: -4px 0px 6px 0px rgba(0, 0, 0, 0.5);
      max-height: calc(100% - 9px - var(--top-bar-height) - 9px);
      overflow-y: auto;
      z-index: 199;
    }

    .overlay__content {
      margin: 0;
      height: 125%;
      left: 9px;
      top: 9px;
      max-height: 97vh;
      height: unset;
    }
  }

  .subform {
    margin: auto;
    text-align: left;
    padding-left: 0;
    padding-top: 0;
    padding-bottom: 0.4em;
    padding-right: 0.4em;
    width: 100%;
    font-size: 12pt;
    height: 12em;
    background-color: rgba(255, 255, 255, 0.65);
    border: 1.01px solid var(--color-dark);
  }

  textarea {
    font-family: 'Geist Mono', monospace;
    resize: vertical;
  }

  .category-select {
    position: relative;
    width: 100%;
    margin-top: 0.5em;
    font-family: 'Geist Mono', monospace;
    font-size: 12pt;
    box-sizing: border-box;
  }

  .category-select__summary {
    padding: 0.5em;
    background-color: rgba(255, 255, 255, 0.65);
    border: 1.01px solid var(--color-dark);
    box-sizing: border-box;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  .category-select__summary::-webkit-details-marker {
    display: none;
  }

  .category-select__options {
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    z-index: 10;
    max-height: 12em;
    overflow-y: auto;
    background-color: white;
    border: 1.01px solid var(--color-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .category-select__option {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em;
    cursor: pointer;
  }

  .category-select__option:hover {
    background-color: #f5e6ed;
  }

  .link-input {
    width: 100%;
    margin-top: 0.5em;
    padding: 0.5em;
    font-family: 'Geist Mono', monospace;
    font-size: 12pt;
    background-color: rgba(255, 255, 255, 0.65);
    border: 1.01px solid var(--color-dark);
    box-sizing: border-box;
  }

  .title-input {
    width: 100%;
    margin-bottom: 0.5em;
    padding: 0.5em;
    font-family: 'Geist Mono', monospace;
    font-size: 12pt;
    background-color: rgba(255, 255, 255, 0.65);
    border: 1.01px solid var(--color-dark);
    box-sizing: border-box;
  }

  .overlay--add textarea {
    box-sizing: border-box !important;
    padding: 10px !important;
  }
</style>
