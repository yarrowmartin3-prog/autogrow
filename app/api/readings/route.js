import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET : retourne les dernières mesures
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

// POST : ajoute une mesure
export async function POST(req) {
  try {
    const { temperature, humidity, ph, tds } = await req.json()
    if ([temperature, humidity, ph, tds].some(v => v === undefined)) {
      return NextResponse.json({ ok: false, error: 'Missing field' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('readings')
      .insert({ temperature, humidity, ph, tds })
      .select()

    if (error) throw error
    return NextResponse.json({ ok: true, inserted: data })
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}
