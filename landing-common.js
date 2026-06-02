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
    
    const menuIcon = document.querySelector('#landingMenuToggle img');
    if (menuIcon) {
        menuIcon.src = isDark ? 'resources/icons_dark/menu.png' : 'resources/icons_light/menu.png';
    }
    
    const logoImg = document.querySelector('.landing-logo img.landing-logo-light');
    if (logoImg) {
        logoImg.src = isDark ? 'resources/aguacero_cuba_darklogo_trasnparente.png' : 'resources/aguacero_cuba_logo_trasnparente.png';
    }
    
    const searchIcon = document.querySelector('#landingSearchTrigger img');
    if (searchIcon) {
        searchIcon.src = isDark ? 'resources/icons_dark/search.png' : 'resources/icons_light/search.png';
    }
    
    const themeIcon = document.getElementById('landingThemeIcon');
    if (themeIcon) {
        themeIcon.src = isDark ? 'resources/icons_dark/sun.png' : 'resources/icons_light/moon.png';
    }
    
    document.querySelectorAll('.landing-sidebar-link img').forEach(img => {
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
    
    const categoryIcon = document.querySelector('#landingCategoriesBtn img:first-child');
    if (categoryIcon && categoryIcon.src && categoryIcon.src.includes('price-tag-alt')) {
        categoryIcon.src = isDark ? 'resources/icons_dark/price-tag-alt.png' : 'resources/icons_light/price-tag-alt.png';
    }
    
    const chevronIcon = document.querySelector('#landingCategoriesBtn img:last-child');
    if (chevronIcon && chevronIcon.src && chevronIcon.src.includes('chevron-down')) {
        chevronIcon.src = isDark ? 'resources/icons_dark/chevron-down.png' : 'resources/icons_light/chevron-down.png';
    }
    
    document.querySelectorAll('.landing-nav-link img').forEach(img => {
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
            
            if (typeof window.updateMapTheme === 'function') {
                window.updateMapTheme();
            }
            if (typeof window.cargarMarcadores === 'function') {
                window.cargarMarcadores();
            }
        });
    }
}

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

// ==================== VARIABLES GLOBALES PARA FILTROS ====================
let originalFilterState = {};

function saveOriginalFilterState() {
    originalFilterState = {};
    
    const categorias = document.querySelectorAll('.filters-sidebar .filtro-categoria');
    categorias.forEach(cb => {
        originalFilterState[`cat_${cb.value}`] = cb.checked;
    });
    
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    if (fechaInicio) originalFilterState.fechaInicio = fechaInicio.value;
    if (fechaFin) originalFilterState.fechaFin = fechaFin.value;
    
    const fechaEspecifica = document.getElementById('fecha-especifica');
    const fechaInicioRango = document.getElementById('fecha-inicio-rango');
    const fechaFinRango = document.getElementById('fecha-fin-rango');
    const modoFecha = document.getElementById('modo-fecha');
    const aptoMenores = document.getElementById('filtro-apto-menores');
    const aireLibre = document.getElementById('filtro-aire-libre');
    
    if (fechaEspecifica) originalFilterState.fechaEspecifica = fechaEspecifica.value;
    if (fechaInicioRango) originalFilterState.fechaInicioRango = fechaInicioRango.value;
    if (fechaFinRango) originalFilterState.fechaFinRango = fechaFinRango.value;
    if (modoFecha) originalFilterState.modoFecha = modoFecha.value;
    if (aptoMenores) originalFilterState.aptoMenores = aptoMenores.checked;
    if (aireLibre) originalFilterState.aireLibre = aireLibre.checked;
}

