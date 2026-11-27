<script setup>
// Vista de agenda: listado de contactos del usuario.
// Permite crear, editar y eliminar contactos.
import { onMounted, ref } from 'vue'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-vue-next'
import * as contactosService from '@/services/contactosService'
import SpinnerCarga from '@/components/SpinnerCarga.vue'
import MensajeAlerta from '@/components/MensajeAlerta.vue'

// Estado de la vista.
const contactos = ref([])
const cargando = ref(true)
const error = ref('')

// Id del contacto que está en confirmación de eliminación.
const confirmandoId = ref(null)
// Id del contacto que se está eliminando (para deshabilitar el botón).
const eliminandoId = ref(null)

/**
 * Carga la lista de contactos desde el backend.
 */
async function cargarContactos() {
    cargando.value = true;
    error.value = '';
    try {
        const data = await contactosService.listar();
        contactos.value = data.contactos || [];
    } catch (e) {
        error.value = e.message || 'No se pudieron cargar los contactos.';
    } finally {
        cargando.value = false;
    }
}

/**
 * Solicita confirmación para eliminar un contacto.
 * @param {number|string} id
 */
function pedirEliminacion(id) {
    confirmandoId.value = id;
}

/**
 * Cancela la confirmación de eliminación.
 */
function cancelarEliminacion() {
    confirmandoId.value = null;
}

/**
 * Elimina un contacto y refresca la lista.
 * @param {number|string} id
 */
async function eliminarContacto(id) {
    eliminandoId.value = id;
    error.value = '';
    try {
        await contactosService.eliminar(id);
        contactos.value = contactos.value.filter((c) => c.id !== id);
        confirmandoId.value = null;
    } catch (e) {
        error.value = e.message || 'No se pudo eliminar el contacto.';
    } finally {
        eliminandoId.value = null;
    }
}

onMounted(cargarContactos);
</script>

<template>
    <main class="agenda">
        <header class="agenda__cabecera">
            <h1 class="agenda__titulo">Mis contactos</h1>
            <router-link to="/agenda/crear" class="btn agenda__crear">
                <Plus :size="20" :stroke-width="2" />
                <span>Nuevo contacto</span>
            </router-link>
        </header>

        <MensajeAlerta tipo="error" :mensaje="error" @cerrar="error = ''" />

        <!-- Estado de carga -->
        <SpinnerCarga v-if="cargando" />

        <!-- Estado vacío -->
        <p v-else-if="contactos.length === 0" class="agenda__vacio">
            Aún no tienes contactos. Crea el primero con el botón de arriba.
        </p>

        <!-- Listado de contactos -->
        <TransitionGroup v-else name="lista" tag="ul" class="contacto-lista">
            <li v-for="contacto in contactos" :key="contacto.id" class="contacto">
                <img
                    v-if="contacto.foto"
                    :src="contacto.foto"
                    :alt="`Foto de ${contacto.nombre}`"
                    class="contacto__foto"
                />
                <div
                    v-else
                    class="contacto__foto contacto__foto--vacia"
                    aria-hidden="true"
                >
                    {{ (contacto.nombre || '?').charAt(0).toUpperCase() }}
                </div>

                <div class="contacto__info">
                    <h2 class="contacto__nombre">
                        {{ contacto.nombre }} {{ contacto.apellido }}
                    </h2>
                    <p v-if="contacto.telefono" class="contacto__dato">
                        {{ contacto.telefono }}
                    </p>
                    <p v-if="contacto.email" class="contacto__dato">
                        {{ contacto.email }}
                    </p>
                </div>

                <div class="contacto__acciones">
                    <!-- Confirmación de eliminación en línea -->
                    <template v-if="confirmandoId === contacto.id">
                        <span class="contacto__pregunta">¿Eliminar?</span>
                        <button
                            type="button"
                            class="btn btn--peligro contacto__boton"
                            :disabled="eliminandoId === contacto.id"
                            @click="eliminarContacto(contacto.id)"
                        >
                            <SpinnerCarga v-if="eliminandoId === contacto.id" />
                            <template v-else>
                                <Check :size="18" :stroke-width="2" />
                                <span>Sí</span>
                            </template>
                        </button>
                        <button
                            type="button"
                            class="btn btn--secundario contacto__boton"
                            @click="cancelarEliminacion"
                        >
                            <X :size="18" :stroke-width="2" />
                            <span>No</span>
                        </button>
                    </template>

                    <!-- Acciones normales -->
                    <template v-else>
                        <router-link
                            :to="`/agenda/${contacto.id}`"
                            class="btn btn--secundario contacto__boton"
                        >
                            <Pencil :size="18" :stroke-width="2" />
                            <span>Editar</span>
                        </router-link>
                        <button
                            type="button"
                            class="btn btn--peligro contacto__boton"
                            @click="pedirEliminacion(contacto.id)"
                        >
                            <Trash2 :size="18" :stroke-width="2" />
                            <span>Eliminar</span>
                        </button>
                    </template>
                </div>
            </li>
        </TransitionGroup>
    </main>
</template>