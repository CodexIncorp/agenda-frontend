<script setup>
// Layout principal: navbar fijo arriba y el contenido de la ruta actual.
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
    <div class="app">
        <AppNavbar />
        <main class="app__contenido">
            <router-view />
        </main>
    </div>
</template>