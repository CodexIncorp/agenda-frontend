// src/config/api.js
// Carga dinámica de la URL del API desde /public/config.json.
// Se lee una sola vez y se cachea en memoria para evitar peticiones repetidas.

// Variable de caché: almacena la URL del API ya resuelta.
let apiUrlCache = null;

/**
 * Obtiene la URL base del API leyendo el archivo de configuración externo.
 * La URL se define únicamente en /public/config.json para permitir
 * cambiar de backend sin recompilar la aplicación (interoperabilidad).
 *
 * @returns {Promise<string>} URL base del API (por ejemplo "https://equipo1.free.nf/api")
 */
export async function getApiUrl() {
    // Si ya se resolvió antes, se devuelve desde la caché.
    if (apiUrlCache) {
        return apiUrlCache;
    }

    try {
        const response = await fetch('/config.json');

        if (!response.ok) {
            throw new Error(`No se pudo cargar config.json (HTTP ${response.status})`);
        }

        const config = await response.json();

        if (!config.API_URL) {
            throw new Error('config.json no define API_URL');
        }

        // Se guarda en caché para futuras llamadas.
        apiUrlCache = config.API_URL;
        return apiUrlCache;
    } catch (error) {
        // Se relanza el error para que el llamador pueda manejarlo.
        throw new Error(`Error al leer la configuración del API: ${error.message}`);
    }
}