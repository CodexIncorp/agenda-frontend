// src/services/authService.js
// Servicios de autenticación: login, registro, perfil, edición y logout.
// Cada función usa el cliente HTTP centralizado (http.js).

import { http } from './http'

/**
 * Inicia sesión con las credenciales del usuario.
 * @param {{ nombre_de_usuario: string, password: string }} credenciales
 * @returns {Promise<{ success: boolean, token: string, usuario: object }>}
 */
export function login(credenciales) {
    return http('/auth/login.php', {
        method: 'POST',
        body: credenciales,
    });
}

/**
 * Registra un nuevo usuario.
 * @param {{ nombre_de_usuario: string, password: string }} datos
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function registrar(datos) {
    return http('/auth/registrar.php', {
        method: 'POST',
        body: datos,
    });
}

/**
 * Obtiene el perfil del usuario autenticado.
 * @returns {Promise<{ success: boolean, usuario: object }>}
 */
export function perfil() {
    return http('/auth/perfil.php', {
        method: 'GET',
    });
}

/**
 * Edita el perfil del usuario. Acepta objeto JSON o FormData (si incluye foto).
 * @param {object|FormData} datos
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function editar(datos) {
    return http('/auth/editar.php', {
        method: 'POST',
        body: datos,
    });
}

/**
 * Cierra la sesión del usuario en el backend.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function logout() {
    return http('/auth/logout.php', {
        method: 'POST',
    });
}