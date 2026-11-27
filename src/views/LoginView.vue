<script setup>
// Vista de inicio de sesión.
// Valida el formulario, llama al store de autenticación y redirige al agenda.
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CampoFormulario from '@/components/CampoFormulario.vue'
import SpinnerCarga from '@/components/SpinnerCarga.vue'
import MensajeAlerta from '@/components/MensajeAlerta.vue'

const auth = useAuthStore()
const router = useRouter()

// Estado del formulario.
const formulario = reactive({
    nombre_de_usuario: '',
    password: '',
})

// Estado de la interfaz.
const cargando = ref(false)
const error = ref('')

/**
 * Valida los campos del formulario.
 * @returns {string} Mensaje de error o cadena vacía si es válido.
 */
function validar() {
    if (!formulario.nombre_de_usuario.trim()) {
        return 'El nombre de usuario es obligatorio.';
    }
    if (!formulario.password) {
        return 'La contraseña es obligatoria.';
    }
    return '';
}

/**
 * Envía las credenciales al backend e inicia sesión.
 */
async function iniciarSesion() {
    error.value = '';

    const mensajeError = validar();
    if (mensajeError) {
        error.value = mensajeError;
        return;
    }

    cargando.value = true;
    try {
        await auth.login({
            nombre_de_usuario: formulario.nombre_de_usuario.trim(),
            password: formulario.password,
        });
        // Redirige a la agenda tras un inicio de sesión exitoso.
        router.push('/agenda');
    } catch (e) {
        error.value = e.message || 'No se pudo iniciar sesión.';
    } finally {
        cargando.value = false;
    }
}
</script>

<template>
    <main class="autenticacion">
        <section class="tarjeta">
            <h1 class="tarjeta__titulo">Iniciar sesión</h1>

            <MensajeAlerta tipo="error" :mensaje="error" @cerrar="error = ''" />

            <form class="formulario" @submit.prevent="iniciarSesion">
                <CampoFormulario
                    id="login-usuario"
                    label="Nombre de usuario"
                    v-model="formulario.nombre_de_usuario"
                    placeholder="admin"
                    :requerido="true"
                />
                <CampoFormulario
                    id="login-password"
                    label="Contraseña"
                    tipo="password"
                    v-model="formulario.password"
                    placeholder="••••••"
                    :requerido="true"
                />

                <button type="submit" class="btn formulario__boton" :disabled="cargando">
                    <SpinnerCarga v-if="cargando" />
                    <span v-else>Ingresar</span>
                </button>
            </form>

            <p class="autenticacion__enlace">
                ¿No tienes cuenta?
                <router-link to="/registro">Regístrate</router-link>
            </p>
        </section>
    </main>
</template>