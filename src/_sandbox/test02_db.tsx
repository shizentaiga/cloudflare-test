// src/_sandbox/test02_db.tsx
import { Context } from 'hono'

export const test02 = async (c: Context<{ Bindings: { cloudflare_test_db: D1Database } }>) => {
  // 🛠️ 1. DBの接続（インスタンスの取得）を上部に切り出し
  const db = c.env.cloudflare_test_db

  try {
    // 🛠️ 2. 切り出した「db」を使ってシンプルにクエリを実行
    const result = await db.prepare("SELECT 1 + 1 AS res").first()
    
    return c.json({
      status: "success",
      message: "DB接続に成功しました！",
      data: result
    })
  } catch (error: any) {
    return c.json({
      status: "error",
      message: "DB接続に失敗しました。",
      detail: error.message
    }, 500)
  }
}