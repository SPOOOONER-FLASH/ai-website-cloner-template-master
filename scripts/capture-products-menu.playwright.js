// Run through playwright-cli run-code --filename=scripts/capture-products-menu.playwright.js
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- CLI consumes this function expression.
async (page) => {
  const results = [];
  for (const locale of ['en', 'es']) {
    for (const [device, width, height] of [['desktop',1440,950],['mobile',390,844]]) {
      await page.setViewportSize({width,height});
      await page.goto('http://127.0.0.1:3017/' + (locale === 'es' ? 'es/' : '') + 'products/');
      await page.locator('#products-overview-title').waitFor();
      await page.evaluate(async () => { await document.fonts.ready; });
      await page.locator('main img').evaluateAll(async (images) => {
        for (const image of images) image.loading = 'eager';
        await Promise.all(images.map(image => image.decode()));
      });
      const promoClose = page.getByRole('button', {name: /^Close:|^Cerrar:/});
      if (await promoClose.count()) await promoClose.first().click();
      await page.screenshot({path:`.impeccable/review/products-${locale}-${device}.png`});
      await page.screenshot({path:`.impeccable/review/products-${locale}-${device}-full.png`,fullPage:true});
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (overflow) throw Error(`${locale}/${device}: horizontal overflow`);
      const families = await page.locator('[aria-labelledby="product-family-map-title"] ol > li').count();
      if (families !== 9) throw Error(`Expected 9 families, got ${families}`);
      await page.getByRole('button',{name:locale === 'es' ? 'Abrir menú' : 'Open menu',exact:true}).click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      await page.screenshot({path:`.impeccable/review/menu-${locale}-${device}.png`});
      const initialFocus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Shift+Tab');
      if (!(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')))) throw Error('Focus escaped dialog');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('[role="dialog"]') && document.activeElement?.getAttribute('aria-controls') === 'site-menu-dialog');
      if (await dialog.count()) throw Error('Escape failed');
      const restored = await page.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'site-menu-dialog');
      if (!restored) throw Error('Focus restoration failed');
      results.push({locale,device,families,overflow,initialFocus,focusRestored:restored});
    }
  }
  console.log(JSON.stringify(results));
}
