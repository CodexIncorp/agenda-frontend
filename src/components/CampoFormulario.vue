<script setup>
// Campo de formulario reutilizable (label + input) con v-model.
defineProps({
    // Identificador único del input (debe coincidir con el label).
    id: { type: String, required: true },
    // Texto de la etiqueta.
    label: { type: String, required: true },
    // Tipo de input (text, email, password, tel, url...).
    tipo: { type: String, default: 'text' },
    // Texto de ayuda dentro del input.
    placeholder: { type: String, default: '' },
    // Indica si el campo es obligatorio.
    requerido: { type: Boolean, default: false },
    // Valor actual (soporta v-model).
    modelValue: { type: [String, Number], default: '' },
})

// Evento de actualización del valor (v-model).
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="campo">
        <label :for="id" class="campo__label">
            {{ label }}<span v-if="requerido" class="campo__obligatorio"> *</span>
        </label>
        <input
            :id="id"
            class="campo__input"
            :type="tipo"
            :value="modelValue"
            :placeholder="placeholder"
            :required="requerido"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>