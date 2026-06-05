// src/index.tsx

import { Hono } from 'hono'
import { renderer } from './renderer'
import { sandbox } from './_sandbox/routes' // 🛠️ サンドボックスのルートをインポート

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

// 🛠️ デバッグ・実験専用のルートを `/_sandbox` 以下に丸ごとマウント
app.route('/_sandbox', sandbox)

export default app