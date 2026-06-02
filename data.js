// data.js - Base de datos local con localStorage

const ADMIN_EMAILS = [
  "organizador@culturahabana.com",
  "admin0428@knowwhere.com",
  "adcuenta@redessociales.com",
];

function esAdministrador(usuario) {
  if (!usuario) return false;
  return ADMIN_EMAILS.includes(usuario.email);
}

function puedeCrearEvento(usuario) {
  return esAdministrador(usuario);
}

const eventosEjemplo = [
  // ... (tus eventos de ejemplo existentes) ...
  {
    id: "evt_001",
    nombre: "VAN VAN - Concierto Especial",
    categoria: "Conciertos",
    descripcion: "La leyenda de la música cubana en concierto único.",
    fechaInicio: "2026-05-15",
    fechaFin: "2026-05-15",
    horaInicio: "21:00",
    horaFin: "02:00",
    precio: 500,
    ubicacion: "Pabellón Cuba, Calle 23 e/ M y N, Vedado",
    sede: "Pabellón Cuba",
    municipio: "Plaza de la Revolución",
    direccion: "Calle 23 # 59, Vedado",
    lat: 23.1395,
    lng: -82.3824,
    poster: "https://picsum.photos/id/30/400/300",
    organizador: "Empresa de Conciertos",
    telefono: "+53 55550001",
    aptoMenores: true,
    aireLibre: false,
    posibilidadReserva: true,
    creadoPor: "organizador",
  },
  {
    id: "evt_002",
    nombre: "Lachy Fortuna - Session Especial",
    categoria: "Farándula",
    descripcion: "El ex-charanguero presenta su nuevo proyecto musical.",
    fechaInicio: "2026-05-18",
    fechaFin: "2026-05-18",
    horaInicio: "22:00",
    horaFin: "03:00",
    precio: 350,
    ubicacion: "Casa de la Música, Miramar",
    sede: "Casa de la Música",
    municipio: "Playa",
    direccion: "Calle 20 e/ 35 y 37, Miramar",
    lat: 23.1184,
    lng: -82.4257,
    poster: "https://picsum.photos/id/39/400/300",
    organizador: "Casa de la Música",
    telefono: "+53 55550002",
    aptoMenores: false,
    aireLibre: true,
    posibilidadReserva: true,
    creadoPor: "organizador",
  },
  {
    id: "evt_003",
    nombre: "Taller de Pintura Calcónica",
    categoria: "Talleres",
    descripcion: "Aprende técnicas de pintura calcónica.",
    fechaInicio: "2026-05-20",
    fechaFin: "2026-05-27",
    horaInicio: "09:00",
    horaFin: "12:00",
    precio: 25,
    ubicacion: "Taller de Cultura, Calle 12 # 304",
    sede: "Taller de Cultura",
    municipio: "Centro Habana",
    direccion: "Calle 12 # 304 e/ 5 y 7",
    lat: 23.1321,
    lng: -82.3765,
    poster: "https://picsum.photos/id/96/400/300",
    organizador: "Proyecto Vende",
    telefono: "+53 55550003",
    aptoMenores: true,
    aireLibre: false,
    posibilidadReserva: false,
    creadoPor: "organizador",
  },
  {
    id: "evt_004",
    nombre: "Exposición de Arte Contemporáneo",
    categoria: "Exposiciones",
    descripcion: "Obras de artistas cubanos emergentes.",
    fechaInicio: "2026-05-25",
    fechaFin: "2026-06-15",
    horaInicio: "10:00",
    horaFin: "18:00",
    precio: 0,
    ubicacion: "Factoría Habana, Calle 26 e/ 11 y 13",
    sede: "Factoría Habana",
    municipio: "Plaza de la Revolución",
    direccion: "Calle 26 # 509",
    lat: 23.1234,
    lng: -82.3876,
    poster: "https://picsum.photos/id/20/400/300",
    organizador: "Factoría Habana",
    telefono: "+53 55550004",
    aptoMenores: true,
    aireLibre: false,
    posibilidadReserva: false,
    creadoPor: "organizador",
  },
  {
    id: "evt_005",
    nombre: "Cine Cubano: Retrospectiva",
    categoria: "Cine",
    descripcion: "Funciones especiales de cine cubano.",
    fechaInicio: "2026-05-28",
    fechaFin: "2026-06-05",
    horaInicio: "15:00",
    horaFin: "22:00",
    precio: 100,
    ubicacion: "Cine Yara, Calle 23",
    sede: "Cine Yara",
    municipio: "Plaza de la Revolución",
    direccion: "Calle 23 # 59",
    lat: 23.1385,
    lng: -82.3826,
    poster: "https://picsum.photos/id/1/400/300",
    organizador: "ICAIC",
    telefono: "+53 55550005",
    aptoMenores: true,
    aireLibre: false,
    posibilidadReserva: true,
    creadoPor: "organizador",
  },
  {
    id: "evt_006",
    nombre: "Festival de Danza",
    categoria: "Danza",
    descripcion: "Compañías de danza de toda la isla.",
    fechaInicio: "2026-06-01",
    fechaFin: "2026-06-03",
    horaInicio: "19:00",
    horaFin: "21:30",
    precio: 800,
    ubicacion: "Gran Teatro de La Habana",
    sede: "Gran Teatro",
    municipio: "Centro Habana",
    direccion: "Paseo del Prado # 458",
    lat: 23.1372,
    lng: -82.3597,
    poster: "https://picsum.photos/id/36/400/300",
    organizador: "Gran Teatro",
    telefono: "+53 55550006",
    aptoMenores: true,
    aireLibre: false,
    posibilidadReserva: true,
    creadoPor: "organizador",
  },
];

