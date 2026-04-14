import { KimonoFormData } from './types'

export async function appendToSpreadsheet(data: KimonoFormData) {
  const webhookUrl = process.env.GAS_WEBHOOK_URL
  if (!webhookUrl) throw new Error('GAS_WEBHOOK_URL が設定されていません')

  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const productList = data.products.join('、') || '―'

  const sunpoStr = (s: { shaku: string; sun: string; bu: string }) =>
    [s.shaku, s.sun, s.bu].every(v => !v) ? '―' : `${s.shaku || '0'}-${s.sun || '0'}-${s.bu || '0'}`

  const row = {
    受付日時: now,
    お名前: data.name,
    フリガナ: data.furigana,
    電話番号: data.tel,
    メール: data.email,
    住所: data.address || '―',
    支部名: data.shibu || '―',
    会員番号: data.memberNo || '―',
    身長cm: data.height || '―',
    ヒップcm: data.hip || '―',
    身丈背: sunpoStr(data.shintake),
    袖丈: sunpoStr(data.sodake),
    裄: sunpoStr(data.yuki),
    袖巾: sunpoStr(data.sodahaba),
    袖付: sunpoStr(data.sodatsuke),
    前巾: sunpoStr(data.maehaba),
    後巾: sunpoStr(data.ushirohaba),
    褄下: sunpoStr(data.tsumashita),
    くりこし: sunpoStr(data.kurikoshi),
    商品: productList,
    備考: data.note || '―',
    ステータス: '未入金',  // 初期値
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  })

  if (!res.ok) throw new Error(`スプレッドシート記録失敗: ${res.status}`)
}
