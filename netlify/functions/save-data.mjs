import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), { status: 405 });
  }

  try {
    const body = await req.json();

    if (!body.password || body.password !== process.env.DASHBOARD_UPLOAD_PASSWORD) {
      return new Response(JSON.stringify({ error: "Clave incorrecta" }), { status: 401 });
    }

    if (!body.data) {
      return new Response(JSON.stringify({ error: "Sin datos para guardar" }), { status: 400 });
    }

    const key = body.key || "movil-data";
    const store = getStore("dashboard-ventas");
    await store.setJSON(key, body.data);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const config = { path: "/api/save-data" };
