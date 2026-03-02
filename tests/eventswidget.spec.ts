import { test } from '@playwright/test';
import { EventsWidgetPage } from '../src/pages/EventsWidgetPage';
import {
  openConstructorPage,
  assertBaseUi,
  openTopicDropdown,
  selectTopic,
  clickGenerate,
  waitForGeneration,
  assertPreviewIframeVisible,
  assertEventsRenderedInIframe,
  assertMenuContainsCyrillic,
  switchLanguageToEn,
  // switchLanguageToEnHard,
  assertMenuHasNoCyrillic,
} from '../src/steps/eventswidget.steps';


test('eventswidget: страница открывается', async ({ page }) => {
  const w = new EventsWidgetPage(page);

  await openConstructorPage(w);
  await assertBaseUi(w);
});

test('eventswidget: выбрать Affiliate -> сгенерировать -> увидеть результат', async ({ page }) => {
  const w = new EventsWidgetPage(page);

  await openConstructorPage(w);
  await openTopicDropdown(w);
  await selectTopic(w, 'Affiliate');
  await clickGenerate(w);
  await waitForGeneration(w);
  await assertPreviewIframeVisible(w);
  await assertEventsRenderedInIframe(w);
});

// test('NEGATIVE: смена языка не переводит пункты меню (known issue)', async ({ page }) => {
//   test.fail(true, 'Known issue: menu items remain in Russian after language switch');
//   const w = new EventsWidgetPage(page);
//   await openConstructorPage(w);
//   await assertMenuContainsCyrillic(w);
//   await switchLanguageToEn(w);
//   await switchLanguageToEnHard(w);
//   await assertMenuHasNoCyrillic(w);
// });

test('NEGATIVE: смена языка не переводит пункты меню (known issue)', async ({ page }) => {
  test.fail(true, 'Known issue: menu items remain in Russian after language switch');

  const w = new EventsWidgetPage(page);

  await openConstructorPage(w);
  await assertMenuContainsCyrillic(w);

  // один переключатель, без дубля
  await switchLanguageToEn(w);

  // это ожидание “правильного поведения”, поэтому тест упадёт ожидаемо
  await assertMenuHasNoCyrillic(w);
});