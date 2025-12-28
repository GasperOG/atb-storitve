import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Napačni podatki' }, { status: 401 })
  }

  const ok = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH!
  )

  if (!ok) {
    return NextResponse.json({ error: 'Napačni podatki' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })

  res.cookies.set('admin', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  })

  return res
}
