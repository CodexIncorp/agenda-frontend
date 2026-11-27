<script setup>
// Vista de inicio (página principal).
// Da la bienvenida y muestra accesos según el estado de autenticación.
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

// Nombre de usuario para saludar (si hay sesión).
const nombreUsuario = computed(() => auth.usuario?.nombre_de_usuario || '')
</script>

<template>
    <main class="inicio">
        <section class="inicio__hero">
            <h1 class="inicio__titulo">Agenda de Contactos</h1>
            <p class="inicio__subtitulo">
                Gestiona tus contactos de forma sencilla y segura, desde cualquier dispositivo.
            </p>

            <!-- Accesos según el estado de la sesión -->
            <div v-if="auth.estaAutenticado" class="inicio__acciones">
                <p class="inicio__saludo">Hola, <strong>{{ nombreUsuario }}</strong>.</p>
                <router-link to="/agenda" class="btn">Ir a mis contactos</router-link>
            </div>
            <div v-else class="inicio__acciones">
                <router-link to="/login" class="btn">Iniciar sesión</router-link>
                <router-link to="/registro" class="btn btn--secundario">Crear cuenta</router-link>
            </div>
        </section>

        <section class="inicio__info">
            <div class="inicio__tarjeta">
                <h2 class="inicio__tarjeta-titulo">Contactos</h2>
                <p>Crea, edita y elimina tus contactos con foto.</p>
            </div>
            <div class="inicio__tarjeta">
                <h2 class="inicio__tarjeta-titulo">Perfil</h2>
                <p>Administra tus datos y tu foto de usuario.</p>
            </div>
        </section>
    </main>
</template>