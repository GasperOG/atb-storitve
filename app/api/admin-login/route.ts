import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

type Admin = {
  username: string
  hash: string
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log('BODY:', body)

  const raw = process.env.ADMINS_JSON
  console.log('RAW ENV:', raw)

  if (!raw) {
    throw new Error('ADMINS_JSON is missing')
  }

  const admins = JSON.parse(raw) as Admin[]
  console.log('ADMINS:', admins)

  const admin = admins.find(a => a.username === body.username)
  console.log('FOUND ADMIN:', admin)

  if (!admin) {
    console.log('❌ USER NOT FOUND')
    return NextResponse.json({ error: 'NO USER' }, { status: 401 })
  }

  const ok = await bcrypt.compare(body.password, admin.hash)
  console.log('COMPARE RESULT:', ok)

  if (!ok) {
    console.log('❌ BAD PASSWORD')
    return NextResponse.json({ error: 'BAD PASSWORD' }, { status: 401 })
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
