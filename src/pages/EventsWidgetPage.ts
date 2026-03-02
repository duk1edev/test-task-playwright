import { Page, Locator, Frame } from '@playwright/test';

export class EventsWidgetPage {
  readonly page: Page;

  // --- Шаг 1
  readonly step1: Locator;
  readonly topicDropdown: Locator;
  readonly topicPopup: Locator;

  // --- Кнопки
  readonly generateButton: Locator;
  readonly loadingButton: Locator;

  // --- iframe
  readonly iframe: Locator;

  // --- Верхнее меню / язык
  readonly navMenu: Locator;
  readonly navMenuItems: Locator;
  readonly languageToggle: Locator;
  readonly currentLanguage: Locator;
  readonly visibleLanguageMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Шаг 1
    this.step1 = page.locator('.constructor__step:has-text("Шаг 1")');
    this.topicDropdown = this.step1.locator('.checkselect-control');
    this.topicPopup = this.step1.locator('.checkselect-popup');

    // --- Верхнее меню
    this.navMenu = page.locator('ul.nav-menu');
    this.navMenuItems = this.navMenu.locator(
      ':scope > li > a, :scope > li.dropdown > span.dropdown-toggle'
    );

    // --- Язык (desktop)
    this.visibleLanguageMenu = page.locator('ul.dropdown-menu:visible');
    this.languageToggle = page
      .locator('span.dropdown-toggle:has(#current-language)')
      .first();
    this.currentLanguage = page.locator('#current-language').first();

    // --- Кнопки
    this.generateButton = page.locator('.constructor__preview button', {
      hasText: 'Сгенерировать превью',
    });

    this.loadingButton = page.locator('.constructor__preview button[disabled]', {
      hasText: 'Загрузка...',
    });

    // --- iframe
    this.iframe = page.locator('iframe[id="3snet-frame"]');
  }

  async goto() {
    await this.page.goto('https://dev.3snet.info/eventswidget/', {
      waitUntil: 'domcontentloaded',
    });
  }

  topicLabel(name: string): Locator {
    return this.topicPopup.locator('label.custom-checkbox', { hasText: name });
  }

  topicCheckbox(name: string): Locator {
    return this.topicLabel(name).locator('input[type="checkbox"]');
  }

  languageOption(locale: 'ru' | 'en'): Locator {
    // Берём option ТОЛЬКО из открытого (visible) меню
    return this.visibleLanguageMenu.locator(`a.language-option[data-locale="${locale}"]`);
  }
  
  languageOptionByHrefEn(): Locator {
  return this.page.locator(
    'a.language-option[data-locale="en"][href="https://dev.3snet.info/en/eventswidget/"]'
  );
}

  async getFrame(): Promise<Frame> {
    const frame = await this.iframe.contentFrame();
    if (!frame) throw new Error('iframe not available');
    return frame;
  }
}