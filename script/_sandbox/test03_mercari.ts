// bun script/_sandbox/test03_mercari.ts

import * as cheerio from 'cheerio';

async function fetchMercariItems() {
  const baseUrl = "https://jp.mercari.com/search/";
  const queryType = "?keyword=";
  const keyword = "cthy";

  // URLの組み立て
  const targetUrl = `${baseUrl}${queryType}${encodeURIComponent(keyword)}`;
  console.log(`[1] ターゲットURL: ${targetUrl}`);
  console.log(`[2] 実際のメルカリへアクセスを開始します...`);

  try {
    // 3. 実際のURLへfetchリクエストを送信
    // ※ ボット判定を少しでも避けるため、一般的なブラウザのふりをする「User-Agent」ヘッダーを付与しています
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8"
      }
    });

    console.log(`[3] レスポンスステータス: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`アクセスが拒否されました（ステータスコード: ${response.status}）`);
    }

    const htmlText = await response.text();
    const $ = cheerio.load(htmlText);

    // 4. メルカリの商品アイテムの塊（セレクター）を探してループ処理
    // ※ メルカリのHTML構造の「item-cell」や「thumbnail」といった要素をターゲットにします
    const items: { name: string; price: string }[] = [];

    // メルカリの商品カードは通常 `[data-testid="item-cell"]` などの属性の中に並んでいます
    $('div[data-testid="item-cell"], li[class*="item"]').each((_, element) => {
      const $el = $(element);
      
      // 商品名と価格が埋め込まれていると思われる場所を抽出
      // (メルカリの仕様変更によってクラス名や属性名は頻繁に変わります)
      const name = $el.find('mer-item-thumbnail, img').attr('alt') || $el.find('[class*="name"]').text();
      const price = $el.find('[class*="price"]').text() || $el.find('span[aria-label*="円"]').text();

      if (name) {
        items.push({
          name: name.replace("の商品画像", "").trim(), // 余計な文字を掃除
          price: price.trim() || "価格不明"
        });
      }
    });

    // 5. 結果の表示
    console.log(`\n================ 商品取得結果（合計: ${items.length}件） ================`);
    if (items.length === 0) {
      console.log("商品が見つかりませんでした、またはボットブロック（JavaScript未実行）の可能性があります。");
      // デバッグ用に取得できたHTMLの一部を出力してみる
      console.log("\n--- HTMLのhead部分 ---");
      console.log(htmlText.substring(0, 600));
    } else {
      items.forEach((item, index) => {
        console.log(`${index + 1}: ${item.name} ➡️ ${item.price}`);
      });
    }
    console.log("===================================================================\n");

  } catch (error: any) {
    console.error("\n❌ スクレイピング失敗:", error.message);
  }
}

// 実行
fetchMercariItems();