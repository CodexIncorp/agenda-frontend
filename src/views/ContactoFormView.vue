<script setup>
// Vista de formulario de contacto: crear o editar según la ruta.
// - Crea: POST /contactos/crear.php (foto obligatoria).
// - Edita: POST /contactos/actualizar.php (foto opcional; conserva la actual).
// La subida de imagen usa FormData; http.js NO fija el Content-Type (lo hace el navegador).
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as contactosService from '@/services/contactosService'
import CampoFormulario from '@/components/CampoFormulario.vue'
import SpinnerCarga from '@/components/SpinnerCarga.vue'
import MensajeAlerta from '@/components/MensajeAlerta.vue'

const route = useRoute()
const router = useRouter()

// Id de la ruta (define si es edición o creación).
const id = computed(() => route.params.id)
const esEdicion = computed(() => !!id.value)

// Estado del formulario.
const formulario = reactive({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    notas: '',
})

// Foto seleccionada (archivo) y vista previa.
const fotoArchivo = ref(null)
const fotoPreview = ref('')

// Estado de la interfaz.
const cargando = ref(false)
const guardando = ref(false)
const error = ref('')

/**
 * Carga el contacto a editar y rellena el formulario.
 */
async function cargarContacto() {
    cargando.value = true;
    error.value = '';
    try {
        const data = await contactosService.detalle(id.value);
        const c = data.contacto || {};
        formulario.nombre = c.nombre || '';
        formulario.apellido = c.apellido || '';
        formulario.telefono = c.telefono || '';
        formulario.email = c.email || '';
        formulario.direccion = c.direccion || '';
        formulario.notas = c.notas || '';
        // Si ya tiene foto, se muestra como vista previa.
        if (c.foto) {
            fotoPreview.value = c.foto;
        }
    } catch (e) {
        error.value = e.message || 'No se pudo cargar el contacto.';
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

    // Se libera la vista previa anterior (si era un blob local).
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
    if (!formulario.nombre.trim()) {
        return 'El nombre es obligatorio.';
    }
    if (!formulario.telefono.trim()) {
        return 'El teléfono es obligatorio.';
    }
    // La foto es obligatoria solo al crear (en edición se conserva la actual).
    if (!esEdicion.value && !fotoArchivo.value) {
        return 'La foto es obligatoria.';
    }
    return '';
}

/**
 * Construye el FormData con los campos y la foto (si se seleccionó).
 * @returns {FormData}
 */
function construirFormData() {
    const datos = new FormData();
    datos.append('nombre', formulario.nombre.trim());
    datos.append('apellido', formulario.apellido.trim());
    datos.append('telefono', formulario.telefono.trim());
    datos.append('email', formulario.email.trim());
    datos.append('direccion', formulario.direccion.trim());
    datos.append('notas', formulario.notas.trim());

    if (esEdicion.value) {
        datos.append('id', id.value);
    }
    // Solo se adjunta la foto si el usuario seleccionó un archivo nuevo.
    if (fotoArchivo.value) {
        datos.append('foto', fotoArchivo.value);
    }
    return datos;
}

/**
 * Guarda el contacto (crear o actualizar) y redirige a la agenda.
 */
async function guardar() {
    error.value = '';

    const mensajeError = validar();
    if (mensajeError) {
        error.value = mensajeError;
        return;
    }

    guardando.value = true;
    try {
        const datos = construirFormData();
        if (esEdicion.value) {
            await contactosService.actualizar(datos);
        } else {
            await contactosService.crear(datos);
        }
        router.push('/agenda');
    } catch (e) {
        error.value = e.message || 'No se pudo guardar el contacto.';
    } finally {
        guardando.value = false;
    }
}

onMounted(() => {
    if (esEdicion.value) {
        cargarContacto();
    }
});
</script>

<template>
    <main class="contacto-form">
        <header class="contacto-form__cabecera">
            <h1 class="contacto-form__titulo">
                {{ esEdicion ? 'Editar contacto' : 'Nuevo contacto' }}
            </h1>
        </header>

        <MensajeAlerta tipo="error" :mensaje="error" @cerrar="error = ''" />

        <!-- Carga inicial (solo edición) -->
        <SpinnerCarga v-if="cargando" />

        <form v-else class="formulario" @submit.prevent="guardar">
            <CampoFormulario
                id="contacto-nombre"
                label="Nombre"
                v-model="formulario.nombre"
                placeholder="Juan"
                :requerido="true"
            />
            <CampoFormulario
                id="contacto-apellido"
                label="Apellido"
                v-model="formulario.apellido"
                placeholder="Pérez"
            />
            <CampoFormulario
                id="contacto-telefono"
                label="Teléfono"
                tipo="tel"
                v-model="formulario.telefono"
                placeholder="123456789"
                :requerido="true"
            />
            <CampoFormulario
                id="contacto-email"
                label="Email"
                tipo="email"
                v-model="formulario.email"
                placeholder="juan@correo.com"
            />
            <CampoFormulario
                id="contacto-direccion"
                label="Dirección"
                v-model="formulario.direccion"
                placeholder="Calle Falsa 123"
            />

            <div class="campo">
                <label for="contacto-notas" class="campo__label">Notas</label>
                <textarea
                    id="contacto-notas"
                    v-model="formulario.notas"
                    class="campo__input campo__textarea"
                    rows="3"
                    placeholder="Información adicional..."
                ></textarea>
            </div>

            <!-- Foto del contacto -->
            <div class="campo">
                <label for="contacto-foto" class="campo__label">
                    Foto<span v-if="!esEdicion" class="campo__obligatorio"> *</span>
                </label>
                <input
                    id="contacto-foto"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="campo__input campo__file"
                    @change="seleccionarFoto"
                />
                <img
                    v-if="fotoPreview"
                    :src="fotoPreview"
                    alt="Vista previa de la foto"
                    class="contacto-form__preview"
                />
            </div>

            <div class="contacto-form__acciones">
                <button type="submit" class="btn" :disabled="guardando">
                    <SpinnerCarga v-if="guardando" />
                    <span v-else>Guardar</span>
                </button>
                <router-link to="/agenda" class="btn btn--secundario">
                    Cancelar
                </router-link>
            </div>
        </form>
    </main>
</template>