function syncOriginalToMobile() {
    const mobileCategorias = document.querySelectorAll('#mobileFiltersContent .filtro-categoria');
    mobileCategorias.forEach(cb => {
        const originalValue = originalFilterState[`cat_${cb.value}`];
        if (originalValue !== undefined) cb.checked = originalValue;
    });
    
    const mobileFechaInicio = document.querySelector('#mobileFiltersContent #fecha-inicio');
    const mobileFechaFin = document.querySelector('#mobileFiltersContent #fecha-fin');
    if (mobileFechaInicio && originalFilterState.fechaInicio !== undefined) mobileFechaInicio.value = originalFilterState.fechaInicio;
    if (mobileFechaFin && originalFilterState.fechaFin !== undefined) mobileFechaFin.value = originalFilterState.fechaFin;
    
    const mobileFechaEspecifica = document.querySelector('#mobileFiltersContent #fecha-especifica');
    const mobileFechaInicioRango = document.querySelector('#mobileFiltersContent #fecha-inicio-rango');
    const mobileFechaFinRango = document.querySelector('#mobileFiltersContent #fecha-fin-rango');
    const mobileModoFecha = document.querySelector('#mobileFiltersContent #modo-fecha');
    const mobileApto = document.querySelector('#mobileFiltersContent #filtro-apto-menores');
    const mobileAire = document.querySelector('#mobileFiltersContent #filtro-aire-libre');
    
    if (mobileFechaEspecifica && originalFilterState.fechaEspecifica !== undefined) mobileFechaEspecifica.value = originalFilterState.fechaEspecifica;
    if (mobileFechaInicioRango && originalFilterState.fechaInicioRango !== undefined) mobileFechaInicioRango.value = originalFilterState.fechaInicioRango;
    if (mobileFechaFinRango && originalFilterState.fechaFinRango !== undefined) mobileFechaFinRango.value = originalFilterState.fechaFinRango;
    if (mobileModoFecha && originalFilterState.modoFecha !== undefined) mobileModoFecha.value = originalFilterState.modoFecha;
    if (mobileApto && originalFilterState.aptoMenores !== undefined) mobileApto.checked = originalFilterState.aptoMenores;
    if (mobileAire && originalFilterState.aireLibre !== undefined) mobileAire.checked = originalFilterState.aireLibre;
    
    if (mobileModoFecha) mobileModoFecha.dispatchEvent(new Event('change'));
}

function syncMobileFiltersToOriginal() {
    const mobileCategorias = document.querySelectorAll('#mobileFiltersContent .filtro-categoria');
    mobileCategorias.forEach(cb => {
        const originalCb = document.querySelector(`.filters-sidebar .filtro-categoria[value="${cb.value}"]`);
        if (originalCb && originalCb.checked !== cb.checked) {
            originalCb.checked = cb.checked;
            originalCb.dispatchEvent(new Event('change'));
        }
    });
    
    const mobileFechaInicio = document.querySelector('#mobileFiltersContent #fecha-inicio');
    const mobileFechaFin = document.querySelector('#mobileFiltersContent #fecha-fin');
    const originalFechaInicio = document.getElementById('fecha-inicio');
    const originalFechaFin = document.getElementById('fecha-fin');
    
    if (mobileFechaInicio && originalFechaInicio && originalFechaInicio.value !== mobileFechaInicio.value) {
        originalFechaInicio.value = mobileFechaInicio.value;
        originalFechaInicio.dispatchEvent(new Event('change'));
    }
    if (mobileFechaFin && originalFechaFin && originalFechaFin.value !== mobileFechaFin.value) {
        originalFechaFin.value = mobileFechaFin.value;
        originalFechaFin.dispatchEvent(new Event('change'));
    }
    
    const mobileFechaEspecifica = document.querySelector('#mobileFiltersContent #fecha-especifica');
    const mobileFechaInicioRango = document.querySelector('#mobileFiltersContent #fecha-inicio-rango');
    const mobileFechaFinRango = document.querySelector('#mobileFiltersContent #fecha-fin-rango');
    const mobileModoFecha = document.querySelector('#mobileFiltersContent #modo-fecha');
    
    const originalFechaEspecifica = document.getElementById('fecha-especifica');
    const originalFechaInicioRango = document.getElementById('fecha-inicio-rango');
    const originalFechaFinRango = document.getElementById('fecha-fin-rango');
    const originalModoFecha = document.getElementById('modo-fecha');
    
    if (mobileFechaEspecifica && originalFechaEspecifica && originalFechaEspecifica.value !== mobileFechaEspecifica.value) {
        originalFechaEspecifica.value = mobileFechaEspecifica.value;
        originalFechaEspecifica.dispatchEvent(new Event('change'));
    }
    if (mobileFechaInicioRango && originalFechaInicioRango && originalFechaInicioRango.value !== mobileFechaInicioRango.value) {
        originalFechaInicioRango.value = mobileFechaInicioRango.value;
        originalFechaInicioRango.dispatchEvent(new Event('change'));
    }
    if (mobileFechaFinRango && originalFechaFinRango && originalFechaFinRango.value !== mobileFechaFinRango.value) {
        originalFechaFinRango.value = mobileFechaFinRango.value;
        originalFechaFinRango.dispatchEvent(new Event('change'));
    }
    if (mobileModoFecha && originalModoFecha && originalModoFecha.value !== mobileModoFecha.value) {
        originalModoFecha.value = mobileModoFecha.value;
        originalModoFecha.dispatchEvent(new Event('change'));
    }
    
    const mobileApto = document.querySelector('#mobileFiltersContent #filtro-apto-menores');
    const mobileAire = document.querySelector('#mobileFiltersContent #filtro-aire-libre');
    const originalApto = document.getElementById('filtro-apto-menores');
    const originalAire = document.getElementById('filtro-aire-libre');
    
    if (mobileApto && originalApto && originalApto.checked !== mobileApto.checked) {
        originalApto.checked = mobileApto.checked;
        originalApto.dispatchEvent(new Event('change'));
    }
    if (mobileAire && originalAire && originalAire.checked !== mobileAire.checked) {
        originalAire.checked = mobileAire.checked;
        originalAire.dispatchEvent(new Event('change'));
    }
}

