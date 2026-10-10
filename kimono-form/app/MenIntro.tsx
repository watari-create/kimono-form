import { MEN_PLANS, MEN_STORE } from '@/lib/types'
import intro from './intro.module.css'

export default function MenIntro() {
  return (
    <>
      <section className={intro.intro}>
        <h2 className={intro.introTitle}>男性用 頒布品着物について</h2>
        <p className={intro.body}>
          長らく男性用の頒布品着物はございませんでしたが、このたび、宗徧流の各種行事にお召しいただける流儀お揃いの装いをご用意いたしました。
        </p>
        <p className={intro.body}>
          現在、お求めいただけるご用意が整っており、行事や節目に向けてお仕度をお考えの方にもおすすめです。内容は、行事での着用を想定した着物と袴のセットです。
        </p>
        <div className={`${intro.chips} ${intro.chipsMen}`}>
          <span>黒紋付</span><span>袴</span><span>帯</span><span>正絹</span><span>合繊</span>
        </div>
        <p className={intro.body} style={{ marginTop: '0.9rem' }}>
          袴の扱いに不慣れな方や、お手入れのしやすさを重視される方のために、化繊もご用意しております。
        </p>
      </section>

      <section className={intro.product}>
        <h3 className={intro.productTitle}>価格と内容について</h3>
        <p className={intro.body}>用途に応じて、以下の三つの組み合わせからお選びいただけます。</p>
        <table className={intro.price}>
          <tbody>
            {MEN_PLANS.map(p => (
              <tr key={p.id}><td>{p.label}</td><td>{p.price}</td></tr>
            ))}
          </tbody>
        </table>
        <p className={intro.small}>
          ［含まれる内容］着物本体／裏地関係／袴／帯／仕立て／紋入れ／湯のし／はじく加工（税込）
        </p>
        <p className={intro.body} style={{ marginTop: '0.75rem' }}>
          家紋は男性女性ともに、従来通り流儀ののぞき梅の紋を入れて納品します。流儀行事にふさわしい装いを、無理なく、そして長くお使いいただけるよう配慮した内容となっております。
        </p>
        <div className={intro.store}>
          <b>{MEN_STORE.name}</b>（運営：{MEN_STORE.company}）<br />
          {MEN_STORE.address}<br />
          TEL {MEN_STORE.tel}　／　担当：{MEN_STORE.staff}<br />
          <a href={MEN_STORE.map} target="_blank" rel="noopener noreferrer">地図を開く</a>
        </div>
        <p className={intro.small}>
          きものやまとの実店舗は全国にございます。お近くの店舗は きものやまと のHPをご確認ください。
        </p>
      </section>

      <section className={intro.product}>
        <h3 className={intro.productTitle}>お申込み方法</h3>
        <p className={intro.body}>次の二通りからお選びいただけます。いずれも3営業日以内に店舗よりご連絡いたします。</p>
        <ul className={intro.checks}>
          <li><b>ご注文（来店なし）</b>　組み合わせとご寸法をご記入のうえ、そのままご注文いただけます。ご不明な箇所は空欄でも結構です。</li>
          <li><b>来店予約</b>　{MEN_STORE.name}にて、ご相談・採寸のうえご注文いただけます。</li>
        </ul>
        <p className={intro.small}>FAX（{MEN_STORE.fax}）またはメール（{MEN_STORE.email}）でも承っております。</p>
      </section>
    </>
  )
}
