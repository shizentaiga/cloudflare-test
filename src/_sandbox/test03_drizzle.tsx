// src/_sandbox/test03_drizzle.tsx
import { Context } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { users } from '../db/schema' // 🛠️ 作成したスキーマをインポート

export const test03 = async (c: Context<{ Bindings: { cloudflare_test_db: D1Database } }>) => {
  // 1. 上部にDB接続とDrizzleの初期化を切り出し
  const d1 = c.env.cloudflare_test_db
  const db = drizzle(d1)

  try {
    // 2. Drizzleの型安全なクエリを使って、全ユーザーを取得してみる
    // ※ まだテーブルにデータを何も入れていないので、成功すれば空配列（ [] ）が返ります
    const allUsers = await db.select().from(users).all()
    
    return c.json({
      status: "success",
      message: "Drizzle経由でのD1接続に成功しました！",
      data: allUsers
    })
  } catch (error: any) {
    return c.json({
      status: "error",
      message: "Drizzleの実行に失敗しました。",
      detail: error.message
    }, 500)
  }
}