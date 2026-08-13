<script>
  import { addOverlayVisible, translatedToArabic } from '../stores';
  import ActionButton from './ActionButton.svelte';
  import { activeMarkerCoords } from '../stores';
  import { fly } from 'svelte/transition';
  import { turnstile } from '@svelte-put/cloudflare-turnstile';
  import { PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY } from '$env/static/public';
  import { SvelteToast, toast } from '@zerodevx/svelte-toast';
  import { categories } from './categories.js';

  let momentTitle = '';
  let momentDescription = '';
  let momentCategory = '';
  let momentLink = '';
  let captchaToken = '';
  let isAddButtonDisabled = true;
  let requestCaptcha = false;

  function closeAddOverlay() {
    addOverlayVisible.update(() => false);
  }

  const showSubmissionSuccessNotification = () => {
    toast.push(
      $translatedToArabic
        ? 'شكراً لك على وضع علامة على الخريطة! بمجرد موافقة فريق الإدارة، سيتمكن الجميع من رؤية الخدمة التي أضفتها.'
        : 'Thank you for placing a pin on the map! Once approved by the admin team, everyone will be able to see the service that you’ve added.',
      {
        theme: {
          '--toastBarHeight': 0
        },

        duration: 5000
      }
    );
  };

  $: isAddButtonDisabled =
    !$activeMarkerCoords?.lng ||
    !$activeMarkerCoords?.lat ||
    !momentTitle ||
    !momentDescription ||
    !momentCategory;

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
      category: momentCategory,
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

<aside
  class="overlay overlay--add"
  transition:fly={{ x: 100, duration: 300 }}
>
  <button
    class="add-panel-close"
    on:click={closeAddOverlay}
    aria-label="close add overlay"
  >
    &times;
  </button>
  <div class="overlay__outer">
    <div class="overlay__content" dir={$translatedToArabic ? 'rtl' : 'ltr'}>
      <section>
        <div class="overlay__section-title">
          {#if $translatedToArabic}
            هل لديك خدمة تريد مشاركتها؟
          {:else}
            Do you have a service that you would like to share?
          {/if}
        </div>
        <div class="overlay__section-text">
          {#if $translatedToArabic}
            <div class="partial_div-numbered">
              <span>1.</span>اضغط على الخريطة لتحديد موقعك.
            </div>
            <div class="partial_div-numbered">
              <span>2.</span>اكتب اسم الجمعية أو المؤسسة، مع نبذة موجزة عن
              الخدمات التي تقدمها. اختر الفئة المناسبة، وأضف رابط الموقع
              الإلكتروني إن توفر.
            </div>
            <div class="partial_div-numbered">
              <span>3.</span>اضغط على زر "إضافة".
            </div>
          {:else}
            <div class="partial_div-numbered">
              <span>1.</span>Click the map to place your pin.
            </div>
            <div class="partial_div-numbered">
              <span>2.</span>Write a little about what it is that they do. Select
              a category and share the website link if you can.
            </div>
            <div class="partial_div-numbered">
              <span>3.</span>Click the Add button.
            </div>
          {/if}
          <form>
            <input
              type="text"
              bind:value={momentTitle}
              id="txt_title"
              class="title-input"
              placeholder={$translatedToArabic ? 'العنوان' : 'Title'}
            />

            <textarea
              bind:value={momentDescription}
              id="txt_contents"
              class="subform"
              placeholder={$translatedToArabic ? 'معلومات' : 'Info'}
            ></textarea>

            <select bind:value={momentCategory} class="category-select">
              <option value="" disabled
                >{$translatedToArabic ? 'الفئة' : 'Category'}</option
              >
              {#each categories as category}
                <option value={category.value}
                  >{$translatedToArabic ? category.ar : category.en}</option
                >
              {/each}
            </select>

            <input
              type="text"
              bind:value={momentLink}
              class="link-input"
              placeholder={$translatedToArabic
                ? 'أضف رابط الموقع الإلكتروني (اختياري)'
                : 'Website link (optional)'}
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
              >{$translatedToArabic ? 'إضافة' : 'Add'}</ActionButton
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
    width: 100%;
    margin-top: 0.5em;
    padding: 0.5em;
    font-family: 'Geist Mono', monospace;
    font-size: 12pt;
    background-color: rgba(255, 255, 255, 0.65);
    border: 1.01px solid var(--color-dark);
    box-sizing: border-box;
    cursor: pointer;
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
