// src/router/index.js
// Configuración de Vue Router.
// - Usa hash history (createWebHashHistory) para compatibilidad con GitHub Pages.
// - Define las rutas mínimas requeridas.
// - Protege rutas privadas mediante un guard de autenticación.

import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
    // Hash history: evita errores 404 al recargar en GitHub Pages.
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
        },
        {
            path: '/registro',
            name: 'registro',
            component: () => import('@/views/RegistroView.vue'),
        },
        {
            path: '/agenda',
            name: 'agenda',
            component: () => import('@/views/AgendaView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/agenda/crear',
            name: 'agenda-crear',
            component: () => import('@/views/ContactoFormView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/agenda/:id',
            name: 'agenda-editar',
            component: () => import('@/views/ContactoFormView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/perfil',
            name: 'perfil',
            component: () => import('@/views/PerfilView.vue'),
            meta: { requiresAuth: true },
        },
    ],
    // Scroll al inicio en cada navegación.
    scrollBehavior() {
        return { top: 0 };
    },
})

// Guard de autenticación:
// - Si la ruta requiere auth y no hay sesión, redirige a /login.
// - Si ya hay sesión y se intenta ir a /login o /registro, redirige a /agenda.
router.beforeEach((to) => {
    const auth = useAuthStore();

    if (to.meta.requiresAuth && !auth.estaAutenticado) {
        return { path: '/login' };
    }

    if ((to.path === '/login' || to.path === '/registro') && auth.estaAutenticado) {
        return { path: '/agenda' };
    }
})

export default router