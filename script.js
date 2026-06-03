﻿﻿﻿﻿﻿// ==================== VARIABLES GLOBALES ====================
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let mobileSearchOverlay = null;

// Asegurar que esAdministrador esté disponible
if (typeof esAdministrador === 'undefined') {
    window.esAdministrador = function(usuario) {
        if (!usuario) return false;
        const ADMIN_EMAILS = ["organizador@culturahabana.com", "admin0428@knowwhere.com", "adcuenta@redessociales.com"];
        return ADMIN_EMAILS.includes(usuario.email);
    };
}

// ==================== DETECTAR MÓVIL ====================
function isMobile() {
    return window.innerWidth <= 700;
}

function getIconoCategoria(categoria) {
    const iconos = {
        'Conciertos': '🎵', 'Teatro': '🎭', 'Cine': '🎬', 'Exposiciones': '🖼️',
        'Danza': '💃', 'Libros': '📚', 'Festival': '🎉', 'Infantiles': '🧸',
        'Deportes': '⚽', 'Talleres': '🔧', 'Museos': '🏛️', 'Ferias': '🛍️', 'Farándula': '✨'
    };
    return iconos[categoria] || '📌';
}

function getPreferenciasUsuario() {
    const usuario = getUsuarioActual();
    return usuario?.preferencias || [];
}

