// ==================== SISTEMA DE NOTIFICACIONES RENOVADO ====================

let permisoNotificaciones = false;
let panelAbierto = false;
let pushPermissionGranted = false;

// Solicitar permiso para notificaciones del navegador
window.solicitarPermisoNotificaciones = async function() {
    if (!("Notification" in window)) {
        console.log("Este navegador no soporta notificaciones");
        return false;
    }
    
    if (Notification.permission === "granted") {
        permisoNotificaciones = true;
        return true;
    }
    
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        permisoNotificaciones = permission === "granted";
        if (permisoNotificaciones) {
            console.log("✅ Permiso de notificaciones concedido");
        }
        return permisoNotificaciones;
    }
    return false;
};

// Solicitar permiso push
window.solicitarPermisoPush = async function() {
    if (!("Notification" in window)) {
        console.log("Este navegador no soporta notificaciones");
        return false;
    }
    
    if (Notification.permission === "granted") {
        pushPermissionGranted = true;
        return true;
    }
    
    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        pushPermissionGranted = permission === "granted";
        return pushPermissionGranted;
    }
    return false;
};

// Enviar notificación push
window.enviarNotificacionPush = function(titulo, cuerpo, eventoId = null) {
    if (!pushPermissionGranted && Notification.permission !== "granted") return;
    
    try {
        const notification = new Notification(titulo, {
            body: cuerpo,
            icon: "resources/aguacero_cuba_logo_trasnparente.png",
            badge: "resources/aguacero_cuba_logo_trasnparente.png",
            tag: eventoId || "evento",
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
        });
        
        if (eventoId) {
            notification.onclick = function() {
                window.focus();
                window.location.href = `detallesEvento.html?id=${eventoId}`;
                notification.close();
            };
        }
    } catch(e) {
        console.error('Error al enviar notificación:', e);
    }
};

