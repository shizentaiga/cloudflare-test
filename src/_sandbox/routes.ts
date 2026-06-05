// src/_sandbox/routes.ts

import { Hono } from 'hono'
import { test01 } from './test01'

// サンドボックス専用のHonoインスタンスを作成
const sandbox = new Hono()

sandbox.get('/test01', test01)

export { sandbox }