function attachMobileChangeEvents() {
    const mobileCategorias = document.querySelectorAll('#mobileFiltersContent .filtro-categoria');
    mobileCategorias.forEach(cb => {
        cb.removeEventListener('change', handleMobileCategoryChange);
        cb.addEventListener('change', handleMobileCategoryChange);
    });
    
    const mobileFechaInicio = document.querySelector('#mobileFiltersContent #fecha-inicio');
    const mobileFechaFin = document.querySelector('#mobileFiltersContent #fecha-fin');
    const mobileFechaEspecifica = document.querySelector('#mobileFiltersContent #fecha-especifica');
    const mobileFechaInicioRango = document.querySelector('#mobileFiltersContent #fecha-inicio-rango');
    const mobileFechaFinRango = document.querySelector('#mobileFiltersContent #fecha-fin-rango');
    const mobileModoFecha = document.querySelector('#mobileFiltersContent #modo-fecha');
    const mobileApto = document.querySelector('#mobileFiltersContent #filtro-apto-menores');
    const mobileAire = document.querySelector('#mobileFiltersContent #filtro-aire-libre');
    
    if (mobileFechaInicio) mobileFechaInicio.addEventListener('change', () => syncToOriginalAndClose());
    if (mobileFechaFin) mobileFechaFin.addEventListener('change', () => syncToOriginalAndClose());
    if (mobileFechaEspecifica) mobileFechaEspecifica.addEventListener('change', () => syncToOriginalAndClose());
    if (mobileFechaInicioRango) mobileFechaInicioRango.addEventListener('change', () => syncToOriginalAndClose());
    if (mobileFechaFinRango) mobileFechaFinRango.addEventListener('change', () => syncToOriginalAndClose());
    if (mobileModoFecha) mobileModoFecha.addEventListener('change', () => {
        syncToOriginalAndClose();
        if (mobileModoFecha.value === 'rango') {
            const fechaContainer = document.querySelector('#mobileFiltersContent #modo-fecha-container');
            const rangoContainer = document.querySelector('#mobileFiltersContent #modo-rango-container');
            if (fechaContainer) fechaContainer.style.display = 'none';
            if (rangoContainer) rangoContainer.style.display = 'block';
        } else {
            const fechaContainer = document.querySelector('#mobileFiltersContent #modo-fecha-container');
            const rangoContainer = document.querySelector('#mobileFiltersContent #modo-rango-container');
            if (fechaContainer) fechaContainer.style.display = 'block';
            if (rangoContainer) rangoContainer.style.display = 'none';
        }
    });
    if (mobileApto) mobileApto.addEventListener('change', () => syncToOriginalAndClose());
    if (mobileAire) mobileAire.addEventListener('change', () => syncToOriginalAndClose());
}