// ==================== MENÚ LATERAL UNIFICADO ====================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const categoriasMenuItem = document.querySelector('.menu-item-dropdown');
    const categoriasBtn = categoriasMenuItem ? categoriasMenuItem.querySelector('.menu-link') : null;
    const submenuCategorias = categoriasMenuItem ? categoriasMenuItem.querySelector('.sub-menu') : null;
    
    if (!sidebar) return;
    
    let activeTooltip = null;
    let tooltipTimeout = null;
    
    const currentPage = window.location.pathname.split('/').pop() || 'inicio.html';
    let isCategoriasOpen = false;
    
    function getSubmenuRealHeight() {
        if (!submenuCategorias) return 0;
        const originalStyles = {
            height: submenuCategorias.style.height,
            padding: submenuCategorias.style.padding,
            display: submenuCategorias.style.display,
            visibility: submenuCategorias.style.visibility,
            position: submenuCategorias.style.position
        };
        
        submenuCategorias.style.height = 'auto';
        submenuCategorias.style.padding = '0.2rem 0';
        submenuCategorias.style.display = 'block';
        submenuCategorias.style.visibility = 'visible';
        submenuCategorias.style.position = 'absolute';
        
        const realHeight = submenuCategorias.scrollHeight;
        
        submenuCategorias.style.height = originalStyles.height;
        submenuCategorias.style.padding = originalStyles.padding;
        submenuCategorias.style.display = originalStyles.display;
        submenuCategorias.style.visibility = originalStyles.visibility;
        submenuCategorias.style.position = originalStyles.position;
        
        return realHeight;
    }
    
    function openAccordionSubmenu() {
        if (!submenuCategorias) return;
        submenuCategorias.style.cssText = '';
        submenuCategorias.classList.remove('floating-submenu');
        submenuCategorias.style.position = 'relative';
        
        const realHeight = getSubmenuRealHeight();
        submenuCategorias.style.height = `${realHeight + 10}px`;
        submenuCategorias.style.padding = '0.2rem 0';
        submenuCategorias.style.overflow = 'hidden';
        
        if (categoriasMenuItem) {
            categoriasMenuItem.classList.add('sub-menu-toggle');
        }
        isCategoriasOpen = true;
    }
    
    function closeAccordionSubmenu() {
        if (!submenuCategorias) return;
        submenuCategorias.style.height = '0';
        submenuCategorias.style.padding = '0';
        submenuCategorias.style.overflow = 'hidden';
        if (categoriasMenuItem) {
            categoriasMenuItem.classList.remove('sub-menu-toggle');
        }
        isCategoriasOpen = false;
    }
    
    function closeFloatingSubmenu() {
        if (submenuCategorias) {
            submenuCategorias.classList.remove('floating-submenu');
            submenuCategorias.style.cssText = '';
            submenuCategorias.style.height = '0';
            submenuCategorias.style.padding = '0';
            submenuCategorias.style.overflow = 'hidden';
            if (categoriasMenuItem) {
                categoriasMenuItem.classList.remove('sub-menu-toggle');
            }
        }
        isCategoriasOpen = false;
    }
    
    function openFloatingSubmenu() {
        if (!submenuCategorias) return;
        
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        
        submenuCategorias.style.cssText = '';
        submenuCategorias.classList.remove('floating-submenu');
        
        if (categoriasMenuItem) {
            categoriasMenuItem.style.position = 'relative';
        }
        
        submenuCategorias.style.position = 'absolute';
        submenuCategorias.style.left = '5rem';
        submenuCategorias.style.top = '7.8rem';
        submenuCategorias.style.width = '180px';
        submenuCategorias.style.maxHeight = '300px';
        submenuCategorias.style.overflowY = 'auto';
        submenuCategorias.style.padding = '0.5rem 0';
        submenuCategorias.style.backgroundColor = 'var(--color-surface)';
        submenuCategorias.style.borderRadius = '0.5rem';
        submenuCategorias.style.boxShadow = '0 4px 12px var(--shadow-border)';
        submenuCategorias.style.border = '1px solid var(--color-border)';
        submenuCategorias.style.zIndex = '10000';
        submenuCategorias.style.display = 'block';
        submenuCategorias.style.visibility = 'visible';
        submenuCategorias.style.opacity = '1';
        submenuCategorias.style.height = 'auto';
        
        submenuCategorias.classList.add('floating-submenu');
        
        if (categoriasMenuItem) {
            categoriasMenuItem.classList.add('sub-menu-toggle');
        }
        isCategoriasOpen = true;
        
        const closeHandler = (event) => {
            if (categoriasBtn && !categoriasBtn.contains(event.target) && 
                submenuCategorias && !submenuCategorias.contains(event.target)) {
                closeFloatingSubmenu();
                document.removeEventListener('click', closeHandler);
                document.removeEventListener('touchstart', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
            document.addEventListener('touchstart', closeHandler);
        }, 10);
    }
    
    function applyInitialState() {
        if (isMobile()) {
            sidebar.classList.remove('minimize');
            document.body.classList.remove('sidebar-visible');
            closeFloatingSubmenu();
            closeAccordionSubmenu();
        } else {
            document.body.classList.remove('sidebar-visible');
            sidebar.classList.add('minimize');
            closeFloatingSubmenu();
            closeAccordionSubmenu();
            isCategoriasOpen = false;
            if (categoriasMenuItem) {
                categoriasMenuItem.style.position = '';
            }
        }
    }
    
    applyInitialState();
    updateActiveMenuItem();
    
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isMobile()) {
                document.body.classList.toggle('sidebar-visible');
                closeFloatingSubmenu();
                closeAccordionSubmenu();
            } else {
                if (sidebar.classList.contains('minimize')) {
                    sidebar.classList.remove('minimize');
                    if (categoriasMenuItem) {
                        categoriasMenuItem.style.position = '';
                    }
                    if (isCategoriasOpen) {
                        setTimeout(() => { openAccordionSubmenu(); }, 50);
                    }
                } else {
                    sidebar.classList.add('minimize');
                    if (isCategoriasOpen) {
                        setTimeout(() => { openFloatingSubmenu(); }, 50);
                    } else {
                        closeFloatingSubmenu();
                        closeAccordionSubmenu();
                    }
                }
            }
            
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
        });
    }
    
    if (categoriasBtn && submenuCategorias && categoriasMenuItem) {
        categoriasBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isMobile()) {
                if (!isCategoriasOpen) {
                    const realHeight = getSubmenuRealHeight();
                    submenuCategorias.style.height = `${realHeight + 10}px`;
                    submenuCategorias.style.padding = '0.2rem 0';
                    categoriasMenuItem.classList.add('sub-menu-toggle');
                    isCategoriasOpen = true;
                } else {
                    submenuCategorias.style.height = '0';
                    submenuCategorias.style.padding = '0';
                    categoriasMenuItem.classList.remove('sub-menu-toggle');
                    isCategoriasOpen = false;
                }
                return;
            }
            
            if (!sidebar.classList.contains('minimize')) {
                if (!isCategoriasOpen) {
                    openAccordionSubmenu();
                } else {
                    closeAccordionSubmenu();
                }
                return;
            }
            
            if (sidebar.classList.contains('minimize')) {
                if (!isCategoriasOpen) {
                    openFloatingSubmenu();
                } else {
                    closeFloatingSubmenu();
                }
            }
        });
    }
    
    function showTooltip(element, text) {
        if (isMobile()) return;
        if (!sidebar.classList.contains('minimize')) return;
        
        if (submenuCategorias && submenuCategorias.classList.contains('floating-submenu')) {
            return;
        }
        
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
        if (tooltipTimeout) clearTimeout(tooltipTimeout);
        
        const rect = element.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'menu-tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${sidebarRect.right + 12}px`;
        tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
        tooltip.style.transform = 'translateY(-50%)';
        
        document.body.appendChild(tooltip);
        activeTooltip = tooltip;
    }
    
    function hideTooltip() {
        if (activeTooltip) {
            tooltipTimeout = setTimeout(() => {
                if (activeTooltip && activeTooltip.parentNode) {
                    activeTooltip.remove();
                    activeTooltip = null;
                }
                tooltipTimeout = null;
            }, 150);
        }
    }
    
    const allMenuItems = document.querySelectorAll('.menu-item');
    
    allMenuItems.forEach(item => {
        const menuLink = item.querySelector('.menu-link');
        const span = menuLink ? menuLink.querySelector('span') : null;
        const itemText = span ? span.textContent : '';
        const isCategoriasItem = item.classList.contains('menu-item-dropdown');
        
        item.addEventListener('mouseenter', function() {
            if (!isMobile() && sidebar.classList.contains('minimize') && itemText) {
                if (isCategoriasItem && submenuCategorias && submenuCategorias.classList.contains('floating-submenu')) {
                    return;
                }
                showTooltip(this, itemText);
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!isMobile() && sidebar.classList.contains('minimize')) {
                hideTooltip();
            }
        });
    });
    
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    subMenuLinks.forEach(link => {
        link.removeEventListener('click', handleSubmenuClick);
        link.addEventListener('click', handleSubmenuClick);
    });
    
    function handleSubmenuClick(e) {
        e.preventDefault();
        const categoria = this.getAttribute('data-categoria');
        if (categoria) {
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            closeFloatingSubmenu();
            window.location.href = `categoria.html?nombre=${encodeURIComponent(categoria)}`;
        }
    }
    
    const mainMenuLinks = document.querySelectorAll('.menu-link:not(#categoriasBtn)');
    mainMenuLinks.forEach(link => {
        link.removeEventListener('click', handleMainLinkClick);
        link.addEventListener('click', handleMainLinkClick);
    });
    
    function handleMainLinkClick(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        
        if (href === currentPage) {
            e.preventDefault();
            
            if (isMobile()) {
                document.body.classList.remove('sidebar-visible');
            } else {
                if (!sidebar.classList.contains('minimize')) {
                    sidebar.classList.add('minimize');
                    closeFloatingSubmenu();
                    closeAccordionSubmenu();
                }
            }
        }
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile()) {
                document.body.classList.remove('sidebar-visible');
                sidebar.classList.remove('minimize');
                closeFloatingSubmenu();
                closeAccordionSubmenu();
            } else {
                sidebar.classList.add('minimize');
                if (isCategoriasOpen) {
                    setTimeout(() => { openFloatingSubmenu(); }, 50);
                } else {
                    closeFloatingSubmenu();
                    closeAccordionSubmenu();
                }
            }
            
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
        }, 100);
    });
}

