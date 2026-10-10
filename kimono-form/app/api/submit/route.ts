import { NextRequest, NextResponse } from 'next/server'
import { sendSlackNotification } from '@/lib/slack'
import { sendConfirmationEmail } from '@/lib/email'
import { appendToSpreadsheet } from '@/lib/spreadsheet'
import { sendMenSlack, sendMenEmail, appendMenToSpreadsheet } from '@/lib/men'
import { KimonoFormData, MenFormData } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data.name || !data.email || !data.tel) {
      return NextResponse.json(
        { error: 'お名前・メールアドレス・電話番号は必須です' },
        { status: 400 }
      )
    }

    if (data.formType === 'men') {
      const men = data as MenFormData
      await Promise.all([
        sendMenSlack(men),
        sendMenEmail(men),
        appendMenToSpreadsheet(men),
      ])
    } else {
      const women = data as KimonoFormData
      await Promise.all([
        sendSlackNotification(women),
        sendConfirmationEmail(women),
        appendToSpreadsheet(women),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'エラーが発生しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    )
  }
}
