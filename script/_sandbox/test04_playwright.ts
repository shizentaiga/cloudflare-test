// script/_sandbox/test04_playwright.ts
import { chromium } from 'playwright';

async function runPlaywrightMercari() {
  const baseUrl = "https://jp.mercari.com/search/";
  const queryType = "?keyword=";
  const keyword = "cthy";
  const targetUrl = `${baseUrl}${queryType}${encodeURIComponent(keyword)}`;

  console.log(`[1] ターゲットURL: ${targetUrl}`);
  console.log('[2] 自動操縦ブラウザを起動しています...');

  // 1. ブラウザを起動（headless: false で実際の画面が見えます）
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    // 人間がMacのChromeでアクセスしているように見せかける設定
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log('[3] メルカリのページを開いています...');
    // 2. ページに移動し、ネットワークの通信が落ち着くまで待つ
    await page.goto(targetUrl, { waitUntil: 'networkidle' });

    console.log('[4] 商品が表示されるのを待っています（JavaScript実行待ち）...');
    // 3. 商品カード（メルカリの要素である mer-item-thumbnail）が画面に出現するまで最大10秒待つ
    await page.waitForSelector('mer-item-thumbnail', { timeout: 10000 });

    console.log('[5] 画面から商品データを抽出しています...');
    // 4. 画面内に並んでいる商品カードの要素をすべて取得
    const itemElements = await page.$$('div[data-testid="item-cell"]');
    
    const items: { name: string; price: string }[] = [];

    // 5. 各商品カードから名前と価格を引っこ抜く
    for (const el of itemElements) {
      // サムネイル画像の alt 属性に商品名が入っていることが多いです
      const thumbnail = await el.$('mer-item-thumbnail');
      const name = thumbnail ? await thumbnail.getAttribute('alt') : '';
      
      // 価格が書かれているテキストを取得
      const priceElement = await el.$('[class*="price"], span[aria-label*="円"]');
      const price = priceElement ? await priceElement.innerText() : '価格不明';

      if (name) {
        items.push({
          name: name.replace("の商品画像", "").trim(),
          price: price.trim()
        });
      }
    }

    // 6. 結果の表示
    console.log(`\n================ 商品取得結果（合計: ${items.length}件） ================`);
    if (items.length === 0) {
      console.log("商品が見つかりませんでした。セレクターが変更された可能性があります。");
    } else {
      items.forEach((item, index) => {
        console.log(`${index + 1}: ${item.name} ➡️ ${item.price}`);
      });
    }
    console.log("===================================================================\n");

  } catch (error: any) {
    console.error("\n❌ Playwrightでの取得に失敗しました:", error.message);
  } finally {
    // 7. テストが終わったらブラウザを閉じる（様子を見たい場合は少しスリープを入れてもOKです）
    console.log('[6] ブラウザを閉じます。');
    await browser.close();
  }
}

// 実行
runPlaywrightMercari();