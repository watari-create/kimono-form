// ===================================================
// 茶道宗徧流不審庵 着物申込み - Google Apps Script
// ===================================================

const SHEET_NAME = '申込み一覧'

const HEADERS = [
  '受付日時', 'お名前', 'フリガナ', '電話番号', 'メール',
  '住所', '支部名', '会員番号',
  '身長(cm)', 'ヒップ(cm)',
  '身丈(背)', '袖丈', '裄', '袖巾', '袖付', '前巾', '後巾', '褄下', 'くりこし',
  '商品', '金額', '備考',
  'ステータス', '入金確認日', '発送日', '備考(管理用)'
]

const STATUS_OPTIONS = ['未入金', '入金済み', '制作中', '発送済み', 'キャンセル']

// ---- 男性用 紋付袴（別シート） ----
const MEN_SHEET_NAME = '男性用申込み'

const MEN_HEADERS = [
  '受付日時', '申込区分', 'お名前', 'フリガナ', '電話番号', 'メール', '住所',
  '来店希望日', '来店希望時間', '相談内容', '紹介先', '着用予定日',
  '組み合わせ', '身長(cm)', 'ヒップ(cm)', 'お腹まわり(cm)', '身丈(背)', '裄',
  '紋', '希望納期', 'お渡し方法', '連絡手段', '備考',
  '対応状況', '店舗連絡日', '備考(管理用)'
]

const MEN_STATUS_OPTIONS = ['未対応', '店舗連絡済み', '来店済み', '注文確定', '納品済み', 'キャンセル']

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    if (data['種別'] === '男性用') return handleMen(data)

    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      setupSheet(sheet)
    }

    const newRow = [
      data['受付日時'] || '',
      data['お名前'] || '',
      data['フリガナ'] || '',
      data['電話番号'] || '',
      data['メール'] || '',
      data['住所'] || '',
      data['支部名'] || '',
      data['会員番号'] || '',
      data['身長cm'] || '',
      data['ヒップcm'] || '',
      data['身丈背'] || '',
      data['袖丈'] || '',
      data['裄'] || '',
      data['袖巾'] || '',
      data['袖付'] || '',
      data['前巾'] || '',
      data['後巾'] || '',
      data['褄下'] || '',
      data['くりこし'] || '',
      data['商品'] || '',
      data['金額'] || '',
      data['備考'] || '',
      '未入金',
      '',
      '',
      '',
    ]

    const lastRow = sheet.getLastRow()
    const targetRow = lastRow + 1

    sheet.appendRow(newRow)

    // 寸法列（11〜19列）を文字列として強制フォーマット
    const sunpoCols = [11, 12, 13, 14, 15, 16, 17, 18, 19]
    sunpoCols.forEach(col => {
      const cell = sheet.getRange(targetRow, col)
      cell.setNumberFormat('@STRING@')
      const val = newRow[col - 1]
      if (val) cell.setValue("'" + val)  // シングルクォートで文字列強制
    })

    const statusCol = HEADERS.indexOf('ステータス') + 1
    const statusCell = sheet.getRange(targetRow, statusCol)
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_OPTIONS, true)
      .build()
    statusCell.setDataValidation(rule)
    colorByStatus(statusCell, '未入金')

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function setupSheet(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length)
  headerRange.setBackground('#2c2c2a')
  headerRange.setFontColor('#ffffff')
  headerRange.setFontWeight('bold')
  headerRange.setFontSize(10)

  // 寸法列を文字列フォーマットに設定
  sheet.getRange(2, 11, 1000, 9).setNumberFormat('@STRING@')

  sheet.setColumnWidth(1, 140)
  sheet.setColumnWidth(2, 100)
  sheet.setColumnWidth(3, 120)
  sheet.setColumnWidth(4, 120)
  sheet.setColumnWidth(5, 180)
  sheet.setColumnWidth(6, 200)
  sheet.setColumnWidth(7, 90)
  sheet.setColumnWidth(8, 80)
  sheet.setColumnWidth(9, 70)
  sheet.setColumnWidth(10, 70)
  for (let i = 11; i <= 19; i++) sheet.setColumnWidth(i, 80)
  sheet.setColumnWidth(20, 200)
  sheet.setColumnWidth(21, 120)
  sheet.setColumnWidth(22, 150)
  sheet.setColumnWidth(23, 90)
  sheet.setColumnWidth(24, 100)
  sheet.setColumnWidth(25, 100)
  sheet.setColumnWidth(26, 150)

  sheet.setFrozenRows(1)
}

