// src/_sandbox/test01.tsx

import { Context } from 'hono'

// 1行テキスト（最軽量）
export const test01 = (c: Context) => c.text("ok")
