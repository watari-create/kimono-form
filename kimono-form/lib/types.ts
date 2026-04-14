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
    title: '夏物（絽）蝶の舞　※仕立て・加工込',
    items: [
      { name: '着物　正絹', price: '¥440,000', amount: 440000 },
      { name: '着物　合繊', price: '¥165,000', amount: 165000 },
      { name: '夏帯　萩と月', price: '¥198,000', amount: 198000 },
      { name: 'セット（正絹）', price: '¥603,000', amount: 603000 },
      { name: 'セット（合繊）', price: '¥338,000', amount: 338000 },
    ],
  },
  {
    title: '冬物（袷）のぞき梅　※仕立て・加工込',
    items: [
      { name: '着物　正絹', price: '¥396,000', amount: 396000 },
      { name: '着物　合繊', price: '¥143,000', amount: 143000 },
      { name: '名古屋帯　むかい蝶（ピンク）', price: '¥242,000', amount: 242000 },
      { name: '名古屋帯　むかい蝶（直門用ブルー）', price: '¥242,000', amount: 242000 },
      { name: 'セット（正絹）', price: '¥593,000', amount: 593000 },
      { name: 'セット（合繊）', price: '¥358,000', amount: 358000 },
    ],
  },
  {
    title: '反物のみ（仕立て・加工なし）',
    items: [
      { name: '蝶の舞（夏きもの）反物　正絹', price: '', amount: 0 },
      { name: '蝶の舞（夏きもの）反物　合繊', price: '', amount: 0 },
      { name: 'のぞき梅（袷きもの）反物　正絹', price: '', amount: 0 },
      { name: 'のぞき梅（袷きもの）反物　合繊', price: '', amount: 0 },
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
