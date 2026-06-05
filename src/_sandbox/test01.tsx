// src/_sandbox/test01.tsx

import { Context } from 'hono'

// サンドボックス用のテキスト
export const test01 = (c: Context) => {
    return c.text("ok")
}
