// src/index.tsx

import { Hono } from 'hono'
import { renderer } from './renderer'
import { sandbox } from './_sandbox/routes'
import { Top } from './components/Top' // 🛠️ コンポーネントをインポート

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  // 🛠️ 外部化したコンポーネントをJSXとして呼び出す
  return c.render(<Top />)
})

app.route('/_sandbox', sandbox)

export default app