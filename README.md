# Dark Pro — Premium HD & 4K Wallpapers Gallery Template

A professional, production-ready HTML wallpaper gallery template with cinematic animations, advanced filtering, search functionality, and responsive design. Perfect for wallpaper marketplaces, photography portfolios, and digital asset platforms.

---

## 📋 Features Overview

### Core Features (Small → Large)

#### 1. **Responsive Mobile Navigation** 🎯
- Fixed navbar with smooth scroll behavior
- Mobile hamburger menu with collapse animation
- Desktop dropdown menu for categories
- Search icon trigger for mobile devices
- Responsive layout for 320px+ screens

#### 2. **Custom Scrollbar Styling** 🔧
- Modern thin scrollbar (6px width)
- Semi-transparent thumb with hover effect
- Dark theme compatible styling

#### 3. **Lazy Loading Images** ⚡
- `loading="lazy"` attribute on all wallpaper images
- Improves page load performance
- Progressive image rendering

#### 4. **Smooth Scroll Anchors** 🎨
- Smooth scroll navigation to page sections
- Support for reduced motion preferences
- Native smooth behavior with GSAP integration

#### 5. **Scroll Reveal Animations** 🎬
- Cards fade in as they enter viewport
- Multiple card types support (blog, account, latest)
- Scroll-triggered reveal effects
- Smooth appear/disappear transitions

#### 6. **Advanced Smooth Scrolling** 🌊
- **Lenis integration** for buttery-smooth page scrolling
- **GSAP ScrollTrigger sync** for animation timing
- Configurable lerp (0.085) for silky feel
- Wheel and touch multipliers for optimal control
- Respects `prefers-reduced-motion` for accessibility

#### 7. **Fullscreen Search Bar** 🔍
- Fixed search section on page
- Real-time search filtering across all wallpapers
- Search results info bar with result count
- Clear search button to reset filters
- Desktop form + mobile search trigger
- Autocomplete-enabled input field

#### 8. **Dynamic Search Functionality** 🎯
- Filter wallpapers by name and keywords
- Live results across all categories
- Search result visibility toggle
- Hidden search results in pagination view

#### 9. **Intelligent Pagination System** 📖
- 8 wallpapers per page layout
- Previous/Next page navigation
- Page state tracking and management
- Automatic pagination on category filter
- Paged-out card state handling

#### 10. **Smart Category Filtering** 🏷️
- **24+ Wallpaper Categories**:
  - Resolution-based: 4K & Ultra HD, 8K, HD (1080p)
  - Device-specific: Mobile & Phone, Dual / Ultrawide
  - Nature: Nature & Landscapes, Ocean & Beaches, Flowers & Macro, Seasons
  - Abstract & Artistic: Abstract, Minimal, Dark & AMOLED, Aesthetic & Vaporwave, Black & White
  - Entertainment: Gaming, Anime & Manga, Superheroes & Movies, Fantasy & Digital Art
  - Special: Space & Galaxy, City & Architecture, Animals & Wildlife, Cars & Bikes, Sports, Quotes & Typography
- Multi-category tagging per wallpaper
- Dynamic URL-based filtering (`?cat=gaming`)
- Category pages with same layout as home
- Automatic category synchronization (no duplicate HTML)

#### 11. **Wallpaper Gallery Grid** 🖼️
- Responsive card grid layout
- Individual card styling with hover effects
- Social panel with View button
- Wallpaper name and resolution display
- Image wrapper with lazy loading
- Accessibility labels for images

#### 12. **Wallpaper Detail Overlay** 👁️
- Fullscreen wallpaper preview
- Display wallpaper resolution and title
- Download/View button integration
- Close button with modal behavior
- Overlay navigation support
- Detail view triggered from any card

#### 13. **Latest Wallpapers Carousel** 🎪
- Horizontal scroll strip for latest additions
- Continuous auto-scroll animation
- Mouse drag interaction support
- Touch swipe support for mobile
- Duplicate strip for infinite loop effect
- Portrait-optimized layout

#### 14. **Premium Wallpapers Carousel** ✨
- Second horizontal scroll strip
- Premium wallpaper highlighting
- Landscape-optimized display
- Same drag/touch interactions as Latest
- Separate data-driven content

