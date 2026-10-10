'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import SiteHeader from './SiteHeader'
import WomenIntro from './WomenIntro'
import MenIntro from './MenIntro'

export default function GuidePage() {
  const [gender, setGender] = useState<'women' | 'men'>('women')

  // ?type=men で男性用タブを開く
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type')
    if (t === 'men') setGender('men')
  }, [])

  const switchGender = (g: 'women' | 'men') => {
    setGender(g)
    const url = new URL(window.location.href)
    if (g === 'men') url.searchParams.set('type', 'men')
    else url.searchParams.delete('type')
    window.history.replaceState(null, '', url.toString())
  }

  const isMen = gender === 'men'

  return (
    <div className={styles.container}>
      <SiteHeader title="頒布着物のご案内" />

      <div className={styles.genderTabs}>
        <button type="button"
          className={`${styles.genderTab} ${!isMen ? styles.genderTabActive : ''}`}
          onClick={() => switchGender('women')}>女性用 お揃い着物</button>
        <button type="button"
          className={`${styles.genderTab} ${isMen ? styles.genderTabActive : ''}`}
          onClick={() => switchGender('men')}>男性用 紋付袴</button>
      </div>

      <OrderCta men={isMen} compact />

      {isMen ? <MenIntro /> : <WomenIntro />}

      <OrderCta men={isMen} />
    </div>
  )
}

function OrderCta({ men, compact }: { men: boolean; compact?: boolean }) {
  if (men) {
    return (
      <div className={compact ? styles.ctaCompact : styles.cta}>
        {!compact && <p className={styles.ctaLead}>ご注文・ご来店予約はこちらから</p>}
        <div className={styles.ctaRow}>
          <Link href="/men/order" className={styles.ctaBtn}>ご注文へ</Link>
          <Link href="/men/order?mode=visit" className={`${styles.ctaBtn} ${styles.ctaBtnSub}`}>来店予約へ</Link>
        </div>
      </div>
    )
  }
  return (
    <div className={compact ? styles.ctaCompact : styles.cta}>
      {!compact && <p className={styles.ctaLead}>ご確認のうえ、お申込みフォームへお進みください</p>}
      <Link href="/order" className={styles.ctaBtn}>お申込みフォームへ</Link>
    </div>
  )
}