function updateActiveMenuItem() {
    const currentPath = window.location.pathname.split('/').pop() || 'inicio.html';
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const link = item.querySelector('.menu-link');
        if (link && link.getAttribute('href') && link.getAttribute('href') !== '#') {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

// ==================== TEMA OSCURO ====================
function applyTheme() {
    const iconMappings = [
        { light: '.logo-light', dark: '.logo-dark' },
        { light: '.home-light', dark: '.home-dark' },
        { light: '.categories-light', dark: '.categories-dark' },
        { light: '.dropdown-light', dark: '.dropdown-dark' },
        { light: '.calendar-light', dark: '.calendar-dark' },
        { light: '.map-light', dark: '.map-dark' },
        { light: '.bookmark-light', dark: '.bookmark-dark' },
        { light: '.promo-light', dark: '.promo-dark' }
    ];
    
    iconMappings.forEach(mapping => {
        const lightIcon = document.querySelector(mapping.light);
        const darkIcon = document.querySelector(mapping.dark);
        if (lightIcon && darkIcon) {
            lightIcon.style.display = isDarkMode ? 'none' : 'inline-block';
            darkIcon.style.display = isDarkMode ? 'inline-block' : 'none';
        }
    });
    
    const searchLight = document.getElementById('searchIconLight');
    const searchDark = document.getElementById('searchIconDark');
    const themeLight = document.getElementById('themeIconLight');
    const themeDark = document.getElementById('themeIconDark');
    const notifLight = document.getElementById('notifIconLight');
    const notifDark = document.getElementById('notifIconDark');
    const menuIcon = document.getElementById('menuIcon');
    
    const mobileSearchLight = document.getElementById('mobileSearchIconLight');
    const mobileSearchDark = document.getElementById('mobileSearchIconDark');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (searchLight) searchLight.style.display = 'none';
        if (searchDark) searchDark.style.display = 'inline-block';
        if (themeLight) themeLight.style.display = 'none';
        if (themeDark) themeDark.style.display = 'inline-block';
        if (notifLight) notifLight.style.display = 'none';
        if (notifDark) notifDark.style.display = 'inline-block';
        if (menuIcon) menuIcon.src = 'resources/icons_dark/menu.png';
        
        if (mobileSearchLight) mobileSearchLight.style.display = 'none';
        if (mobileSearchDark) mobileSearchDark.style.display = 'inline-block';
    } else {
        document.body.classList.remove('dark-mode');
        if (searchLight) searchLight.style.display = 'inline-block';
        if (searchDark) searchDark.style.display = 'none';
        if (themeLight) themeLight.style.display = 'inline-block';
        if (themeDark) themeDark.style.display = 'none';
        if (notifLight) notifLight.style.display = 'inline-block';
        if (notifDark) notifDark.style.display = 'none';
        if (menuIcon) menuIcon.src = 'resources/icons_light/menu.png';
        
        if (mobileSearchLight) mobileSearchLight.style.display = 'inline-block';
        if (mobileSearchDark) mobileSearchDark.style.display = 'none';
    }
    
    const closeIcon = document.getElementById('mobileSearchCloseIcon');
    if (closeIcon && mobileSearchOverlay && mobileSearchOverlay.classList.contains('active')) {
        closeIcon.src = isDarkMode ? 'resources/icons_dark/icon_x.png' : 'resources/icons_light/icon_x.png';
    }
    
    // Actualizar iconos del submenú del avatar si existe
    if (typeof actualizarIconosSubmenuAvatar === 'function') {
        actualizarIconosSubmenuAvatar();
    }
    
    // Actualizar botón de login
    if (typeof actualizarBotonLoginEstilo === 'function') {
        actualizarBotonLoginEstilo();
    }
    
    // Actualizar el hover del botón si ya existe
    const avatarDiv = document.getElementById('avatarUsuario');
    if (avatarDiv && !getUsuarioActual()) {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            avatarDiv.style.color = 'white';
            avatarDiv.style.borderColor = 'white';
        } else {
            avatarDiv.style.color = 'var(--color-primary)';
            avatarDiv.style.borderColor = 'var(--color-primary)';
        }
    }
}

