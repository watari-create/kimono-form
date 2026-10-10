import Link from 'next/link'
import styles from '../../page.module.css'
import SiteHeader from '../../SiteHeader'
import MenForm from '../../MenForm'

export const metadata = {
  title: '男性用 紋付袴 お申込み | 茶道宗徧流不審庵',
}

export default function MenOrderPage() {
  return (
    <div className={styles.container}>
      <SiteHeader title="男性用 紋付袴 ご注文・来店予約" />
      <nav className={styles.pageNav}>
        <Link href="/?type=men">← 商品のご案内（価格・店舗）</Link>
        <Link href="/order">女性用はこちら →</Link>
      </nav>
      <MenForm />
    </div>
  )
}
