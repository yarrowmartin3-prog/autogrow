export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/readings';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const payload = [{ temperature: 23.4, humidity: 56, ph: 6.3, tds: 720 }];

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
        prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();
    return new Response(JSON.stringify({ ok: r.ok, data }), {
      status: r.ok ? 200 : r.status,
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
}
