// Servicio centralizado para las peticiones HTTP a DummyJSON.
// La autenticacion y el guardado del token pertenecen a auth.js.

const API_URL = "https://dummyjson.com";

/**
 * Realiza una peticion a la API de DummyJSON.
 *
 * @param {string} endpoint Ruta de la API, por ejemplo: "/users".
 * @param {RequestInit} options Opciones de fetch: method, body, headers, etc.
 * @returns {Promise<object|Array>} Datos JSON devueltos por la API.
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});

    // Solo se envia Content-Type cuando se manda un body JSON.
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // auth.js guarda el token; api.js solamente lo adjunta si existe.
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error en apiFetch:", error);
    throw error;
  }
}
