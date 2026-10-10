import { Resend } from 'resend'
import { MenFormData, MEN_PLANS, MEN_STORE, Sunpo } from './types'

const now = () => new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
const dash = (v?: string) => (v && v.trim() ? v : '―')
const sunpoStr = (s: Sunpo) =>
  [s.shaku, s.sun, s.bu].every(v => !v) ? '―' : `${s.shaku || '0'}尺${s.sun || '0'}寸${s.bu || '0'}分`

const typeLabel = (d: MenFormData) => (d.requestType === 'visit' ? '来店予約' : 'ご注文（来店なし）')

function planText(d: MenFormData) {
  const p = MEN_PLANS.find(p => p.id === d.plan)
  return p ? `${p.label}（${p.detail}）${p.price}` : '―'
}

function consultText(d: MenFormData) {
  if (d.consult.length === 0) return '―'
  return d.consult.map(c => (c === 'その他' && d.consultOther ? `その他（${d.consultOther}）` : c)).join('、')
}

function visitTime(d: MenFormData) {
  if (!d.visitTimeFrom && !d.visitTimeTo) return '―'
  return `${d.visitTimeFrom || ''}〜${d.visitTimeTo || ''}`
}

function monText(d: MenFormData) {
  return d.mon === 'その他' ? `その他（${dash(d.monOther)}）` : 'ご指定紋（のぞき梅）'
}

/** メール・Slack 共通の内容行 */
function detailLines(d: MenFormData): [string, string][] {
  const common: [string, string][] = [
    ['お名前', `${d.name}（${d.furigana}）`],
    ['電話番号', d.tel],
    ['メール', d.email],
    ['ご住所', dash(d.address)],
  ]
  if (d.requestType === 'visit') {
    return [
      ['店舗', MEN_STORE.name],
      ['ご来店希望日', dash(d.visitDate)],
      ['ご来店希望時間', visitTime(d)],
      ['ご相談内容', consultText(d)],
      ['ご紹介先', dash(d.referral)],
      ['ご着用予定日', dash(d.wearDate)],
      ...common,
    ]
  }
  return [
    ['組み合わせ', planText(d)],
    ['ご身長 / ヒップ / お腹まわり', `${dash(d.height)}cm / ${dash(d.hip)}cm / ${dash(d.waist)}cm`],
    ['身丈（背）', sunpoStr(d.shintake)],
    ['裄', sunpoStr(d.yuki)],
    ['紋の種類', monText(d)],
    ['ご希望納期', dash(d.deliveryDate)],
    ['お渡し方法', dash(d.handover)],
    ['ご希望の連絡手段', dash(d.contactMethod)],
    ...common,
  ]
}

export async function sendMenSlack(d: MenFormData) {
  const webhookUrl = process.env.KIMONO_SLACK_WEBHOOK_URL
  if (!webhookUrl) throw new Error('KIMONO_SLACK_WEBHOOK_URL が設定されていません')

  const lines = detailLines(d).map(([k, v]) => `*${k}*：${v}`).join('\n')
  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `👘 男性用 紋付袴：${typeLabel(d)}`, emoji: true },
      },
      { type: 'section', text: { type: 'mrkdwn', text: lines } },
      ...(d.note ? [{ type: 'section', text: { type: 'mrkdwn', text: `*備考*\n${d.note}` } }] : []),
      { type: 'context', elements: [{ type: 'mrkdwn', text: `受付日時：${now()}` }] },
    ],
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Slack通知失敗: ${res.status}`)
}

export async function sendMenEmail(d: MenFormData) {
  const fromEmail = process.env.FROM_EMAIL
  if (!fromEmail) throw new Error('FROM_EMAIL が設定されていません')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const body = detailLines(d).map(([k, v]) => `${k}：${v}`).join('\n')
  const isVisit = d.requestType === 'visit'

  const { error } = await resend.emails.send({
    from: `茶道宗徧流不審庵本部 <${fromEmail}>`,
    to: d.email,
    subject: isVisit
      ? '【茶道宗徧流不審庵本部】男性用紋付袴 ご来店予約を承りました'
      : '【茶道宗徧流不審庵本部】男性用紋付袴 ご注文を承りました',
    text: `
${d.name} 様

この度は男性用 紋付袴の${isVisit ? 'ご来店予約' : 'ご注文'}をいただき、誠にありがとうございます。
3営業日以内に、${MEN_STORE.name}よりご連絡いたします。

━━━━━━━━━━━━━━━━━━━━
【${typeLabel(d)}】受付内容
━━━━━━━━━━━━━━━━━━━━
${body}
${d.note ? `\n【備考】\n${d.note}\n` : ''}━━━━━━━━━━━━━━━━━━━━

【店舗情報】
${MEN_STORE.name}
${MEN_STORE.address}
TEL ${MEN_STORE.tel}
運営会社：${MEN_STORE.company}
地図：${MEN_STORE.map}

ご不明な点がございましたら、お気軽にご連絡ください。

─────────────────────
茶道宗徧流不審庵本部
${fromEmail}
─────────────────────
`.trim(),
  })

  if (error) throw new Error(`メール送信失敗: ${error.message}`)
}

export async function appendMenToSpreadsheet(d: MenFormData) {
  const webhookUrl = process.env.GAS_WEBHOOK_URL
  if (!webhookUrl) throw new Error('GAS_WEBHOOK_URL が設定されていません')

  const isVisit = d.requestType === 'visit'
  const row = {
    種別: '男性用',
    受付日時: now(),
    申込区分: isVisit ? '来店予約' : 'ご注文',
    お名前: d.name,
    フリガナ: d.furigana,
    電話番号: d.tel,
    メール: d.email,
    住所: dash(d.address),
    来店希望日: isVisit ? dash(d.visitDate) : '―',
    来店希望時間: isVisit ? visitTime(d) : '―',
    相談内容: isVisit ? consultText(d) : '―',
    紹介先: isVisit ? dash(d.referral) : '―',
    着用予定日: isVisit ? dash(d.wearDate) : '―',
    組み合わせ: isVisit ? '―' : planText(d),
    '身長(cm)': isVisit ? '―' : dash(d.height),
    'ヒップ(cm)': isVisit ? '―' : dash(d.hip),
    'お腹まわり(cm)': isVisit ? '―' : dash(d.waist),
    '身丈(背)': isVisit ? '―' : sunpoStr(d.shintake),
    裄: isVisit ? '―' : sunpoStr(d.yuki),
    紋: isVisit ? '―' : monText(d),
    希望納期: isVisit ? '―' : dash(d.deliveryDate),
    お渡し方法: isVisit ? '―' : dash(d.handover),
    連絡手段: isVisit ? '―' : dash(d.contactMethod),
    備考: dash(d.note),
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  })
  if (!res.ok) throw new Error(`スプレッドシート記録失敗: ${res.status}`)
}
