// src/services/contactosService.js
// Servicios de contactos: listar, detalle, crear, actualizar y eliminar.
// Las funciones crear/actualizar aceptan FormData para incluir la foto.

import { http } from './http'

/**
 * Lista los contactos del usuario autenticado.
 * @returns {Promise<{ success: boolean, contactos: object[] }>}
 */
export function listar() {
    return http('/contactos/index.php', {
        method: 'GET',
    });
}

/**
 * Obtiene el detalle de un contacto por su id.
 * @param {number|string} id
 * @returns {Promise<{ success: boolean, contacto: object }>}
 */
export function detalle(id) {
    return http(`/contactos/detalle.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
    });
}

/**
 * Crea un contacto. Acepta objeto JSON o FormData (si incluye foto).
 * @param {object|FormData} datos
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function crear(datos) {
    return http('/contactos/crear.php', {
        method: 'POST',
        body: datos,
    });
}

/**
 * Actualiza un contacto existente. Acepta objeto JSON o FormData (si incluye foto).
 * @param {object|FormData} datos
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function actualizar(datos) {
    return http('/contactos/actualizar.php', {
        method: 'POST',
        body: datos,
    });
}

/**
 * Elimina un contacto por su id.
 * @param {number|string} id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export function eliminar(id) {
    return http('/contactos/eliminar.php', {
        method: 'POST',
        body: { id },
    });
}