<script setup>
// Barra de navegación superior.
// Muestra enlaces según el estado de autenticación y permite cerrar sesión.
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

/**
 * Cierra la sesión y redirige al login.
 */
async function cerrarSesion() {
    await auth.logout()
    router.push('/login')
}
</script>

<template>
    <header class="navbar">
        <nav class="navbar__inner">
            <router-link to="/" class="navbar__brand">Agenda</router-link>

            <div class="navbar__links">
                <template v-if="auth.estaAutenticado">
                    <router-link to="/agenda" class="navbar__link">Contactos</router-link>
                    <router-link to="/perfil" class="navbar__link">Perfil</router-link>
                    <button class="navbar__boton" @click="cerrarSesion">Salir</button>
                </template>
                <template v-else>
                    <router-link to="/login" class="navbar__link">Iniciar sesión</router-link>
                    <router-link to="/registro" class="navbar__link">Registro</router-link>
                </template>
            </div>
        </nav>
    </header>
</template>