/**
 * DARK PRO — Auto wallpaper categories (no AI / no rename)
 * Detects category from image path, filename, title & alt — used by category.html filter.
 */
(function initWallpaperCategories() {
    "use strict";

    var MIN_SCORE = 18;

    var RULES = [
        { cat: "animals", re: /tiger|lion|leopard|cheetah|panther|bear|wolf|fox|deer|moose|eagle|hawk|owl|bird|penguin|dolphin|whale|shark|fish|horse|zebra|giraffe|elephant|rhino|hippo|panda|koala|kangaroo|monkey|gorilla|animal|wildlife|zoo|bengal|pet\b|puppy|kitten|snake|butterfly|bee\b/i },
        { cat: "cars", re: /lamborghini|ferrari|porsche|bugatti|mclaren|bmw|mercedes|audi|toyota|nissan|gt-?r|mustang|corvette|camaro|charger|supercar|hypercar|\bcar\b|automobile|vehicle|racing|nascar|formula|drift|motorcycle|motorbike|\bbike\b|forza|horizon|drive|roadster|coupe|sedan/i },
        { cat: "gaming", re: /gta|grand.?theft|tekken|alan.?wake|fortnite|minecraft|call.?of.?duty|cod\b|battlefield|assassin|zelda|mario|pokemon|cyberpunk|elden.?ring|god.?of.?war|horizon|playstation|xbox|nintendo|game\b|gaming|videogame|ps5|ps4\b/i },
        { cat: "superheroes", re: /spider.?man|marvel|batman|superman|wonder.?woman|iron.?man|thor\b|hulk|avengers|dc\b|comic|miles.?morales|deadpool|wolverine/i },
        { cat: "anime", re: /anime|manga|naruto|goku|luffy|one.?piece|demonslayer|jujutsu|sakura|kawaii|otaku/i },
        { cat: "nature", re: /nature|landscape|forest|woods|jungle|meadow|valley|hill\b|countryside|scenic|greenery|trees?\b/i },
        { cat: "ocean", re: /ocean|sea\b|beach|coast|shore|wave|tropical|island|coral|underwater|marine/i },
        { cat: "space", re: /space|galaxy|nebula|cosmos|universe|planet|astronaut|milky|stellar|solar|moon\b|mars\b/i },
        { cat: "city", re: /city|urban|skyline|downtown|street|building|architecture|metropolis|night.?city/i },
        { cat: "dark", re: /amoled|dark.?mode|black.?wall|midnight|shadow|noir/i },
        { cat: "minimal", re: /minimal|simple|clean.?design|flat.?design/i },
        { cat: "abstract", re: /abstract|pattern|geometric|gradient|fluid|digital.?art|surreal/i },
        { cat: "fantasy", re: /fantasy|dragon|wizard|magic|medieval|castle|fairy|mythic/i },
        { cat: "sports", re: /football|soccer|basketball|cricket|tennis|stadium|sport\b|athlete|olympic/i },
        { cat: "flowers", re: /flower|bloom|rose\b|tulip|garden|floral|petal|botanical/i },
        { cat: "seasons", re: /snow|snowfall|winter|autumn|fall\b|spring\b|summer|frost|ice\b|blizzard/i },
        { cat: "aesthetic", re: /aesthetic|vaporwave|synthwave|retro|neon|lo-?fi|pastel/i },
        { cat: "quotes", re: /quote|typography|text.?art|saying|motivat/i },
        { cat: "black-white", re: /black.?and.?white|monochrome|grayscale|b&w/i },
    ];

    function unique(arr) {
        var seen = {};
        return arr.filter(function(v) {
            var k = v.toLowerCase();
            if (!v || seen[k]) return false;
            seen[k] = true;
            return true;
        });
    }

    function filenameFromSrc(src) {
        try {
            var path = decodeURIComponent(String(src || ""));
            return path.split("/").pop().split("?")[0].toLowerCase();
        } catch (e) {
            return String(src || "").toLowerCase();
        }
    }

    function getCardSrc(card) {
        return (
            card.getAttribute("data-original-src") ||
            (card.querySelector("img") && card.querySelector("img").getAttribute("src")) ||
            ""
        );
    }

    function getCardText(card) {
        var img = card.querySelector("img");
        var alt = img ? (img.getAttribute("alt") || "") : "";
        var nameEl = card.querySelector(".wallpaper-name, .h-scroll-card__label");
        var name = nameEl ? nameEl.textContent.trim() : "";
        var src = getCardSrc(card);
        var file = filenameFromSrc(src);
        var url = decodeURIComponent(src).toLowerCase();
        return { file: file, name: name.toLowerCase(), alt: alt.toLowerCase(), url: url, all: [file, name, alt, url].join(" ") };
    }

    function resolutionCategories(card) {
        var res = (card.getAttribute("data-resolution") || "").toLowerCase();
        var out = [];
        if (/3840|4k|2160|uhd/.test(res)) out.push("4k");
        if (/7680|8k/.test(res)) out.push("8k");
        if (/1080/.test(res) && !/3840/.test(res)) out.push("hd");
        if (/1080\s*×\s*1920|1920\s*×\s*1080|mobile|phone|portrait/.test(res)) out.push("mobile");
        if (/3440|5120|ultrawide|21:9/.test(res)) out.push("ultrawide");
        return out;
    }

    function detectThematicCategories(card) {
        var t = getCardText(card);
        var scores = {};

        RULES.forEach(function(rule) {
            var s = 0;
            if (rule.re.test(t.file)) s += 35;
            if (rule.re.test(t.name)) s += 28;
            if (rule.re.test(t.url)) s += 22;
            if (rule.re.test(t.alt)) s += 12;
            if (s >= MIN_SCORE) scores[rule.cat] = Math.max(scores[rule.cat] || 0, s);
        });

        return Object.keys(scores).sort(function(a, b) {
            return scores[b] - scores[a];
        });
    }

    function detectCategories(card) {
        return unique(detectThematicCategories(card).concat(resolutionCategories(card)));
    }

    function applyAutoCategories(card) {
        if (!card) return [];
        var detected = detectCategories(card);
        if (detected.length) {
            card.setAttribute("data-category", detected.join(" "));
        }
        return detected;
    }

    function getCardCategoryTokens(card) {
        return (card.getAttribute("data-category") || "")
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
    }

    function cardMatchesCategory(card, cat) {
        if (!cat) return true;
        var key = cat.toLowerCase();
        var tokens = getCardCategoryTokens(card);
        if (tokens.includes(key)) return true;

        var res = (card.getAttribute("data-resolution") || "").toLowerCase();
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

    function applyAllInRoot(root) {
        var scope = root || document;
        var cards = scope.querySelectorAll(".blog-card, .h-scroll-card");
        cards.forEach(applyAutoCategories);
        return cards.length;
    }

    window.darkProDetectCategories = detectCategories;
    window.darkProApplyAutoCategories = applyAutoCategories;
    window.darkProCardMatchesCategory = cardMatchesCategory;
    window.darkProApplyAllWallpaperCategories = applyAllInRoot;

    function boot() {
        applyAllInRoot(document);
        window.__wallpaperCategoriesReady = true;
        document.dispatchEvent(new CustomEvent("wallpaper-categories-ready"));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
