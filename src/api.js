const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = "https://api.unsplash.com";

function getAuthHeaders() {
  if (!ACCESS_KEY) {
    throw new Error("Falta configurar VITE_UNSPLASH_ACCESS_KEY en el archivo .env.");
  }

  return {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  };
}

function buildUrl(path, params = {}) {
  const url = new URL(path, BASE_URL);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

async function requestJson(path, { params, fallbackMessage } = {}) {
  const response = await fetch(buildUrl(path, params), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(fallbackMessage || "No fue posible completar la solicitud.");
  }

  return response.json();
}

function normalizePhotoList(payload) {
  if (Array.isArray(payload)) return payload;
  return payload.results || [];
}

export async function getPhotos(page = 1, perPage = 30) {
  return requestJson("/photos", {
    params: { page, per_page: perPage },
    fallbackMessage: "Error al obtener fotos.",
  });
}

export async function searchPhotos(query, page = 1, perPage = 30) {
  const data = await requestJson("/search/photos", {
    params: { query, page, per_page: perPage },
    fallbackMessage: "Error en la busqueda.",
  });

  return normalizePhotoList(data);
}

export async function getRelatedPhotos(id) {
  try {
    const data = await requestJson(`/photos/${id}/related`);
    return normalizePhotoList(data);
  } catch {
    return [];
  }
}

export async function triggerDownload(photo) {
  try {
    await requestJson(`/photos/${photo.id}/download`);
  } catch {
    return;
  }
}