// ==================== ACTUALIZAR BOTÓN LOGIN ====================
function actualizarBotonLoginEstilo() {
    const avatarDiv = document.getElementById('avatarUsuario');
    if (!avatarDiv) return;
    
    const usuario = getUsuarioActual();
    if (usuario) return; // Solo para usuarios no logueados
    
    const isDark = document.body.classList.contains('dark-mode');
    
    // Tema claro: borde y texto color primario
    // Tema oscuro: borde y texto blanco
    if (isDark) {
        avatarDiv.style.color = 'white';
        avatarDiv.style.borderColor = 'white';
        avatarDiv.style.backgroundColor = 'transparent';
    } else {
        avatarDiv.style.color = 'var(--color-primary)';
        avatarDiv.style.borderColor = 'var(--color-primary)';
        avatarDiv.style.backgroundColor = 'transparent';
    }
}

// ==================== COLOR PRIMARIO DEL USUARIO ====================
function lightenColor(color, percent) {
    if (color && color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const newR = Math.min(255, r + Math.floor(r * percent / 100));
        const newG = Math.min(255, g + Math.floor(g * percent / 100));
        const newB = Math.min(255, b + Math.floor(b * percent / 100));
        return `rgb(${newR}, ${newG}, ${newB})`;
    }
    return color;
}

function aplicarColorPrimarioUsuario() {
    const usuario = getUsuarioActual();
    let color = "#025a8a";
    
    if (usuario && usuario.colorPrimario) {
        color = usuario.colorPrimario;
    } else {
        const globalColor = localStorage.getItem('colorPrimario');
        if (globalColor) color = globalColor;
    }
    
    document.documentElement.style.setProperty('--color-primary', color);
    const hoverColor = lightenColor(color, 10);
    document.documentElement.style.setProperty('--color-primary-hover', hoverColor);
    localStorage.setItem('colorPrimario', color);
}

