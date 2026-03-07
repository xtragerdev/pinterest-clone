const ACCESS_KEY = "_v_ZPhiGbudb7DYFJwZgWA8io2TpTy5OjJdI6-mJKWc";
const BASE = "https://api.unsplash.com";

export async function getPhotos(page = 1, perPage = 30) {
  const res = await fetch(`${BASE}/photos?page=${page}&per_page=${perPage}&client_id=${ACCESS_KEY}`);
  if (!res.ok) throw new Error("Error al obtener fotos");
  return res.json();
}

export async function searchPhotos(query, page = 1, perPage = 30) {
  const res = await fetch(`${BASE}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${ACCESS_KEY}`);
  if (!res.ok) throw new Error("Error en la búsqueda");
  const data = await res.json();
  return data.results;
}

export async function getRelatedPhotos(id) {
  const res = await fetch(`${BASE}/photos/${id}/related?client_id=${ACCESS_KEY}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export function triggerDownload(photo) {
  fetch(`${BASE}/photos/${photo.id}/download?client_id=${ACCESS_KEY}`);
}
