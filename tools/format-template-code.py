# One-time formatter: professional headers + 10-line gaps between sections
import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = "\n" * 10
z

def pad_before_sections(text, pattern, skip_first=True):
    matches = list(re.finditer(pattern, text))
    for i, m in enumerate(reversed(matches)):
        if skip_first and i == len(matches) - 1:
            continue
        pos = m.start()
        before = text[:pos]
        trail = len(before) - len(before.rstrip("\n"))
        if trail < 10:
            text = before + ("\n" * (10 - trail)) + text[pos:]
    return text


def format_css():
    path = os.path.join(ROOT, "CSS", "style.css")
    with open(path, "r", encoding="utf-8") as f:
        css = f.read()

    header = """/* =============================================================================
   DARK PRO WALLPAPERS — style.css
   Layout order (top to bottom on page):
   01 Global reset & scrollbar
   02 Navbar (fixed top)
   03 Fullscreen hero scroll (3D)
   04 Wallpaper gallery cards
   05 Search results bar & pagination
   06 Latest wallpapers strip
   07 Search section
   08 Account login / register
   09 Footer
   10 Back-to-top button
   11 Wallpaper detail overlay
   12 Mobile & small-screen tweaks
   ============================================================================= */

"""

    if "DARK PRO WALLPAPERS — style.css" not in css:
        css = header + css

    css = pad_before_sections(css, r"\n        /\* ==========", skip_first=True)

    mobile = """

        /* ========== MOBILE — MINIMUM WIDTH (320px+) ========== */
        @media (max-width: 360px) {
            #navbar {
                width: 100%;
                margin-left: 0;
                border-radius: 0;
                height: 64px;
            }
            #page-name {
                margin-left: 8%;
                max-width: 58vw;
            }
            .brand-tag {
                display: none;
            }
            .blog-container {
                --wallpaper-pad: 10px;
                --wallpaper-gap: 10px;
                grid-template-columns: 1fr;
            }
            .scroll-3d-scene .content {
                font-size: 1.25rem;
                letter-spacing: 0.06em;
                padding: 0 5vw;
            }
            .wallpaper-pagination-scroll {
                max-width: 72vw;
            }
            .account-slider-container {
                width: 94vw;
            }
            .search-box {
                width: min(92vw, 100%);
            }
            .footer-container {
                flex-direction: column;
                gap: 24px;
            }
        }
"""

    if "MOBILE — MINIMUM WIDTH" not in css:
        css = css.rstrip() + mobile

    with open(path, "w", encoding="utf-8") as f:
        f.write(css)


def format_script_js():
    path = os.path.join(ROOT, "Javascript", "Script.js")
    with open(path, "r", encoding="utf-8") as f:
        js = f.read()

    header = """/**
 * =============================================================================
 * DARK PRO WALLPAPERS — Script.js
 * Main site behaviour (matches visible sections on page):
 *   01 Navbar scroll state
 *   02 Scroll reveal animations
 *   03 Smooth scroll navigation
 *   04 Category dropdown
 *   05 Gallery pagination
 *   06 Live search
 *   07 Account login / register slider
 *   08 Wallpaper detail view & download
 *   09 View counter (localStorage)
 * =============================================================================
 */

"""

    if "DARK PRO WALLPAPERS — Script.js" not in js:
        js = header + js

    js = pad_before_sections(js, r"\n        // ==========", skip_first=True)

    with open(path, "w", encoding="utf-8") as f:
        f.write(js)


def format_scroll_3d():
    path = os.path.join(ROOT, "Javascript", "scroll-3d.js")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    header = """/**
 * =============================================================================
 * DARK PRO WALLPAPERS — scroll-3d.js
 * Fullscreen hero scroll (GSAP ScrollTrigger)
 *   • Pinned / fixed hero on Index & category pages
 *   • Image sequence from data-scroll-images
 *   • Site content scrolls over hero
 * =============================================================================
 */

"""

    if "scroll-3d.js" not in content[:400]:
        content = header + content

    content = pad_before_sections(content, r"\n    function ", skip_first=True)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def format_catalog():
    path = os.path.join(ROOT, "Javascript", "wallpapers-catalog.js")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    header = """/**
 * =============================================================================
 * DARK PRO WALLPAPERS — wallpapers-catalog.js
 * Single wallpaper source (Index.html #blog-container)
 *   • category.html loads & filters cards automatically
 *   • No duplicate cards per category page
 * =============================================================================
 */

"""

    if "wallpapers-catalog.js" not in content[:400]:
        content = header + content

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


if __name__ == "__main__":
    format_css()
    format_script_js()
    format_scroll_3d()
    format_catalog()
    print("Done")