function handleMobileCategoryChange(e) {
    const originalCb = document.querySelector(`.filters-sidebar .filtro-categoria[value="${e.target.value}"]`);
    if (originalCb) {
        originalCb.checked = e.target.checked;
        originalCb.dispatchEvent(new Event('change'));
    }
}

function syncToOriginalAndClose() {
    syncMobileFiltersToOriginal();
    setTimeout(() => {
        if (window.mobileFiltersOverlay) {
            window.mobileFiltersOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 150);
}

// ==================== FILTROS MÓVIL PRINCIPAL ====================
/*function initMobileFilters() {
    const filterBtn = document.getElementById('mobileFilterBtn');
    if (!filterBtn) return;
    
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
        
        const style = document.createElement('style');
        style.textContent = `
            .mobile-filters-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                visibility: hidden;
                opacity: 0;
                transition: all 0.3s ease;
            }
            .mobile-filters-overlay.active {
                visibility: visible;
                opacity: 1;
            }
            .mobile-filters-panel {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                width: 85%;
                max-width: 320px;
                background: var(--color-surface);
                box-shadow: -2px 0 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                z-index: 10002;
            }
            .mobile-filters-overlay.active .mobile-filters-panel {
                transform: translateX(0);
            }
            .mobile-filters-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid var(--color-border);
                background: var(--color-surface);
                flex-shrink: 0;
            }
            .mobile-filters-header h3 {
                margin: 0;
                font-size: 1.1rem;
            }
            .mobile-filters-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.5rem;
            }
            .mobile-filters-close img {
                width: 20px;
                height: 20px;
            }
            .mobile-filters-content {
                flex: 1;
                overflow-y: auto;
                padding: 1rem;
            }
            .mobile-filters-content .filters-sidebar {
                width: 100%;
                position: static;
                padding: 0;
                box-shadow: none;
            }
            .mobile-filters-content .resultados-orden-clone {
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--color-border);
            }
        `;
        document.head.appendChild(style);
        
        const closeBtn = document.getElementById('mobileFiltersClose');
        const overlayEl = document.getElementById('mobileFiltersOverlay');
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
            overlayEl.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        overlayEl?.addEventListener('click', (e) => {
            if (e.target === overlayEl) {
                overlayEl.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        window.mobileFiltersOverlay = overlayEl;
    }
    
    const newFilterBtn = filterBtn.cloneNode(true);
    filterBtn.parentNode.replaceChild(newFilterBtn, filterBtn);
    
    newFilterBtn.addEventListener('click', () => {
        const filtersSidebar = document.querySelector('.filters-sidebar');
        const mobileContent = document.getElementById('mobileFiltersContent');
        
        if (filtersSidebar && mobileContent) {
            saveOriginalFilterState();
            mobileContent.innerHTML = '';
            const clone = filtersSidebar.cloneNode(true);
            clone.classList.add('filters-sidebar');
            mobileContent.appendChild(clone);
            
            const ordenador = document.querySelector('.resultados-orden');
            if (ordenador && !mobileContent.querySelector('.resultados-orden-clone')) {
                const ordenadorClone = ordenador.cloneNode(true);
                ordenadorClone.classList.add('resultados-orden-clone');
                mobileContent.insertBefore(ordenadorClone, mobileContent.firstChild);
            }
            
            syncOriginalToMobile();
            attachMobileChangeEvents();
        }
        window.mobileFiltersOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}*/

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