// Generar lista de notificaciones en tiempo real
function generarNotificaciones() {
    const usuario = getUsuarioActual();
    if (!usuario) return [];
    
    const preferenciasNotificacion = usuario.preferenciasNotificacion || {
        sieteDias: true,
        unDia: true,
        treintaMinutos: false,
        unaHora: false
    };
    
    const eventos = getEventosFuturos();
    const preferenciasCategorias = usuario.preferencias || [];
    const recordatoriosIds = usuario.recordatorios || [];
    const notificaciones = [];
    const ahora = new Date();
    
    eventos.forEach(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        const diffDias = Math.ceil((fechaEvento - ahora) / (1000 * 60 * 60 * 24));
        const diffMinutos = Math.ceil((fechaEvento - ahora) / (1000 * 60));
        
        const esInteres = preferenciasCategorias.includes(evento.categoria) || recordatoriosIds.includes(evento.id);
        if (!esInteres) return;
        
        if (preferenciasNotificacion.sieteDias && diffDias === 7) {
            notificaciones.push({
                id: `${evento.id}_7dias`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza en 7 días`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 7 * 24 * 60 * 60 * 1000),
                leida: false
            });
        }
        if (preferenciasNotificacion.unDia && diffDias === 1) {
            notificaciones.push({
                id: `${evento.id}_1dia`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza mañana`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 24 * 60 * 60 * 1000),
                leida: false
            });
        }
        if (preferenciasNotificacion.unaHora && diffMinutos === 60) {
            notificaciones.push({
                id: `${evento.id}_1hora`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza en 1 hora`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 60 * 60 * 1000),
                leida: false
            });
        }
        if (preferenciasNotificacion.treintaMinutos && diffMinutos === 30) {
            notificaciones.push({
                id: `${evento.id}_30min`,
                eventoId: evento.id,
                titulo: evento.nombre,
                mensaje: `Comienza en 30 minutos`,
                direccion: evento.ubicacion || evento.direccion,
                fecha: new Date(fechaEvento.getTime() - 30 * 60 * 1000),
                leida: false
            });
        }
    });
    
    notificaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    return notificaciones;
}

function formatFechaRelativa(fechaStr) {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMin = Math.floor((ahora - fecha) / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);
    
    if (diffMin < 1) return "Ahora mismo";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} h`;
    if (diffDias < 7) return `Hace ${diffDias} días`;
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function actualizarContadorNotificaciones() {
    const contador = document.getElementById('notifCounter');
    if (!contador) return;
    
    if (panelAbierto) {
        contador.style.display = 'none';
        return;
    }
    
    const notificaciones = generarNotificaciones();
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    
    if (noLeidas === 0) {
        contador.style.display = 'none';
    } else {
        contador.style.display = 'flex';
        contador.textContent = noLeidas > 15 ? "+15" : noLeidas;
    }
}

function renderizarPanelNotificaciones() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;
    
    const notificaciones = generarNotificaciones();
    
    if (notificaciones.length === 0) {
        panel.innerHTML = `
            <div class="notif-empty">
                <span>🔔</span>
                <p>No hay notificaciones</p>
                <small>Las notificaciones de tus eventos favoritos aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    panel.innerHTML = notificaciones.map(notif => `
        <div class="notif-item ${notif.leida ? '' : 'notif-no-leida'}" data-evento-id="${notif.eventoId}" data-notif-id="${notif.id}">
            <div class="notif-content">
                <div class="notif-title">${notif.titulo}</div>
                <div class="notif-message">${notif.mensaje}</div>
                <div class="notif-location">${notif.direccion ? notif.direccion.substring(0, 50) : 'Ubicación no especificada'}${notif.direccion && notif.direccion.length > 50 ? '...' : ''}</div>
                <div class="notif-time">${formatFechaRelativa(notif.fecha)}</div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => {
            const eventoId = item.getAttribute('data-evento-id');
            if (eventoId) {
                window.location.href = `detallesEvento.html?id=${eventoId}`;
            }
        });
    });
}

function toggleNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;
    
    panelAbierto = !panelAbierto;
    
    if (panelAbierto) {
        renderizarPanelNotificaciones();
        panel.classList.add('active');
        actualizarContadorNotificaciones();
        
        const closeHandler = (e) => {
            if (!panel.contains(e.target) && !document.getElementById('notificationsBtn')?.contains(e.target)) {
                panel.classList.remove('active');
                panelAbierto = false;
                actualizarContadorNotificaciones();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 100);
    } else {
        panel.classList.remove('active');
        actualizarContadorNotificaciones();
    }
}

// Inicializar sistema
window.initNotificationsSystem = function() {
    console.log("🔔 Inicializando sistema de notificaciones");
    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
        notifBtn.removeEventListener('click', window.notifClickHandler);
        window.notifClickHandler = (e) => {
            e.stopPropagation();
            toggleNotificationsPanel();
        };
        notifBtn.addEventListener('click', window.notifClickHandler);
    }
    
    const usuario = getUsuarioActual();
    if (usuario) {
        window.solicitarPermisoNotificaciones();
    }
    
    setInterval(() => {
        if (!panelAbierto) {
            actualizarContadorNotificaciones();
        }
    }, 60000);
    
    actualizarContadorNotificaciones();
    console.log("✅ Sistema de notificaciones listo");
};

// Verificar eventos próximos
window.verificarYEnviarNotificaciones = function() {
    const usuario = getUsuarioActual();
    if (!usuario || !pushPermissionGranted) return;
    
    const ahora = new Date();
    const eventos = getEventos();
    const preferencias = usuario.preferenciasNotificacion || {};
    
    usuario.recordatorios?.forEach(recordatorioId => {
        const evento = eventos.find(e => e.id === recordatorioId);
        if (!evento) return;
        
        const fechaEvento = new Date(evento.fechaInicio);
        const diffHoras = (fechaEvento - ahora) / (1000 * 60 * 60);
        
        if (preferencias.sieteDias && diffHoras <= 168 && diffHoras > 167) {
            window.enviarNotificacionPush(`📅 ${evento.nombre}`, "Comienza en 7 días", evento.id);
        }
        if (preferencias.unDia && diffHoras <= 24 && diffHoras > 23) {
            window.enviarNotificacionPush(`📅 ${evento.nombre}`, "Comienza mañana", evento.id);
        }
        if (preferencias.unaHora && diffHoras <= 1 && diffHoras > 0.9) {
            window.enviarNotificacionPush(`⏰ ${evento.nombre}`, "Comienza en 1 hora", evento.id);
        }
        if (preferencias.treintaMinutos && diffHoras <= 0.5 && diffHoras > 0.4) {
            window.enviarNotificacionPush(`⏰ ${evento.nombre}`, "Comienza en 30 minutos", evento.id);
        }
    });
};

setInterval(window.verificarYEnviarNotificaciones, 60 * 60 * 1000);

// Auto-inicializar si el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.initNotificationsSystem(), 100);
    });
} else {
    setTimeout(() => window.initNotificationsSystem(), 100);
}