function colorByStatus(cell, status) {
  const colors = {
    '未入金':   { bg: '#fce8e6', font: '#c0392b' },
    '入金済み':  { bg: '#fff9c4', font: '#f57f17' },
    '制作中':   { bg: '#e3f2fd', font: '#1565c0' },
    '発送済み':  { bg: '#e8f5e9', font: '#2e7d32' },
    'キャンセル': { bg: '#eeeeee', font: '#757575' },
  }
  const c = colors[status] || { bg: '#ffffff', font: '#000000' }
  cell.setBackground(c.bg)
  cell.setFontColor(c.font)
  cell.setFontWeight('bold')
}

function onEdit(e) {
  const sheet = e.source.getActiveSheet()
  if (sheet.getName() === MEN_SHEET_NAME) {
    const col = MEN_HEADERS.indexOf('対応状況') + 1
    if (e.range.getColumn() === col && e.range.getRow() > 1) colorMenStatus(e.range, e.value)
    return
  }
  if (sheet.getName() !== SHEET_NAME) return

  const statusCol = HEADERS.indexOf('ステータス') + 1
  if (e.range.getColumn() !== statusCol) return
  if (e.range.getRow() === 1) return

  colorByStatus(e.range, e.value)
}


// ===================================================
// 男性用 紋付袴
// ===================================================
function handleMen(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(MEN_SHEET_NAME)
    if (!sheet) {
      sheet = ss.insertSheet(MEN_SHEET_NAME)
      setupMenSheet(sheet)
    }

    const statusCol = MEN_HEADERS.indexOf('対応状況') + 1
    const row = MEN_HEADERS.map((h, i) => (i + 1 === statusCol ? '未対応' : (data[h] || '')))
    sheet.appendRow(row)

    const targetRow = sheet.getLastRow()
    const statusCell = sheet.getRange(targetRow, statusCol)
    statusCell.setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(MEN_STATUS_OPTIONS, true).build()
    )
    colorMenStatus(statusCell, '未対応')

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function setupMenSheet(sheet) {
  sheet.getRange(1, 1, 1, MEN_HEADERS.length).setValues([MEN_HEADERS])
  const header = sheet.getRange(1, 1, 1, MEN_HEADERS.length)
  header.setBackground('#24466b')
  header.setFontColor('#ffffff')
  header.setFontWeight('bold')
  header.setFontSize(10)
  // すべて文字列として扱う（日付・寸法の自動変換を防ぐ）
  sheet.getRange(2, 1, 1000, MEN_HEADERS.length).setNumberFormat('@STRING@')
  for (let i = 1; i <= MEN_HEADERS.length; i++) sheet.setColumnWidth(i, 110)
  sheet.setColumnWidth(1, 140)
  sheet.setColumnWidth(13, 260)
  sheet.setColumnWidth(23, 200)
  sheet.setFrozenRows(1)
}

function colorMenStatus(cell, status) {
  const colors = {
    '未対応':     { bg: '#fce8e6', font: '#c0392b' },
    '店舗連絡済み': { bg: '#fff9c4', font: '#f57f17' },
    '来店済み':   { bg: '#e3f2fd', font: '#1565c0' },
    '注文確定':   { bg: '#ede7f6', font: '#4527a0' },
    '納品済み':   { bg: '#e8f5e9', font: '#2e7d32' },
    'キャンセル':  { bg: '#eeeeee', font: '#757575' },
  }
  const c = colors[status] || { bg: '#ffffff', font: '#000000' }
  cell.setBackground(c.bg)
  cell.setFontColor(c.font)
  cell.setFontWeight('bold')
}
