// src/services/http.js
// Cliente HTTP centralizado basado en fetch.
// - Inyecta el token (Authorization: Bearer) en cada petición.
// - Serializa objetos a JSON (pero NO toca FormData: el navegador pone el boundary).
// - Parsea las respuestas { success, message }.
// - Cierra sesión y redirige a /login ante 401/403.

import { getApiUrl } from '@/config/api'

// Clave usada en localStorage para el token (compartida con el store de auth).
const TOKEN_KEY = 'token'

/**
 * Obtiene el token almacenado en localStorage.
 * @returns {string|null}
 */
function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Realiza una petición HTTP al backend y devuelve el JSON de respuesta.
 *
 * @param {string} path Ruta del endpoint (ej. "/auth/login.php").
 * @param {RequestInit} options Opciones de fetch (method, body, headers...).
 * @returns {Promise<any>} Datos JSON de la respuesta.
 */
export async function http(path, options = {}) {
    // La URL base se resuelve dinámicamente desde config.json.
    const API_URL = await getApiUrl();

    // Se copian los headers recibidos para no mutar el objeto original.
    const headers = { ...(options.headers || {}) };

    let body = options.body;

    // Si el body es un objeto plano (no FormData), se serializa a JSON.
    // FormData NO se toca: el navegador debe fijar el Content-Type con el boundary.
    if (body && !(body instanceof FormData) && typeof body === 'object') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    // Se añade el token de autenticación si existe.
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Se ejecuta la petición.
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        body,
    });

    // Se intenta parsear la respuesta como JSON (algunos endpoints no devuelven cuerpo).
    let data = null;
    const texto = await response.text();
    if (texto) {
        try {
            data = JSON.parse(texto);
        } catch {
            // Si no es JSON válido, se conserva el texto crudo en message.
            data = { success: false, message: texto };
        }
    }

    // Ante 401/403: se limpia el token y se redirige al login.
    // Se importa el router de forma diferida para evitar dependencias circulares.
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        const { default: router } = await import('@/router');
        router.push('/login');
    }

    // Si hubo error HTTP o success=false, se lanza una excepción con el mensaje del backend.
    if (!response.ok || (data && data.success === false)) {
        const mensaje = (data && data.message) || `Error HTTP ${response.status}`;
        throw new Error(mensaje);
    }

    return data;
}