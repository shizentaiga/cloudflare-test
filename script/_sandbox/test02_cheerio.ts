// bun script/_sandbox/test02_cheerio.ts

import * as cheerio from 'cheerio';

// 1. テスト用の擬似的なHTMLデータ（スクレイピングで取得した想定のテキスト）
const dummyHtml = `
  <html>
    <body>
      <h1 id="main-title">本日の新着商品リスト</h1>
      <ul class="item-list">
        <li class="item" data-id="101">
          <span class="name">極美品 MacBook Air M2</span>
          <span class="price">¥128,000</span>
        </li>
        <li class="item" data-id="102">
          <span class="name">iPhone 15 Pro 256GB</span>
          <span class="price">¥145,000</span>
        </li>
      </ul>
    </body>
  </html>
`;

function runCheerioTest() {
  console.log("[開始] cheerioを使ったHTMLの解析テスト\n");

  // 2. HTMLテキストをcheerioに読み込ませる（$ という変数に入れるのが定石です）
  const $ = cheerio.load(dummyHtml);

  // 3. ID指定（#）で要素をピンポイントで取得してテキストを抜く
  const pageTitle = $('#main-title').text();
  console.log(`ページタイトル: ${pageTitle}`);
  console.log("-----------------------------------------");

  // 4. クラス指定（.）で、ループ（繰り返し）処理をして複数のデータを抜く
  // $('.item-list .item') で「item-listクラスの中にあるitemクラス」をすべて指定
  $('.item-list .item').each((index, element) => {
    // 現在ループしている要素（element）を、再びcheerioで扱えるように包む
    const $item = $(element);

    // その要素の中から、さらにクラス名でテキストを絞り込む
    const itemName = $item.find('.name').text();
    const itemPrice = $item.find('.price').text();
    
    // 属性（カスタムデータ属性など）の値も引っこ抜ける
    const itemId = $item.attr('data-id');

    console.log(`商品 [${index + 1}] (ID: ${itemId})`);
    console.log(`  名前: ${itemName}`);
    console.log(`  価格: ${itemPrice}`);
  });

  console.log("\n[完了] データの抽出が正常に終了しました。");
}

// 実行
runCheerioTest();