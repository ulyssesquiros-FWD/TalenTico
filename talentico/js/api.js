// Servicio centralizado para las peticiones HTTP a DummyJSON.
// auth.js inicia sesion y guarda el token; este archivo solo realiza peticiones.
export const API_URL = "http://localhost:3000";
const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export async function apiFetch(endpoint, options = {}) {
  if (typeof endpoint !== "string" || !endpoint.startsWith("/")) {
    throw new Error('El endpoint debe ser una ruta que inicie con "/".');
  }

  const method = (options.method || "GET").toUpperCase();

  if (!HTTP_METHODS.includes(method)) {
    throw new Error(`Metodo HTTP no permitido: ${method}`);
  }

  try {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers || {});
    const hasBody = options.body !== undefined && options.body !== null;

    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      method,
      headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (!response.ok) {
      const message = data?.message || data?.error || `Error HTTP ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error(`Error en apiFetch (${method} ${endpoint}):`, error.message);
    throw error;
  }
}
