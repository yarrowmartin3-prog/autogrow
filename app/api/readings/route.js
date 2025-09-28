cd ~/projects/autogrow
mkdir -p app/api/readings

cat > app/api/readings/route.js <<'EOF'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// GET: retourne les 50 dernières mesures
export async function GET() {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, data })
}

// POST: insère une mesure {temperature, humidity, ph, tds}
export async function POST(req) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const payload = {
    temperature: body.temperature ?? null,
    humidity: body.humidity ?? null,
    ph: body.ph ?? null,
    tds: body.tds ?? null,
    created_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('readings')
    .insert(payload)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, data }, { status: 201 })
}
EOF
