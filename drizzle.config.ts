// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',          // D1はSQLiteベースなのでsqliteを指定
  schema: './src/db/schema.ts', // 先ほど作ったテーブル定義ファイルの場所
  out: './drizzle',           // マイグレーションファイル（SQL）の出力先
  // 🛠️ ローカルでのスキーマ検証（push）用に、一時的なメモリURLを指定します
  dbCredentials: {
    url: ':memory:',
  },
})