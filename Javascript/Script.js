/**
 * =============================================================================
 * DARK PRO WALLPAPERS — Script.js
 * Behaviour matches page sections (top → bottom):
 * 01 Navbar  05 Pagination  08 Detail view
 * 02 Reveal  06 Search      09 Downloads
 * 03 Scroll  07 Account
 * 04 Dropdown
 * =============================================================================
 */

        // ========== 01 NAVBAR SCROLL ==========zz
        const navbar = document.getElementById('navbar');
        if (navbar) {
            function updateNavbarOnScroll() {
                const inHeroScroll = document.body.classList.contains('hero-scroll-active');
                if (inHeroScroll) {
                    navbar.classList.remove('scrolled');
                    navbar.classList.add('default');
                    return;
                }
                if (window.scrollY > 30) {
                    navbar.classList.remove('default');
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                    navbar.classList.add('default');
                }
            }
            window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
            updateNavbarOnScroll();
        }



        // ========== 02 SCROLL REVEAL — cards fade in on scroll ==========
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.blog-card, .account-card, .latest-card');
            const revealCards = document.querySelectorAll('.reveal-card');
            function bindScrollReveal() {
                if (window.__scrollRevealBound) return;
                if (window.__darkProLenis) {
                    window.__darkProLenis.on("scroll", checkCards);
                    window.__scrollRevealBound = true;
                } else {
                    window.addEventListener("scroll", checkCards, { passive: true });
                    window.__scrollRevealBound = true;
                }
            }
            bindScrollReveal();
            window.addEventListener("darkpro-lenis-ready", bindScrollReveal);

            function checkCards() {
                const triggerBottom = window.innerHeight * 0.8;
                const cards = document.querySelectorAll(".blog-card, .account-card, .latest-card");
                cards.forEach(card => {
                    if (card.classList.contains("blog-card--paged-out")) return;
                    if (card.classList.contains("blog-card--search-hidden")) return;
                    const cardTop = card.getBoundingClientRect().top;
                    if (cardTop < triggerBottom) card.classList.add('show');
                    else card.classList.remove('show');
                });
                revealCards.forEach(card => {
                    const cardTop = card.getBoundingClientRect().top;
                    if (cardTop < triggerBottom) card.classList.add('show');
                    else card.classList.remove('show');
                });
            }
            checkCards();
            window.checkCards = checkCards;
        });

        // ========== SMOOTH SCROLL ==========
        function scrollToId(id) {
            const el = document.getElementById(id);
            if (!el) return;
            if (typeof window.darkProScrollTo === "function") {
                window.darkProScrollTo(el, { offset: -72, duration: 1.2 });
            } else {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }
        document.getElementById("home-btn")?.addEventListener("click", function(e) {
            e.preventDefault();
            closeWallpaperDetail();
            scrollToId("home-section");
        });
        document.getElementById("contact-btn")?.addEventListener("click", function(e) {
            e.preventDefault();
            closeWallpaperDetail();
            scrollToId("Contact-section");
        });
        document.getElementById("account-btn")?.addEventListener("click", function(e) {
            e.preventDefault();
            closeWallpaperDetail();
            scrollToId("account-section");
        });
        document.getElementById("nav-search-link")?.addEventListener("click", function(e) {
            e.preventDefault();
            closeWallpaperDetail();
            scrollToId("search-section");
            setTimeout(() => {
                const searchBox = document.getElementById("search-box");
                if (searchBox) searchBox.focus();
            }, 400);
        });

        // ========== NAVBAR SEARCH FORM ==========
        const navSearchForm = document.getElementById("nav-search-form");
        const navSearchInput = document.getElementById("nav-search-input");
        if (navSearchForm && navSearchInput) {
            navSearchForm.addEventListener("submit", function(e) {
                e.preventDefault();
                closeWallpaperDetail();
                const query = navSearchInput.value.trim();
                scrollToId("search-section");
                const searchBox = document.getElementById("search-box");
                if (searchBox) {
                    searchBox.value = query;
                    setTimeout(() => {
                        searchBox.focus();
                        performSearch(query);
                    }, 400);
                }
            });
        }

        // ========== DROPDOWN ==========
        function toggleDropdown() {
            const menu = document.getElementById("dropdownContent");
            if (!menu) return;
            const open = !menu.classList.contains("show");
            menu.classList.toggle("show", open);
            const btn = document.getElementById("categories-btn");
            if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
        }

        (function bindDropdownWheelScroll() {
            const menu = document.getElementById("dropdownContent");
            if (!menu) return;
            menu.setAttribute("data-lenis-prevent", "");
            menu.addEventListener(
                "wheel",
                function(e) {
                    if (!menu.classList.contains("show")) return;
                    const maxScroll = menu.scrollHeight - menu.clientHeight;
                    if (maxScroll <= 0) return;
                    e.stopPropagation();
                },
                { passive: true, capture: true }
            );
        })();
        window.toggleDropdown = toggleDropdown;

        window.addEventListener("click", function(event) {
            const btn = document.getElementById("categories-btn");
            const menu = document.getElementById("dropdownContent");
            if (!menu || !btn) return;
            if (btn.contains(event.target)) return;
            if (menu.contains(event.target)) return;
            menu.classList.remove("show");
            btn.setAttribute("aria-expanded", "false");
        });



        // ========== 05 GALLERY PAGINATION — #wallpaper-pagination ==========
        function getBlogCards() {
            return document.querySelectorAll("#blog-container .blog-card");
        }
        const WALLPAPERS_PER_PAGE = 16;
        const wallpaperSection = document.getElementById("wallpapers-section");
        const paginationNav = document.getElementById("wallpaper-pagination");
        let currentPage = 1;
        let totalPages = 1;
        let isSearchActive = false;

        function getAllVisibleCards() {
            return Array.from(getBlogCards()).filter(c => !c.classList.contains("blog-card--search-hidden"));
        }

        function getCardsForPagination() {
            return Array.from(getBlogCards());
        }

        function initPagination() {
            const list = getCardsForPagination();
            totalPages = Math.max(1, Math.ceil(list.length / WALLPAPERS_PER_PAGE));
            currentPage = 1;
            if (totalPages <= 1) {
                if (paginationNav) paginationNav.style.display = "none";
                list.forEach(c => { c.classList.remove("blog-card--paged-out");
                    c.classList.add("show"); });
            } else {
                if (paginationNav) paginationNav.style.display = "flex";
                buildPagination();
                syncCardsVisibility();
                updateNavState();
            }
        }

        function pageForIndex(i) { return Math.floor(i / WALLPAPERS_PER_PAGE) + 1; }

        function syncCardsVisibility() {
            if (isSearchActive) return;
            const list = getCardsForPagination();
            list.forEach((card, i) => {
                const hide = pageForIndex(i) !== currentPage;
                card.classList.toggle("blog-card--paged-out", hide);
                if (!hide && !card.classList.contains("blog-card--search-hidden")) card.classList.add(
                    "show");
            });
        }

        function updateNavState() {
            if (!paginationNav || isSearchActive) return;
            paginationNav.querySelectorAll(".wallpaper-page-btn").forEach(btn => {
                const p = parseInt(btn.getAttribute("data-page"), 10);
                btn.classList.toggle("is-active", p === currentPage);
                if (p === currentPage) btn.setAttribute("aria-current", "page");
                else btn.removeAttribute("aria-current");
            });
            const prevBtn = paginationNav.querySelector(".wallpaper-page-prev");
            const nextBtn = paginationNav.querySelector(".wallpaper-page-next");
            if (prevBtn) prevBtn.disabled = currentPage <= 1;
            if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
        }

        function goToPage(page) {
            if (isSearchActive) return;
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            syncCardsVisibility();
            updateNavState();
            wallpaperSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        function buildPagination() {
            if (!paginationNav) return;
            paginationNav.innerHTML = "";
            const prevBtn = document.createElement("button");
            prevBtn.type = "button";
            prevBtn.className = "wallpaper-page-arrow wallpaper-page-prev";
            prevBtn.setAttribute("aria-label", "Previous page");
            prevBtn.innerHTML = "&laquo;";
            prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
            paginationNav.appendChild(prevBtn);
            const strip = document.createElement("div");
            strip.className = "wallpaper-pagination-scroll";
            for (let p = 1; p <= totalPages; p++) {
                const b = document.createElement("button");
                b.type = "button";
                b.className = "wallpaper-page-btn";
                b.setAttribute("data-page", String(p));
                b.textContent = "Page " + p;
                b.addEventListener("click", () => goToPage(p));
                strip.appendChild(b);
            }
            paginationNav.appendChild(strip);
            const nextBtn = document.createElement("button");
            nextBtn.type = "button";
            nextBtn.className = "wallpaper-page-arrow wallpaper-page-next";
            nextBtn.setAttribute("aria-label", "Next page");
            nextBtn.innerHTML = "&raquo;";
            nextBtn.addEventListener("click", () => goToPage(currentPage + 1));
            paginationNav.appendChild(nextBtn);
        }

        function tryInitPagination() {
            if (paginationNav && wallpaperSection && getBlogCards().length) initPagination();
        }
        tryInitPagination();
        window.reinitPagination = tryInitPagination;

        document.addEventListener("wallpapers-catalog-ready", function() {
            tryInitPagination();
            if (typeof window.checkCards === "function") window.checkCards();
            preloadViewCounts();
            if (typeof window.reinitHorizontalScroll === "function") window.reinitHorizontalScroll();
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        });



        // ========== 06 LIVE SEARCH — #search-box & nav search ==========
        const searchBox = document.getElementById("search-box");
        const searchResultsBar = document.getElementById("search-results-bar");
        const searchResultsText = document.getElementById("search-results-text");
        const searchClearBtn = document.getElementById("search-clear-btn");
        const searchNoResults = document.getElementById("search-no-results");
        const blogContainer = document.getElementById("blog-container");

        function buildSearchTextForCard(card) {
            if (typeof window.darkProGetWallpaperSearchIndex === "function") {
                return window.darkProGetWallpaperSearchIndex(card);
            }
            const nameEl = card.querySelector(".wallpaper-name");
            const name = nameEl ? nameEl.textContent.trim() : "";
            const categories = (card.getAttribute("data-category") || "").trim();
            const imgEl = card.querySelector("img");
            const alt = imgEl ? (imgEl.alt || "") : "";
            const resolution = (card.getAttribute("data-resolution") || "").trim();
            const kindEl = card.querySelector(".wallpaper-kind");
            const kind = kindEl ? kindEl.textContent.trim() : "";
            const smart = (card.getAttribute("data-smart-index") || "").trim();
            return [name, categories, alt, resolution, kind, smart].join(" ").toLowerCase();
        }

        function buildSearchTextForLatestItem(item) {
            const labelEl = item.querySelector(".latest-wallpaper-label");
            const label = labelEl ? labelEl.textContent.trim() : "";
            const categories = (item.getAttribute("data-category") || "").trim();
            const imgEl = item.querySelector("img");
            const alt = imgEl ? (imgEl.alt || "") : "";
            const resolution = (item.getAttribute("data-resolution") || "").trim();
            return [label, categories, alt, resolution].join(" ").toLowerCase();
        }

        function performSearch(query) {
            const q = query.toLowerCase().trim();
            const allCards = Array.from(document.querySelectorAll(".blog-card"));
            let matchCount = 0;

            if (!q) {
                // Clear search
                isSearchActive = false;
                allCards.forEach(c => c.classList.remove("blog-card--search-hidden"));
                if (searchResultsBar) searchResultsBar.style.display = "none";
                if (searchNoResults) searchNoResults.style.display = "none";
                if (paginationNav) paginationNav.style.display = totalPages > 1 ? "flex" : "none";
                // Restore pagination
                initPagination();
                if (wallpaperSection) wallpaperSection.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }

            // Search active
            isSearchActive = true;
            if (paginationNav) paginationNav.style.display = "none";

            allCards.forEach(card => {
                const matched = typeof window.darkProMatchesWallpaper === "function"
                    ? window.darkProMatchesWallpaper(card, q)
                    : buildSearchTextForCard(card).includes(q);
                if (matched) {
                    card.classList.remove("blog-card--search-hidden");
                    card.classList.remove("blog-card--paged-out");
                    card.classList.add("show");
                    matchCount++;
                } else {
                    card.classList.add("blog-card--search-hidden");
                    card.classList.remove("blog-card--paged-out");
                }
            });

            // Update search results bar
            if (searchResultsBar && searchResultsText) {
                searchResultsBar.style.display = "flex";
                searchResultsText.textContent = matchCount + " wallpaper" + (matchCount !== 1 ? "s" : "") +
                    " found for \"" + query + "\"";
            }

            // Show/hide no results message
            if (searchNoResults) {
                searchNoResults.style.display = matchCount === 0 ? "block" : "none";
            }

            // Scroll to results
            if (wallpaperSection) wallpaperSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Debounce helper
        function debounce(fn, delay) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn.apply(this, args), delay);
            };
        }

        const debouncedSearch = debounce(function(query) {
            performSearch(query);
        }, 250);

        document.addEventListener("wallpaper-categories-ready", function() {
            if (isSearchActive && searchBox && searchBox.value.trim()) {
                performSearch(searchBox.value);
            }
            if (typeof window.checkCards === "function") window.checkCards();
        });

        if (searchBox) {
            searchBox.addEventListener("input", function() {
                const query = this.value;
                debouncedSearch(query);
            });
            searchBox.addEventListener("keydown", function(e) {
                if (e.key === "Escape") {
                    this.value = "";
                    performSearch("");
                }
            });
        }

        if (searchClearBtn) {
            searchClearBtn.addEventListener("click", function() {
                if (searchBox) searchBox.value = "";
                performSearch("");
                if (searchBox) searchBox.focus();
            });
        }

        // Quick search buttons
        document.querySelectorAll(".search-quick-btn").forEach(btn => {
            btn.addEventListener("click", function(e) {
                e.preventDefault();
                const searchTerm = this.getAttribute("data-search") || "";
                if (searchBox) {
                    searchBox.value = searchTerm;
                    performSearch(searchTerm);
                }
                scrollToId("search-section");
                setTimeout(() => {
                    if (searchBox) searchBox.focus();
                }, 300);
            });
        });

        // ========== BACK TO TOP ==========
        const topBtn = document.getElementById("topBtn");
        if (topBtn) {
            window.addEventListener("scroll", () => {
                topBtn.style.display = (document.body.scrollTop > 100 || document.documentElement.scrollTop >
                    100) ?
                    "block" : "none";
            });
            topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        }

        // ========== ACCOUNT TOGGLE (FIXED SLIDE ANIMATION) ==========
        const loginSlide = document.getElementById("login-slide");
        const registerSlide = document.getElementById("register-slide");
        const registerLink = document.getElementById("register");
        const backToLoginBtn = document.getElementById("back-to-login-btn");

        if (loginSlide && registerSlide && registerLink && backToLoginBtn) {
            registerLink.addEventListener("click", () => {
                loginSlide.classList.add("slide-out-left");
                registerSlide.classList.add("slide-in");
            });
            backToLoginBtn.addEventListener("click", () => {
                loginSlide.classList.remove("slide-out-left");
                registerSlide.classList.remove("slide-in");
            });
        }

        // ========== LOGIN STATE (premium wallpapers gate) ==========
        const LOGIN_KEY = "darkpro_logged_in";
        const premiumLoginModal = document.getElementById("premium-login-modal");
        const premiumLoginGoBtn = document.getElementById("premium-login-go-btn");
        let pendingPremiumAction = null;

        function isLoggedIn() {
            return localStorage.getItem(LOGIN_KEY) === "1";
        }

        function setLoggedIn(value) {
            if (value) localStorage.setItem(LOGIN_KEY, "1");
            else localStorage.removeItem(LOGIN_KEY);
        }

        function showPremiumLoginModal(onSuccess) {
            pendingPremiumAction = typeof onSuccess === "function" ? onSuccess : null;
            if (!premiumLoginModal) {
                if (confirm("Premium wallpapers ke liye login karein. Account section par jayein?")) {
                    closeWallpaperDetail();
                    scrollToId("account-section");
                }
                pendingPremiumAction = null;
                return;
            }
            premiumLoginModal.hidden = false;
            premiumLoginModal.setAttribute("aria-hidden", "false");
        }

        function hidePremiumLoginModal(clearPending) {
            if (!premiumLoginModal) return;
            premiumLoginModal.hidden = true;
            premiumLoginModal.setAttribute("aria-hidden", "true");
            if (clearPending !== false) pendingPremiumAction = null;
        }

        window.darkProIsLoggedIn = isLoggedIn;
        window.darkProRequireLogin = function(onSuccess) {
            if (isLoggedIn()) {
                if (typeof onSuccess === "function") onSuccess();
                return;
            }
            showPremiumLoginModal(onSuccess);
        };

        premiumLoginGoBtn?.addEventListener("click", function() {
            hidePremiumLoginModal(false);
            closeWallpaperDetail();
            scrollToId("account-section");
        });

        premiumLoginModal?.querySelectorAll("[data-premium-login-close]").forEach(function(el) {
            el.addEventListener("click", function() {
                hidePremiumLoginModal(true);
            });
        });

        document.querySelector(".login-submit-btn")?.addEventListener("click", function(e) {
            e.preventDefault();
            setLoggedIn(true);
            if (pendingPremiumAction) {
                const action = pendingPremiumAction;
                pendingPremiumAction = null;
                hidePremiumLoginModal(true);
                action();
            } else {
                hidePremiumLoginModal(true);
            }
        });

        document.querySelector(".register-submit-btn")?.addEventListener("click", function(e) {
            e.preventDefault();
            setLoggedIn(true);
            hidePremiumLoginModal();
        });



        // ========== 08 WALLPAPER DETAIL — full view overlay ==========
        const detailSection = document.getElementById("wallpaper-detail-section");
        const mainContentWrapper = document.getElementById("main-content-wrapper");
        const mainFooter = document.getElementById("main-footer");
        const heroScrollTrack = document.getElementById("hero-scroll-track");
        const detailImg = document.getElementById("detail-wallpaper-img");
        const detailName = document.getElementById("detail-wallpaper-name");
        const detailResolution = document.getElementById("detail-resolution");
        const detailCategories = document.getElementById("detail-categories");
        const detailType = document.getElementById("detail-type");
        const detailViewsEl = document.getElementById("detail-views");
        const detailViewsItem = document.getElementById("detail-views-item");
        const detailSmartTags = document.getElementById("detail-smart-tags");
        const relatedGrid = document.getElementById("related-wallpapers-grid");
        const relatedEmpty = document.getElementById("related-empty");
        const relatedSection = document.getElementById("related-wallpapers-section");
        const backToGalleryBtn = document.getElementById("back-to-gallery-btn");
        const downloadOriginalBtn = document.getElementById("detail-download-original");
        const downloadScreenBtn = document.getElementById("detail-download-screen");

        let currentDetailCard = null;
        let currentDetailSrc = "";
        let currentDetailName = "";
        let resolutionDetected = false;

        function slugify(s) {
            return String(s || "wallpaper").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
                "wallpaper";
        }

        function extFromUrl(url) {
            const m = String(url).match(/\.(jpe?g|png|webp)(\?.*)?$/i);
            return m ? "." + m[1].toLowerCase().replace("jpeg", "jpg") : ".jpg";
        }

        // If a local WebP version exists (same pixels, smaller size), prefer it for faster page load.
        // This is best-effort: if the WebP file doesn't exist, we fallback to the original src on error.
        function webpCandidateForUrl(url) {
            const s = String(url || "");
            let hash = "";
            let base = s;
            const hashIdx = s.indexOf("#");
            if (hashIdx >= 0) {
                hash = s.slice(hashIdx);
                base = s.slice(0, hashIdx);
            }

            let query = "";
            const qIdx = base.indexOf("?");
            if (qIdx >= 0) {
                query = base.slice(qIdx);
                base = base.slice(0, qIdx);
            }

            if (!/\.(png|jpe?g)$/i.test(base)) return null;
            return base.replace(/\.(png|jpe?g)$/i, ".webp") + query + hash;
        }

        function isLocalDarkProImageUrl(url) {
            return String(url || "").includes("/Dark pro/Images/");
        }

        function trySwapImgToWebp(imgEl) {
            if (!imgEl) return;
            if (imgEl.dataset.webpTried === "1") return;
            const srcAttr = imgEl.getAttribute("src");
            if (!srcAttr) return;
            if (!isLocalDarkProImageUrl(srcAttr)) return;
            const candidate = webpCandidateForUrl(srcAttr);
            if (!candidate || candidate === srcAttr) return;

            imgEl.dataset.webpTried = "1";
            imgEl.addEventListener(
                "error",
                function() {
                    imgEl.src = srcAttr; // fallback to original if WebP isn't available
                },
                { once: true }
            );
            imgEl.src = candidate;
        }

        // Upgrade visible gallery thumbnails to WebP (best-effort).
        document.querySelectorAll('img[src*="/Dark pro/Images/"]').forEach(trySwapImgToWebp);

        function getOriginalSrc(card) {
            const originalAttr = card.getAttribute("data-original-src");
            if (originalAttr) {
                if (originalAttr.startsWith("http") || originalAttr.startsWith("//")) return originalAttr;
                return window.location.origin + (originalAttr.startsWith("/") ? "" : "/") + originalAttr;
            }
            const thumb = card.querySelector(".image-wrapper img") || card.querySelector("img");
            if (thumb && thumb.src) return thumb.src;
            return null;
        }

        function getCardName(card) {
            const nameSpan = card.querySelector(".wallpaper-name");
            if (nameSpan && nameSpan.textContent.trim()) return nameSpan.textContent.trim();
            const hLabel = card.querySelector(".h-scroll-card__label");
            if (hLabel && hLabel.textContent.trim()) return hLabel.textContent.trim();
            const label = card.querySelector(".latest-wallpaper-label");
            if (label) {
                const t = label.textContent.trim();
                return t.replace(" · Wallpaper", "").replace("Wallpaper", "").trim();
            }
            const alt = card.querySelector("img");
            if (alt && alt.alt) return alt.alt.replace(" wallpaper preview", "").replace(" portrait", "").replace(
                " landscape", "").trim();
            return "Wallpaper";
        }

        function updateDetailSmartTags(card) {
            if (!detailSmartTags) return;
            const cat = getCardCategories(card);
            if (cat && cat.trim()) {
                detailSmartTags.textContent = cat.split(/\s+/).filter(Boolean).join(" · ");
                detailSmartTags.hidden = false;
            } else {
                detailSmartTags.textContent = "";
                detailSmartTags.hidden = true;
            }
        }

        function getCardResolution(card) {
            const res = card.getAttribute("data-resolution");
            if (res) return res;
            const img = card.querySelector("img");
            if (img && img.naturalWidth) return img.naturalWidth + " × " + img.naturalHeight;
            return "—";
        }

        function getCardCategories(card) {
            const cat = card.getAttribute("data-category");
            return cat ? cat.trim() : "";
        }

        function getAllWallpaperCards() {
            return Array.from(document.querySelectorAll(".blog-card"));
        }

        // ========== VIEW COUNTER (localStorage) ==========
        function getViewStorageKey(imageSrc) {
            // Create a stable key from the image URL
            let hash = 0;
            const str = String(imageSrc || "unknown");
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return 'wp_views_' + Math.abs(hash);
        }

        function getViewCount(imageSrc) {
            const key = getViewStorageKey(imageSrc);
            return parseInt(localStorage.getItem(key) || '0', 10);
        }

        function incrementViewCount(imageSrc) {
            const key = getViewStorageKey(imageSrc);
            const current = parseInt(localStorage.getItem(key) || '0', 10);
            const newCount = current + 1;
            localStorage.setItem(key, String(newCount));
            return newCount;
        }

        function updateViewDisplay(count) {
            if (detailViewsEl && detailViewsItem) {
                detailViewsEl.textContent = count;
                detailViewsItem.style.display = 'inline';
                // Add a subtle pulse animation
                detailViewsEl.style.transition = 'none';
                detailViewsEl.style.transform = 'scale(1.3)';
                detailViewsEl.style.color = '#7ef0ff';
                setTimeout(() => {
                    detailViewsEl.style.transition = 'all 0.4s ease';
                    detailViewsEl.style.transform = 'scale(1)';
                    detailViewsEl.style.color = '';
                }, 150);
            }
        }

        // ========== RESOLUTION DETECTION FROM ACTUAL IMAGE ==========
        function detectResolutionFromImage(imgEl) {
            if (!imgEl || !detailResolution) return;
            if (imgEl.naturalWidth > 0 && imgEl.naturalHeight > 0) {
                const detected = imgEl.naturalWidth + " × " + imgEl.naturalHeight;
                detailResolution.textContent = detected;
                resolutionDetected = true;
                // Also update the source card's data-resolution for future accuracy
                if (currentDetailCard) {
                    currentDetailCard.setAttribute('data-resolution', detected);
                }
            }
        }

        function setupResolutionDetection() {
            if (!detailImg) return;
            resolutionDetected = false;
            // If image is already loaded (cached), detect immediately
            if (detailImg.complete && detailImg.naturalWidth > 0) {
                detectResolutionFromImage(detailImg);
            } else {
                // Otherwise wait for load
                const onLoadHandler = function() {
                    detectResolutionFromImage(detailImg);
                    detailImg.removeEventListener('load', onLoadHandler);
                };
                detailImg.addEventListener('load', onLoadHandler);
                // Fallback: if image fails to load or takes too long, keep the data-resolution value
                const onErrorHandler = function() {
                    detailImg.removeEventListener('error', onErrorHandler);
                    // Keep the data-resolution fallback already set
                };
                detailImg.addEventListener('error', onErrorHandler);
            }
        }

        function findRelatedWallpapers(sourceCard, maxResults = 8) {
            const sourceCategories = getCardCategories(sourceCard).toLowerCase().split(/\s+/).filter(Boolean);
            const sourceSrc = getOriginalSrc(sourceCard);
            const allCards = getAllWallpaperCards();
            const scored = [];
            const seenSrcs = new Set();
            if (sourceSrc) seenSrcs.add(sourceSrc);

            allCards.forEach(card => {
                if (card === sourceCard) return;
                const cardSrc = getOriginalSrc(card);
                if (!cardSrc || seenSrcs.has(cardSrc)) return;
                seenSrcs.add(cardSrc);
                const cardCategories = getCardCategories(card).toLowerCase().split(/\s+/).filter(Boolean);
                let score = 0;
                sourceCategories.forEach(sc => {
                    if (cardCategories.includes(sc)) score += 2;
                    else {
                        cardCategories.forEach(cc => {
                            if (cc.includes(sc) || sc.includes(cc)) score += 1;
                        });
                    }
                });
                if (score > 0) scored.push({ card, score });
            });
            scored.sort((a, b) => b.score - a.score);
            return scored.slice(0, maxResults).map(item => item.card);
        }

        function findRelatedWallpapersFallback(sourceCard, maxResults = 6) {
            const sourceSrc = getOriginalSrc(sourceCard);
            const allCards = getAllWallpaperCards();
            const seenSrcs = new Set();
            if (sourceSrc) seenSrcs.add(sourceSrc);
            const result = [];
            for (const card of allCards) {
                if (card === sourceCard) continue;
                if (result.length >= maxResults) break;
                const cardSrc = getOriginalSrc(card);
                if (!cardSrc || seenSrcs.has(cardSrc)) continue;
                seenSrcs.add(cardSrc);
                result.push(card);
            }
            return result;
        }

        function renderRelatedWallpapers(relatedCards) {
            relatedGrid.innerHTML = "";
            if (!relatedCards || relatedCards.length === 0) {
                relatedEmpty.style.display = "block";
                relatedSection.style.display = "block";
                return;
            }
            relatedEmpty.style.display = "none";
            relatedSection.style.display = "block";
            relatedCards.forEach(card => {
                const thumbImg = card.querySelector(".image-wrapper img");
                const thumbSrc = thumbImg ? thumbImg.src : (card.querySelector("img") ? card.querySelector(
                    "img").src : "");
                const name = getCardName(card);
                const div = document.createElement("div");
                div.className = "related-wallpaper-card";
                div.innerHTML = `
                    <div class="related-img-wrap">
                        <img src="${thumbSrc}" alt="${name}" loading="lazy">
                    </div>
                    <p class="related-name">${name}</p>
                `;
                div.addEventListener("click", () => {
                    openWallpaperDetail(card);
                });
                div.setAttribute("tabindex", "0");
                div.setAttribute("role", "button");
                div.setAttribute("aria-label", "View " + name);
                div.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openWallpaperDetail(card);
                    }
                });
                relatedGrid.appendChild(div);
            });
        }

        function scrollToTopInstant() {
            if (window.__darkProLenis) {
                window.__darkProLenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
        }

        function openWallpaperDetail(card) {
            if (!card) return;
            currentDetailCard = card;
            const srcOriginal = getOriginalSrc(card);
            const name = getCardName(card);
            const resolution = getCardResolution(card);
            const categories = getCardCategories(card);
            currentDetailSrc = srcOriginal;
            currentDetailName = name;

            const srcWebp = webpCandidateForUrl(srcOriginal);
            if (srcWebp && srcWebp !== srcOriginal) {
                // Try WebP for faster viewing; if missing/unloadable, fallback to the original.
                detailImg.addEventListener(
                    "error",
                    function() {
                        detailImg.src = srcOriginal;
                    },
                    { once: true }
                );
                detailImg.src = srcWebp;
            } else {
                detailImg.src = srcOriginal;
            }
            detailImg.alt = name;
            detailName.textContent = name;
            detailResolution.textContent = resolution;
            detailCategories.textContent = categories || "—";
            const isPremium =
                card.classList?.contains("h-scroll-card--premium") ||
                card.getAttribute("data-premium") === "true";
            detailType.textContent = isPremium ? "Premium Wallpaper" : "Wallpaper";
            updateDetailSmartTags(card);

            setupResolutionDetection();

            const viewCount = incrementViewCount(srcOriginal);
            updateViewDisplay(viewCount);

            document.body.classList.add("wallpaper-detail-open");
            document.body.classList.remove("hero-scroll-active");
            if (mainContentWrapper) mainContentWrapper.style.display = "none";
            if (mainFooter) mainFooter.style.display = "none";
            if (heroScrollTrack) heroScrollTrack.style.visibility = "hidden";
            detailSection.style.display = "block";
            detailSection.setAttribute("aria-hidden", "false");
            detailSection.setAttribute("data-lenis-prevent", "");
            detailSection.scrollTop = 0;
            if (window.__darkProLenis) {
                window.__darkProLenis.stop();
            }
            if (!detailSection.dataset.wheelBound) {
                detailSection.addEventListener(
                    "wheel",
                    function(e) {
                        e.stopPropagation();
                    },
                    { passive: true }
                );
                detailSection.dataset.wheelBound = "1";
            }
            scrollToTopInstant();

            const related = findRelatedWallpapers(card, 8);
            if (related.length > 0) {
                renderRelatedWallpapers(related);
            } else {
                const fallback = findRelatedWallpapersFallback(card, 6);
                renderRelatedWallpapers(fallback);
            }
        }

        function closeWallpaperDetail() {
            if (detailSection.style.display === "none") return;
            detailSection.style.display = "none";
            detailSection.setAttribute("aria-hidden", "true");
            detailSection.removeAttribute("data-lenis-prevent");
            document.body.classList.remove("wallpaper-detail-open");
            if (mainContentWrapper) mainContentWrapper.style.display = "";
            if (mainFooter) mainFooter.style.display = "";
            if (heroScrollTrack) heroScrollTrack.style.visibility = "";
            if (window.__darkProLenis) {
                window.__darkProLenis.start();
            }
            currentDetailCard = null;
            currentDetailSrc = "";
            currentDetailName = "";
            resolutionDetected = false;
            document.body.style.overflow = "";
            if (detailSmartTags) {
                detailSmartTags.textContent = "";
                detailSmartTags.hidden = true;
            }
        }

        if (backToGalleryBtn) {
            backToGalleryBtn.addEventListener("click", closeWallpaperDetail);
        }

        async function downloadWallpaperDetail(resolutionType) {
            if (!currentDetailSrc) return;
            const name = slugify(currentDetailName);
            let ext = extFromUrl(currentDetailSrc);
            let filename = name + ext;
            try {
                let blob;
                if (resolutionType === "original") {
                    const response = await fetch(currentDetailSrc, { mode: "cors", cache: "force-cache" });
                    if (!response.ok) throw new Error("Failed to fetch");
                    blob = await response.blob();
                } else if (resolutionType === "screen") {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;
                    const response = await fetch(currentDetailSrc, { mode: "cors", cache: "force-cache" });
                    if (!response.ok) throw new Error("Failed to fetch");
                    const originalBlob = await response.blob();
                    const originalUrl = URL.createObjectURL(originalBlob);
                    try {
                        blob = await getScreenResizedBlob(originalUrl, screenWidth, screenHeight);
                        URL.revokeObjectURL(originalUrl);
                    } catch (err) {
                        URL.revokeObjectURL(originalUrl);
                        throw err;
                    }
                }
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = filename;
                a.rel = "noopener";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            } catch (error) {
                console.warn("Download failed, falling back to direct link:", error);
                const a = document.createElement("a");
                a.href = currentDetailSrc;
                a.download = filename;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }

        async function getScreenResizedBlob(originalUrl, screenWidth, screenHeight) {
            return new Promise((resolve, reject) => {
                const imgEl = new Image();
                imgEl.crossOrigin = "Anonymous";
                imgEl.onload = () => {
                    let width = imgEl.width;
                    let height = imgEl.height;
                    if (width > screenWidth) {
                        const ratio = screenWidth / width;
                        width = screenWidth;
                        height = Math.floor(height * ratio);
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(imgEl, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas to blob failed"));
                    }, "image/jpeg", 0.92);
                };
                imgEl.onerror = reject;
                imgEl.src = originalUrl;
            });
        }

        if (downloadOriginalBtn) {
            downloadOriginalBtn.addEventListener("click", (e) => {
                e.preventDefault();
                downloadWallpaperDetail("original");
            });
        }
        if (downloadScreenBtn) {
            downloadScreenBtn.addEventListener("click", (e) => {
                e.preventDefault();
                downloadWallpaperDetail("screen");
            });
        }

        // ========== OPEN GALLERY CARDS ON CLICK (no View button) ==========
        if (blogContainer) {
            blogContainer.addEventListener("click", function(e) {
                const card = e.target.closest(".blog-card");
                if (!card) return;
                if (card.classList.contains("blog-card--paged-out")) return;
                if (card.classList.contains("blog-card--search-hidden")) return;
                e.preventDefault();
                openWallpaperDetail(card);
            });
        }

        // Horizontal scroll cards (.h-scroll-card) — handled in scroll-horizontal.js
        window.openWallpaperDetail = openWallpaperDetail;
        window.closeWallpaperDetail = closeWallpaperDetail;

        // ========== ESCAPE KEY TO CLOSE DETAIL ==========
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && detailSection && detailSection.style.display !== "none") {
                closeWallpaperDetail();
            }
        });

        // ========== NAVBAR BRAND CLICK ALSO CLOSES DETAIL ==========
        document.getElementById("page-name")?.addEventListener("click", function(e) {
            if (detailSection && detailSection.style.display !== "none") {
                e.preventDefault();
                closeWallpaperDetail();
                scrollToId("home-section");
            }
        });

        // ========== INITIALIZE VIEW COUNTS ON CARDS (show existing views) ==========
        // This pre-loads view counts so they can be shown if needed
        function preloadViewCounts() {
            const allCards = getAllWallpaperCards();
            allCards.forEach(card => {
                const src = getOriginalSrc(card);
                if (src) {
                    const key = getViewStorageKey(src);
                    if (!localStorage.getItem(key)) {
                        localStorage.setItem(key, '0');
                    }
                }
            });
        }
        preloadViewCounts();

        console.log("✅ Dark Pro Wallpapers initialized successfully!");
        console.log("   - Resolution auto-detection: ACTIVE");
        console.log("   - Live search with auto-indexing: ACTIVE");
        console.log("   - View counter (localStorage): ACTIVE");