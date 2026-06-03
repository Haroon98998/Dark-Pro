/**
 * =============================================================================
 * DARK PRO — scroll-horizontal.js
 * Latest & Premium: continuous auto-scroll + mouse/touch drag (no ScrollTrigger)
 * =============================================================================
 */
(function initHorizontalScroll() {
    "use strict";

    const carousels = new WeakMap();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function whenReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function resolveCarouselCard(target) {
        const card = target && target.closest ? target.closest(".h-scroll-card") : null;
        if (!card) return null;

        const dupStrip = card.closest(".h-scroll-strip--duplicate");
        if (!dupStrip) return card;

        const track = card.closest(".h-scroll-track");
        const originalStrip = track
            ? track.querySelector(".h-scroll-strip:not(.h-scroll-strip--duplicate)")
            : null;
        if (!originalStrip) return card;

        const dupCards = dupStrip.querySelectorAll(".h-scroll-card");
        const index = Array.from(dupCards).indexOf(card);
        if (index < 0) return card;

        const originalCards = originalStrip.querySelectorAll(".h-scroll-card");
        return originalCards[index] || card;
    }

    function openCardFromElement(el) {
        if (typeof window.openWallpaperDetail !== "function") return;
        const card = resolveCarouselCard(el);
        if (!card) return;

        const isPremium =
            card.classList.contains("h-scroll-card--premium") ||
            card.getAttribute("data-premium") === "true";

        if (isPremium && typeof window.darkProRequireLogin === "function") {
            window.darkProRequireLogin(function() {
                window.openWallpaperDetail(card);
            });
            return;
        }

        window.openWallpaperDetail(card);
    }

    function wrapOffset(offset, loopWidth) {
        if (loopWidth <= 0) return 0;
        while (offset <= -loopWidth) offset += loopWidth;
        while (offset > 0) offset -= loopWidth;
        return offset;
    }

    function destroyCarousel(section) {
        const instance = carousels.get(section);
        if (!instance) return;
        instance.destroy();
        carousels.delete(section);
    }

    function createAutoCarousel(section) {
        const viewport = section.querySelector(".h-scroll-viewport");
        const strip = section.querySelector(".h-scroll-strip");
        if (!viewport || !strip) return null;

        viewport.setAttribute("data-lenis-prevent", "");

        let track = viewport.querySelector(".h-scroll-track");
        if (!track) {
            track = document.createElement("div");
            track.className = "h-scroll-track";
            viewport.insertBefore(track, strip);
            track.appendChild(strip);

            const duplicate = strip.cloneNode(true);
            duplicate.classList.add("h-scroll-strip", "h-scroll-strip--duplicate");
            duplicate.setAttribute("aria-hidden", "true");
            duplicate.removeAttribute("id");
            duplicate.querySelectorAll("a").forEach(function(link) {
                link.setAttribute("tabindex", "-1");
            });
            track.appendChild(duplicate);
        }

        if (typeof gsap !== "undefined") {
            gsap.set(track, { clearProps: "transform" });
            gsap.set(strip, { clearProps: "transform" });
        } else {
            track.style.transform = "";
        }

        const isPremium = section.classList.contains("h-scroll-section--premium");
        const speedPxPerSec = reducedMotion ? 0 : isPremium ? 44 : 38;
        const state = {
            offset: 0,
            loopWidth: 0,
            dragging: false,
            visible: true,
            paused: false,
            pointerId: null,
            startX: 0,
            startY: 0,
            startOffset: 0,
            dragMoved: false,
            rafId: 0,
            lastTime: 0,
        };

        function measureLoop() {
            state.loopWidth = strip.getBoundingClientRect().width;
            state.offset = wrapOffset(state.offset, state.loopWidth);
            applyTransform();
        }

        function applyTransform() {
            track.style.transform = "translate3d(" + state.offset + "px, 0, 0)";
        }

        function onPointerDown(e) {
            if (e.button !== 0) return;
            state.dragging = true;
            state.pointerId = e.pointerId;
            state.startX = e.clientX;
            state.startY = e.clientY;
            state.startOffset = state.offset;
            state.dragMoved = false;
            viewport.classList.add("is-dragging");
            try {
                viewport.setPointerCapture(e.pointerId);
            } catch (err) {
                /* ignore */
            }
        }

        function onPointerMove(e) {
            if (!state.dragging || e.pointerId !== state.pointerId) return;
            const dx = e.clientX - state.startX;
            const dy = e.clientY - state.startY;
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                state.dragMoved = true;
            }
            state.offset = wrapOffset(state.startOffset + dx, state.loopWidth);
            applyTransform();
        }

        function endDrag(e) {
            if (!state.dragging) return;
            if (e && e.pointerId != null && state.pointerId != null && e.pointerId !== state.pointerId) {
                return;
            }
            const wasDrag = state.dragMoved;
            state.dragging = false;
            state.pointerId = null;
            viewport.classList.remove("is-dragging");

            if (!wasDrag && e) {
                const hit = document.elementFromPoint(e.clientX, e.clientY);
                const card = resolveCarouselCard(hit);
                if (card) {
                    e.preventDefault();
                    openCardFromElement(card);
                }
            }

            window.setTimeout(function() {
                state.dragMoved = false;
            }, 80);
        }

        function tick(now) {
            if (!state.lastTime) state.lastTime = now;
            const dt = Math.min(0.05, (now - state.lastTime) / 1000);
            state.lastTime = now;

            if (
                !reducedMotion &&
                state.visible &&
                !state.paused &&
                !state.dragging &&
                state.loopWidth > 0
            ) {
                state.offset -= speedPxPerSec * dt;
                state.offset = wrapOffset(state.offset, state.loopWidth);
                applyTransform();
            }

            state.rafId = window.requestAnimationFrame(tick);
        }

        const onPointerUp = function(e) {
            endDrag(e);
        };
        const onPointerCancel = function(e) {
            endDrag(e);
        };
        const onWheel = function(e) {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
            e.preventDefault();
            state.offset = wrapOffset(state.offset - e.deltaX, state.loopWidth);
            applyTransform();
        };
        const onResize = function() {
            measureLoop();
        };
        const onImageLoad = function() {
            measureLoop();
        };

        function blockCardNav(e) {
            if (e.target.closest(".h-scroll-card")) {
                e.preventDefault();
            }
        }

        viewport.addEventListener("pointerdown", onPointerDown);
        viewport.addEventListener("pointermove", onPointerMove);
        viewport.addEventListener("pointerup", onPointerUp);
        viewport.addEventListener("pointercancel", onPointerCancel);
        viewport.addEventListener("lostpointercapture", onPointerUp);
        viewport.addEventListener("click", blockCardNav, true);
        viewport.addEventListener("wheel", onWheel, { passive: false });

        strip.querySelectorAll("img").forEach(function(img) {
            if (!img.complete) {
                img.addEventListener("load", onImageLoad, { once: true });
                img.addEventListener("error", onImageLoad, { once: true });
            }
        });

        const visibilityObserver = new IntersectionObserver(
            function(entries) {
                entries.forEach(function(entry) {
                    if (entry.target === section) {
                        state.visible = entry.isIntersecting;
                    }
                });
            },
            { threshold: 0.08, rootMargin: "80px 0px" }
        );
        visibilityObserver.observe(section);

        window.addEventListener("resize", onResize);
        document.addEventListener("visibilitychange", function() {
            state.paused = document.hidden;
        });

        measureLoop();
        state.rafId = window.requestAnimationFrame(tick);
        section.classList.add("h-scroll-section--ready", "is-active");

        return {
            refresh: measureLoop,
            destroy: function() {
                window.cancelAnimationFrame(state.rafId);
                viewport.removeEventListener("pointerdown", onPointerDown);
                viewport.removeEventListener("pointermove", onPointerMove);
                viewport.removeEventListener("pointerup", onPointerUp);
                viewport.removeEventListener("pointercancel", onPointerCancel);
                viewport.removeEventListener("lostpointercapture", onPointerUp);
                viewport.removeEventListener("click", blockCardNav, true);
                viewport.removeEventListener("wheel", onWheel);
                window.removeEventListener("resize", onResize);
                visibilityObserver.disconnect();
                viewport.classList.remove("is-dragging");
                track.style.transform = "";
                section.classList.remove("is-active");
            },
        };
    }

    function initAutoCarousel(section) {
        destroyCarousel(section);
        const instance = createAutoCarousel(section);
        if (instance) carousels.set(section, instance);
    }

    function initBlogGalleryAnimations() {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

        const section = document.getElementById("wallpapers-section");
        if (!section) return;

        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray("#blog-container .blog-card").forEach(function(card, i) {
            if (card.dataset.galleryAnim === "1") return;
            card.classList.add("blog-card--scroll-anim");
            card.dataset.galleryAnim = "1";

            gsap.fromTo(
                card,
                { opacity: 0, y: 48, scale: 0.94 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 92%",
                        toggleActions: "play none none none",
                        once: true,
                    },
                    delay: (i % 4) * 0.05,
                }
            );
        });
    }

    function initCarousels() {
        document.querySelectorAll(".h-scroll-section").forEach(initAutoCarousel);
    }

    function initAll() {
        initCarousels();
        initBlogGalleryAnimations();
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh(true);
        }
    }

    whenReady(initAll);
    window.addEventListener("load", function() {
        document.querySelectorAll(".h-scroll-section").forEach(function(section) {
            const instance = carousels.get(section);
            if (instance) instance.refresh();
        });
    });

    document.addEventListener("wallpapers-catalog-ready", function() {
        initBlogGalleryAnimations();
    });

    window.reinitHorizontalScroll = initAll;

    let resizeTimer;
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.querySelectorAll(".h-scroll-section").forEach(function(section) {
                const instance = carousels.get(section);
                if (instance) instance.refresh();
            });
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(true);
        }, 200);
    });
})();
