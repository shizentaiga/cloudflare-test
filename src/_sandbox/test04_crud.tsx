// src/_sandbox/test04_crud.tsx
// CRUD（Create / Read / Update / Delete）

import { Context } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

export const test04 = async (c: Context<{ Bindings: { cloudflare_test_db: D1Database } }>) => {
  const d1 = c.env.cloudflare_test_db
  const db = drizzle(d1)

  // 💡 フォームの送信データ（POST）またはURLパラメータ（GET）を取得
  const action = c.req.query('action') || (await c.req.formData().catch(() => null))?.get('action')
  const formData = await c.req.formData().catch(() => null)
  
  const idStr = formData?.get('id') || c.req.query('id')
  const name = formData?.get('name') as string
  const email = formData?.get('email') as string
  const id = idStr ? parseInt(idStr as string, 10) : null

  let message = ""

  try {
    // 🛠️ 1. Create (追加)
    if (action === 'create' && name) {
      await db.insert(users).values({ name, email: email || null })
      message = `✅ ユーザー「${name}」を追加しました。`
    } 
    // 🛠️ 2. Update (変更)
    else if (action === 'update' && id && name) {
      await db.update(users).set({ name, email: email || null }).where(eq(users.id, id))
      message = `🔄 ID: ${id} のユーザーを更新しました。`
    } 
    // 🛠️ 3. Delete (削除)
    else if (action === 'delete' && id) {
      await db.delete(users).where(eq(users.id, id))
      message = `🗑️ ID: ${id} のユーザーを削除しました。`
    }

    // 🛠️ 4. Read (現在のデータを全件取得)
    const allUsers = await db.select().from(users).all()

    // 💡 編集モードの判定（URLに ?action=edit_form&id=X が来たら、そのユーザーのデータをフォームに初期セットする）
    const isEdit = c.req.query('action') === 'edit_form'
    const editUser = isEdit ? allUsers.find(u => u.id === id) : null

    // 📄 HTMLテンプレートの生成
    return c.html(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>D1 CRUD サンドボックス</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 p-8 font-sans">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-2xl font-bold mb-6 text-gray-800">📊 D1 × Drizzle 最小CRUD画面</h1>
          
          ${message ? `<div class="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md text-sm">${message}</div>` : ''}

          <div class="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
            <h2 class="text-lg font-semibold mb-4 text-gray-700">${isEdit ? '🔄 ユーザーの編集' : '➕ ユーザーの新規追加'}</h2>
            <form method="POST" action="/_sandbox/test04" class="flex flex-wrap gap-4 items-end">
              <input type="hidden" name="action" value="${isEdit ? 'update' : 'create'}">
              ${isEdit ? `<input type="hidden" name="id" value="${editUser?.id}">` : ''}
              
              <div>
                <label class="block text-xs text-gray-500 mb-1">名前（必須）</label>
                <input type="text" name="name" value="${editUser?.name || ''}" required class="border rounded px-3 py-1.5 text-sm w-48 focus:outline-blue-500" placeholder="例：山田太郎">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">メールアドレス（任意）</label>
                <input type="email" name="email" value="${editUser?.email || ''}" class="border rounded px-3 py-1.5 text-sm w-64 focus:outline-blue-500" placeholder="例：test@example.com">
              </div>
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded font-medium transition">
                ${isEdit ? '更新を保存' : '追加する'}
              </button>
              ${isEdit ? `<a href="/_sandbox/test04" class="text-sm text-gray-500 underline mb-2">キャンセル</a>` : ''}
            </form>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-100 border-b border-gray-200 text-gray-600 text-sm">
                  <th class="p-3 font-semibold w-16">ID</th>
                  <th class="p-3 font-semibold">名前</th>
                  <th class="p-3 font-semibold">メールアドレス</th>
                  <th class="p-3 font-semibold w-40 text-center">操作</th>
                </tr>
              </thead>
              <tbody class="text-sm divide-y divide-gray-100">
                ${allUsers.length === 0 ? `
                  <tr>
                    <td colspan="4" class="p-8 text-center text-gray-400">データが1件もありません。上のフォームから追加してください。</td>
                  </tr>
                ` : allUsers.map(user => `
                  <tr class="hover:bg-gray-50">
                    <td class="p-3 font-mono text-gray-500">${user.id}</td>
                    <td class="p-3 font-medium text-gray-800">${user.name}</td>
                    <td class="p-3 text-gray-600">${user.email || '<span class="text-gray-300">未設定</span>'}</td>
                    <td class="p-3 flex justify-center gap-3">
                      <a href="/_sandbox/test04?action=edit_form&id=${user.id}" class="text-blue-600 hover:text-blue-800 font-medium">編集</a>
                      <a href="/_sandbox/test04?action=delete&id=${user.id}" onclick="return confirm('本当に削除しますか？')" class="text-red-600 hover:text-red-800 font-medium">削除</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `)
  } catch (error: any) {
    return c.html(`<div style="color:red; pading:20px;">エラーが発生しました: ${error.message}</div>`, 500)
  }
}