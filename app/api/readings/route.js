export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/readings?select=*&order=created_at.desc&limit=50';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const r = await fetch(url, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      cache: 'no-store'
    });

    const data = await r.json();
    return new Response(JSON.stringify({ ok: true, data }), {
      status: r.ok ? 200 : r.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