function inicializarDatos() {
  console.log("🔧 Inicializando datos...");

  // 🔥 FORZAR ACTUALIZACIÓN DE EVENTOS - SIEMPRE SOBREESCRIBIR 🔥
  console.log("📅 Forzando carga de eventos de ejemplo...");
  localStorage.setItem("eventos", JSON.stringify(eventosEjemplo));

  if (!localStorage.getItem("usuarios")) {
    console.log("👥 Creando usuarios de ejemplo...");
    const usuariosIniciales = [
      {
        id: "user_001",
        email: "usuario@example.com",
        password: "123456",
        nombre: "Usuario Ejemplo",
        rol: "usuario",
        telefono: "+53 51234567",
        avatarColor: "#2ecc71",
        colorPrimario: "#025a8a",
        preferencias: ["Conciertos", "Teatro"],
        estado: "activo",
        fechaDesactivacion: null,
        fechaEliminacion: null,
        preferenciasNotificacion: {
          sieteDias: false,
          unDia: true,
          treintaMinutos: true,
          unaHora: false,
        },
        recordatorios: [],
      },
      {
        id: "user_002",
        email: "organizador@culturahabana.com",
        password: "12345678",
        nombre: "Administrador",
        rol: "usuario",
        telefono: "+53 51234567",
        avatarColor: "#e74c3c",
        colorPrimario: "#025a8a",
        preferencias: [],
        estado: "activo",
        fechaDesactivacion: null,
        fechaEliminacion: null,
        preferenciasNotificacion: {
          sieteDias: true,
          unDia: true,
          treintaMinutos: false,
          unaHora: false,
        },
        recordatorios: [],
      },
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
  }

  console.log("✅ Inicialización completada");
}

function getEventos() {
  return JSON.parse(localStorage.getItem("eventos")) || [];
}

function guardarEventos(eventos) {
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

function getEventoById(id) {
  return getEventos().find((e) => e.id === id);
}

function agregarEvento(evento) {
  const eventos = getEventos();
  const nuevoId =
    "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
  const nuevoEvento = { ...evento, id: nuevoId };
  eventos.push(nuevoEvento);
  guardarEventos(eventos);
  return nuevoEvento;
}

function getUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function registrarUsuario(usuario) {
  console.log("📝 RegistrarUsuario llamado con:", usuario);
  const usuarios = getUsuarios();

  if (usuarios.find((u) => u.email === usuario.email)) {
    console.log("❌ Email ya registrado:", usuario.email);
    return { exito: false, mensaje: "El correo ya está registrado" };
  }

  const colores = [
    "#2ecc71",
    "#3498db",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#e67e22",
  ];
  const nuevoUsuario = {
    ...usuario,
    id: "user_" + Date.now(),
    avatarColor: colores[Math.floor(Math.random() * colores.length)],
    colorPrimario: "#025a8a",
    preferencias: usuario.preferencias || [],
    rol: "usuario",
    estado: "activo",
    fechaDesactivacion: null,
    fechaEliminacion: null,
    preferenciasNotificacion: {
      sieteDias: true,
      unDia: true,
      treintaMinutos: false,
      unaHora: false,
    },
    recordatorios: [], // Lista de IDs de eventos a recordar
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);
  console.log("✅ Usuario registrado:", nuevoUsuario.email);
  return { exito: true, usuario: nuevoUsuario };
}

function iniciarSesion(email, password) {
  console.log("🔐 IniciarSesion llamado con:", email, password);
  const usuarios = getUsuarios();

  const usuario = usuarios.find(
    (u) => u.email === email && u.password === password,
  );

  if (!usuario) {
    console.log("❌ Usuario no encontrado");
    return { exito: false, mensaje: "Correo o contraseña incorrectos" };
  }

  if (usuario.estado === "deshabilitado") {
    return {
      exito: false,
      mensaje: "Tu cuenta está desactivada",
      necesitaRecuperacion: true,
      email: usuario.email,
    };
  }

  localStorage.setItem("usuarioActual", JSON.stringify(usuario));
  return { exito: true, usuario };
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActual");
  // Eliminar el color primario personalizado al cerrar sesión
  localStorage.removeItem("colorPrimario");
}

function getUsuarioActual() {
  const u = localStorage.getItem("usuarioActual");
  return u ? JSON.parse(u) : null;
}

function actualizarUsuario(usuarioActualizado) {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex((u) => u.id === usuarioActualizado.id);
  if (index !== -1) {
    usuarios[index] = usuarioActualizado;
    guardarUsuarios(usuarios);
    const usuarioActual = getUsuarioActual();
    if (usuarioActual && usuarioActual.id === usuarioActualizado.id) {
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActualizado));
    }
    return true;
  }
  return false;
}

