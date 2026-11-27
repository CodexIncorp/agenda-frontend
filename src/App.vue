<script setup>
// Layout principal: navbar fijo arriba y el contenido de la ruta actual.
// La transición de ruta se anima con fade-up (respeta prefers-reduced-motion).
import AppNavbar from '@/components/AppNavbar.vue'
import { useDarkMode } from '@/composables/useDarkMode'

// Inicializa el modo oscuro (aplica data-theme y escucha la preferencia).
useDarkMode()
</script>

<template>
    <div class="app">
        <AppNavbar />
        <main class="app__contenido">
            <Transition name="fade-up" mode="out-in">
                <router-view :key="$route.fullPath" />
            </Transition>
        </main>
    </div>
</template>