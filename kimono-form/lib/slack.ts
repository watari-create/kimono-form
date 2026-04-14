import { KimonoFormData } from './types'

export async function sendSlackNotification(data: KimonoFormData) {
  const webhookUrl = process.env.KIMONO_SLACK_WEBHOOK_URL
  if (!webhookUrl) throw new Error('KIMONO_SLACK_WEBHOOK_URL が設定されていません')

  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
  const productList = data.products.length > 0 ? data.products.join('、') : 'なし'

  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📋 新しいお申込みがありました', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*お名前*\n${data.name}（${data.furigana}）` },
          { type: 'mrkdwn', text: `*電話番号*\n${data.tel}` },
          { type: 'mrkdwn', text: `*メールアドレス*\n${data.email}` },
          { type: 'mrkdwn', text: `*支部名*\n${data.shibu || '―'}　No. ${data.memberNo || '―'}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*ご希望商品*\n${productList}` },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*合計金額*\n${data.totalAmount || '要問合せ含む'}` },
        ],
      },
      ...(data.note ? [{
        type: 'section',
        text: { type: 'mrkdwn', text: `*備考*\n${data.note}` },
      }] : []),
      {
        type: 'context',
        elements: [{ type: 'mrkdwn', text: `受付日時：${now}` }],
      },
    ],
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`Slack通知失敗: ${res.status}`)
}