// ==================== AVATAR CON SUBMENÚ ====================
function initAvatar() {
    const avatarDiv = document.getElementById('avatarUsuario');
    const menuPromocion = document.getElementById('menuPromocion');
    
    if (!avatarDiv) return;
    
    let avatarSubmenu = null;
    
    function crearSubmenuAvatar() {
        if (avatarSubmenu) return;
        
        avatarSubmenu = document.createElement('div');
        avatarSubmenu.className = 'avatar-submenu';
        avatarSubmenu.style.cssText = `
            position: absolute;
            background: var(--color-surface);
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px var(--shadow-border);
            border: 1px solid var(--color-border);
            z-index: 10000;
            min-width: 160px;
            overflow: hidden;
            display: none;
        `;
        const isDark = document.body.classList.contains('dark-mode');
        const iconPath = isDark ? 'resources/icons_dark/' : 'resources/icons_light/';
        
        avatarSubmenu.innerHTML = `
            <a href="perfil.html" class="avatar-submenu-item">
                <img class="avatar-submenu-icon" src="${iconPath}cog.png" alt="config" style="width: 16px; height: 16px;">
                <span>Configuración</span>
            </a>
            <div class="avatar-submenu-divider"></div>
            <a href="#" id="logoutSubmenuBtn" class="avatar-submenu-item">
                <img class="avatar-submenu-icon" src="${iconPath}arrow-out-right-square-half.png" alt="salir" style="width: 16px; height: 16px;">
                <span>Cerrar sesión</span>
            </a>
        `;
        document.body.appendChild(avatarSubmenu);
        
        const style = document.createElement('style');
        style.textContent = `
            .avatar-submenu-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1rem;
                color: var(--color-text-primary);
                text-decoration: none;
                font-size: 0.8rem;
                transition: background 0.2s ease;
            }
            .avatar-submenu-item:hover {
                background: var(--color-bg);
            }
            .avatar-submenu-divider {
                height: 1px;
                background: var(--color-border);
                margin: 0.2rem 0;
            }
        `;
        document.head.appendChild(style);
        
        document.getElementById('logoutSubmenuBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
            window.location.reload();
        });
    }
    
    function updateAvatar() {
        const usuario = getUsuarioActual();
        
        if (usuario && usuario.nombre) {
            avatarDiv.innerHTML = usuario.nombre.charAt(0).toUpperCase();
            avatarDiv.style.backgroundColor = usuario.avatarColor || '#2ecc71';
            avatarDiv.style.color = 'white';
            avatarDiv.style.border = 'none';
            avatarDiv.style.fontSize = '1rem';
            avatarDiv.style.fontWeight = '600';
            avatarDiv.style.width = '36px';
            avatarDiv.style.height = '36px';
            avatarDiv.style.borderRadius = '50%';
            avatarDiv.style.display = 'flex';
            avatarDiv.style.alignItems = 'center';
            avatarDiv.style.justifyContent = 'center';
            avatarDiv.style.cursor = 'pointer';
            avatarDiv.title = usuario.nombre;
            
            if (menuPromocion) {
                menuPromocion.style.display = esAdministrador(usuario) ? 'block' : 'none';
            }
        } else {
            avatarDiv.innerHTML = 'Iniciar sesión';
            avatarDiv.style.borderRadius = '30px';
            avatarDiv.style.fontSize = '0.75rem';
            avatarDiv.style.fontWeight = '600';
            avatarDiv.style.width = 'auto';
            avatarDiv.style.height = 'auto';
            avatarDiv.style.padding = '0.4rem 1rem';
            avatarDiv.style.display = 'inline-flex';
            avatarDiv.style.alignItems = 'center';
            avatarDiv.style.justifyContent = 'center';
            avatarDiv.style.cursor = 'pointer';
            avatarDiv.style.transition = 'all 0.3s ease';
            avatarDiv.title = 'Iniciar sesión';
            
            const isDark = document.body.classList.contains('dark-mode');
            if (isDark) {
                avatarDiv.style.color = 'white';
                avatarDiv.style.border = '2px solid white';
                avatarDiv.style.backgroundColor = 'transparent';
            } else {
                avatarDiv.style.color = 'var(--color-primary)';
                avatarDiv.style.border = '2px solid var(--color-primary)';
                avatarDiv.style.backgroundColor = 'transparent';
            }
            
            // Eliminar event listeners anteriores para evitar duplicados
            const oldMouseEnter = avatarDiv.onmouseenter;
            const oldMouseLeave = avatarDiv.onmouseleave;
            
            avatarDiv.addEventListener('mouseenter', () => {
                const isDarkHover = document.body.classList.contains('dark-mode');
                if (isDarkHover) {
                    // Tema oscuro: hover con fondo blanco y texto color primario
                    avatarDiv.style.backgroundColor = 'white';
                    avatarDiv.style.color = 'var(--color-primary)';
                    avatarDiv.style.borderColor = 'white';
                } else {
                    // Tema claro: hover con fondo primario y texto blanco
                    avatarDiv.style.backgroundColor = 'var(--color-primary)';
                    avatarDiv.style.color = 'white';
                    avatarDiv.style.borderColor = 'var(--color-primary)';
                }
            });
            
            avatarDiv.addEventListener('mouseleave', () => {
                const isDarkLeave = document.body.classList.contains('dark-mode');
                if (isDarkLeave) {
                    avatarDiv.style.backgroundColor = 'transparent';
                    avatarDiv.style.color = 'white';
                    avatarDiv.style.borderColor = 'white';
                } else {
                    avatarDiv.style.backgroundColor = 'transparent';
                    avatarDiv.style.color = 'var(--color-primary)';
                    avatarDiv.style.borderColor = 'var(--color-primary)';
                }
            });
            
            if (menuPromocion) menuPromocion.style.display = 'none';
        }
    }
    
    function showSubmenu() {
        if (isMobile()) {
            window.location.href = 'perfil.html';
            return;
        }
        
        const usuario = getUsuarioActual();
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }
        
        crearSubmenuAvatar();
        
        const rect = avatarDiv.getBoundingClientRect();
        avatarSubmenu.style.display = 'block';
        avatarSubmenu.style.position = 'fixed';
        avatarSubmenu.style.left = `${rect.left - 160}px`;
        avatarSubmenu.style.top = `${rect.bottom + 5}px`;
        
        const closeHandler = (event) => {
            if (!avatarDiv.contains(event.target) && !avatarSubmenu.contains(event.target)) {
                avatarSubmenu.style.display = 'none';
                document.removeEventListener('click', closeHandler);
                document.removeEventListener('touchstart', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
            document.addEventListener('touchstart', closeHandler);
        }, 10);
    }
    
    avatarDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const usuario = getUsuarioActual();
        if (usuario) {
            showSubmenu();
        } else {
            window.location.href = 'login.html';
        }
    });
    
    updateAvatar();
}

