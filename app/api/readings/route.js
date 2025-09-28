mkdir -p app/api/readings
cat > app/api/readings/route.js <<'EOF'
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Empêche l'export statique (sinon /api/* peut renvoyer 404)
export const dynamic = 'force-dynamic';
// Force Node.js runtime (supprime des soucis avec 'edge' et supabase-js)
export const runtime = 'nodejs';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

/** GET /api/readings
 *  Retourne les 50 dernières mesures (ordre du + récent au + ancien)
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e.message || e) },
      { status: 500 }
    );
  }
}

/** POST /api/readings
 *  Body JSON: { temperature:number, humidity:number, ph:number, tds:number }
 */
export async function POST(request) {
  try {
    const { temperature, humidity, ph, tds } = await request.json();

    if ([temperature, humidity, ph, tds].some(v => v === undefined)) {
      return NextResponse.json(
        { ok: false, error: 'Missing field' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('readings')
      .insert({ temperature, humidity, ph, tds })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, inserted: data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e.message || e) },
      { status: 500 }
    );
  }
}
EOF
