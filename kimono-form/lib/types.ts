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
  note: string
}

export const PRODUCTS = [
  '袷きもの のぞき梅（正絹）',
  '袷きもの のぞき梅（合繊）',
  '名古屋帯 向かい蝶（灰桜）',
  '名古屋帯 向かい蝶（薄藍）',
  '夏きもの 蝶の舞（正絹）',
  '夏きもの 蝶の舞（合繊）',
  '夏帯 月と萩',
]

export const SUNPO_FIELDS: { key: keyof Pick<KimonoFormData, 'shintake'|'sodake'|'yuki'|'sodahaba'|'sodatsuke'|'maehaba'|'ushirohaba'|'tsumashita'|'kurikoshi'>; label: string; shakuOnly?: boolean }[] = [
  { key: 'shintake',    label: '身丈（背）' },
  { key: 'sodake',      label: '袖丈' },
  { key: 'yuki',        label: '裄' },
  { key: 'sodahaba',    label: '袖巾' },
  { key: 'sodatsuke',   label: '袖付',   shakuOnly: true },
  { key: 'maehaba',     label: '前巾',   shakuOnly: true },
  { key: 'ushirohaba',  label: '後巾' },
  { key: 'tsumashita',  label: '褄下' },
  { key: 'kurikoshi',   label: 'くりこし', shakuOnly: true },
]
