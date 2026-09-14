import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const url = new URL(req.url);
    const key = url.searchParams.get("key") || "movil-data";
    const store = getStore("dashboard-ventas");
    const data = await store.get(key, { type: "json" });

    return new Response(JSON.stringify(data || null), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const config = { path: "/api/get-data" };
