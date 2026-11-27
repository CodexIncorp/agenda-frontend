// src/directives/reveal.js
// Directiva personalizada v-reveal.
// Anima la entrada de un elemento (fade + subir) cuando aparece en el viewport.
// Respeta prefers-reduced-motion y limpia el observer al desmontar.

// Observadores por elemento (para desconectar al desmontar).
const observadores = new WeakMap();

export const reveal = {
    mounted(el) {
        // Sin soporte o con movimiento reducido: se muestra directamente.
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (typeof IntersectionObserver === 'undefined' || reduceMotion) {
            el.classList.add('in-view');
            return;
        }

        el.classList.add('reveal');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        observadores.set(el, observer);
    },

    unmounted(el) {
        const observer = observadores.get(el);
        if (observer) {
            observer.disconnect();
        }
        observadores.delete(el);
    },
};