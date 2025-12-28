import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // Allow multiple admin emails via ADMIN_EMAILS (comma-separated) or single ADMIN_EMAIL
  const allowed = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  if (!allowed.includes(email)) {
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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })

  // Store a non-http-only cookie with the admin email so client code can include it in audit metadata
  res.cookies.set('admin_email', email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  })

  return res
}