#### 15. **Horizontal Scroll Interactions** 🎯
- Smooth drag-to-scroll functionality
- Momentum scrolling simulation
- Mouse wheel support in carousel
- Touch swipe for mobile devices
- Card click to open detail view
- Reduced motion support for animations

#### 16. **Account Section (Ready)** 👤
- Dedicated account forms area
- Account card styling
- Scroll reveal animations
- Placeholder for login/profile features

#### 17. **Contact/Features Section** 📞
- Separate section for features showcase
- Scroll navigation from navbar
- Dedicated area for template information

#### 18. **Back-to-Top Button** ⬆️
- Fixed position button at bottom
- Smooth scroll to top functionality
- Visibility toggle on scroll

#### 19. **Cinematic 3D Hero Scroll** 🎬
- **Fullscreen hero scroll with 6 sequential images**
- GSAP ScrollTrigger powered 3D animations
- Image sequence trigger on page scroll
- "Visual Excellence" content overlay
- Covers entire screen at page load
- Main content scrolls over hero
- Hero scroll active detection
- Navbar style changes during hero display

#### 20. **Accessibility Features** ♿
- ARIA labels on buttons and navigation
- Semantic HTML structure
- Alt text on all images
- Role attributes for dropdowns and menus
- Keyboard navigation support
- Skip-to-content functionality ready
- Sr-only (screen reader only) text support

