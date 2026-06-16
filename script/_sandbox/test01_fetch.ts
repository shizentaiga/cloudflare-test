// script/_sandbox/test01_fetch.ts

async function runScraping() {
  const targetUrl = "https://example.com";
  console.log(`[開始] ${targetUrl} のデータを取得中...`);

  try {
    // 1. 対象のURLにリクエストを送り、レスポンスを受け取る
    const response = await fetch(targetUrl);

    // 2. HTTPステータスコードが200（成功）か確認
    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }

    // 3. ページのHTMLソースをテキストとして丸ごと抽出
    const htmlText = await response.text();

    console.log("\n--- [取得成功] HTMLソースの最初の一部を表示します ---");
    // 長すぎるので最初の500文字だけ切り取って表示
    console.log(htmlText.substring(0, 500));
    console.log("---------------------------------------------------\n");

    // 4. 簡単な文字抽出テスト（<title>タグの中身を抜き出してみる）
    const titleMatch = htmlText.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : "タイトルが見つかりません";
    
    console.log(`[解析結果] サイトのタイトルは「${title}」でした。`);

  } catch (error) {
    console.error("[エラー発生] スクレイピングに失敗しました:", error);
  }
}

// 実行する
runScraping();