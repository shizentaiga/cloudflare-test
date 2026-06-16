// script/_sandbox/test04_playwright.ts
import { chromium } from 'playwright';

async function runPlaywrightMercari() {
  const baseUrl = "https://jp.mercari.com/search/";
  const queryType = "?keyword=";
  const keyword = "cthy";
  const targetUrl = `${baseUrl}${queryType}${encodeURIComponent(keyword)}`;

  // 💡 設定: 最大何件まで取得するか（20件を超えたら即終了）
  const MAX_ITEMS = 20;

  console.log(`[1] ターゲットURL: ${targetUrl}`);
  console.log('[2] 自動操縦ブラウザを起動しています（ヘッドレスモード）...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  try {
    console.log('[3] メルカリのページを開いています...');
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    console.log('[4] 商品の初期表示を待っています...');
    const targetSelector = 'li[data-testid="item-cell"]';
    
    // 最初の1件が画面に出るのだけを待つ
    await page.waitForSelector(targetSelector, { timeout: 15000 });

    console.log('[5] 商品データの抽出を開始（逐次表示）...\n');
    console.log(`======================= 商品取得結果 =======================`);

    // 画面内にある対象要素の「現在の件数」を取得
    const totalCount = await page.locator(targetSelector).count();
    
    let successCount = 0;

    // 件数ベースでループを回し、1件ずつ即時処理・即時出力する
    for (let i = 0; i < totalCount; i++) {
      // 💡 対策: 設定した最大件数に達していたら、次の要素をチェックせずに即ループを抜ける
      if (successCount >= MAX_ITEMS) {
        console.log(`\n⚠️ 最大取得設定件数（${MAX_ITEMS}件）に達したため、処理を終了します。`);
        break;
      }

      try {
        // i番目の商品をピンポイントで指定
        const item = page.locator(targetSelector).nth(i);

        // 要素が本当に画面に存在するか、短いタイムアウト（500ms）でチェック
        if (!(await item.isVisible({ timeout: 500 }).catch(() => false))) {
          break; 
        }

        // 商品名（タイトル）を取得して整形
        const imgElement = item.locator('img');
        const rawTitle = await imgElement.getAttribute('alt');
        const title = rawTitle?.replace(/の(サムネイル|商品画像)$/, '').trim();

        // 価格を取得
        const priceText = await item.locator('span[class*="number"]').textContent();
        const price = priceText ? priceText.trim() : '不明';

        // 商品の個別ページのURLを取得
        const linkElement = item.locator('a[data-testid="thumbnail-link"]');
        const relativeUrl = await linkElement.getAttribute('href');
        const absoluteUrl = relativeUrl ? `https://jp.mercari.com${relativeUrl}` : 'URL不明';

        if (title) {
          successCount++;
          console.log(`---------------------------------------- [${successCount}]`);
          console.log(`📦 商品名: ${title}`);
          console.log(`💰 価  格: ￥${price}`);
          console.log(`🔗 ＵＲＬ: ${absoluteUrl}`);
        }
        
      } catch (error) {
        // 読み込みエラーなどの場合は安全にスキップ
        break;
      }
    }

    console.log(`\n===================================================================`);
    console.log(`🎉 合計 ${successCount} 件の商品を正常に取得しました。`);
    console.log(`===================================================================\n`);

  } catch (error: any) {
    console.error("\n❌ Playwrightでの取得に失敗しました:", error.message);
  } finally {
    console.log('[6] ブラウザを閉じます。');
    await browser.close();
  }
}

// 実行
runPlaywrightMercari();