<script setup>
// Vista de registro de usuario.
// Valida el formulario, registra al usuario y redirige al login.
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authService from '@/services/authService'
import CampoFormulario from '@/components/CampoFormulario.vue'
import SpinnerCarga from '@/components/SpinnerCarga.vue'
import MensajeAlerta from '@/components/MensajeAlerta.vue'

const router = useRouter()

// Estado del formulario.
const formulario = reactive({
    nombre_de_usuario: '',
    password: '',
    confirmar_password: '',
})

// Estado de la interfaz.
const cargando = ref(false)
const error = ref('')
const exito = ref('')

// Longitud mínima de la contraseña.
const PASSWORD_MIN = 6;

/**
 * Valida los campos del formulario.
 * @returns {string} Mensaje de error o cadena vacía si es válido.
 */
function validar() {
    if (!formulario.nombre_de_usuario.trim()) {
        return 'El nombre de usuario es obligatorio.';
    }
    if (formulario.password.length < PASSWORD_MIN) {
        return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
    }
    if (formulario.password !== formulario.confirmar_password) {
        return 'Las contraseñas no coinciden.';
    }
    return '';
}

/**
 * Registra al usuario y redirige al login tras el éxito.
 */
async function registrar() {
    error.value = '';
    exito.value = '';

    const mensajeError = validar();
    if (mensajeError) {
        error.value = mensajeError;
        return;
    }

    cargando.value = true;
    try {
        await authService.registrar({
            nombre_de_usuario: formulario.nombre_de_usuario.trim(),
            password: formulario.password,
        });
        exito.value = 'Cuenta creada correctamente. Redirigiendo al inicio de sesión...';
        // Se redirige al login tras un breve momento para que se lea el mensaje.
        setTimeout(() => router.push('/login'), 1200);
    } catch (e) {
        error.value = e.message || 'No se pudo registrar el usuario.';
    } finally {
        cargando.value = false;
    }
}
</script>

<template>
    <main class="autenticacion">
        <section class="tarjeta">
            <h1 class="tarjeta__titulo">Crear cuenta</h1>

            <MensajeAlerta tipo="error" :mensaje="error" @cerrar="error = ''" />
            <MensajeAlerta tipo="success" :mensaje="exito" @cerrar="exito = ''" />

            <form class="formulario" @submit.prevent="registrar">
                <CampoFormulario
                    id="registro-usuario"
                    label="Nombre de usuario"
                    v-model="formulario.nombre_de_usuario"
                    placeholder="admin"
                    :requerido="true"
                />
                <CampoFormulario
                    id="registro-password"
                    label="Contraseña"
                    tipo="password"
                    v-model="formulario.password"
                    placeholder="Mínimo 6 caracteres"
                    :requerido="true"
                />
                <CampoFormulario
                    id="registro-confirmar"
                    label="Confirmar contraseña"
                    tipo="password"
                    v-model="formulario.confirmar_password"
                    placeholder="Repite la contraseña"
                    :requerido="true"
                />

                <button type="submit" class="btn formulario__boton" :disabled="cargando">
                    <SpinnerCarga v-if="cargando" />
                    <span v-else>Registrarme</span>
                </button>
            </form>

            <p class="autenticacion__enlace">
                ¿Ya tienes cuenta?
                <router-link to="/login">Inicia sesión</router-link>
            </p>
        </section>
    </main>
</template>