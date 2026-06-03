/**
 * =============================================================================
 * DARK PRO — smooth-scroll.js
 * Lenis smooth scroll + GSAP ScrollTrigger sync (site-wide)
 * =============================================================================
 */
(function initSmoothScroll() {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function boot() {
        if (typeof Lenis === "undefined" || typeof gsap === "undefined") return;
        if (window.__darkProLenis) return;

        const lenis = new Lenis({
            lerp: 0.085,
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.4,
            syncTouch: true,
            syncTouchLerp: 0.075,
        });

        window.__darkProLenis = lenis;

        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
            lenis.on("scroll", ScrollTrigger.update);
            ScrollTrigger.addEventListener("refresh", function() {
                lenis.resize();
            });
        }

        gsap.ticker.add(function(time) {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh(true);
        }

        window.dispatchEvent(new CustomEvent("darkpro-lenis-ready"));

        window.darkProScrollTo = function(target, options) {
            const el = typeof target === "string" ? document.querySelector(target) : target;
            if (!el) return;
            lenis.scrollTo(el, {
                offset: options && options.offset != null ? options.offset : 0,
                duration: options && options.duration != null ? options.duration : 1.15,
            });
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
