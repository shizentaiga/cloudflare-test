// src/db/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// 最小限の users テーブル定義
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'), // Email追加(Null許容)
})