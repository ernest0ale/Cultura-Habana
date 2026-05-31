// ==================== LANDING COMMON - Funciones compartidas ====================

// Redirigir si ya hay sesión iniciada
function checkAndRedirectLanding(currentPage) {
    const usuario = getUsuarioActual();
    if (usuario) {
        const redirectMap = {
            'index': 'inicio.html',
            'calendarioLanding': 'calendario.html',
            'mapaLanding': 'mapa.html',
            'categoriaLanding': 'categoria.html',
            'busquedaLanding': 'busqueda.html',
            'detallesEventoLanding': 'detallesEvento.html',
            'eventosLanding': 'inicio.html'
        };
        const redirectTo = redirectMap[currentPage] || 'inicio.html';
        window.location.href = redirectTo;
        return true;
    }
    return false;
}

// Tema oscuro con actualización de iconos y logo
let isDarkModeLanding = localStorage.getItem('darkMode') === 'true';

function updateLandingIconsAndLogo() {
    const isDark = document.body.classList.contains('dark-mode');
    
    // Actualizar iconos del navbar
    const searchIcon = document.querySelector('#landingSearchTrigger img');
    const themeIcon = document.getElementById('landingThemeIcon');
    const menuIcon = document.querySelector('#landingMenuToggle img');
    
    if (searchIcon) {
        searchIcon.src = isDark ? 'resources/icons_dark/search.png' : 'resources/icons_light/search.png';
    }
    if (themeIcon) {
        themeIcon.src = isDark ? 'resources/icons_dark/sun.png' : 'resources/icons_light/moon.png';
    }
    if (menuIcon) {
        menuIcon.src = isDark ? 'resources/icons_dark/menu.png' : 'resources/icons_light/menu.png';
    }
    
    // Actualizar logo
    const logoImg = document.querySelector('.landing-logo img');
    if (logoImg) {
        logoImg.src = isDark ? 'resources/aguacero_cuba_darklogo_trasnparente.png' : 'resources/aguacero_cuba_logo_trasnparente.png';
    }
    
    // Actualizar iconos del sidebar móvil
    const sidebarLinks = document.querySelectorAll('.landing-sidebar-link img');
    sidebarLinks.forEach(img => {
        const src = img.src;
        if (src.includes('home-alt')) {
            img.src = isDark ? 'resources/icons_dark/home-alt.png' : 'resources/icons_light/home-alt.png';
        } else if (src.includes('price-tag-alt')) {
            img.src = isDark ? 'resources/icons_dark/price-tag-alt.png' : 'resources/icons_light/price-tag-alt.png';
        } else if (src.includes('chevron-down')) {
            img.src = isDark ? 'resources/icons_dark/chevron-down.png' : 'resources/icons_light/chevron-down.png';
        } else if (src.includes('calendar-alt')) {
            img.src = isDark ? 'resources/icons_dark/calendar-alt.png' : 'resources/icons_light/calendar-alt.png';
        } else if (src.includes('map')) {
            img.src = isDark ? 'resources/icons_dark/map.png' : 'resources/icons_light/map.png';
        }
    });
    
    // Actualizar iconos del dropdown de categorías
    const dropdownBtnIcon = document.querySelector('#landingCategoriesBtn img');
    if (dropdownBtnIcon && dropdownBtnIcon.src.includes('price-tag-alt')) {
        dropdownBtnIcon.src = isDark ? 'resources/icons_dark/price-tag-alt.png' : 'resources/icons_light/price-tag-alt.png';
    }
    
    const dropdownChevron = document.querySelector('#landingCategoriesBtn img:last-child');
    if (dropdownChevron && dropdownChevron.src.includes('chevron-down')) {
        dropdownChevron.src = isDark ? 'resources/icons_dark/chevron-down.png' : 'resources/icons_light/chevron-down.png';
    }
    
    // Actualizar iconos de navegación principal
    const navLinks = document.querySelectorAll('.landing-nav-link img');
    navLinks.forEach(img => {
        const src = img.src;
        if (src.includes('home-alt')) {
            img.src = isDark ? 'resources/icons_dark/home-alt.png' : 'resources/icons_light/home-alt.png';
        } else if (src.includes('calendar-alt')) {
            img.src = isDark ? 'resources/icons_dark/calendar-alt.png' : 'resources/icons_light/calendar-alt.png';
        } else if (src.includes('map')) {
            img.src = isDark ? 'resources/icons_dark/map.png' : 'resources/icons_light/map.png';
        }
    });
}

