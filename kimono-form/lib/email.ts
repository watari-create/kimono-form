import { Resend } from 'resend'
import { KimonoFormData } from './types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(data: KimonoFormData) {
  const fromEmail = process.env.FROM_EMAIL
  if (!fromEmail) throw new Error('FROM_EMAIL が設定されていません')

  const productList = data.products.length > 0
    ? data.products.map(p => `・${p}`).join('\n')
    : '（未選択）'

  const { error } = await resend.emails.send({
    from: `のぞき梅 <${fromEmail}>`,
    to: data.email,
    subject: '【のぞき梅】お申込みありがとうございます',
    text: `
${data.name} 様

この度はお申込みいただきありがとうございます。
本部より請求書をお送りいたしますので、お振込みいただけますと幸いです。

━━━━━━━━━━━━━━━━━━━━
【お申込み内容】
━━━━━━━━━━━━━━━━━━━━
お名前　：${data.name}（${data.furigana}）
電話番号：${data.tel}
ご住所　：${data.address || '―'}
支部名　：${data.shibu || '―'}　No. ${data.memberNo || '―'}

【ご希望商品】
${productList}

${data.note ? `【備考】\n${data.note}\n\n` : ''}━━━━━━━━━━━━━━━━━━━━

ご不明な点がございましたら、お気軽にご連絡ください。
引き続きどうぞよろしくお願いいたします。

─────────────────────
茶道宗徧流不審庵本部
${fromEmail}
─────────────────────
`.trim(),
  })

  if (error) throw new Error(`メール送信失敗: ${error.message}`)
}
