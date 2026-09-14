export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    if (!body.password || body.password !== env.DASHBOARD_UPLOAD_PASSWORD) {
      return new Response(JSON.stringify({ error: "Clave incorrecta" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!body.data) {
      return new Response(JSON.stringify({ error: "Sin datos para guardar" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const key = body.key || "movil-data";
    await env.DASHBOARD_KV.put(key, JSON.stringify(body.data));

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ error: "Método no permitido" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}  
