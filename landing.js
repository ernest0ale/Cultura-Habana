// landing.js - Script común para todas las landing pages

// Redirigir si ya hay sesión iniciada
function checkAndRedirect(currentPage) {
    const usuario = getUsuarioActual();
    if (usuario) {
        const redirectMap = {
            'index': 'inicio.html',
            'calendarioLanding': 'calendario.html',
            'mapaLanding': 'mapa.html',
            'categoriaLanding': 'categoria.html',
            'busquedaLanding': 'busqueda.html',
            'detallesEventoLanding': 'detallesEvento.html'
        };
        const redirectTo = redirectMap[currentPage] || 'inicio.html';
        window.location.href = redirectTo;
        return true;
    }
    return false;
}

// Inicializar tema oscuro
function initLandingTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) document.body.classList.add('dark-mode');
    
    const themeBtn = document.getElementById('landingThemeBtn');
    const themeIcon = document.getElementById('landingThemeIcon');
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            themeIcon.src = isDark ? 'resources/icons_dark/sun.png' : 'resources/icons_light/moon.png';
            localStorage.setItem('darkMode', isDark);
        });
    }
}

// Inicializar buscador con overlay (igual en móvil y escritorio)
function initLandingSearch() {
    const searchTrigger = document.getElementById('landingSearchTrigger');
    if (!searchTrigger) return;
    
    // Crear overlay si no existe
    if (!document.querySelector('.landing-search-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'landing-search-overlay';
        overlay.innerHTML = `
            <div class="landing-search-container">
                <div class="landing-search-bar">
                    <input type="text" id="landing-search-input" placeholder="Buscar eventos...">
                    <button class="landing-search-btn" id="landing-search-submit">
                        <img src="resources/icons_dark/search.png" alt="buscar">
                    </button>
                    <button class="landing-search-close" id="landing-search-close">
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
        
        // Actualizar icono X según tema
        const updateCloseIcon = () => {
            const isDark = document.body.classList.contains('dark-mode');
            closeIcon.src = isDark ? 'resources/icons_dark/icon_x.png' : 'resources/icons_light/icon_x.png';
        };
        
        const observer = new MutationObserver(updateCloseIcon);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        updateCloseIcon();
        
        window.landingSearchOverlay = overlay;
    }
    
    searchTrigger.addEventListener('click', () => {
        window.landingSearchOverlay.classList.add('active');
        setTimeout(() => document.getElementById('landing-search-input')?.focus(), 100);
    });
}

// Inicializar dropdown de categorías (con click)
function initLandingCategories() {
    const dropdownBtn = document.getElementById('landingCategoriesBtn');
    const dropdown = document.getElementById('landingCategoriesDropdown');
    
    if (dropdownBtn && dropdown) {
        dropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }
    
    // Enlaces de categorías
    document.querySelectorAll('.landing-dropdown-content a, .landing-sidebar-dropdown a').forEach(link => {
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
    
    // Cerrar al hacer clic en un enlace
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Dropdown en sidebar móvil
    const sidebarDropdownBtn = document.getElementById('landingSidebarCategoriesBtn');
    const sidebarDropdown = document.getElementById('landingSidebarCategoriesDropdown');
    
    if (sidebarDropdownBtn && sidebarDropdown) {
        sidebarDropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarDropdown.classList.toggle('open');
        });
    }
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
    const pageName = document.body.getAttribute('data-page') || 'index';
    if (checkAndRedirect(pageName)) return;
    
    initLandingTheme();
    initLandingSearch();
    initLandingCategories();
    initLandingMobileMenu();
});