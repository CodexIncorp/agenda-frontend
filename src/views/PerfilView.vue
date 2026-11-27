<script setup>
// Vista de perfil del usuario.
// Muestra y permite editar los datos de la cuenta y la foto de usuario.
// Si se cambia la foto se envía FormData; si no, se envía JSON.
import { computed, onMounted, reactive, ref } from 'vue'
import { Save } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import CampoFormulario from '@/components/CampoFormulario.vue'
import SpinnerCarga from '@/components/SpinnerCarga.vue'
import MensajeAlerta from '@/components/MensajeAlerta.vue'

const auth = useAuthStore()

// Estado del formulario.
const formulario = reactive({
    nombre_de_usuario: '',
    password: '',
    confirmar_password: '',
})

// Foto seleccionada (archivo) y vista previa.
const fotoArchivo = ref(null)
const fotoPreview = ref('')

// Estado de la interfaz.
const cargando = ref(true)
const guardando = ref(false)
const error = ref('')
const exito = ref('')

// Longitud mínima de la contraseña.
const PASSWORD_MIN = 6;

// Nombre de usuario actual (para mostrar en la cabecera).
const usuarioActual = computed(() => auth.usuario?.nombre_de_usuario || '');

/**
 * Carga el perfil desde el backend y rellena el formulario.
 */
async function cargarPerfil() {
    cargando.value = true;
    error.value = '';
    try {
        await auth.cargarPerfil();
        formulario.nombre_de_usuario = auth.usuario?.nombre_de_usuario || '';
        if (auth.usuario?.foto) {
            fotoPreview.value = auth.usuario.foto;
        }
    } catch (e) {
        error.value = e.message || 'No se pudo cargar el perfil.';
    } finally {
        cargando.value = false;
    }
}

/**
 * Actualiza la foto seleccionada y su vista previa.
 * @param {Event} evento
 */
function seleccionarFoto(evento) {
    const archivo = evento.target.files?.[0] || null;
    fotoArchivo.value = archivo;

    if (fotoPreview.value.startsWith('blob:')) {
        URL.revokeObjectURL(fotoPreview.value);
    }
    fotoPreview.value = archivo ? URL.createObjectURL(archivo) : '';
}

/**
 * Valida los campos del formulario.
 * @returns {string} Mensaje de error o cadena vacía si es válido.
 */
function validar() {
    if (!formulario.nombre_de_usuario.trim()) {
        return 'El nombre de usuario es obligatorio.';
    }
    // La contraseña es opcional: solo se valida si el usuario la escribe.
    if (formulario.password) {
        if (formulario.password.length < PASSWORD_MIN) {
            return `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres.`;
        }
        if (formulario.password !== formulario.confirmar_password) {
            return 'Las contraseñas no coinciden.';
        }
    }
    return '';
}

/**
 * Guarda los cambios del perfil y actualiza el estado.
 */
async function guardar() {
    error.value = '';
    exito.value = '';

    const mensajeError = validar();
    if (mensajeError) {
        error.value = mensajeError;
        return;
    }

    guardando.value = true;
    try {
        let datos;
        if (fotoArchivo.value) {
            // Con foto: se usa FormData (sin fijar Content-Type manualmente).
            datos = new FormData();
            datos.append('nombre_de_usuario', formulario.nombre_de_usuario.trim());
            if (formulario.password) {
                datos.append('password', formulario.password);
            }
            datos.append('foto', fotoArchivo.value);
        } else {
            // Sin foto: se envía JSON.
            datos = { nombre_de_usuario: formulario.nombre_de_usuario.trim() };
            if (formulario.password) {
                datos.password = formulario.password;
            }
        }

        await auth.editar(datos);
        exito.value = 'Perfil actualizado correctamente.';

        // Limpia los campos de contraseña tras guardar.
        formulario.password = '';
        formulario.confirmar_password = '';
        fotoArchivo.value = null;
    } catch (e) {
        error.value = e.message || 'No se pudo actualizar el perfil.';
    } finally {
        guardando.value = false;
    }
}

onMounted(cargarPerfil);
</script>

<template>
    <main class="perfil">
        <header class="perfil__cabecera">
            <h1 class="perfil__titulo">Mi perfil</h1>
        </header>

        <MensajeAlerta tipo="error" :mensaje="error" @cerrar="error = ''" />
        <MensajeAlerta tipo="success" :mensaje="exito" @cerrar="exito = ''" />

        <!-- Carga inicial -->
        <SpinnerCarga v-if="cargando" />

        <section v-else class="tarjeta perfil__tarjeta">
            <!-- Foto y usuario actual -->
            <div class="perfil__resumen">
                <img
                    v-if="fotoPreview"
                    :src="fotoPreview"
                    :alt="`Foto de ${usuarioActual}`"
                    class="perfil__foto"
                />
                <div v-else class="perfil__foto perfil__foto--vacia" aria-hidden="true">
                    {{ (usuarioActual || '?').charAt(0).toUpperCase() }}
                </div>
                <p class="perfil__usuario">{{ usuarioActual }}</p>
            </div>

            <form class="formulario" @submit.prevent="guardar">
                <CampoFormulario
                    id="perfil-usuario"
                    label="Nombre de usuario"
                    v-model="formulario.nombre_de_usuario"
                    :requerido="true"
                />
                <CampoFormulario
                    id="perfil-password"
                    label="Nueva contraseña"
                    tipo="password"
                    v-model="formulario.password"
                    placeholder="Dejar vacío para no cambiar"
                />
                <CampoFormulario
                    id="perfil-confirmar"
                    label="Confirmar nueva contraseña"
                    tipo="password"
                    v-model="formulario.confirmar_password"
                    placeholder="Repite la nueva contraseña"
                />

                <!-- Cambio de foto -->
                <div class="campo">
                    <label for="perfil-foto" class="campo__label">Foto de usuario</label>
                    <input
                        id="perfil-foto"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        class="campo__input campo__file"
                        @change="seleccionarFoto"
                    />
                </div>

                <button type="submit" class="btn formulario__boton" :disabled="guardando">
                    <SpinnerCarga v-if="guardando" />
                    <template v-else>
                        <Save :size="20" :stroke-width="2" />
                        <span>Guardar cambios</span>
                    </template>
                </button>
            </form>
        </section>
    </main>
</template>