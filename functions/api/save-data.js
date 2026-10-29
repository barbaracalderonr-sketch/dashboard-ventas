// Guarda datos del dashboard en Cloudflare KV.
// Forma nueva (liviana): la clave de carga y el nombre del dato van en los encabezados
// X-Upload-Password y X-Data-Key, y el cuerpo es directamente el JSON a guardar.
// Así el servidor no tiene que leer ni reescribir archivos grandes (evita el error
// "exceeded resource limits" cuando la BBDD crece durante el mes).
// La forma antigua (todo dentro de un JSON con password, key y data) sigue funcionando.
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const headerPass = request.headers.get("X-Upload-Password");

    if (headerPass !== null) {
      let password = headerPass;
      try { password = decodeURIComponent(headerPass); } catch (e) {}
      if (!password || password !== env.DASHBOARD_UPLOAD_PASSWORD) {
        return json({ error: "Clave incorrecta" }, 401);
      }
      const key = request.headers.get("X-Data-Key") || "movil-data";
      const text = await request.text();
      if (!text || text === "null") {
        return json({ error: "Sin datos para guardar" }, 400);
      }
      await env.DASHBOARD_KV.put(key, text);
      return json({ ok: true });
    }

    const body = await request.json();

    if (!body.password || body.password !== env.DASHBOARD_UPLOAD_PASSWORD) {
      return json({ error: "Clave incorrecta" }, 401);
    }

    if (!body.data) {
      return json({ error: "Sin datos para guardar" }, 400);
    }

    const key = body.key || "movil-data";
    await env.DASHBOARD_KV.put(key, JSON.stringify(body.data));

    return json({ ok: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestGet() {
  return json({ error: "Método no permitido" }, 405);
}