function desactivarCuenta(email, confirmText) {
  if (confirmText !== "DELETE") {
    return { exito: false, mensaje: "Debes escribir DELETE para confirmar" };
  }

  const usuarios = getUsuarios();
  const index = usuarios.findIndex((u) => u.email === email);
  if (index === -1) {
    return { exito: false, mensaje: "Usuario no encontrado" };
  }

  const ahora = new Date();
  const fechaEliminacion = new Date(ahora.getTime() + 14 * 24 * 60 * 60 * 1000);

  usuarios[index].estado = "deshabilitado";
  usuarios[index].fechaDesactivacion = ahora.toISOString();
  usuarios[index].fechaEliminacion = fechaEliminacion.toISOString();

  guardarUsuarios(usuarios);

  const usuarioActual = getUsuarioActual();
  if (usuarioActual && usuarioActual.email === email) {
    cerrarSesion();
  }

  return {
    exito: true,
    mensaje: `Cuenta desactivada. Tendrás 14 días para recuperarla.`,
  };
}

function getEventosFuturos() {
  // Obtener fecha actual en UTC para evitar problemas de zona horaria
  const ahora = new Date();
  const hoyUTC = new Date(
    Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()),
  );
  const hoyStr = `${hoyUTC.getUTCFullYear()}-${String(hoyUTC.getUTCMonth() + 1).padStart(2, "0")}-${String(hoyUTC.getUTCDate()).padStart(2, "0")}`;

  return getEventos()
    .filter((e) => e.fechaInicio >= hoyStr)
    .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
}

function getCategoriasConEventos() {
  const categorias = new Set();
  getEventos().forEach((e) => categorias.add(e.categoria));
  return Array.from(categorias).sort();
}

function buscarEventos(termino) {
  if (!termino || termino.trim() === "") return getEventos();
  const t = termino.toLowerCase();
  return getEventos().filter(
    (e) =>
      e.nombre.toLowerCase().includes(t) ||
      e.categoria.toLowerCase().includes(t) ||
      (e.ubicacion && e.ubicacion.toLowerCase().includes(t)),
  );
}

function limpiarEventosExpirados() {
  const eventos = getEventos();
  const ahora = new Date();
  let eventosModificados = false;

  const eventosFiltrados = eventos.filter((evento) => {
    let fechaExpiracion;

    if (evento.fechaFin && evento.fechaFin !== evento.fechaInicio) {
      fechaExpiracion = new Date(evento.fechaFin);
      if (evento.horaFin) {
        const [horas, minutos] = evento.horaFin.split(":");
        fechaExpiracion.setHours(parseInt(horas) + 8, parseInt(minutos));
      } else {
        fechaExpiracion.setHours(23, 59, 59);
      }
    } else {
      fechaExpiracion = new Date(evento.fechaInicio);
      if (evento.horaFin) {
        const [horas, minutos] = evento.horaFin.split(":");
        fechaExpiracion.setHours(parseInt(horas) + 8, parseInt(minutos));
      } else if (evento.horaInicio) {
        const [horas, minutos] = evento.horaInicio.split(":");
        fechaExpiracion.setHours(parseInt(horas) + 12, parseInt(minutos));
      } else {
        fechaExpiracion.setHours(23, 59, 59);
      }
    }

    if (ahora > fechaExpiracion) {
      eventosModificados = true;
      return false;
    }
    return true;
  });

  if (eventosModificados) {
    guardarEventos(eventosFiltrados);
  }
}