// ==================== AVATAR CON SUBMENÚ FLOTANTE (UNIFICADO) ====================
function initAvatarUnificado() {
    const avatarDiv = document.getElementById('avatarUsuario');
    const menuPromocion = document.getElementById('menuPromocion');
    
    if (!avatarDiv) return;
    
    let avatarSubmenu = null;
    
    function crearSubmenuAvatar() {
        if (avatarSubmenu) return;
        
        avatarSubmenu = document.createElement('div');
        avatarSubmenu.className = 'avatar-submenu';
        avatarSubmenu.style.cssText = `
            position: fixed;
            background: var(--color-surface);
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px var(--shadow-border);
            border: 1px solid var(--color-border);
            z-index: 10001;
            min-width: 160px;
            overflow: hidden;
            display: none;
        `;
        const isDark = document.body.classList.contains('dark-mode');
        const iconPath = isDark ? 'resources/icons_dark/' : 'resources/icons_light/';
        
        avatarSubmenu.innerHTML = `
            <a href="perfil.html" class="avatar-submenu-item">
                <img class="avatar-submenu-icon" src="${iconPath}cog.png" alt="config" style="width: 16px; height: 16px;">
                <span>Configuración</span>
            </a>
            <div class="avatar-submenu-divider"></div>
            <a href="#" id="logoutSubmenuBtn" class="avatar-submenu-item">
                <img class="avatar-submenu-icon" src="${iconPath}arrow-out-right-square-half.png" alt="salir" style="width: 16px; height: 16px;">
                <span>Cerrar sesión</span>
            </a>
        `;
        document.body.appendChild(avatarSubmenu);
        
        const style = document.createElement('style');
        style.textContent = `
            .avatar-submenu-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.6rem 1rem;
                color: var(--color-text-primary);
                text-decoration: none;
                font-size: 0.8rem;
                transition: background 0.2s ease;
            }
            .avatar-submenu-item:hover {
                background: var(--color-bg);
            }
            .avatar-submenu-divider {
                height: 1px;
                background: var(--color-border);
                margin: 0.2rem 0;
            }
        `;
        document.head.appendChild(style);
        
        document.getElementById('logoutSubmenuBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
            window.location.reload();
        });
    }
    
    function updateAvatar() {
        const usuario = getUsuarioActual();
        
        if (usuario && usuario.nombre) {
            avatarDiv.innerHTML = usuario.nombre.charAt(0).toUpperCase();
            avatarDiv.style.backgroundColor = usuario.avatarColor || '#2ecc71';
            avatarDiv.style.color = 'white';
            avatarDiv.style.border = 'none';
            avatarDiv.style.fontSize = '1rem';
            avatarDiv.style.fontWeight = '600';
            avatarDiv.style.width = '36px';
            avatarDiv.style.height = '36px';
            avatarDiv.style.borderRadius = '50%';
            avatarDiv.style.display = 'flex';
            avatarDiv.style.alignItems = 'center';
            avatarDiv.style.justifyContent = 'center';
            avatarDiv.style.cursor = 'pointer';
            avatarDiv.title = usuario.nombre;
            
            if (menuPromocion) {
                menuPromocion.style.display = esAdministrador(usuario) ? 'block' : 'none';
            }
        } else {
            avatarDiv.innerHTML = 'Iniciar sesión';
            avatarDiv.style.borderRadius = '30px';
            avatarDiv.style.fontSize = '0.75rem';
            avatarDiv.style.fontWeight = '600';
            avatarDiv.style.width = 'auto';
            avatarDiv.style.height = 'auto';
            avatarDiv.style.padding = '0.4rem 1rem';
            avatarDiv.style.display = 'inline-flex';
            avatarDiv.style.alignItems = 'center';
            avatarDiv.style.justifyContent = 'center';
            avatarDiv.style.cursor = 'pointer';
            avatarDiv.style.transition = 'all 0.3s ease';
            avatarDiv.title = 'Iniciar sesión';
            
            const isDark = document.body.classList.contains('dark-mode');
            if (isDark) {
                avatarDiv.style.color = 'white';
                avatarDiv.style.border = '2px solid white';
                avatarDiv.style.backgroundColor = 'transparent';
            } else {
                avatarDiv.style.color = 'var(--color-primary)';
                avatarDiv.style.border = '2px solid var(--color-primary)';
                avatarDiv.style.backgroundColor = 'transparent';
            }
            
            // Eliminar event listeners anteriores para evitar duplicados
            const oldMouseEnter = avatarDiv.onmouseenter;
            const oldMouseLeave = avatarDiv.onmouseleave;
            
            avatarDiv.addEventListener('mouseenter', () => {
                const isDarkHover = document.body.classList.contains('dark-mode');
                if (isDarkHover) {
                    // Tema oscuro: hover con fondo blanco y texto color primario
                    avatarDiv.style.backgroundColor = 'white';
                    avatarDiv.style.color = 'var(--color-primary)';
                    avatarDiv.style.borderColor = 'white';
                } else {
                    // Tema claro: hover con fondo primario y texto blanco
                    avatarDiv.style.backgroundColor = 'var(--color-primary)';
                    avatarDiv.style.color = 'white';
                    avatarDiv.style.borderColor = 'var(--color-primary)';
                }
            });
            
            avatarDiv.addEventListener('mouseleave', () => {
                const isDarkLeave = document.body.classList.contains('dark-mode');
                if (isDarkLeave) {
                    avatarDiv.style.backgroundColor = 'transparent';
                    avatarDiv.style.color = 'white';
                    avatarDiv.style.borderColor = 'white';
                } else {
                    avatarDiv.style.backgroundColor = 'transparent';
                    avatarDiv.style.color = 'var(--color-primary)';
                    avatarDiv.style.borderColor = 'var(--color-primary)';
                }
            });
            
            if (menuPromocion) menuPromocion.style.display = 'none';
        }
    }
    
    function showSubmenu(e) {
        e.stopPropagation();
        
        const usuario = getUsuarioActual();
        if (!usuario) {
            window.location.href = 'login.html';
            return;
        }
        
        crearSubmenuAvatar();
        
        const rect = avatarDiv.getBoundingClientRect();
        avatarSubmenu.style.display = 'block';
        avatarSubmenu.style.left = `${rect.left - 160}px`;
        avatarSubmenu.style.top = `${rect.bottom + 5}px`;
        
        const closeHandler = (event) => {
            if (!avatarDiv.contains(event.target) && !avatarSubmenu.contains(event.target)) {
                avatarSubmenu.style.display = 'none';
                document.removeEventListener('click', closeHandler);
                document.removeEventListener('touchstart', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
            document.addEventListener('touchstart', closeHandler);
        }, 10);
    }
    
    avatarDiv.addEventListener('click', showSubmenu);
    updateAvatar();
}

