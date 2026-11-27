// src/composables/useDarkMode.js
// Composable de modo oscuro (singleton).
// Sincroniza el atributo data-theme de <html> con localStorage y
// prefers-color-scheme como valor inicial. Persiste la preferencia del usuario.

import { ref, watch } from 'vue'

// Clave de persistencia de la preferencia.
const CLAVE = 'tema'

/**
 * Aplica el tema al documento.
 * @param {'light'|'dark'} valor
 */
function aplicar(valor) {
    document.documentElement.setAttribute('data-theme', valor);
}

/**
 * Determina el tema inicial: preferencia guardada o prefers-color-scheme.
 * @returns {'light'|'dark'}
 */
function obtenerInicial() {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado === 'dark' || guardado === 'light') {
        return guardado;
    }
    const prefiereOscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefiereOscuro ? 'dark' : 'light';
}

// Estado compartido (singleton) ya inicializado.
const tema = ref(obtenerInicial());

// Aplica el tema al cargar el módulo (antes del primer pintado).
aplicar(tema.value);

// Persiste y aplica en cada cambio (una sola vez, a nivel de módulo).
watch(tema, (valor) => {
    aplicar(valor);
    localStorage.setItem(CLAVE, valor);
});

/**
 * Expone el tema actual y una acción para alternarlo.
 * @returns {{ tema: import('vue').Ref<'light'|'dark'>, alternar: () => void }}
 */
export function useDarkMode() {
    /** Alterna entre claro y oscuro. */
    function alternar() {
        tema.value = tema.value === 'dark' ? 'light' : 'dark';
    }

    return { tema, alternar };
}