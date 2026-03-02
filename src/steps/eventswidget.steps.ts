import { expect, test } from '@playwright/test';
import { EventsWidgetPage } from '../pages/EventsWidgetPage';


export async function openConstructorPage(w: EventsWidgetPage) {
  await test.step('Открыть страницу конструктора', async () => {
    await w.goto();
  });
}

export async function assertBaseUi(w: EventsWidgetPage) {
  await test.step('Проверить базовые элементы интерфейса', async () => {
    await expect(w.page.getByText(/Шаг 1/i)).toBeVisible();
    await expect(w.generateButton).toBeVisible();
    await expect(w.page.getByRole('button', { name: /скопировать код/i })).toBeVisible();
  });
}

export async function openTopicDropdown(w: EventsWidgetPage) {
  await test.step('Открыть выпадающий список тематик (Шаг 1)', async () => {
    await w.step1.scrollIntoViewIfNeeded();
    await w.topicDropdown.click();
    await expect(w.topicPopup).toBeVisible();
  });
}

export async function selectTopic(w: EventsWidgetPage, topicName: string) {
  await test.step(`Выбрать тематику: ${topicName}`, async () => {
    await w.topicLabel(topicName).click();
    await expect(w.topicCheckbox(topicName)).toBeChecked();
    await expect(w.topicDropdown).toContainText(/Выбрано:/);
  });
}

export async function clickGenerate(w: EventsWidgetPage) {
  await test.step('Нажать "Сгенерировать превью"', async () => {
    await w.generateButton.click({ force: true });
  });
}

export async function waitForGeneration(w: EventsWidgetPage) {
  await test.step('Дождаться состояния "Загрузка..." и завершения генерации', async () => {
    await expect(w.loadingButton).toBeVisible({ timeout: 30_000 });
    await expect(w.loadingButton).toBeHidden({ timeout: 60_000 });
    await expect(w.generateButton).toBeEnabled();
  });
}

export async function assertPreviewIframeVisible(w: EventsWidgetPage) {
  await test.step('Убедиться, что iframe превью появился', async () => {
    await expect(w.iframe).toBeVisible({ timeout: 60_000 });
  });
}

export async function assertEventsRenderedInIframe(w: EventsWidgetPage) {
  await test.step('Проверить, что внутри iframe отрисовались события', async () => {
    const frame = await w.getFrame();

    const group = frame.locator('div.event-group-sport').first();
    await expect(group).toBeVisible({ timeout: 60_000 });

    const row = frame.locator('tr.event-activity-item').first();
    await expect(row).toBeVisible({ timeout: 60_000 });

    await expect(row.locator('.event-name')).toBeVisible();
    await expect(row.locator('.event-date')).toBeVisible();
  });
}

// ===== LANGUAGE / MENU STEPS =====
export async function assertMenuContainsCyrillic(w: EventsWidgetPage) {
  await test.step('Проверить, что пункты меню содержат кириллицу', async () => {
    await expect(w.navMenu).toBeVisible();
    const text = (await w.navMenu.innerText()).trim();
    await expect(text).toMatch(/[А-Яа-яЁё]/);
  });
}

export async function switchLanguageToEn(w: EventsWidgetPage) {
  await test.step('Переключить язык на EN', async () => {
    const enUrl = 'https://dev.3snet.info/en/eventswidget/';

    await w.languageToggle.click();

    const enLink = w.page.locator(
      `a.language-option[data-locale="en"][href="${enUrl}"]`
    );

    await expect(enLink).toBeVisible({ timeout: 10_000 });

    // Кликаем “по-настоящему” и ждём навигацию
    await Promise.all([
      w.page.waitForURL(/\/en\/eventswidget\/?/, { timeout: 30_000 }),
      enLink.click({ force: true }),
    ]);

    // Гарантия, что UI реально переключился
    await expect(w.currentLanguage).toHaveText(/EN/i, { timeout: 30_000 });

    // по твоему требованию
    await w.page.waitForTimeout(5000);
  });
}


export async function assertMenuHasNoCyrillic(w: EventsWidgetPage) {
  await test.step('Проверить, что пункты меню НЕ содержат кириллицу', async () => {
    const text = (await w.navMenu.innerText()).trim();
    await expect(text).not.toMatch(/[А-Яа-яЁё]/);
  });
}