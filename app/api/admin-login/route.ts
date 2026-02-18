import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

type Admin = {
  username: string
  hash: string
  email?: string
  name?: string
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log('BODY:', body)

  // Read admins JSON from environment. Support three possibilities:
  // 1) ADMINS_JSON contains raw JSON (possibly wrapped in quotes)
  // 2) ADMINS_JSON contains base64-encoded JSON
  // 3) ADMINS_JSON_B64 contains base64-encoded JSON
  let raw = process.env.ADMINS_JSON ?? ''
  console.log('RAW ENV:', raw ? '[present]' : '[empty]')

  // Strip surrounding quotes if present (handles local `.env.local` quoting)
  if (raw.length >= 2) {
    if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
      raw = raw.slice(1, -1)
    }
  }

  let admins: Admin[] = []
  // Try parsing raw JSON first
  if (raw) {
    try {
      admins = JSON.parse(raw) as Admin[]
      console.log('ADMINS (from ADMINS_JSON):', admins)
    } catch (err) {
      // If parse failed, maybe it's base64
      console.warn('Failed to parse ADMINS_JSON as raw JSON, trying base64', err)
      try {
        const decoded = Buffer.from(raw, 'base64').toString('utf8')
        admins = JSON.parse(decoded) as Admin[]
        console.log('ADMINS (from ADMINS_JSON base64):', admins)
      } catch (e2) {
        console.error('Failed to parse ADMINS_JSON (raw or base64)', e2)
      }
    }
  }

  // If still empty, try ADMINS_JSON_B64 env var
  if (!admins.length && process.env.ADMINS_JSON_B64) {
    try {
      const decoded = Buffer.from(process.env.ADMINS_JSON_B64, 'base64').toString('utf8')
      admins = JSON.parse(decoded) as Admin[]
      console.log('ADMINS (from ADMINS_JSON_B64):', admins)
    } catch (e) {
      console.error('Failed to parse ADMINS_JSON_B64', e)
    }
  }

  if (!admins.length) {
    throw new Error('ADMINS_JSON is missing or malformed')
  }

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
  const secureCookie = process.env.NODE_ENV === 'production'
  const sevenDays = 60 * 60 * 24 * 7 // seconds
  res.cookies.set('admin', 'true', {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'strict',
    path: '/',
    maxAge: sevenDays,
  })

  // set client-readable info for UI (non-httpOnly)
  try {
    const email = admin.email ?? admin.username
    const name = admin.name ?? admin.username
    res.cookies.set('admin_email', String(email), {
      httpOnly: false,
      secure: secureCookie,
      sameSite: 'strict',
      path: '/',
      maxAge: sevenDays,
    })
    res.cookies.set('admin_name', String(name), {
      httpOnly: false,
      secure: secureCookie,
      sameSite: 'strict',
      path: '/',
      maxAge: sevenDays,
    })
  } catch {
    /* ignore */
  }

  return res
}
