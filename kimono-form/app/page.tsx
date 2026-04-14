'use client'

import { useState } from 'react'
import { KimonoFormData, PRODUCTS, SUNPO_FIELDS, Sunpo } from '@/lib/types'
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
  note: '',
})

export default function Home() {
  const [form, setForm] = useState<KimonoFormData>(initialForm())
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const setField = (key: keyof KimonoFormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const setSunpo = (key: keyof KimonoFormData, field: keyof Sunpo, value: string) =>
    setForm(f => ({ ...f, [key]: { ...(f[key] as Sunpo), [field]: value } }))

  const toggleProduct = (name: string) =>
    setForm(f => ({
      ...f,
      products: f.products.includes(name)
        ? f.products.filter(p => p !== name)
        : [...f.products, name],
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
        body: JSON.stringify(form),
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
            ご登録のメールアドレスへ<br />
            振込先をご案内するメールをお送りしました。<br />
            ご確認のうえ、お振込みをお願いいたします。
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
          <h1 className={styles.title}>お申込みフォーム（着物）</h1>
          <p className={styles.subtitle}>のぞき梅 / 侘び数寄道</p>
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
        <div className={styles.products}>
          {PRODUCTS.map(name => (
            <button key={name} type="button"
              className={`${styles.productCard} ${form.products.includes(name) ? styles.selected : ''}`}
              onClick={() => toggleProduct(name)}>
              <span className={styles.productCheck} />
              <span className={styles.productName}>{name}</span>
            </button>
          ))}
        </div>
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
        送信後、振込先をメールでお知らせします。<br />
        ご入金確認後に制作を開始いたします。
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
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
      <circle cx="30" cy="30" r="27" stroke="#2c2c2a" strokeWidth="2.5"/>
      <circle cx="30" cy="30" r="21" stroke="#2c2c2a" strokeWidth="1.5"/>
      <ellipse cx="30" cy="43" rx="13" ry="9" fill="#2c2c2a"/>
      <circle cx="30" cy="32" r="7" fill="#2c2c2a"/>
      <circle cx="21" cy="45" r="5" fill="#2c2c2a"/>
      <circle cx="39" cy="45" r="5" fill="#2c2c2a"/>
    </svg>
  )
}
