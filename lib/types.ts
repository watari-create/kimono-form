export type Sunpo = {
  shaku: string
  sun: string
  bu: string
}

export type KimonoFormData = {
  name: string
  furigana: string
  tel: string
  email: string
  address: string
  shibu: string
  memberNo: string
  height: string
  hip: string
  shintake: Sunpo
  sodake: Sunpo
  yuki: Sunpo
  sodahaba: Sunpo
  sodatsuke: Sunpo
  maehaba: Sunpo
  ushirohaba: Sunpo
  tsumashita: Sunpo
  kurikoshi: Sunpo
  products: string[]
  totalAmount: string
  note: string
}

export type ProductItem = {
  name: string
  price: string
  amount: number
}

export type ProductSection = {
  title: string
  items: ProductItem[]
}

export const PRODUCT_SECTIONS: ProductSection[] = [
  {
    title: '反物のみ　単品',
    items: [
      { name: '袷きもの　のぞき梅（正絹）', price: '¥335,000', amount: 335000 },
      { name: '袷きもの　のぞき梅（合繊）', price: '¥116,000', amount: 116000 },
      { name: '名古屋帯　向かい蝶（ピンク）', price: '¥245,000', amount: 245000 },
      { name: '名古屋帯　向かい蝶（ブルー・直門専用）', price: '¥245,000', amount: 245000 },
      { name: '夏きもの　蝶の舞（正絹）', price: '¥387,000', amount: 387000 },
      { name: '夏きもの　蝶の舞（合繊）', price: '¥139,000', amount: 139000 },
      { name: '夏帯　萩と月', price: '¥193,000', amount: 193000 },
    ],
  },
  {
    title: '反物のみ　セット',
    items: [
      { name: 'のぞき梅（正絹）＋向かい蝶（ピンク）', price: '¥539,000', amount: 539000 },
      { name: 'のぞき梅（正絹）＋向かい蝶（ブルー・直門専用）', price: '¥539,000', amount: 539000 },
      { name: 'のぞき梅（合繊）＋向かい蝶（ピンク）', price: '¥335,000', amount: 335000 },
      { name: 'のぞき梅（合繊）＋向かい蝶（ブルー・直門専用）', price: '¥335,000', amount: 335000 },
      { name: '蝶の舞（正絹）＋萩と月', price: '¥539,000', amount: 539000 },
      { name: '蝶の舞（合繊）＋萩と月', price: '¥308,000', amount: 308000 },
    ],
  },
  {
    title: '仕立て込み　単品',
    items: [
      { name: '袷きもの　のぞき梅（正絹）', price: '¥378,000', amount: 378000 },
      { name: '袷きもの　のぞき梅（合繊）', price: '¥139,000', amount: 139000 },
      { name: '名古屋帯　向かい蝶（ピンク）', price: '¥258,000', amount: 258000 },
      { name: '名古屋帯　向かい蝶（ブルー・直門専用）', price: '¥258,000', amount: 258000 },
      { name: '夏きもの　蝶の舞（正絹）', price: '¥428,000', amount: 428000 },
      { name: '夏きもの　蝶の舞（合繊）', price: '¥162,000', amount: 162000 },
      { name: '夏帯　萩と月', price: '¥206,000', amount: 206000 },
    ],
  },
  {
    title: '仕立て込み　セット',
    items: [
      { name: 'のぞき梅（正絹）＋向かい蝶（ピンク）', price: '¥591,000', amount: 591000 },
      { name: 'のぞき梅（正絹）＋向かい蝶（ブルー・直門専用）', price: '¥591,000', amount: 591000 },
      { name: 'のぞき梅（合繊）＋向かい蝶（ピンク）', price: '¥369,000', amount: 369000 },
      { name: 'のぞき梅（合繊）＋向かい蝶（ブルー・直門専用）', price: '¥369,000', amount: 369000 },
      { name: '蝶の舞（正絹）＋萩と月', price: '¥589,000', amount: 589000 },
      { name: '蝶の舞（合繊）＋萩と月', price: '¥342,000', amount: 342000 },
    ],
  },
]

export const SUNPO_FIELDS: { key: keyof Pick<KimonoFormData, 'shintake'|'sodake'|'yuki'|'sodahaba'|'sodatsuke'|'maehaba'|'ushirohaba'|'tsumashita'|'kurikoshi'>; label: string; shakuOnly?: boolean }[] = [
  { key: 'shintake',    label: '身丈（背）' },
  { key: 'sodake',      label: '袖丈' },
  { key: 'yuki',        label: '裄' },
  { key: 'sodahaba',    label: '袖巾' },
  { key: 'sodatsuke',   label: '袖付',     shakuOnly: true },
  { key: 'maehaba',     label: '前巾',     shakuOnly: true },
  { key: 'ushirohaba',  label: '後巾' },
  { key: 'tsumashita',  label: '褄下' },
  { key: 'kurikoshi',   label: 'くりこし', shakuOnly: true },
]

// ===================================================
// 男性用 紋付袴
// ===================================================

export type MenRequestType = 'order' | 'visit'

export type MenFormData = {
  formType: 'men'
  requestType: MenRequestType
  // 共通
  name: string
  furigana: string
  tel: string
  email: string
  address: string
  note: string
  // 来店予約
  visitDate: string
  visitTimeFrom: string
  visitTimeTo: string
  consult: string[]
  consultOther: string
  referral: string
  wearDate: string
  // ご注文（来店なし）
  plan: string
  height: string
  hip: string
  waist: string
  shintake: Sunpo
  yuki: Sunpo
  mon: string
  monOther: string
  deliveryDate: string
  handover: string
  contactMethod: string
}

export type MenPlan = {
  id: string
  label: string
  detail: string
  price: string
  amount: number
}

export const MEN_PLANS: MenPlan[] = [
  { id: 'synthetic', label: '① すべて合繊', detail: '紋付着物（合繊）・袴（合繊）・帯（合繊）', price: '¥200,750', amount: 200750 },
  { id: 'mixed',     label: '② 正絹 着物＋合繊 袴・帯', detail: '紋付着物（正絹）・袴（合繊）・帯（合繊）', price: '¥435,820', amount: 435820 },
  { id: 'silk',      label: '③ すべて正絹', detail: '紋付着物（正絹）・袴（正絹）・帯（正絹）', price: '¥567,270', amount: 567270 },
]

export const MEN_CONSULT_OPTIONS = ['紋付袴のご注文（誂え）', '採寸のみ', 'その他']
export const MEN_REFERRAL_OPTIONS = ['侘び数寄道', '宗徧流']

export const MEN_STORE = {
  name: 'THE YARD 外苑前店',
  address: '〒150-0001 東京都渋谷区神宮前3-36-26',
  tel: '03-5843-1063',
  fax: '03-5843-1062',
  email: 'web.theyard.361@gmail.com',
  company: '株式会社やまと',
  staff: '店長 佐久間 賢',
  map: 'https://maps.app.goo.gl/RCXTzhnSUNWBL2669',
}
