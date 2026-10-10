'use client'

import { useState } from 'react'
import styles from './intro.module.css'

type Photo = { src: string; caption: string }

const WINTER: Photo[] = [
  { src: '/images/winter-full.jpg', caption: '袷きもの のぞき梅 × 名古屋帯 むかい蝶' },
  { src: '/images/winter-obi-front.jpg', caption: '名古屋帯 むかい蝶（前）' },
  { src: '/images/winter-obi-back.jpg', caption: '名古屋帯 むかい蝶（後）' },
]

const SUMMER: Photo[] = [
  { src: '/images/summer-full.jpg', caption: '夏きもの 蝶の舞 × 夏帯 萩と月' },
  { src: '/images/summer-obi-front.jpg', caption: '夏帯 萩と月（前）' },
  { src: '/images/summer-obi-back.jpg', caption: '夏帯 萩と月（後）' },
]

export default function WomenIntro() {
  const [zoom, setZoom] = useState<Photo | null>(null)

  return (
    <>
      <section className={styles.intro}>
        <h2 className={styles.introTitle}>流儀お揃い着物のご案内</h2>
        <p className={styles.lead}>
          このたび、門人の皆さまよりかねてよりご要望をいただいておりました流儀の頒布着物を制作いたしました。
        </p>
        <p className={styles.body}>
          近年、夏の期間が長くなっていること、また気候の変化を考慮し、従来の「袷・単・絽」という三種類ではなく、5月から9月までお召しいただける<strong>夏用着物</strong>と、10月から4月までお召しいただける<strong>冬用の袷着物</strong>の二季構成といたしました。また、真夏日の茶道行事や水屋仕事などにおいて、ご自宅でのお手入れのしやすさを重視される方のために、<strong>化繊の着物</strong>も併せてご用意しております。
        </p>
        <p className={styles.body}>
          正絹・合繊ともにご選択いただけるほか、帯とのセットでのご注文も承っております。いずれも流儀の行事全般でお召しいただける内容となっております。
        </p>
        <div className={styles.chips}>
          <span>冬物（袷）</span><span>夏物（絽）</span><span>正絹</span><span>合繊</span>
        </div>
      </section>

      <section className={styles.product}>
        <div className={styles.productHead}>
          <span className={`${styles.season} ${styles.winter}`}>冬物（袷）10月〜4月</span>
          <h3 className={styles.productTitle}>のぞき梅 ／ 名古屋帯 むかい蝶</h3>
        </div>
        <Gallery photos={WINTER} onZoom={setZoom} />
        <p className={styles.body}>
          地紋には蔦の中に覗梅をあしらい、落ち着いた中にもやわらかな表情をもたせました。帯は、宗白宗匠が考案されたむかい蝶を復刻いたしました。流儀の歴史と記憶を大切にしながらも、現在の装いに調和するデザインです。
        </p>
        <PriceTable rows={[
          ['着物 正絹（仕立て込み）', '¥378,000'],
          ['着物 合繊（仕立て込み）', '¥139,000'],
          ['名古屋帯 むかい蝶（仕立て込み）', '¥258,000'],
          ['セット 正絹＋むかい蝶（仕立て込み）', '¥591,000'],
          ['セット 合繊＋むかい蝶（仕立て込み）', '¥369,000'],
        ]} />
      </section>

      <section className={styles.product}>
        <div className={styles.productHead}>
          <span className={`${styles.season} ${styles.summer}`}>夏物（絽）5月〜9月</span>
          <h3 className={styles.productTitle}>蝶の舞 ／ 夏帯 萩と月</h3>
        </div>
        <Gallery photos={SUMMER} onZoom={setZoom} />
        <p className={styles.body}>
          意匠には流儀好みでもある蝶をあしらい、色合いは青磁と若竹色を基調とした、涼やかさの中にも品格を感じさせる仕上がりとなっております。帯には、希斎宗匠の『土耳古裂帖』より考案された「萩と月」を復刻し、流儀らしい趣と懐かしさを添えております。
        </p>
        <PriceTable rows={[
          ['着物 正絹（仕立て込み）', '¥428,000'],
          ['着物 合繊（仕立て込み）', '¥162,000'],
          ['夏帯 萩と月（仕立て込み）', '¥206,000'],
          ['セット 正絹＋萩と月（仕立て込み）', '¥589,000'],
          ['セット 合繊＋萩と月（仕立て込み）', '¥342,000'],
        ]} />
        <p className={styles.small}>※ 反物のみ（仕立て・はじく加工なし）の価格は、下のお申込み欄でご確認いただけます。</p>
      </section>

      <section className={styles.product}>
        <h3 className={styles.productTitle}>「のぞき梅」洗える着物についてのお知らせ</h3>
        <div className={styles.fabric}>
          <figure onClick={() => setZoom({ src: '/images/fabric-silk.jpg', caption: '正絹' })}>
            <img src="/images/fabric-silk.jpg" alt="正絹の生地" />
            <figcaption>正絹</figcaption>
          </figure>
          <figure onClick={() => setZoom({ src: '/images/fabric-synthetic.jpg', caption: '合繊' })}>
            <img src="/images/fabric-synthetic.jpg" alt="合繊の生地" />
            <figcaption>合繊</figcaption>
          </figure>
        </div>
        <p className={styles.body}>
          袷用の合繊生地は、地紋を染めて仕上げる仕様のため、正絹と並べて比較すると、見た目や風合いの印象に違いが生じます。職人の皆様には正絹の雰囲気に近づけるよう調整を重ねていただいておりますが、素材そのものの性質の違いから、仕上がりには一定の差異が生じる可能性がございます。
        </p>
        <ul className={styles.checks}>
          <li>合繊生地は、正絹と比較した場合、色味・光沢・地紋の見え方・風合いなどに違いが生じる場合がございます。</li>
          <li>正絹と全く同一の印象にはならない可能性がございます。</li>
          <li>上記の素材上の違いをご理解いただいたうえで、お申し込みくださいますようお願いいたします。</li>
        </ul>
      </section>

      <section className={styles.product}>
        <h3 className={styles.productTitle}>ご注文から納品までの流れ</h3>
        <ol className={styles.flow}>
          <li><b>お申し込み</b>このフォーム、またはFAX（0467-25-1550）にてお申し込みください。<span className={styles.deadline}>締切：12月11日（金）</span></li>
          <li><b>請求書の送付</b>本部より請求書をお送りいたします。お振込にてお支払いください。</li>
          <li><b>お仕立て・加工</b>お申し込み内容をもとに、仕立て・新はじく加工・紋入れを行います。</li>
          <li><b>納品・発送</b>きものやまとよりご指定のご住所へ発送いたします。送料別途。</li>
        </ol>
        <p className={styles.small}>※ 締切日より約3ヶ月後の納品となります。お急ぎの場合は本部にご相談ください。<br />※ お申込み後のキャンセルは承っておりません。あらかじめご了承ください。</p>
      </section>

      {zoom && (
        <div className={styles.lightbox} onClick={() => setZoom(null)}>
          <img src={zoom.src} alt={zoom.caption} />
          <p>{zoom.caption}</p>
        </div>
      )}
    </>
  )
}

function Gallery({ photos, onZoom }: { photos: Photo[]; onZoom: (p: Photo) => void }) {
  const [main, ...subs] = photos
  return (
    <div className={styles.gallery}>
      <figure className={styles.main} onClick={() => onZoom(main)}>
        <img src={main.src} alt={main.caption} />
      </figure>
      <div className={styles.subs}>
        {subs.map(p => (
          <figure key={p.src} onClick={() => onZoom(p)}>
            <img src={p.src} alt={p.caption} />
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

function PriceTable({ rows }: { rows: [string, string][] }) {
  return (
    <table className={styles.price}>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k}><td>{k}</td><td>{v}</td></tr>
        ))}
      </tbody>
    </table>
  )
}
