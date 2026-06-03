/**
 * =============================================================================
 * DARK PRO WALLPAPERS — scroll-3d.js
 * Fullscreen hero scroll (GSAP ScrollTrigger)
 * Used on Index.html and category.html — same code, no duplicate.
 * =============================================================================
 */
(function initCinematicScroll3D() {
    "use strict";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    function whenReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function getBgStyle(section) {
        const bg = section.querySelector(".bg-image");
        return bg ? bg.getAttribute("style") || "" : "";
    }

    function getScrollFrameUrls(section) {
        const raw = section.getAttribute("data-scroll-images");
        if (!raw) return [];
        const parts = raw.indexOf("|") >= 0 ? raw.split("|") : raw.split(",");
        return parts
            .map(function(s) { return s.trim().replace(/\\/g, "/"); })
            .filter(function(s) {
                return s && /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(s);
            });
    }

    function frameStyle(url) {
        const safe = encodeURI(url.trim().replace(/"/g, ""));
        return "background-image: url('" + safe + "');";
    }

    function buildFramesHtml(urls) {
        return urls.map(function(url, i) {
            return '<div class="scroll-3d-frame' + (i === 0 ? " is-active" : "") +
                '" style="' + frameStyle(url) + '" data-frame="' + (i + 1) + '"></div>';
        }).join("");
    }

    function buildScene(section) {
        if (section.dataset.scroll3dReady === "1") return false;

        const frameUrls = getScrollFrameUrls(section);
        const isSequence = frameUrls.length > 0;
        const bgStyle = getBgStyle(section);
        const content = section.querySelector(".content");
        if (!isSequence && !bgStyle && !content) return false;

        const contentHtml = content ? content.outerHTML : "";
        const firstBg = isSequence ? frameStyle(frameUrls[0]) : bgStyle;

        section.classList.add("scroll-3d-scene");
        section.classList.remove("scroll-hero");
        section.removeAttribute("data-parallax-speed");
        if (isSequence) section.classList.add("scroll-3d-sequence");

        let layersHtml;
        if (isSequence) {
            layersHtml =
                '<div class="scroll-3d-layer scroll-3d-layer--far" style="' + firstBg + '"></div>' +
                '<div class="scroll-3d-frames-wrap">' +
                buildFramesHtml(frameUrls) +
                "</div>";
        } else {
            layersHtml =
                '<div class="scroll-3d-layer scroll-3d-layer--far" style="' + bgStyle + '"></div>' +
                '<div class="scroll-3d-layer scroll-3d-layer--near" style="' + bgStyle + '"></div>' +
                '<div class="scroll-3d-layer scroll-3d-layer--main" style="' + bgStyle + '"></div>';
        }

        section.innerHTML =
            '<div class="scroll-3d-pin">' +
            '  <div class="scroll-3d-stage">' +
            layersHtml +
            '    <div class="scroll-3d-fog" aria-hidden="true"></div>' +
            '    <div class="scroll-3d-vignette" aria-hidden="true"></div>' +
            contentHtml +
            "  </div>" +
            "</div>";

        if (isSequence) {
            frameUrls.forEach(function(url) {
                const img = new Image();
                img.src = url;
            });
        }

        section.dataset.scroll3dReady = "1";
        return true;
    }

    function crossfadeFrames(frames, progress) {
        const total = frames.length;
        if (total === 0) return;
        if (total === 1) {
            frames[0].style.opacity = "1";
            return;
        }
        const pos = progress * (total - 1);
        const idx = Math.min(total - 2, Math.max(0, Math.floor(pos)));
        const blend = pos - idx;
        frames.forEach(function(frame, i) {
            let opacity = 0;
            if (i === idx) opacity = 1 - blend;
            else if (i === idx + 1) opacity = blend;
            frame.style.opacity = String(opacity);
            frame.classList.toggle("is-active", opacity > 0.5);
        });
    }

    function scrollDistance(section) {
        const w = window.innerWidth;
        if (w < 480) return "+=130%";
        if (w < 900) return "+=155%";
        return "+=185%";
    }

    function getHeroScrollTrack(section) {
        if (!section || !section.classList.contains("scroll-3d-sequence")) return null;
        return section.closest(".hero-scroll-track");
    }

    function syncHeroTrackHeight(track) {
        if (!track) return;
        const w = window.innerWidth;
        let vh = 300;
        if (w < 480) vh = 220;
        else if (w < 900) vh = 260;
        track.style.height = vh + "vh";
    }

    function sceneSettings(isSequence) {
        const w = window.innerWidth;
        if (isSequence) {
            if (w < 480) {
                return { scrub: 1, scaleStart: 1, scalePeak: 1.08, rotPeak: 4, zPeak: 45, yPeak: -14 };
            }
            if (w < 900) {
                return { scrub: 1.1, scaleStart: 1, scalePeak: 1.1, rotPeak: 5, zPeak: 58, yPeak: -20 };
            }
            return { scrub: 1.2, scaleStart: 1, scalePeak: 1.12, rotPeak: 6, zPeak: 72, yPeak: -26 };
        }
        if (w < 480) {
            return { scrub: 1, scaleStart: 1.08, scaleEnd: 1.38, rotEnd: 8, zEnd: 120, yEnd: -50 };
        }
        if (w < 900) {
            return { scrub: 1.1, scaleStart: 1.1, scaleEnd: 1.48, rotEnd: 11, zEnd: 150, yEnd: -65 };
        }
        return { scrub: 1.25, scaleStart: 1.1, scaleEnd: 1.55, rotEnd: 14, zEnd: 180, yEnd: -80 };
    }

    function setHeroScrollPhase(active) {
        document.body.classList.toggle("hero-scroll-active", active);
    }

    function applySequenceScrollState(section, cfg, progress) {
        const framesWrap = section.querySelector(".scroll-3d-frames-wrap");
        const content = section.querySelector(".content");
        const fog = section.querySelector(".scroll-3d-fog");
        const frames = framesWrap ? Array.from(section.querySelectorAll(".scroll-3d-frame")) : [];
        const p = Math.max(0, Math.min(1, progress));

        section.classList.toggle("is-hero-idle", p < 0.002);

        if (frames.length) crossfadeFrames(frames, p);

        if (framesWrap && typeof gsap !== "undefined") {
            let scale = cfg.scaleStart;
            let z = 0;
            let rotX = 0;
            let y = 0;

            if (p <= 0.5) {
                const t = p / 0.5;
                scale = cfg.scaleStart + (cfg.scalePeak - cfg.scaleStart) * t;
                z = cfg.zPeak * t;
                rotX = cfg.rotPeak * t;
                y = cfg.yPeak * t;
            } else {
                const t = (p - 0.5) / 0.5;
                scale = cfg.scalePeak + (cfg.scaleStart - cfg.scalePeak) * t;
                z = cfg.zPeak * (1 - t);
                rotX = cfg.rotPeak * (1 - t);
                y = cfg.yPeak * (1 - t);
            }

            gsap.set(framesWrap, {
                scale: scale,
                z: z,
                rotationX: rotX,
                y: y,
                force3D: true,
                transformOrigin: "50% 45%",
            });
        }

        if (fog && typeof gsap !== "undefined") {
            gsap.set(fog, { opacity: 0.12 + p * 0.33 });
        }

        if (content) {
            if (p < 0.42) {
                if (typeof gsap !== "undefined") {
                    gsap.set(content, {
                        opacity: 1,
                        yPercent: -50,
                        y: 0,
                        z: 40,
                        rotationX: 0,
                        visibility: "visible",
                    });
                } else {
                    content.style.opacity = "1";
                    content.style.visibility = "visible";
                }
            } else if (typeof gsap !== "undefined") {
                const t = (p - 0.42) / 0.58;
                gsap.set(content, {
                    opacity: 1 - t,
                    yPercent: -50,
                    y: -80 * t,
                    z: 40 + 80 * t,
                    rotationX: -4 * t,
                    visibility: t > 0.95 ? "hidden" : "visible",
                });
            }
        }
    }

    function resetAllHeroesAtTop() {
        if (window.scrollY > 12) return;

        document.querySelectorAll(".scroll-3d-sequence").forEach(function(section) {
            applySequenceScrollState(section, sceneSettings(true), 0);
        });

        if (typeof ScrollTrigger !== "undefined") {
            const st = ScrollTrigger.getById("hero-scroll-main");
            if (st && st.animation) {
                st.animation.progress(0);
            }
        }
    }

    function initScenes() {
        const sections = document.querySelectorAll(".scroll-3d-scene, .section.scroll-hero");
        sections.forEach(buildScene);

        document.querySelectorAll(".scroll-3d-sequence").forEach(function(section) {
            section.classList.add("scroll-3d-fullscreen", "is-hero-idle");
            syncHeroTrackHeight(getHeroScrollTrack(section));
            applySequenceScrollState(section, sceneSettings(true), 0);
        });

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            document.documentElement.classList.add("scroll-3d-fallback");
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll(".scroll-3d-scene").forEach(function(section) {
            if (section.dataset.scroll3dBound === "1") return;

            const pin = section.querySelector(".scroll-3d-pin");
            const stage = section.querySelector(".scroll-3d-stage");
            const isSequence = section.classList.contains("scroll-3d-sequence");
            const layerFar = section.querySelector(".scroll-3d-layer--far");
            const layerNear = section.querySelector(".scroll-3d-layer--near");
            const layerMain = section.querySelector(".scroll-3d-layer--main");
            const framesWrap = section.querySelector(".scroll-3d-frames-wrap");
            const cameraTarget = isSequence ? framesWrap : layerMain;
            const fog = section.querySelector(".scroll-3d-fog");
            const content = section.querySelector(".content");

            if (!pin || !stage || !cameraTarget) return;

            const cfg = sceneSettings(isSequence);
            const isFirstHero = isSequence && !document.body.dataset.heroScrollBound;
            const heroTrack = getHeroScrollTrack(section);
            const useFullscreenOverlay = isSequence && heroTrack;

            gsap.set(stage, { transformPerspective: 1400, transformStyle: "preserve-3d" });

            if (isSequence) {
                applySequenceScrollState(section, cfg, 0);
            } else {
                gsap.set(cameraTarget, {
                    force3D: true,
                    transformOrigin: "50% 45%",
                    scale: cfg.scaleStart,
                    z: 0,
                    rotationX: 0,
                    y: 0,
                });
            }

            const scrollTriggerConfig = {
                trigger: useFullscreenOverlay ? heroTrack : section,
                start: "top top",
                end: useFullscreenOverlay ? "bottom top" : function() { return scrollDistance(section); },
                scrub: cfg.scrub,
                invalidateOnRefresh: true,
                onUpdate: function(self) {
                    if (isSequence) {
                        applySequenceScrollState(section, cfg, self.progress);
                    }
                },
                onRefresh: function() {
                    if (window.scrollY < 12 && isSequence) {
                        applySequenceScrollState(section, cfg, 0);
                    }
                },
            };

            if (isFirstHero) {
                scrollTriggerConfig.id = "hero-scroll-main";
                scrollTriggerConfig.onEnter = function() { setHeroScrollPhase(true); };
                scrollTriggerConfig.onLeave = function() { setHeroScrollPhase(false); };
                scrollTriggerConfig.onEnterBack = function() { setHeroScrollPhase(true); };
                scrollTriggerConfig.onLeaveBack = function() {
                    setHeroScrollPhase(window.scrollY < 20);
                };
                document.body.dataset.heroScrollBound = "1";
                setHeroScrollPhase(true);
            }

            if (!useFullscreenOverlay) {
                scrollTriggerConfig.pin = pin;
                scrollTriggerConfig.anticipatePin = 1;
            }

            const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig });

            if (isSequence) {
                tl.to({}, { duration: 1, ease: "none" });
            } else {
                tl.fromTo(
                    cameraTarget,
                    { z: 0, rotationX: 0, scale: cfg.scaleStart, y: 0, immediateRender: false },
                    {
                        z: cfg.zEnd,
                        rotationX: cfg.rotEnd,
                        scale: cfg.scaleEnd,
                        y: cfg.yEnd,
                        ease: "none",
                        immediateRender: false,
                    },
                    0
                );

                if (layerNear) {
                    tl.fromTo(
                        layerNear,
                        { z: -90, scale: 1.08, y: 0, opacity: 0.75, immediateRender: false },
                        { z: 40, scale: 1.35, y: cfg.yEnd * 0.45, opacity: 1, ease: "none", immediateRender: false },
                        0
                    );
                }

                if (layerFar) {
                    tl.fromTo(
                        layerFar,
                        { z: -200, scale: 1.04, y: 0, immediateRender: false },
                        { z: -40, scale: 1.15, y: cfg.yEnd * 0.5, ease: "none", immediateRender: false },
                        0
                    );
                }

                if (fog) {
                    tl.fromTo(fog, { opacity: 0.12, immediateRender: false }, { opacity: 0.65, ease: "none", immediateRender: false }, 0);
                }

                if (content) {
                    tl.fromTo(
                        content,
                        { opacity: 1, yPercent: -50, y: 0, z: 40, rotationX: 0, immediateRender: false },
                        {
                            opacity: 0,
                            y: -100,
                            z: 220,
                            rotationX: -6,
                            ease: "none",
                            immediateRender: false,
                        },
                        0
                    );
                }
            }

            if (isSequence) {
                tl.progress(0);
                applySequenceScrollState(section, cfg, 0);
            }

            section.dataset.scroll3dBound = "1";
        });

        ScrollTrigger.refresh();
        resetAllHeroesAtTop();
    }

    whenReady(function() {
        window.scrollTo(0, 0);
        initScenes();
        requestAnimationFrame(function() {
            requestAnimationFrame(resetAllHeroesAtTop);
        });
    });

    window.addEventListener("load", function() {
        window.scrollTo(0, 0);
        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }
        resetAllHeroesAtTop();
    });

    window.addEventListener("pageshow", function(e) {
        if (e.persisted) {
            window.scrollTo(0, 0);
            resetAllHeroesAtTop();
        }
    });

    let resizeTimer;
    window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.querySelectorAll(".scroll-3d-sequence").forEach(function(section) {
                syncHeroTrackHeight(getHeroScrollTrack(section));
            });
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
            resetAllHeroesAtTop();
        }, 200);
    });
})();