function actualizarIconosSubmenuAvatar() {
    const isDark = document.body.classList.contains('dark-mode');
    const icons = document.querySelectorAll('.avatar-submenu-icon');
    icons.forEach(icon => {
        if (icon.src && icon.src.includes('cog.png')) {
            icon.src = isDark ? 'resources/icons_dark/cog.png' : 'resources/icons_light/cog.png';
        } else if (icon.src && icon.src.includes('arrow-out-right-square-half.png')) {
            icon.src = isDark ? 'resources/icons_dark/arrow-out-right-square-half.png' : 'resources/icons_light/arrow-out-right-square-half.png';
        }
    });
}

// ==================== BÚSQUEDA GLOBAL ====================
function initSearch() {
    const buscador = document.getElementById('buscador-global');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!buscador) return;
    
    function realizarBusqueda() {
        const termino = buscador.value.trim();
        if (termino) {
            window.location.href = `busqueda.html?q=${encodeURIComponent(termino)}`;
        }
    }
    
    buscador.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusqueda();
    });
    
    if (searchBtn) {
        searchBtn.addEventListener('click', realizarBusqueda);
    }
}

// ==================== NOTIFICACIONES ====================
function initNotifications() {
    if (typeof initNotificationsSystem === 'function') {
        initNotificationsSystem();
    } else {
        console.warn('initNotificationsSystem no está definida, recargando...');
        const script = document.createElement('script');
        script.src = 'notifications.js';
        script.onload = () => {
            if (typeof initNotificationsSystem === 'function') {
                initNotificationsSystem();
            }
        };
        document.head.appendChild(script);
    }
}

// ==================== CONFIGURAR ENLACES ====================
function setupCategoriaLinks() {
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    subMenuLinks.forEach(link => {
        link.removeEventListener('click', setupClick);
        link.addEventListener('click', setupClick);
    });
    
    function setupClick(e) {
        e.preventDefault();
        const categoria = this.getAttribute('data-categoria');
        if (categoria) {
            window.location.href = `categoria.html?nombre=${encodeURIComponent(categoria)}`;
        }
    }
}

