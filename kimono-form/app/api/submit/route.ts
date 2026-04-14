import { NextRequest, NextResponse } from 'next/server'
import { sendSlackNotification } from '@/lib/slack'
import { sendConfirmationEmail } from '@/lib/email'
import { appendToSpreadsheet } from '@/lib/spreadsheet'
import { KimonoFormData } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const data: KimonoFormData = await req.json()

    if (!data.name || !data.email || !data.tel) {
      return NextResponse.json(
        { error: 'お名前・メールアドレス・電話番号は必須です' },
        { status: 400 }
      )
    }

    await Promise.all([
      sendSlackNotification(data),
      sendConfirmationEmail(data),
      appendToSpreadsheet(data),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'エラーが発生しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    )
  }
}
