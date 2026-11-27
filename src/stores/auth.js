// src/stores/auth.js
// Store de autenticación (Pinia) con persistencia en localStorage.
// Centraliza el token y los datos del usuario, y expone acciones de sesión.

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authService from '@/services/authService'

// Claves de persistencia (el token debe coincidir con la usada en http.js).
const TOKEN_KEY = 'token'
const USUARIO_KEY = 'usuario'

/**
 * Lee y parsea un valor JSON de localStorage de forma segura.
 * @param {string} clave
 * @returns {any|null}
 */
function leerStorage(clave) {
    try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : null;
    } catch {
        return null;
    }
}

export const useAuthStore = defineStore('auth', () => {
    // Estado reactivo inicializado desde localStorage (sesión persistida).
    const token = ref(localStorage.getItem(TOKEN_KEY) || null);
    const usuario = ref(leerStorage(USUARIO_KEY));

    // Getter: indica si hay una sesión activa.
    const estaAutenticado = computed(() => !!token.value);

    /**
     * Guarda token y usuario en el estado y en localStorage.
     * @param {string} nuevoToken
     * @param {object} nuevoUsuario
     */
    function guardarSesion(nuevoToken, nuevoUsuario) {
        token.value = nuevoToken;
        usuario.value = nuevoUsuario;
        localStorage.setItem(TOKEN_KEY, nuevoToken);
        localStorage.setItem(USUARIO_KEY, JSON.stringify(nuevoUsuario));
    }

    /**
     * Limpia el estado y el localStorage (cierre de sesión local).
     */
    function limpiarSesion() {
        token.value = null;
        usuario.value = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USUARIO_KEY);
    }

    /**
     * Inicia sesión: llama al backend y persiste token + usuario.
     * @param {{ nombre_de_usuario: string, password: string }} credenciales
     * @returns {Promise<object>} Respuesta del backend.
     */
    async function login(credenciales) {
        const data = await authService.login(credenciales);
        guardarSesion(data.token, data.usuario);
        return data;
    }

    /**
     * Cierra sesión: notifica al backend y limpia la sesión local
     * aunque la petición falle.
     * @returns {Promise<void>}
     */
    async function logout() {
        try {
            await authService.logout();
        } catch {
            // Se ignora el error del backend: la sesión local debe limpiarse igual.
        } finally {
            limpiarSesion();
        }
    }

    /**
     * Edita el perfil y actualiza los datos del usuario en el estado.
     * @param {object|FormData} datos
     * @returns {Promise<object>} Respuesta del backend.
     */
    async function editar(datos) {
        const data = await authService.editar(datos);
        if (data && data.usuario) {
            usuario.value = data.usuario;
            localStorage.setItem(USUARIO_KEY, JSON.stringify(data.usuario));
        }
        return data;
    }

    /**
     * Recarga el perfil desde el backend y actualiza el estado.
     * @returns {Promise<object>} Respuesta del backend.
     */
    async function cargarPerfil() {
        const data = await authService.perfil();
        if (data && data.usuario) {
            usuario.value = data.usuario;
            localStorage.setItem(USUARIO_KEY, JSON.stringify(data.usuario));
        }
        return data;
    }

    return {
        token,
        usuario,
        estaAutenticado,
        login,
        logout,
        editar,
        cargarPerfil,
    };
});