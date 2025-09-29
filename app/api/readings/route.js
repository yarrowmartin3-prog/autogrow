export const dynamic = 'force-dynamic'; // évite la mise en cache statique

export async function GET() {
  return new Response(JSON.stringify({ ok: true, source: "readings" }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return new Response(JSON.stringify({ ok: true, received: body }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}
