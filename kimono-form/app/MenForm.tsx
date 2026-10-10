'use client'

import { useState, useEffect } from 'react'
import {
  MenFormData, MenRequestType, MEN_PLANS, MEN_CONSULT_OPTIONS,
  MEN_REFERRAL_OPTIONS, MEN_STORE, Sunpo,
} from '@/lib/types'
import styles from './page.module.css'

const emptySunpo = (): Sunpo => ({ shaku: '', sun: '', bu: '' })

const initialMen = (): MenFormData => ({
  formType: 'men',
  requestType: 'order',
  name: '', furigana: '', tel: '', email: '', address: '', note: '',
  visitDate: '', visitTimeFrom: '', visitTimeTo: '',
  consult: [], consultOther: '', referral: '', wearDate: '',
  plan: '', height: '', hip: '', waist: '',
  shintake: emptySunpo(), yuki: emptySunpo(),
  mon: 'のぞき梅', monOther: '', deliveryDate: '', handover: '', contactMethod: '',
})

export default function MenForm() {
  const [form, setForm] = useState<MenFormData>(initialMen())
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = <K extends keyof MenFormData>(key: K, value: MenFormData[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const setSunpo = (key: 'shintake' | 'yuki', field: keyof Sunpo, value: string) =>
    setForm(f => ({ ...f, [key]: { ...f[key], [field]: value } }))

  const toggleConsult = (v: string) =>
    setForm(f => ({
      ...f,
      consult: f.consult.includes(v) ? f.consult.filter(c => c !== v) : [...f.consult, v],
    }))

  // ?mode=visit で来店予約を開く
  useEffect(() => {
    const m = new URLSearchParams(window.location.search).get('mode')
    if (m === 'visit') setForm(f => ({ ...f, requestType: 'visit' }))
  }, [])

  const isVisit = form.requestType === 'visit'

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.tel) {
      setErrorMsg('お名前・メールアドレス・電話番号をご入力ください')
      return
    }
    if (isVisit && !form.visitDate) {
      setErrorMsg('ご来店希望日をご入力ください')
      return
    }
    if (!isVisit && !form.plan) {
      setErrorMsg('ご希望の組み合わせをお選びください')
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
      window.scrollTo({ top: 0 })
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'エラーが発生しました')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className={styles.thanks}>
        <h1 className={styles.thanksTitle}>
          {isVisit ? 'ご来店予約を承りました' : 'ご注文を承りました'}
        </h1>
        <p className={styles.thanksText}>
          ご登録のメールアドレスへ受付内容をお送りしました。<br />
          3営業日以内に、{MEN_STORE.name}よりご連絡いたします。
        </p>
        <p className={styles.thanksNote}>ご不明な点がございましたらお気軽にご連絡ください。</p>
      </div>
    )
  }

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お申込み方法</h2>
        <div className={styles.modeSwitch}>
          {([
            ['order', 'ご注文', '来店なしでご注文'],
            ['visit', '来店予約', '店舗でご相談・採寸'],
          ] as [MenRequestType, string, string][]).map(([v, label, sub]) => (
            <button key={v} type="button"
              className={`${styles.modeBtn} ${form.requestType === v ? styles.modeBtnActive : ''}`}
              onClick={() => set('requestType', v)}>
              <span>{label}</span>
              <small>{sub}</small>
            </button>
          ))}
        </div>
      </section>

      {isVisit ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>ご来店予約内容</h2>
          <Field label="店舗">
            <input type="text" value={MEN_STORE.name} readOnly />
          </Field>
          <div className={styles.row2}>
            <Field label="ご来店希望日" required>
              <input type="date" value={form.visitDate} onChange={e => set('visitDate', e.target.value)} />
            </Field>
            <Field label="ご着用予定日">
              <input type="date" value={form.wearDate} onChange={e => set('wearDate', e.target.value)} />
            </Field>
          </div>
          <div className={styles.row2}>
            <Field label="ご来店希望時間（から）">
              <input type="time" value={form.visitTimeFrom} onChange={e => set('visitTimeFrom', e.target.value)} />
            </Field>
            <Field label="（まで）">
              <input type="time" value={form.visitTimeTo} onChange={e => set('visitTimeTo', e.target.value)} />
            </Field>
          </div>
          <Field label="ご相談内容">
            <div className={styles.choiceList}>
              {MEN_CONSULT_OPTIONS.map(o => (
                <Choice key={o} type="checkbox" label={o}
                  checked={form.consult.includes(o)} onChange={() => toggleConsult(o)} />
              ))}
            </div>
          </Field>
          {form.consult.includes('その他') && (
            <Field label="その他の内容">
              <input type="text" value={form.consultOther} onChange={e => set('consultOther', e.target.value)} />
            </Field>
          )}
          <Field label="ご紹介先">
            <div className={styles.choiceList}>
              {MEN_REFERRAL_OPTIONS.map(o => (
                <Choice key={o} type="radio" label={o}
                  checked={form.referral === o} onChange={() => set('referral', o)} />
              ))}
            </div>
          </Field>
        </section>
      ) : (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>紋付袴 ご注文内容</h2>
            {MEN_PLANS.map(p => {
              const selected = form.plan === p.id
              return (
                <div key={p.id}
                  className={`${styles.productRow} ${selected ? styles.productRowSelected : ''}`}
                  onClick={() => set('plan', p.id)}>
                  <div className={styles.productRowLeft}>
                    <span className={`${styles.radioDot} ${selected ? styles.radioDotChecked : ''}`} />
                    <span className={styles.productName}>
                      {p.label}<br /><small className={styles.productDetail}>{p.detail}</small>
                    </span>
                  </div>
                  <span className={styles.productPrice}>{p.price}</span>
                </div>
              )
            })}
            <p className={styles.productNote}>
              ※ お誂え仕立て・入紋付。価格は税込です。<br />
              ※ ご不明な箇所は空欄でも結構です。折り返しご連絡いたします。
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>ご寸法</h2>
            <div className={styles.row3}>
              <Field label="ご身長（cm）">
                <input type="number" value={form.height} onChange={e => set('height', e.target.value)} />
              </Field>
              <Field label="ヒップ（cm）">
                <input type="number" value={form.hip} onChange={e => set('hip', e.target.value)} />
              </Field>
              <Field label="お腹まわり（cm）">
                <input type="number" value={form.waist} onChange={e => set('waist', e.target.value)} />
              </Field>
            </div>
            <table className={styles.sunpoTable} style={{ marginTop: 10 }}>
              <thead>
                <tr><th>鯨尺</th><th>尺</th><th>寸</th><th>分</th></tr>
              </thead>
              <tbody>
                {([['shintake', '身丈（背）'], ['yuki', '裄']] as ['shintake' | 'yuki', string][]).map(([key, label]) => (
                  <tr key={key}>
                    <td className={styles.sunpoLabel}>{label}</td>
                    {(['shaku', 'sun', 'bu'] as (keyof Sunpo)[]).map(f => (
                      <td key={f}>
                        <input type="number" min="0" max="9" value={form[key][f]}
                          onChange={e => setSunpo(key, f, e.target.value)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>紋・納期・お渡し</h2>
            <Field label="紋の種類">
              <div className={styles.choiceList}>
                <Choice type="radio" label="ご指定紋（のぞき梅）"
                  checked={form.mon === 'のぞき梅'} onChange={() => set('mon', 'のぞき梅')} />
                <Choice type="radio" label="その他"
                  checked={form.mon === 'その他'} onChange={() => set('mon', 'その他')} />
              </div>
            </Field>
            {form.mon === 'その他' && (
              <Field label="紋の内容">
                <input type="text" value={form.monOther} onChange={e => set('monOther', e.target.value)} />
              </Field>
            )}
            <Field label="ご希望納期">
              <input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)} />
            </Field>
            <Field label="お渡し方法">
              <div className={styles.choiceList}>
                {['店舗受取', '配送'].map(o => (
                  <Choice key={o} type="radio" label={o}
                    checked={form.handover === o} onChange={() => set('handover', o)} />
                ))}
              </div>
            </Field>
          </section>
        </>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{isVisit ? 'ご予約者様情報' : 'ご注文者様情報'}</h2>
        <div className={styles.row2}>
          <Field label="お名前" required>
            <input type="text" placeholder="山田 太郎" value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="フリガナ" required>
            <input type="text" placeholder="ヤマダ タロウ" value={form.furigana} onChange={e => set('furigana', e.target.value)} />
          </Field>
        </div>
        <div className={styles.row2}>
          <Field label="電話番号" required>
            <input type="tel" placeholder="090-0000-0000" value={form.tel} onChange={e => set('tel', e.target.value)} />
          </Field>
          <Field label="メールアドレス" required>
            <input type="email" placeholder="example@mail.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
        </div>
        <Field label="ご住所">
          <input type="text" placeholder="〒000-0000　都道府県・市区町村・番地" value={form.address}
            onChange={e => set('address', e.target.value)} />
        </Field>
        {!isVisit && (
          <Field label="ご希望の連絡手段">
            <div className={styles.choiceList}>
              {['電話', 'メール'].map(o => (
                <Choice key={o} type="radio" label={o}
                  checked={form.contactMethod === o} onChange={() => set('contactMethod', o)} />
              ))}
            </div>
          </Field>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>備考・ご要望</h2>
        <textarea placeholder="ご質問、ご相談など" value={form.note}
          onChange={e => set('note', e.target.value)} className={styles.textarea} />
      </section>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <button className={styles.submitBtn} onClick={handleSubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '送信中...' : isVisit ? '来店予約を送信する' : '注文を送信する'}
      </button>
      <p className={styles.submitNote}>
        送信後、3営業日以内に{MEN_STORE.name}よりご連絡いたします。
      </p>
    </>
  )
}

function Field({ label, required, children }: {
  label: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}{required && <span className={styles.required}> ＊</span>}</span>
      {children}
    </div>
  )
}

function Choice({ type, label, checked, onChange }: {
  type: 'checkbox' | 'radio'; label: string; checked: boolean; onChange: () => void
}) {
  return (
    <label className={`${styles.choice} ${checked ? styles.choiceChecked : ''}`}>
      <input type={type} checked={checked} onChange={onChange} />
      {label}
    </label>
  )
}
