// src/_sandbox/routes.ts

import { Hono } from 'hono'
import { test01 } from './test01'
import { test02 } from './test02_db'
import { test03 } from './test03_drizzle'

// サンドボックス専用のHonoインスタンスを作成
const sandbox = new Hono()

sandbox.get('/test01', test01)
sandbox.get('/test02', test02)
sandbox.get('/test03', test03)

export { sandbox }