// ==================== BÚSQUEDA MOBILE ====================
function initMobileSearch() {
    if (document.querySelector('.mobile-search-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-search-overlay';
    overlay.innerHTML = `
        <div class="mobile-search-container">
            <div class="mobile-search-bar">
                <input type="text" id="mobile-search-input" placeholder="Buscar eventos...">
                <button class="mobile-search-btn" id="mobile-search-submit">
                    <img id="mobileSearchBtnIcon" src="resources/icons_dark/search.png" alt="buscar">
                </button>
                <button class="mobile-search-close" id="mobile-search-close">
                    <img id="mobileSearchCloseIcon" src="resources/icons_light/icon_x.png" alt="cerrar">
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    mobileSearchOverlay = overlay;
    
    const searchInput = document.getElementById('mobile-search-input');
    const searchSubmit = document.getElementById('mobile-search-submit');
    const searchClose = document.getElementById('mobile-search-close');
    
    function realizarBusquedaMobile() {
        const termino = searchInput.value.trim();
        if (termino) {
            window.location.href = `busqueda.html?q=${encodeURIComponent(termino)}`;
        } else {
            cerrarBusquedaMobile();
        }
    }
    
    searchSubmit?.addEventListener('click', realizarBusquedaMobile);
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusquedaMobile();
    });
    searchClose?.addEventListener('click', cerrarBusquedaMobile);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarBusquedaMobile();
    });
    
    function updateMobileSearchIcons() {
        const isDark = document.body.classList.contains('dark-mode');
        const btnIcon = document.getElementById('mobileSearchBtnIcon');
        if (btnIcon) {
            btnIcon.src = 'resources/icons_dark/search.png';
        }
        const closeIcon = document.getElementById('mobileSearchCloseIcon');
        if (closeIcon) {
            closeIcon.src = isDark ? 'resources/icons_dark/icon_x.png' : 'resources/icons_light/icon_x.png';
        }
    }
    
    const topBarRight = document.querySelector('.top-bar-right');
    if (topBarRight && !document.querySelector('.mobile-search-trigger')) {
        const searchTrigger = document.createElement('button');
        searchTrigger.className = 'mobile-search-trigger';
        searchTrigger.id = 'mobileSearchTrigger';
        searchTrigger.innerHTML = `
            <img id="mobileSearchIconLight" src="resources/icons_light/search.png" alt="buscar">
            <img id="mobileSearchIconDark" src="resources/icons_dark/search.png" alt="buscar" style="display:none;">
        `;
        
        const themeBtn = document.querySelector('#themeToggleBtn');
        if (themeBtn) {
            themeBtn.insertAdjacentElement('beforebegin', searchTrigger);
        } else {
            topBarRight.insertAdjacentElement('afterbegin', searchTrigger);
        }
        
        searchTrigger.addEventListener('click', () => {
            if (mobileSearchOverlay) {
                mobileSearchOverlay.classList.add('active');
                updateMobileSearchIcons();
                setTimeout(() => document.getElementById('mobile-search-input')?.focus(), 100);
            }
        });
    }
    
    const originalApplyTheme = window.applyTheme || function() {};
    window.applyTheme = function() {
        if (typeof originalApplyTheme === 'function') originalApplyTheme();
        
        const isDark = document.body.classList.contains('dark-mode');
        const lightIcon = document.querySelector('#mobileSearchIconLight');
        const darkIcon = document.querySelector('#mobileSearchIconDark');
        
        if (lightIcon && darkIcon) {
            lightIcon.style.display = isDark ? 'none' : 'inline-block';
            darkIcon.style.display = isDark ? 'inline-block' : 'none';
        }
        
        if (mobileSearchOverlay && mobileSearchOverlay.classList.contains('active')) {
            const closeIcon = document.getElementById('mobileSearchCloseIcon');
            if (closeIcon) {
                closeIcon.src = isDark ? 'resources/icons_dark/icon_x.png' : 'resources/icons_light/icon_x.png';
            }
        }
    };
    
    const isDark = document.body.classList.contains('dark-mode');
    const lightIcon = document.querySelector('#mobileSearchIconLight');
    const darkIcon = document.querySelector('#mobileSearchIconDark');
    if (lightIcon && darkIcon) {
        lightIcon.style.display = isDark ? 'none' : 'inline-block';
        darkIcon.style.display = isDark ? 'inline-block' : 'none';
    }
}

function cerrarBusquedaMobile() {
    if (mobileSearchOverlay) {
        mobileSearchOverlay.classList.remove('active');
        const searchInput = document.getElementById('mobile-search-input');
        if (searchInput) searchInput.value = '';
    }
}

// ==================== CONTROL DE NOTIFICACIONES POR SESIÓN ====================
function actualizarNotificacionesPorSesion() {
    const usuario = getUsuarioActual();
    const notifWrapper = document.querySelector('.notifications-wrapper');
    
    if (notifWrapper) {
        if (usuario) {
            notifWrapper.classList.add('visible');
            notifWrapper.style.display = 'block';
        } else {
            notifWrapper.classList.remove('visible');
            notifWrapper.style.display = 'none';
        }
    }
}

// ==================== INICIALIZACIÓN COMPLETA ====================
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    aplicarColorPrimarioUsuario();
    
    if (typeof initSidebar === 'function') {
        initSidebar();
    }
    
    initMobileSearch();
    initAvatarUnificado();
    initSearch();
    initNotifications();
    setupCategoriaLinks();
    actualizarNotificacionesPorSesion();
    actualizarBotonLoginEstilo();
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
            aplicarColorPrimarioUsuario();
            actualizarBotonLoginEstilo();
        });
    }
});

// ==================== FUNCIONES ADICIONALES ====================
function getEventosGuardados() {
    const usuario = getUsuarioActual();
    if (!usuario || !usuario.recordatorios) return [];
    const eventos = getEventos();
    return usuario.recordatorios.map(id => eventos.find(e => e.id === id)).filter(e => e);
}

// landing-common.js - Script común para todas las landing pages
function initLandingPage(currentPage) {
    const usuario = getUsuarioActual();
    if (usuario) {
        const redirectMap = {
            'index': 'inicio.html',
            'categoriasLanding': 'inicio.html',
            'calendarioLanding': 'calendario.html',
            'mapaLanding': 'mapa.html',
            'busquedaLanding': 'busqueda.html',
            'detallesEventoLanding': 'detallesEvento.html'
        };
        const redirectTo = redirectMap[currentPage] || 'inicio.html';
        window.location.href = redirectTo;
        return;
    }
    
    const isDarkModeStorage = localStorage.getItem('darkMode') === 'true';
    if (isDarkModeStorage) document.body.classList.add('dark-mode');
    
    const themeBtn = document.getElementById('landingThemeBtn');
    const themeIcon = document.getElementById('landingThemeIcon');
    
    function applyThemeLanding() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            themeIcon.src = 'resources/icons_light/moon.png';
            localStorage.setItem('darkMode', 'false');
        } else {
            document.body.classList.add('dark-mode');
            themeIcon.src = 'resources/icons_dark/sun.png';
            localStorage.setItem('darkMode', 'true');
        }
    }
    
    themeBtn?.addEventListener('click', applyThemeLanding);
    initLandingMobileSearch();
}

function initLandingMobileSearch() {
    if (document.querySelector('.mobile-search-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-search-overlay';
    overlay.innerHTML = `
        <div class="mobile-search-container">
            <div class="mobile-search-bar">
                <input type="text" id="mobile-search-input" placeholder="Buscar eventos...">
                <button class="mobile-search-btn" id="mobile-search-submit">
                    <img src="resources/icons_dark/search.png" alt="buscar" style="width: 18px; height: 18px;">
                </button>
                <button class="mobile-search-close" id="mobile-search-close">
                    <img src="resources/icons_light/icon_x.png" alt="cerrar">
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    const searchInput = document.getElementById('mobile-search-input');
    const searchSubmit = document.getElementById('mobile-search-submit');
    const searchClose = document.getElementById('mobile-search-close');
    
    function realizarBusqueda() {
        const termino = searchInput.value.trim();
        if (termino) window.location.href = `busquedaLanding.html?q=${encodeURIComponent(termino)}`;
        else overlay.classList.remove('active');
    }
    
    searchSubmit?.addEventListener('click', realizarBusqueda);
    searchInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') realizarBusqueda(); });
    searchClose?.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
    
    const searchTrigger = document.querySelector('.landing-search-trigger');
    searchTrigger?.addEventListener('click', () => overlay.classList.add('active'));
}