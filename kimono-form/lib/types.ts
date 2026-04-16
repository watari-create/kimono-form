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
