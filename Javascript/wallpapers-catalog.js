/**
 * =============================================================================
 * DARK PRO WALLPAPERS — wallpapers-catalog.js
 * Single wallpaper catalog: Index.html #blog-container only.
 * category.html auto-loads & filters — do not duplicate cards per category.
 * =============================================================================
 */
(function initWallpapersCatalog() {
    "use strict";

    const CATEGORY_NAMES = {
        "4k": "4K & Ultra HD",
        "8k": "8K",
        hd: "HD (1080p)",
        mobile: "Mobile & Phone",
        ultrawide: "Dual / Ultrawide",
        nature: "Nature & Landscapes",
        abstract: "Abstract",
        minimal: "Minimal",
        dark: "Dark & AMOLED",
        space: "Space & Galaxy",
        city: "City & Architecture",
        ocean: "Ocean & Beaches",
        animals: "Animals & Wildlife",
        cars: "Cars & Bikes",
        gaming: "Gaming",
        anime: "Anime & Manga",
        superheroes: "Superheroes & Movies",
        fantasy: "Fantasy & Digital Art",
        sports: "Sports",
        quotes: "Quotes & Typography",
        seasons: "Seasons",
        flowers: "Flowers & Macro",
        "black-white": "Black & White",
        aesthetic: "Aesthetic & Vaporwave",
    };

    const DEFAULT_SCROLL_IMAGES =
        "Images/Scroll/1.png|Images/Scroll/2.png|Images/Scroll/3.png|Images/Scroll/4.png";

    window.DarkProCategories = CATEGORY_NAMES;

    function isCategoryPage() {
        return /category\.html$/i.test(window.location.pathname.split("/").pop() || "");
    }

    function getActiveCategory() {
        return new URLSearchParams(window.location.search).get("cat");
    }

    function prepareCard(card) {
        if (typeof window.darkProApplyAutoCategories === "function") {
            window.darkProApplyAutoCategories(card);
        }
    }

    function cardMatchesCategory(card, cat) {
        if (typeof window.darkProCardMatchesCategory === "function") {
            return window.darkProCardMatchesCategory(card, cat);
        }
        if (!cat) return true;
        const key = cat.toLowerCase();
        const tokens = (card.getAttribute("data-category") || "")
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
        if (tokens.includes(key)) return true;

        const res = (card.getAttribute("data-resolution") || "").toLowerCase();
        if (key === "4k" && (res.includes("3840") || res.includes("4k") || res.includes("2160"))) return true;
        if (key === "8k" && res.includes("8k")) return true;
        if (key === "hd" && res.includes("1080") && !res.includes("3840")) return true;
        if (key === "mobile" && (tokens.includes("mobile") || /1080\s*×\s*1920|1920\s*×\s*1080/.test(res))) {
            return true;
        }
        if (key === "ultrawide" && (tokens.includes("ultrawide") || res.includes("3440") || res.includes("5120"))) {
            return true;
        }
        return false;
    }

    function updateCategoryHeroTitle(cat) {
        const titleEl =
            document.getElementById("category-hero-title") ||
            document.getElementById("category-title") ||
            document.querySelector(".scroll-3d-sequence .content");
        if (!titleEl) return;

        if (cat && CATEGORY_NAMES[cat]) {
            const label = CATEGORY_NAMES[cat] + " Wallpapers";
            titleEl.textContent = label;
            document.title = "Dark Pro — " + CATEGORY_NAMES[cat] + " Wallpapers";
        } else if (isCategoryPage()) {
            titleEl.textContent = "All Wallpapers";
            document.title = "Dark Pro — Category Wallpapers";
        }
    }

    function ensureHeroScrollMarkup() {
        if (!isCategoryPage()) return;
        if (document.getElementById("hero-scroll-track")) return;

        const hero = document.querySelector(".scroll-3d-sequence");
        if (!hero) return;

        const track = document.createElement("div");
        track.id = "hero-scroll-track";
        track.className = "hero-scroll-track";
        hero.parentNode.insertBefore(track, hero);
        track.appendChild(hero);

        if (!hero.getAttribute("data-scroll-images")) {
            hero.setAttribute("data-scroll-images", DEFAULT_SCROLL_IMAGES);
        }

        const wrapper = document.getElementById("main-content-wrapper");
        if (wrapper && !wrapper.classList.contains("site-content-over-hero")) {
            wrapper.classList.add("site-content-over-hero");
        }
    }

    async function fetchCatalogCards() {
        const response = await fetch("Index.html");
        if (!response.ok) throw new Error("Could not load wallpaper catalog");
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        return Array.from(doc.querySelectorAll("#blog-container .blog-card"));
    }

    function renderCards(container, cards) {
        if (!cards.length) {
            container.innerHTML =
                '<p class="category-empty-msg">No wallpapers found in this category yet. Add <code>data-category</code> tags on cards in Index.html.</p>';
            return;
        }
        container.innerHTML = cards.map(function(card) { return card.outerHTML; }).join("");
        if (typeof window.darkProApplyAllWallpaperCategories === "function") {
            window.darkProApplyAllWallpaperCategories(container);
        }
    }

    function filterIndexPageCards(cat) {
        const container = document.getElementById("blog-container");
        if (!container || !cat) return;
        const cards = Array.from(container.querySelectorAll(".blog-card"));
        cards.forEach(prepareCard);
        cards.forEach(function(card) {
            const show = cardMatchesCategory(card, cat);
            card.classList.toggle("blog-card--search-hidden", !show);
            card.classList.toggle("blog-card--paged-out", !show);
        });
        updateCategoryHeroTitle(cat);
    }

    async function loadCatalog() {
        const container = document.getElementById("blog-container");
        if (!container) return;

        const cat = getActiveCategory();

        if (isCategoryPage()) {
            ensureHeroScrollMarkup();
            updateCategoryHeroTitle(cat);

            try {
                const allCards = await fetchCatalogCards();
                allCards.forEach(prepareCard);
                const filtered = cat ? allCards.filter(function(c) { return cardMatchesCategory(c, cat); }) : allCards;
                renderCards(container, filtered);
            } catch (err) {
                console.error(err);
                container.innerHTML =
                    '<p class="category-empty-msg">Could not load wallpapers. Open the site with Live Server and try again.</p>';
            }
            return;
        }

        if (cat) filterIndexPageCards(cat);
    }

    function run() {
        if (typeof window.darkProApplyAllWallpaperCategories === "function") {
            window.darkProApplyAllWallpaperCategories(document);
        }
        loadCatalog().then(function() {
            window.__wallpapersCatalogReady = true;
            document.dispatchEvent(new CustomEvent("wallpapers-catalog-ready"));

            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run);
    } else {
        run();
    }
})();