limpiarEventosExpirados();
setInterval(limpiarEventosExpirados, 60 * 60 * 1000);

function formatFechaShort(fechaStr) {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("-");
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  return `${parseInt(day)} ${meses[parseInt(month) - 1]}`;
}

function formatFechaDDMMYYYY(fechaStr) {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("-");
  return `${day}/${month}/${year}`;
}

function testFormat(fechaStr) {
  const [year, month, day] = fechaStr.split("-");
  console.log("year:", year, "month:", month, "day:", day);
  return `${day}/${month}/${year}`;
}

function formatFechaCompleta(fechaStr) {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("-");
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const fechaUTC = new Date(
    Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
  );
  const diaSemana = dias[fechaUTC.getUTCDay()];

  return `${diaSemana}, ${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
}

function getIcono(categoria) {
  const iconos = {
    Conciertos: "🎵",
    Teatro: "🎭",
    Cine: "🎬",
    Exposiciones: "🖼️",
    Danza: "💃",
    Libros: "📚",
    Festival: "🎉",
    Infantiles: "🧸",
    Deportes: "⚽",
    Talleres: "🔧",
    Museos: "🏛️",
    Ferias: "🛍️",
    Farándula: "✨",
  };
  return iconos[categoria] || "📌";
}

function getEtiquetaAptoMenores(aptoMenores) {
  if (aptoMenores === true) {
    return { texto: "Todas las edades", clase: "badge-menores-si" };
  } else {
    return { texto: "Solo Adultos", clase: "badge-menores-no" };
  }
}

function getEtiquetaAireLibre(aireLibre) {
  if (aireLibre === true) {
    return { texto: "Aire libre", clase: "badge-aire-si" };
  } else {
    return { texto: "Bajo techo", clase: "badge-aire-no" };
  }
}

function actualizarEvento(id, datosActualizados) {
  const eventos = getEventos();
  const index = eventos.findIndex((e) => e.id === id);

  if (index === -1) {
    console.log("❌ Evento no encontrado:", id);
    return false;
  }

  eventos[index] = {
    ...eventos[index],
    ...datosActualizados,
    id: eventos[index].id,
  };
  guardarEventos(eventos);
  console.log("✅ Evento actualizado:", eventos[index].nombre);
  return true;
}

function eliminarEvento(id) {
  const eventos = getEventos();
  const index = eventos.findIndex((e) => e.id === id);

  if (index === -1) {
    console.log("❌ Evento no encontrado:", id);
    return false;
  }

  const eventoEliminado = eventos[index];
  eventos.splice(index, 1);
  guardarEventos(eventos);
  console.log("🗑️ Evento eliminado:", eventoEliminado.nombre);
  return true;
}

function puedeEditarEvento(usuario, evento) {
  if (!usuario) return false;
  if (esAdministrador(usuario)) return true;
  return evento.creadoPor === usuario.id;
}

// Función para agregar un evento a los recordatorios del usuario
function agregarRecordatorio(usuarioId, eventoId) {
  const usuarios = getUsuarios();
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (usuario && !usuario.recordatorios.includes(eventoId)) {
    usuario.recordatorios.push(eventoId);
    guardarUsuarios(usuarios);

    // Actualizar la sesión actual si es el mismo usuario
    const usuarioActual = getUsuarioActual();
    if (usuarioActual && usuarioActual.id === usuarioId) {
      usuarioActual.recordatorios = usuario.recordatorios;
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    }
    return true;
  }
  return false;
}

// Función para eliminar un evento de los recordatorios
function eliminarRecordatorio(usuarioId, eventoId) {
  const usuarios = getUsuarios();
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (usuario) {
    const index = usuario.recordatorios.indexOf(eventoId);
    if (index !== -1) {
      usuario.recordatorios.splice(index, 1);
      guardarUsuarios(usuarios);

      // Actualizar la sesión actual
      const usuarioActual = getUsuarioActual();
      if (usuarioActual && usuarioActual.id === usuarioId) {
        usuarioActual.recordatorios = usuario.recordatorios;
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
      }
      return true;
    }
  }
  return false;
}

// Función para verificar si un evento está en los recordatorios del usuario
function esRecordatorio(usuarioId, eventoId) {
  if (!usuarioId) return false;
  const usuarios = getUsuarios();
  const usuario = usuarios.find((u) => u.id === usuarioId);
  return usuario ? usuario.recordatorios.includes(eventoId) : false;
}

inicializarDatos();