function initLandingTheme() {
    if (isDarkModeLanding) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    updateLandingIconsAndLogo();
    
    const themeBtn = document.getElementById('landingThemeBtn');
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            isDarkModeLanding = !isDarkModeLanding;
            localStorage.setItem('darkMode', isDarkModeLanding);
            if (isDarkModeLanding) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            updateLandingIconsAndLogo();
            
            // Actualizar mapa si existe
            if (typeof window.updateMapTheme === 'function') {
                window.updateMapTheme();
            }
            if (typeof window.cargarMarcadores === 'function') {
                window.cargarMarcadores();
            }
        });
    }
}

// Inicializar buscador con overlay
function initLandingSearch() {
    const searchTrigger = document.getElementById('landingSearchTrigger');
    if (!searchTrigger) return;
    
    if (!document.querySelector('.landing-search-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-search-overlay';
        overlay.id = 'landingSearchOverlay';
        overlay.innerHTML = `
            <div class="mobile-search-container">
                <div class="mobile-search-bar">
                    <input type="text" id="landing-search-input" placeholder="Buscar eventos...">
                    <button class="mobile-search-btn" id="landing-search-submit">
                        <img id="landingSearchBtnIcon" src="resources/icons_dark/search.png" alt="buscar">
                    </button>
                    <button class="mobile-search-close" id="landing-search-close">
                        <img id="landingSearchCloseIcon" src="resources/icons_light/icon_x.png" alt="cerrar">
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        const searchInput = document.getElementById('landing-search-input');
        const searchSubmit = document.getElementById('landing-search-submit');
        const searchClose = document.getElementById('landing-search-close');
        const closeIcon = document.getElementById('landingSearchCloseIcon');
        const searchBtnIcon = document.getElementById('landingSearchBtnIcon');
        
        function realizarBusqueda() {
            const termino = searchInput.value.trim();
            if (termino) {
                window.location.href = `busquedaLanding.html?q=${encodeURIComponent(termino)}`;
            } else {
                overlay.classList.remove('active');
            }
        }
        
        searchSubmit?.addEventListener('click', realizarBusqueda);
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') realizarBusqueda();
        });
        searchClose?.addEventListener('click', () => overlay.classList.remove('active'));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
        
        function updateSearchIcons() {
            const isDark = document.body.classList.contains('dark-mode');
            if (closeIcon) {
                closeIcon.src = isDark ? 'resources/icons_dark/icon_x.png' : 'resources/icons_light/icon_x.png';
            }
            if (searchBtnIcon) {
                searchBtnIcon.src = 'resources/icons_dark/search.png';
            }
        }
        
        const observer = new MutationObserver(updateSearchIcons);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        updateSearchIcons();
        
        window.landingSearchOverlay = overlay;
    }
    
    searchTrigger.addEventListener('click', () => {
        window.landingSearchOverlay.classList.add('active');
        setTimeout(() => {
            const input = document.getElementById('landing-search-input');
            if (input) input.focus();
        }, 100);
    });
}

// Inicializar dropdown de categorías
function initLandingCategories() {
    const dropdownBtn = document.getElementById('landingCategoriesBtn');
    const dropdown = document.getElementById('landingCategoriesDropdown');
    
    if (dropdownBtn && dropdown) {
        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
        
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }
    
    document.querySelectorAll('.landing-dropdown-content a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = link.getAttribute('data-categoria');
            if (categoria) {
                window.location.href = `categoriaLanding.html?nombre=${encodeURIComponent(categoria)}`;
            }
        });
    });
}

// Inicializar menú lateral móvil
function initLandingMobileMenu() {
    const menuToggle = document.getElementById('landingMenuToggle');
    const sidebar = document.getElementById('landingSidebar');
    const sidebarClose = document.getElementById('landingSidebarClose');
    const overlay = document.getElementById('landingSidebarOverlay');
    
    if (!menuToggle || !sidebar) return;
    
    function openMenu() {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    menuToggle.addEventListener('click', openMenu);
    if (sidebarClose) sidebarClose.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    const sidebarDropdownBtn = document.getElementById('landingSidebarCategoriesBtn');
    const sidebarDropdown = document.getElementById('landingSidebarCategoriesDropdown');
    
    if (sidebarDropdownBtn && sidebarDropdown) {
        sidebarDropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarDropdown.classList.toggle('open');
        });
    }
    
    document.querySelectorAll('.landing-sidebar-dropdown a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = link.getAttribute('data-categoria');
            if (categoria) {
                window.location.href = `categoriaLanding.html?nombre=${encodeURIComponent(categoria)}`;
            }
        });
    });
}

// ==================== FILTROS MÓVIL ====================
function initMobileFilters() {
    if (!document.querySelector('.mobile-filters-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-filters-overlay';
        overlay.id = 'mobileFiltersOverlay';
        overlay.innerHTML = `
            <div class="mobile-filters-panel">
                <div class="mobile-filters-header">
                    <h3>Filtros</h3>
                    <button id="mobileFiltersClose" class="mobile-filters-close">
                        <img id="mobileFiltersCloseIcon" src="resources/icons_light/icon_x.png" alt="cerrar">
                    </button>
                </div>
                <div class="mobile-filters-content" id="mobileFiltersContent"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        const closeBtn = document.getElementById('mobileFiltersClose');
        const closeIcon = document.getElementById('mobileFiltersCloseIcon');
        
        function updateCloseIcon() {
            const isDark = document.body.classList.contains('dark-mode');
            if (closeIcon) {
                closeIcon.src = isDark ? 'resources/icons_dark/icon_x.png' : 'resources/icons_light/icon_x.png';
            }
        }
        
        const observer = new MutationObserver(updateCloseIcon);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        updateCloseIcon();
        
        closeBtn?.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        window.mobileFiltersOverlay = overlay;
    }
    
    const filterBtn = document.getElementById('mobileFilterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const filtersContent = document.querySelector('.filters-sidebar');
            const mobileContent = document.getElementById('mobileFiltersContent');
            if (filtersContent && mobileContent) {
                mobileContent.innerHTML = filtersContent.cloneNode(true).innerHTML;
                
                const ordenador = document.querySelector('.resultados-orden');
                if (ordenador && !mobileContent.querySelector('.resultados-orden-clone')) {
                    const ordenadorClone = ordenador.cloneNode(true);
                    ordenadorClone.classList.add('resultados-orden-clone');
                    ordenadorClone.style.marginBottom = '1rem';
                    ordenadorClone.style.paddingBottom = '0.5rem';
                    ordenadorClone.style.borderBottom = '1px solid var(--color-border)';
                    mobileContent.insertBefore(ordenadorClone, mobileContent.firstChild);
                }
                
                reinitializeFilterEvents();
            }
            window.mobileFiltersOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
}

function reinitializeFilterEvents() {
    const ordenSelect = document.getElementById('orden-eventos');
    const mobileOrdenSelect = document.querySelector('#mobileFiltersContent #orden-eventos');
    if (ordenSelect && mobileOrdenSelect) {
        mobileOrdenSelect.addEventListener('change', () => {
            ordenSelect.value = mobileOrdenSelect.value;
            ordenSelect.dispatchEvent(new Event('change'));
        });
    }
    
    document.querySelectorAll('#mobileFiltersContent .filtro-categoria').forEach(cb => {
        cb.addEventListener('change', () => {
            const originalCb = document.querySelector(`.filters-sidebar .filtro-categoria[value="${cb.value}"]`);
            if (originalCb) originalCb.checked = cb.checked;
            originalCb?.dispatchEvent(new Event('change'));
        });
    });
    
    document.querySelectorAll('#mobileFiltersContent input[type="date"]').forEach(input => {
        input.addEventListener('change', () => {
            const originalInput = document.querySelector(`.filters-sidebar #${input.id}`);
            if (originalInput) originalInput.value = input.value;
            originalInput?.dispatchEvent(new Event('change'));
        });
    });
    
    const modoSelect = document.getElementById('modo-fecha');
    const mobileModoSelect = document.querySelector('#mobileFiltersContent #modo-fecha');
    if (modoSelect && mobileModoSelect) {
        mobileModoSelect.addEventListener('change', () => {
            modoSelect.value = mobileModoSelect.value;
            modoSelect.dispatchEvent(new Event('change'));
        });
    }
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
    const pageName = document.body.getAttribute('data-page') || 'index';
    if (checkAndRedirectLanding(pageName)) return;
    
    initLandingTheme();
    initLandingSearch();
    initLandingCategories();
    initLandingMobileMenu();
    initMobileFilters();
});