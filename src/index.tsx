// src/index.tsx

import { Hono } from 'hono'
import { renderer } from './renderer'
import { sandbox } from './_sandbox/routes'
import { Top } from './components/Top' // 🛠️ コンポーネントをインポート

  // 🛠️ 1. ここに環境変数（D1）の型を定義する
  type Bindings = {
    cloudflare_test_db: D1Database
  }

  const app = new Hono<{ Bindings: Bindings }>()

app.use(renderer)

app.get('/', (c) => {
  // 🛠️ 外部化したコンポーネントをJSXとして呼び出す
  return c.render(<Top />)
})

app.route('/_sandbox', sandbox)

export default app