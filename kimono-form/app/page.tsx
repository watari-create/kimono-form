'use client'

import { useState, useMemo } from 'react'
import { KimonoFormData, PRODUCT_SECTIONS, SUNPO_FIELDS, Sunpo } from '@/lib/types'
import styles from './page.module.css'

const emptySunpo = (): Sunpo => ({ shaku: '', sun: '', bu: '' })

const initialForm = (): KimonoFormData => ({
  name: '', furigana: '', tel: '', email: '',
  address: '', shibu: '', memberNo: '',
  height: '', hip: '',
  shintake: emptySunpo(), sodake: emptySunpo(), yuki: emptySunpo(),
  sodahaba: emptySunpo(), sodatsuke: emptySunpo(), maehaba: emptySunpo(),
  ushirohaba: emptySunpo(), tsumashita: emptySunpo(), kurikoshi: emptySunpo(),
  products: [],
  totalAmount: '',
  note: '',
})

// 全商品をフラットなマップに変換
const productMap = new Map<string, { price: string; amount: number }>()
PRODUCT_SECTIONS.forEach(section => {
  section.items.forEach(item => {
    const id = `${section.title}-${item.name}`
    productMap.set(id, { price: item.price, amount: item.amount })
  })
})

export default function Home() {
  const [form, setForm] = useState<KimonoFormData>(initialForm())
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // 合計金額を計算
  const { total, hasUnpriced } = useMemo(() => {
    let sum = 0
    let unpriced = false
    form.products.forEach(id => {
      const p = productMap.get(id)
      if (p) {
        if (p.amount > 0) sum += p.amount
        else unpriced = true
      }
    })
    return { total: sum, hasUnpriced: unpriced }
  }, [form.products])

  const totalDisplay = form.products.length === 0
    ? ''
    : hasUnpriced && total === 0
      ? '要問合せ'
      : hasUnpriced
        ? `¥${total.toLocaleString()} ＋ 要問合せ分`
        : `¥${total.toLocaleString()}`

  const setField = (key: keyof KimonoFormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const setSunpo = (key: keyof KimonoFormData, field: keyof Sunpo, value: string) =>
    setForm(f => ({ ...f, [key]: { ...(f[key] as Sunpo), [field]: value } }))

  const toggleProduct = (id: string) =>
    setForm(f => ({
      ...f,
      products: f.products.includes(id)
        ? f.products.filter(p => p !== id)
        : [...f.products, id],
    }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.tel) {
      setErrorMsg('お名前・メールアドレス・電話番号をご入力ください')
      return
    }
    if (form.products.length === 0) {
      setErrorMsg('商品を1つ以上お選びください')
      return
    }
    setErrorMsg('')
    setStatus('loading')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, totalAmount: totalDisplay }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'エラーが発生しました')
      }
      setStatus('done')
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'エラーが発生しました')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className={styles.container}>
        <div className={styles.thanks}>
          <div className={styles.logo}><LogoSvg /></div>
          <h1 className={styles.thanksTitle}>お申込みありがとうございます</h1>
          <p className={styles.thanksText}>
            ご登録のメールアドレスへご案内をお送りしました。<br />
            本部より請求書をお送りいたしますので、<br />
            お振込みいただけますと幸いです。
          </p>
          <p className={styles.thanksNote}>
            ご不明な点がございましたらお気軽にご連絡ください。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}><LogoSvg /></div>
        <div>
          <h1 className={styles.title}>茶道宗徧流不審庵 頒布着物申し込み</h1>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お客様情報</h2>
        <div className={styles.row2}>
          <Field label="お名前" required>
            <input type="text" placeholder="山田 花子" value={form.name}
              onChange={e => setField('name', e.target.value)} />
          </Field>
          <Field label="フリガナ" required>
            <input type="text" placeholder="ヤマダ ハナコ" value={form.furigana}
              onChange={e => setField('furigana', e.target.value)} />
          </Field>
        </div>
        <div className={styles.row2}>
          <Field label="電話番号" required>
            <input type="tel" placeholder="090-0000-0000" value={form.tel}
              onChange={e => setField('tel', e.target.value)} />
          </Field>
          <Field label="メールアドレス" required>
            <input type="email" placeholder="example@mail.com" value={form.email}
              onChange={e => setField('email', e.target.value)} />
          </Field>
        </div>
        <Field label="ご住所">
          <input type="text" placeholder="〒000-0000　都道府県・市区町村・番地" value={form.address}
            onChange={e => setField('address', e.target.value)} />
        </Field>
        <div className={styles.row2}>
          <Field label="支部名">
            <input type="text" placeholder="〇〇支部" value={form.shibu}
              onChange={e => setField('shibu', e.target.value)} />
          </Field>
          <Field label="会員番号">
            <input type="text" placeholder="No." value={form.memberNo}
              onChange={e => setField('memberNo', e.target.value)} />
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>体型情報</h2>
        <div className={styles.row2}>
          <Field label="身長（cm）">
            <input type="number" placeholder="158" value={form.height}
              onChange={e => setField('height', e.target.value)} />
          </Field>
          <Field label="ヒップ（cm）">
            <input type="number" placeholder="92" value={form.hip}
              onChange={e => setField('hip', e.target.value)} />
          </Field>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>きもの寸法（鯨尺）</h2>
        <table className={styles.sunpoTable}>
          <thead>
            <tr><th>部位</th><th>尺</th><th>寸</th><th>分</th></tr>
          </thead>
          <tbody>
            {SUNPO_FIELDS.map(({ key, label, shakuOnly }) => (
              <tr key={key}>
                <td className={styles.sunpoLabel}>
                  {label}{shakuOnly && <span className={styles.asterisk}> ＊</span>}
                </td>
                <td>
                  <input type="number" min="0" max="9"
                    disabled={shakuOnly}
                    value={(form[key] as Sunpo).shaku}
                    onChange={e => setSunpo(key, 'shaku', e.target.value)}
                    className={shakuOnly ? styles.disabled : ''}
                  />
                </td>
                <td>
                  <input type="number" min="0" max="9"
                    value={(form[key] as Sunpo).sun}
                    onChange={e => setSunpo(key, 'sun', e.target.value)}
                  />
                </td>
                <td>
                  <input type="number" min="0" max="9"
                    value={(form[key] as Sunpo).bu}
                    onChange={e => setSunpo(key, 'bu', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.sunpoNote}>＊ 印の項目は寸・分のみ入力</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ご希望の商品</h2>
        {PRODUCT_SECTIONS.map(section => (
          <div key={section.title} className={styles.productSection}>
            <div className={styles.productSectionTitle}>{section.title}</div>
            {section.items.map(item => {
              const id = `${section.title}-${item.name}`
              const selected = form.products.includes(id)
              return (
                <div key={id}
                  className={`${styles.productRow} ${selected ? styles.productRowSelected : ''}`}
                  onClick={() => toggleProduct(id)}>
                  <div className={styles.productRowLeft}>
                    <span className={`${styles.checkBox} ${selected ? styles.checkBoxChecked : ''}`} />
                    <span className={styles.productName}>{item.name}</span>
                  </div>
                  <span className={styles.productPrice}>
                    {item.price || '要問合せ'}
                  </span>
                </div>
              )
            })}
          </div>
        ))}

        {totalDisplay && (
          <div className={styles.totalBox}>
            <span className={styles.totalLabel}>合計金額（税込）</span>
            <span className={styles.totalAmount}>{totalDisplay}</span>
          </div>
        )}

        <p className={styles.productNote}>
          ※ 価格はすべて税込。お仕立て代・新はじく加工代・のぞき梅の紋入れ代を含みます。セット価格は7%引きです。<br />
          ※ 合繊はご自宅でお手入れいただける洗える着物です。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>備考・ご要望</h2>
        <textarea placeholder="サイズのご相談、配送希望日など"
          value={form.note}
          onChange={e => setField('note', e.target.value)}
          className={styles.textarea} />
      </section>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <button className={styles.submitBtn} onClick={handleSubmit}
        disabled={status === 'loading'}>
        {status === 'loading' ? '送信中...' : '申し込む'}
      </button>

      <p className={styles.submitNote}>
        送信後、本部より請求書をお送りいたします。
      </p>
    </div>
  )
}

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label>{label}{required && <span className={styles.required}> ＊</span>}</label>
      {children}
    </div>
  )
}

function LogoSvg() {
  return (
    <img
      src="data:image/png;base64,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"
      alt="のぞき梅ロゴ"
      width="48"
      height="48"
      style={{ borderRadius: '50%' }}
    />
  )
}
