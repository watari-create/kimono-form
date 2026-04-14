// ===================================================
// のぞき梅 着物申込み - Google Apps Script
// スプレッドシートに貼り付けて「デプロイ」するだけ！
// ===================================================

const SHEET_NAME = '申込み一覧'

const HEADERS = [
  '受付日時', 'お名前', 'フリガナ', '電話番号', 'メール',
  '住所', '支部名', '会員番号',
  '身長(cm)', 'ヒップ(cm)',
  '身丈(背)', '袖丈', '裄', '袖巾', '袖付', '前巾', '後巾', '褄下', 'くりこし',
  '商品', '備考',
  'ステータス', '入金確認日', '発送日', '備考(管理用)'
]

// ステータスの選択肢
const STATUS_OPTIONS = ['未入金', '入金済み', '制作中', '発送済み', 'キャンセル']

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)

    // シートがなければ初期化
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      setupSheet(sheet)
    }

    // データを行として追加
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
      data['備考'] || '',
      '未入金',  // ステータス初期値
      '',        // 入金確認日
      '',        // 発送日
      '',        // 備考(管理用)
    ]

    const lastRow = sheet.getLastRow()
    sheet.appendRow(newRow)

    // ステータス列にドロップダウンを設定
    const statusCol = HEADERS.indexOf('ステータス') + 1
    const statusCell = sheet.getRange(lastRow + 1, statusCol)
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(STATUS_OPTIONS, true)
      .build()
    statusCell.setDataValidation(rule)

    // 未入金は赤、入金済みは黄、発送済みは緑に色付け
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
  // ヘッダー行を設定
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])

  // ヘッダーのスタイル
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length)
  headerRange.setBackground('#2c2c2a')
  headerRange.setFontColor('#ffffff')
  headerRange.setFontWeight('bold')
  headerRange.setFontSize(10)

  // 列幅を調整
  sheet.setColumnWidth(1, 140)   // 受付日時
  sheet.setColumnWidth(2, 100)   // お名前
  sheet.setColumnWidth(3, 120)   // フリガナ
  sheet.setColumnWidth(4, 120)   // 電話番号
  sheet.setColumnWidth(5, 180)   // メール
  sheet.setColumnWidth(6, 200)   // 住所
  sheet.setColumnWidth(7, 90)    // 支部名
  sheet.setColumnWidth(8, 80)    // 会員番号
  sheet.setColumnWidth(9, 70)    // 身長
  sheet.setColumnWidth(10, 70)   // ヒップ
  // 寸法列
  for (let i = 11; i <= 19; i++) sheet.setColumnWidth(i, 80)
  sheet.setColumnWidth(20, 200)  // 商品
  sheet.setColumnWidth(21, 150)  // 備考
  sheet.setColumnWidth(22, 90)   // ステータス
  sheet.setColumnWidth(23, 100)  // 入金確認日
  sheet.setColumnWidth(24, 100)  // 発送日
  sheet.setColumnWidth(25, 150)  // 備考(管理用)

  // ヘッダーを固定
  sheet.setFrozenRows(1)
}

function colorByStatus(cell, status) {
  const colors = {
    '未入金':  { bg: '#fce8e6', font: '#c0392b' },
    '入金済み': { bg: '#fff9c4', font: '#f57f17' },
    '制作中':  { bg: '#e3f2fd', font: '#1565c0' },
    '発送済み': { bg: '#e8f5e9', font: '#2e7d32' },
    'キャンセル': { bg: '#eeeeee', font: '#757575' },
  }
  const c = colors[status] || { bg: '#ffffff', font: '#000000' }
  cell.setBackground(c.bg)
  cell.setFontColor(c.font)
  cell.setFontWeight('bold')
}

// ステータス変更時に色を自動更新するトリガー
function onEdit(e) {
  const sheet = e.source.getActiveSheet()
  if (sheet.getName() !== SHEET_NAME) return

  const statusCol = HEADERS.indexOf('ステータス') + 1
  if (e.range.getColumn() !== statusCol) return
  if (e.range.getRow() === 1) return  // ヘッダーは無視

  colorByStatus(e.range, e.value)
}