#### 21. **Modern Dark Theme Design** 🌙
- Dark background (#2d3137)
- Light text with high contrast
- Semi-transparent backdrop filters
- Blur effects (20px) on navbar
- Smooth color transitions
- Hover state effects
- Premium visual appearance

#### 22. **Bootstrap 4 Integration** 🎨
- Responsive grid system
- Built-in utility classes
- Mobile-first breakpoints
- Form components
- Navbar components
- Collapse animations

#### 23. **Complete File Organization** 📁
- Clean, logical file structure
- Code comments matching visual order
- Numbered sections for easy reference
- Modular JavaScript files
- Organized CSS with logical grouping
- Separate tools folder for utilities

#### 24. **Modern Browser Compatibility** 🌐
- Chrome & Chromium-based browsers
- Mozilla Firefox
- Safari (desktop & mobile)
- Microsoft Edge
- CSS Grid & Flexbox support
- Modern JavaScript (ES6+)
- CDN-based asset delivery

#### 25. **Full-Featured Template System** 🚀
- Single source of wallpaper data (Index.html)
- Category pages auto-load from main gallery
- No duplicate card HTML needed
- Dynamic wallpaper catalog system
- Zero manual category page editing
- Scalable wallpaper management

---

## 🚀 Getting Started

### Installation

1. **Extract the template** to your project folder
2. **Open in VS Code** with Live Server extension
3. **Run locally** using Live Server (fetch requires HTTP, not file://)
4. **Customize** branding, colors, and add wallpapers

### Add Wallpapers (Easy One-Place System)

Edit **`Index.html`** → Find `#blog-container` → Add or modify `.blog-card` blocks:

```html
<div class="blog-card" 
     data-category="gaming cars" 
     data-resolution="3840 × 2160" 
     data-original-src="https://your-image-url.jpg">
    <div class="image-wrapper" tabindex="0">
        <img src="https://your-image-url.jpg" alt="Wallpaper description" loading="lazy">
        <div class="social-panel">
            <button type="button" class="view-wallpaper-btn">View</button>
        </div>
    </div>
    <a href="#" class="wallpaper-card-link">
        <p class="wallpaper-line">
            <span class="wallpaper-name">Wallpaper Name</span>
            <span class="wallpaper-sep"> </span>
            <span class="wallpaper-kind">Category Tag</span>
        </p>
    </a>
</div>
```

**Category pages update automatically** — No need to edit separate category HTML files.

### Customize Categories

Edit the dropdown in navbar → Add/remove categories:

```html
<a href="category.html?cat=your-category" class="drop-menu">Your Category</a>
```

Then tag wallpapers with `data-category="your-category"` in Index.html.

---

## 📂 File Structure

```
Dark Pro/
├── Index.html                 # Home page (hero + full gallery)
├── category.html              # Category filtered view
├── README.md                  # This file
│
├── CSS/
│   └── style.css              # All styles (sections 00-11)
│
├── Javascript/
│   ├── Script.js              # Core functionality (navbar, search, pagination, detail)
│   ├── scroll-3d.js           # 3D hero scroll with GSAP
│   ├── scroll-horizontal.js   # Carousel drag/scroll
│   ├── smooth-scroll.js       # Lenis smooth scroll + ScrollTrigger
│   ├── wallpapers-catalog.js  # Category page loader
│   └── wallpaper-categories.js# Category management
│
├── Icons/                     # Icon assets folder
├── Screenshot/               # Screenshot folder for documentation
└── tools/
    ├── convert-images-to-webp.ps1  # PowerShell image converter
    └── format-template-code.py      # Python code formatter
```

---

## 🎨 Customization Guide

### Change Color Scheme
Edit `CSS/style.css` → Line 1 (Global reset) → Modify `body { background-color: }`

### Change Logo/Branding
1. Update navbar brand image in `Index.html` line ~40
2. Change title text in `<meta name="title">`
3. Replace favicon link with your own

### Enable/Disable Features
- Hero scroll: Remove `#hero-scroll-track` div in Index.html
- Search: Remove `#search-section` and its functionality
- Carousels: Remove `.h-scroll-track` divs

### Add Custom Categories
1. Add new link in navbar dropdown (both Index.html & category.html)
2. Tag wallpapers with the category name in `data-category`
3. No additional files needed!

---

## ⚙️ Technical Details

### Dependencies & Libraries
- **Bootstrap 4.4.1** - Responsive grid & components
- **jQuery 3.4.1** - DOM manipulation
- **Popper.js 1.16.0** - Positioning library
- **GSAP** - Advanced animations (ScrollTrigger included)
- **Lenis** - Smooth scroll library
- **SVG Icons** - Lightweight icon system

### JavaScript Modules
- **Script.js** - Navigation, search, pagination, detail view
- **scroll-3d.js** - 3D hero sequence animation
- **scroll-horizontal.js** - Carousel drag/swipe
- **smooth-scroll.js** - Lenis integration
- **wallpapers-catalog.js** - Dynamic content loading

### CSS Structure
- Sections numbered 00-11 matching visual order
- Mobile-first responsive design
- Semantic CSS classes
- CSS Grid & Flexbox layouts
- Smooth transitions & animations
- Dark theme optimized

### Performance
- Lazy image loading
- Optimized scrollbar
- Efficient event listeners
- Passive scroll events
- Prefers-reduced-motion support

---

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Full | Latest versions |
| Firefox | ✅ Full | Latest versions |
| Safari | ✅ Full | Modern versions (CSS Grid support required) |
| Mobile Chrome | ✅ Full | Responsive, touch optimized |
| Mobile Safari | ✅ Full | iOS 12+ recommended |

---

## 📋 Checklist for Selling/Publishing

Before selling or publishing this template:

- [ ] Replace footer branding with your own
- [ ] Update license information
- [ ] Remove sample wallpapers if needed
- [ ] Test on multiple browsers
- [ ] Verify all links work correctly
- [ ] Update meta tags for SEO
- [ ] Test responsive design on mobile devices
- [ ] Optimize image sizes
- [ ] Set up CDN for images if needed
- [ ] Add Terms of Service page
- [ ] Create documentation for buyers

---

## 🔧 Utilities

### Image Optimization
Use the included PowerShell script to convert images to WebP:
```powershell
.\tools\convert-images-to-webp.ps1
```

### Code Formatting
Use the Python formatter for consistent code style:
```bash
python tools/format-template-code.py
```

---

## 📝 License & Usage

This template is provided as-is for commercial and personal use.

**Before resale:** Replace all branding elements, update footer information, and add your own copyright notice.

---

## 💡 Tips for Best Results

1. **Image Quality**: Use 3840×2160 (4K) or higher for hero scroll
2. **Category Tags**: Use consistent, simple names (no spaces)
3. **Performance**: Serve images from CDN for faster loading
4. **Customization**: Modify CSS instead of HTML for easier updates
5. **Mobile Testing**: Always test on real devices
6. **SEO**: Add proper meta descriptions and keywords

---

## 🤝 Support & Documentation

For detailed setup instructions and advanced customization, refer to:
- `CSS/style.css` - Code comments explain each section
- `Javascript/Script.js` - Behavior functions documented
- HTML comments in `Index.html` - Layout structure explained

---

**Version**: 1.0  
**Last Updated**: 2024  
**Type**: HTML Template (No build step required)  
**License**: Commercial Use Allowed (Update branding before resale)
