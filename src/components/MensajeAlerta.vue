<script setup>
// Mensaje de alerta reutilizable (éxito / error / info).
defineProps({
    // Tipo de alerta: 'success' | 'error' | 'info'.
    tipo: { type: String, default: 'info' },
    // Texto a mostrar. Si está vacío, no se renderiza.
    mensaje: { type: String, default: '' },
})

// Evento para cerrar la alerta desde el componente padre.
defineEmits(['cerrar'])
</script>

<template>
    <div
        v-if="mensaje"
        class="alerta"
        :class="`alerta--${tipo}`"
        role="alert"
    >
        <span class="alerta__texto">{{ mensaje }}</span>
        <button
            class="alerta__cerrar"
            type="button"
            aria-label="Cerrar mensaje"
            @click="$emit('cerrar')"
        >
            ×
        </button>
    </div>
</template>