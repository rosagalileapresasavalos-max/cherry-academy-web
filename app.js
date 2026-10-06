/* =========================================================
   🍒 CHERRY ACADEMY - CONTROL ESCOLAR
   Sistema de usuarios, roles, permisos y CRUD
========================================================= */

const CLAVE_DATOS = "cherryAcademyDatos";
const CLAVE_USUARIOS = "cherryAcademyUsuarios";

const DATOS_INICIALES = {
    alumnos: [],
    profesores: [],
    grupos: [],
    materias: [],
    calificaciones: [],
    asistencias: [],
    tareas: []
};

/* =========================================================
   USUARIO ACTUAL
========================================================= */

let usuarioActual = null;

/* =========================================================
   CARGAR Y GUARDAR DATOS
========================================================= */

function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE_DATOS);

        if (!guardado) {
            return { ...DATOS_INICIALES };
        }

        const datosGuardados = JSON.parse(guardado);

        return {
            alumnos: Array.isArray(datosGuardados.alumnos) ? datosGuardados.alumnos : [],
            profesores: Array.isArray(datosGuardados.profesores) ? datosGuardados.profesores : [],
            grupos: Array.isArray(datosGuardados.grupos) ? datosGuardados.grupos : [],
            materias: Array.isArray(datosGuardados.materias) ? datosGuardados.materias : [],
            calificaciones: Array.isArray(datosGuardados.calificaciones) ? datosGuardados.calificaciones : [],
            asistencias: Array.isArray(datosGuardados.asistencias) ? datosGuardados.asistencias : [],
            tareas: Array.isArray(datosGuardados.tareas) ? datosGuardados.tareas : []
        };

    } catch (error) {
        console.error("Error al cargar datos:", error);
        return { ...DATOS_INICIALES };
    }
}

let datos = cargarDatos();

function guardarDatos() {
    localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
}

/* =========================================================
   USUARIOS
========================================================= */

function cargarUsuarios() {
    try {
        const guardado = localStorage.getItem(CLAVE_USUARIOS);

        if (!guardado) {
            return [];
        }

        const usuarios = JSON.parse(guardado);

        return Array.isArray(usuarios) ? usuarios : [];

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        return [];
    }
}

let usuarios = cargarUsuarios();

/*
    Si no existen usuarios, se crea automáticamente
    el administrador principal.

    ID: ADMIN001
    PIN: 1234
*/

function inicializarUsuarios() {

    const usuariosBase = [
        {
            id: "ADMIN001",
            nombre: "Administrador",
            pin: "1234",
            rol: "administrador",
            matricula: "",
            numero: "",
            activo: true
        },
        {
            id: "PROF001",
            nombre: "Profesor de prueba",
            pin: "5678",
            rol: "profesor",
            matricula: "",
            numero: "PROF001",
            activo: true
        },
        {
            id: "ALUM001",
            nombre: "Alumno de prueba",
            pin: "9012",
            rol: "alumno",
            matricula: "ALUM001",
            numero: "",
            activo: true
        }
    ];

    let cambios = false;

    usuariosBase.forEach(usuarioBase => {

        const existe = usuarios.some(
            usuario =>
                usuario.id.toUpperCase() === usuarioBase.id.toUpperCase()
        );

        if (!existe) {
            usuarios.push(usuarioBase);
            cambios = true;
        }
    });

    if (cambios) {
        guardarUsuarios();
    }
}

function guardarUsuarios() {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

inicializarUsuarios();

/* =========================================================
   PANTALLAS
========================================================= */

function mostrarPantalla(id) {

    document.querySelectorAll(".pantalla").forEach(pantalla => {
        pantalla.classList.remove("activa");
    });

    const pantalla = document.getElementById(id);

    if (pantalla) {
        pantalla.classList.add("activa");
    }
}

/* =========================================================
   INICIO / LOGIN
========================================================= */

function mostrarInicio() {

    mostrarPantalla("pantalla-inicio");

    const campoId = document.getElementById("campo-id");
    const campoPin = document.getElementById("campo-pin");
    const mensaje = document.getElementById("mensaje-login");

    if (campoId) {
        campoId.value = "";
    }

    if (campoPin) {
        campoPin.value = "";
    }

    if (mensaje) {
        mensaje.textContent = "";
    }
}

function mostrarLogin() {

    mostrarPantalla("pantalla-login");

    const campoId = document.getElementById("campo-id");
    const campoPin = document.getElementById("campo-pin");

    if (campoId) {
        campoId.focus();
    } else if (campoPin) {
        campoPin.focus();
    }
}

/* =========================================================
   VALIDAR ACCESO
========================================================= */

function validarAcceso() {

    const campoId = document.getElementById("campo-id");
    const campoPin = document.getElementById("campo-pin");
    const mensaje = document.getElementById("mensaje-login");

    const id = campoId
        ? campoId.value.trim().toUpperCase()
        : "";

    const pin = campoPin
        ? campoPin.value.trim()
        : "";

    if (!id || !pin) {

        if (mensaje) {
            mensaje.textContent = "Ingresa tu ID y tu PIN.";
        }

        return;
    }

    const usuario = usuarios.find(u =>
        String(u.id).toUpperCase() === id &&
        String(u.pin) === pin &&
        u.activo !== false
    );

    if (!usuario) {

        if (mensaje) {
            mensaje.textContent = "ID o PIN incorrectos.";
        }

        return;
    }

    usuarioActual = usuario;

    if (mensaje) {
        mensaje.textContent = "";
    }

    actualizarMenuPorRol();

    mostrarPantalla("pantalla-menu");
}

/* =========================================================
   ROLES
========================================================= */

function esAdministrador() {
    return usuarioActual &&
        usuarioActual.rol === "administrador";
}

function esProfesor() {
    return usuarioActual &&
        usuarioActual.rol === "profesor";
}

function esAlumno() {
    return usuarioActual &&
        usuarioActual.rol === "alumno";
}

/* =========================================================
   NOMBRE DEL ROL
========================================================= */

function obtenerNombreRol(rol) {

    switch (rol) {

        case "administrador":
            return "Administrador";

        case "profesor":
            return "Profesor";

        case "alumno":
            return "Alumno";

        default:
            return "Usuario";
    }
}

/* =========================================================
   ACTUALIZAR MENÚ SEGÚN ROL
========================================================= */

function actualizarMenuPorRol() {

    const menu = document.getElementById("pantalla-menu");

    if (!menu || !usuarioActual) {
        return;
    }

    const encabezado = menu.querySelector(".encabezado-menu");

    if (encabezado) {

        let infoRol = encabezado.querySelector(".info-usuario");

        if (!infoRol) {

            infoRol = document.createElement("p");
            infoRol.className = "info-usuario";

            const contenedorTexto = encabezado.querySelector("div");

            if (contenedorTexto) {
                contenedorTexto.appendChild(infoRol);
            }
        }

        infoRol.textContent =
            `${usuarioActual.nombre} · ${obtenerNombreRol(usuarioActual.rol)}`;
    }

    document.querySelectorAll(".tarjeta-menu").forEach(tarjeta => {

        const modulo = obtenerModuloTarjeta(tarjeta);

        if (tieneAccesoModulo(modulo)) {
            tarjeta.style.display = "";
        } else {
            tarjeta.style.display = "none";
        }
    });
}

/* =========================================================
   OBTENER MÓDULO DE TARJETA
========================================================= */

function obtenerModuloTarjeta(tarjeta) {

    const onclick = tarjeta.getAttribute("onclick") || "";

    const coincidencia = onclick.match(
        /abrirModulo\(['"]([^'"]+)['"]\)/
    );

    return coincidencia ? coincidencia[1] : "";
}

/* =========================================================
   PERMISOS DE MÓDULOS
========================================================= */

function tieneAccesoModulo(modulo) {

    if (esAdministrador()) {
        return true;
    }

    if (esProfesor()) {

        const permitidosProfesor = [
            "alumnos",
            "grupos",
            "materias",
            "calificaciones",
            "asistencias",
            "tareas",
            "reportes"
        ];

        return permitidosProfesor.includes(modulo);
    }

    if (esAlumno()) {

        const permitidosAlumno = [
            "calificaciones",
            "asistencias",
            "tareas",
            "reportes"
        ];

        return permitidosAlumno.includes(modulo);
    }

    return false;
}

/* =========================================================
   PERMISO DE EDICIÓN
========================================================= */

function puedeEditar(modulo) {

    if (esAdministrador()) {
        return true;
    }

    if (esProfesor()) {

        return [
            "calificaciones",
            "asistencias",
            "tareas"
        ].includes(modulo);
    }

    return false;
}

/* =========================================================
   PERMISO DE ELIMINACIÓN
========================================================= */

function puedeEliminar(modulo) {

    if (esAdministrador()) {
        return true;
    }

    if (esProfesor()) {

        return [
            "calificaciones",
            "asistencias",
            "tareas"
        ].includes(modulo);
    }

    return false;
}

/* =========================================================
   MENSAJE DE ACCESO DENEGADO
========================================================= */

function mostrarAccesoDenegado() {

    mostrarMensaje(
        "Acceso restringido 🔒",
        "Tu tipo de usuario no tiene permiso para realizar esta acción."
    );
}

/* =========================================================
   SALIR
========================================================= */

function salirSistema() {

    usuarioActual = null;

    cerrarModal();

    mostrarInicio();
}

/* =========================================================
   UTILIDADES
========================================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function obtenerValor(id) {

    const elemento = document.getElementById(id);

    return elemento
        ? elemento.value.trim()
        : "";
}

function limpiarModulo() {

    const modulo = document.getElementById("contenido-modulo");

    if (!modulo) {
        return;
    }

    modulo.querySelectorAll("input, select, textarea").forEach(elemento => {

        elemento.value = "";

    });
}

function volverMenu() {

    cerrarModal();

    actualizarMenuPorRol();

    mostrarPantalla("pantalla-menu");
}

/* =========================================================
   MODAL
========================================================= */

let funcionConfirmacion = null;

function mostrarMensaje(titulo, mensaje) {

    const modal = document.getElementById("modal");
    const tituloModal = document.getElementById("modal-titulo");
    const contenido = document.getElementById("modal-contenido");

    if (!modal) {
        alert(`${titulo}\n\n${mensaje}`);
        return;
    }

    if (tituloModal) {
        tituloModal.textContent = titulo;
    }

    if (contenido) {
        contenido.innerHTML = `
            <p>${escaparHTML(mensaje)}</p>
        `;
    }

    funcionConfirmacion = null;

    modal.classList.remove("oculto");
    modal.classList.add("activo");
}

function cerrarModal() {

    const modal = document.getElementById("modal");

    if (modal) {
        modal.classList.remove("activo");
        modal.classList.add("oculto");
    }

    funcionConfirmacion = null;
}

/* =========================================================
   CONFIRMACIÓN DE ELIMINACIÓN
========================================================= */

function confirmarEliminacion(titulo, mensaje, funcion) {

    const modal = document.getElementById("modal");
    const tituloModal = document.getElementById("modal-titulo");
    const contenido = document.getElementById("modal-contenido");

    if (!modal) {
        if (confirm(mensaje)) {
            funcion();
        }
        return;
    }

    funcionConfirmacion = funcion;

    if (tituloModal) {
        tituloModal.textContent = titulo;
    }

    if (contenido) {

        contenido.innerHTML = `
            <p>${escaparHTML(mensaje)}</p>

            <div class="botones-modal">
                <button
                    class="boton boton-secundario"
                    onclick="cerrarModal()">
                    CANCELAR
                </button>

                <button
                    class="boton boton-eliminar"
                    onclick="ejecutarConfirmacion()">
                    ELIMINAR
                </button>
            </div>
        `;
    }

    modal.classList.remove("oculto");
    modal.classList.add("activo");
}

function ejecutarConfirmacion() {

    if (typeof funcionConfirmacion !== "function") {
        cerrarModal();
        return;
    }

    const funcion = funcionConfirmacion;

    funcionConfirmacion = null;

    cerrarModal();

    funcion();
}

/* =========================================================
   ABRIR MÓDULO
========================================================= */

function abrirModulo(modulo) {

    if (!usuarioActual) {
        mostrarLogin();
        return;
    }

    if (!tieneAccesoModulo(modulo)) {
        mostrarAccesoDenegado();
        return;
    }

    // Primero cambiamos a la pantalla de módulos
    mostrarPantalla("pantalla-modulo");

    switch (modulo) {

        case "alumnos":
            mostrarAlumnos();
            break;

        case "profesores":
            mostrarProfesores();
            break;

        case "grupos":
            mostrarGrupos();
            break;

        case "materias":
            mostrarMaterias();
            break;

        case "calificaciones":
            mostrarCalificaciones();
            break;

        case "asistencias":
            mostrarAsistencias();
            break;

        case "tareas":
            mostrarTareas();
            break;

        case "reportes":
            mostrarReportes();
            break;

        default:
            mostrarMensaje(
                "Módulo",
                "El módulo solicitado no existe."
            );
            break;
    }
}

/* =========================================================
   ALUMNOS
========================================================= */

function mostrarAlumnos() {

    const editable = puedeEditar("alumnos");
    const eliminable = puedeEliminar("alumnos");

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>👩‍🎓 Alumnos</h1>
                <p>Registro y control de alumnos.</p>
            </div>

            <button
                class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Matrícula</label>
                    <input id="alumno-matricula" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Nombre</label>
                    <input id="alumno-nombre" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Apellido</label>
                    <input id="alumno-apellido" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Grupo</label>
                    <input id="alumno-grupo" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Teléfono</label>
                    <input id="alumno-telefono" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Correo</label>
                    <input id="alumno-correo" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Fecha de nacimiento</label>
                    <input id="alumno-fecha" type="date" class="campo">
                </div>

            </div>

            <div class="botones-grid">

                ${editable ? `
                    <button class="boton boton-principal"
                        onclick="guardarAlumno()">
                        GUARDAR
                    </button>

                    <button class="boton boton-secundario"
                        onclick="editarAlumno()">
                        EDITAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="buscarAlumno()">
                    BUSCAR
                </button>

                ${eliminable ? `
                    <button class="boton boton-salir"
                        onclick="eliminarAlumno()">
                        ELIMINAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>

        </div>

        <div class="tarjeta">

            <h2>Lista de alumnos</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Grupo</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            datos.alumnos.length
                            ? datos.alumnos.map(a => `
                                <tr>
                                    <td>${escaparHTML(a.matricula)}</td>
                                    <td>${escaparHTML(a.nombre)}</td>
                                    <td>${escaparHTML(a.apellido)}</td>
                                    <td>${escaparHTML(a.grupo)}</td>
                                    <td>${escaparHTML(a.telefono)}</td>
                                    <td>${escaparHTML(a.correo)}</td>
                                    <td>${escaparHTML(a.fecha)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="7" class="sin-datos">
                                        No hay alumnos registrados.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarAlumno() {

    if (!puedeEditar("alumnos")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("alumno-matricula");
    const nombre = obtenerValor("alumno-nombre");
    const apellido = obtenerValor("alumno-apellido");
    const grupo = obtenerValor("alumno-grupo");
    const telefono = obtenerValor("alumno-telefono");
    const correo = obtenerValor("alumno-correo");
    const fecha = obtenerValor("alumno-fecha");

    if (!matricula || !nombre || !apellido) {

        mostrarMensaje(
            "Faltan datos",
            "Ingresa matrícula, nombre y apellido."
        );

        return;
    }

    const existe = datos.alumnos.some(
        a => String(a.matricula).toLowerCase() === matricula.toLowerCase()
    );

    if (existe) {

        mostrarMensaje(
            "Matrícula existente",
            "Ya existe un alumno con esa matrícula."
        );

        return;
    }

    datos.alumnos.push({
        matricula,
        nombre,
        apellido,
        grupo,
        telefono,
        correo,
        fecha
    });

    guardarDatos();

    mostrarMensaje(
        "Alumno guardado 🍒",
        "El alumno se registró correctamente."
    );

    mostrarAlumnos();
}

function buscarAlumno() {

    const matricula = obtenerValor("alumno-matricula");

    if (!matricula) {
        mostrarMensaje(
            "Buscar alumno",
            "Ingresa una matrícula para buscar."
        );
        return;
    }

    const alumno = datos.alumnos.find(
        a => String(a.matricula).toLowerCase() === matricula.toLowerCase()
    );

    if (!alumno) {

        mostrarMensaje(
            "No encontrado",
            "No existe un alumno con esa matrícula."
        );

        return;
    }

    document.getElementById("alumno-nombre").value = alumno.nombre || "";
    document.getElementById("alumno-apellido").value = alumno.apellido || "";
    document.getElementById("alumno-grupo").value = alumno.grupo || "";
    document.getElementById("alumno-telefono").value = alumno.telefono || "";
    document.getElementById("alumno-correo").value = alumno.correo || "";
    document.getElementById("alumno-fecha").value = alumno.fecha || "";
}

function editarAlumno() {

    if (!puedeEditar("alumnos")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("alumno-matricula");

    const alumno = datos.alumnos.find(
        a => String(a.matricula).toLowerCase() === matricula.toLowerCase()
    );

    if (!alumno) {

        mostrarMensaje(
            "No encontrado",
            "Primero busca un alumno existente."
        );

        return;
    }

    alumno.nombre = obtenerValor("alumno-nombre");
    alumno.apellido = obtenerValor("alumno-apellido");
    alumno.grupo = obtenerValor("alumno-grupo");
    alumno.telefono = obtenerValor("alumno-telefono");
    alumno.correo = obtenerValor("alumno-correo");
    alumno.fecha = obtenerValor("alumno-fecha");

    guardarDatos();

    mostrarMensaje(
        "Alumno actualizado ✨",
        "Los datos fueron actualizados correctamente."
    );

    mostrarAlumnos();
}

function eliminarAlumno() {

    if (!puedeEliminar("alumnos")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("alumno-matricula");

    if (!matricula) {

        mostrarMensaje(
            "Eliminar alumno",
            "Ingresa la matrícula del alumno."
        );

        return;
    }

    const indice = datos.alumnos.findIndex(
        a => String(a.matricula).toLowerCase() === matricula.toLowerCase()
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrado",
            "No existe un alumno con esa matrícula."
        );

        return;
    }

    const alumno = datos.alumnos[indice];

    confirmarEliminacion(
        "¿Eliminar alumno? 🗑️",
        `¿Seguro que deseas eliminar a ${alumno.nombre} ${alumno.apellido}? Esta acción no se puede deshacer.`,
        () => {

            datos.alumnos.splice(indice, 1);

            guardarDatos();

            mostrarAlumnos();

            mostrarMensaje(
                "Alumno eliminado",
                "El alumno fue eliminado correctamente."
            );
        }
    );
}

/* =========================================================
   PROFESORES
========================================================= */

function mostrarProfesores() {

    const editable = puedeEditar("profesores");
    const eliminable = puedeEliminar("profesores");

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>👩‍🏫 Profesores</h1>
                <p>Registro de docentes.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Número de empleado</label>
                    <input id="profesor-numero" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Nombre</label>
                    <input id="profesor-nombre" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Apellido</label>
                    <input id="profesor-apellido" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Especialidad</label>
                    <input id="profesor-especialidad" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Teléfono</label>
                    <input id="profesor-telefono" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Correo</label>
                    <input id="profesor-correo" class="campo">
                </div>

            </div>

            <div class="botones-grid">

                ${editable ? `
                    <button class="boton boton-principal"
                        onclick="guardarProfesor()">
                        GUARDAR
                    </button>

                    <button class="boton boton-secundario"
                        onclick="editarProfesor()">
                        EDITAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="buscarProfesor()">
                    BUSCAR
                </button>

                ${eliminable ? `
                    <button class="boton boton-salir"
                        onclick="eliminarProfesor()">
                        ELIMINAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>

        </div>

        <div class="tarjeta">

            <h2>Lista de profesores</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Especialidad</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            datos.profesores.length
                            ? datos.profesores.map(p => `
                                <tr>
                                    <td>${escaparHTML(p.numero)}</td>
                                    <td>${escaparHTML(p.nombre)}</td>
                                    <td>${escaparHTML(p.apellido)}</td>
                                    <td>${escaparHTML(p.especialidad)}</td>
                                    <td>${escaparHTML(p.telefono)}</td>
                                    <td>${escaparHTML(p.correo)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="6" class="sin-datos">
                                        No hay profesores registrados.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarProfesor() {

    if (!puedeEditar("profesores")) {
        mostrarAccesoDenegado();
        return;
    }

    const numero = obtenerValor("profesor-numero");
    const nombre = obtenerValor("profesor-nombre");
    const apellido = obtenerValor("profesor-apellido");
    const especialidad = obtenerValor("profesor-especialidad");
    const telefono = obtenerValor("profesor-telefono");
    const correo = obtenerValor("profesor-correo");

    if (!numero || !nombre || !apellido) {

        mostrarMensaje(
            "Faltan datos",
            "Ingresa número de empleado, nombre y apellido."
        );

        return;
    }

    const existe = datos.profesores.some(
        p => String(p.numero).toLowerCase() === numero.toLowerCase()
    );

    if (existe) {

        mostrarMensaje(
            "Número existente",
            "Ya existe un profesor con ese número."
        );

        return;
    }

    datos.profesores.push({
        numero,
        nombre,
        apellido,
        especialidad,
        telefono,
        correo
    });

    guardarDatos();

    mostrarMensaje(
        "Profesor guardado 🍒",
        "El profesor se registró correctamente."
    );

    mostrarProfesores();
}

function buscarProfesor() {

    const numero = obtenerValor("profesor-numero");

    if (!numero) {

        mostrarMensaje(
            "Buscar profesor",
            "Ingresa el número de empleado."
        );

        return;
    }

    const profesor = datos.profesores.find(
        p => String(p.numero).toLowerCase() === numero.toLowerCase()
    );

    if (!profesor) {

        mostrarMensaje(
            "No encontrado",
            "No existe un profesor con ese número."
        );

        return;
    }

    document.getElementById("profesor-nombre").value = profesor.nombre || "";
    document.getElementById("profesor-apellido").value = profesor.apellido || "";
    document.getElementById("profesor-especialidad").value = profesor.especialidad || "";
    document.getElementById("profesor-telefono").value = profesor.telefono || "";
    document.getElementById("profesor-correo").value = profesor.correo || "";
}

function editarProfesor() {

    if (!puedeEditar("profesores")) {
        mostrarAccesoDenegado();
        return;
    }

    const numero = obtenerValor("profesor-numero");

    const profesor = datos.profesores.find(
        p => String(p.numero).toLowerCase() === numero.toLowerCase()
    );

    if (!profesor) {

        mostrarMensaje(
            "No encontrado",
            "Primero busca un profesor existente."
        );

        return;
    }

    profesor.nombre = obtenerValor("profesor-nombre");
    profesor.apellido = obtenerValor("profesor-apellido");
    profesor.especialidad = obtenerValor("profesor-especialidad");
    profesor.telefono = obtenerValor("profesor-telefono");
    profesor.correo = obtenerValor("profesor-correo");

    guardarDatos();

    mostrarMensaje(
        "Profesor actualizado ✨",
        "Los datos fueron actualizados correctamente."
    );

    mostrarProfesores();
}

function eliminarProfesor() {

    if (!puedeEliminar("profesores")) {
        mostrarAccesoDenegado();
        return;
    }

    const numero = obtenerValor("profesor-numero");

    if (!numero) {

        mostrarMensaje(
            "Eliminar profesor",
            "Ingresa el número de empleado."
        );

        return;
    }

    const indice = datos.profesores.findIndex(
        p => String(p.numero).toLowerCase() === numero.toLowerCase()
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrado",
            "No existe un profesor con ese número."
        );

        return;
    }

    const profesor = datos.profesores[indice];

    confirmarEliminacion(
        "¿Eliminar profesor? 🗑️",
        `¿Seguro que deseas eliminar a ${profesor.nombre} ${profesor.apellido}?`,
        () => {

            datos.profesores.splice(indice, 1);

            guardarDatos();

            mostrarProfesores();

            mostrarMensaje(
                "Profesor eliminado",
                "El profesor fue eliminado correctamente."
            );
        }
    );
}

/* =========================================================
   GRUPOS
========================================================= */

function mostrarGrupos() {

    const editable = puedeEditar("grupos");
    const eliminable = puedeEliminar("grupos");

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>👥 Grupos</h1>
                <p>Administración de grupos escolares.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Nombre del grupo</label>
                    <input id="grupo-nombre" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Grado</label>
                    <input id="grupo-grado" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Especialidad</label>
                    <input id="grupo-especialidad" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Turno</label>
                    <input id="grupo-turno" class="campo">
                </div>

            </div>

            <div class="botones-grid">

                ${editable ? `
                    <button class="boton boton-principal"
                        onclick="guardarGrupo()">
                        GUARDAR
                    </button>

                    <button class="boton boton-secundario"
                        onclick="editarGrupo()">
                        EDITAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="buscarGrupo()">
                    BUSCAR
                </button>

                ${eliminable ? `
                    <button class="boton boton-salir"
                        onclick="eliminarGrupo()">
                        ELIMINAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>

        </div>

        <div class="tarjeta">

            <h2>Lista de grupos</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Grado</th>
                            <th>Especialidad</th>
                            <th>Turno</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            datos.grupos.length
                            ? datos.grupos.map(g => `
                                <tr>
                                    <td>${escaparHTML(g.nombre)}</td>
                                    <td>${escaparHTML(g.grado)}</td>
                                    <td>${escaparHTML(g.especialidad)}</td>
                                    <td>${escaparHTML(g.turno)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="4" class="sin-datos">
                                        No hay grupos registrados.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarGrupo() {

    if (!puedeEditar("grupos")) {
        mostrarAccesoDenegado();
        return;
    }

    const nombre = obtenerValor("grupo-nombre");
    const grado = obtenerValor("grupo-grado");
    const especialidad = obtenerValor("grupo-especialidad");
    const turno = obtenerValor("grupo-turno");

    if (!nombre) {

        mostrarMensaje(
            "Faltan datos",
            "Ingresa el nombre del grupo."
        );

        return;
    }

    const existe = datos.grupos.some(
        g => String(g.nombre).toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {

        mostrarMensaje(
            "Grupo existente",
            "Ya existe un grupo con ese nombre."
        );

        return;
    }

    datos.grupos.push({
        nombre,
        grado,
        especialidad,
        turno
    });

    guardarDatos();

    mostrarMensaje(
        "Grupo guardado 🍒",
        "El grupo se registró correctamente."
    );

    mostrarGrupos();
}

function buscarGrupo() {

    const nombre = obtenerValor("grupo-nombre");

    if (!nombre) {

        mostrarMensaje(
            "Buscar grupo",
            "Ingresa el nombre del grupo."
        );

        return;
    }

    const grupo = datos.grupos.find(
        g => String(g.nombre).toLowerCase() === nombre.toLowerCase()
    );

    if (!grupo) {

        mostrarMensaje(
            "No encontrado",
            "No existe ese grupo."
        );

        return;
    }

    document.getElementById("grupo-grado").value = grupo.grado || "";
    document.getElementById("grupo-especialidad").value = grupo.especialidad || "";
    document.getElementById("grupo-turno").value = grupo.turno || "";
}

function editarGrupo() {

    if (!puedeEditar("grupos")) {
        mostrarAccesoDenegado();
        return;
    }

    const nombre = obtenerValor("grupo-nombre");

    const grupo = datos.grupos.find(
        g => String(g.nombre).toLowerCase() === nombre.toLowerCase()
    );

    if (!grupo) {

        mostrarMensaje(
            "No encontrado",
            "Primero busca un grupo existente."
        );

        return;
    }

    grupo.grado = obtenerValor("grupo-grado");
    grupo.especialidad = obtenerValor("grupo-especialidad");
    grupo.turno = obtenerValor("grupo-turno");

    guardarDatos();

    mostrarMensaje(
        "Grupo actualizado ✨",
        "Los datos fueron actualizados correctamente."
    );

    mostrarGrupos();
}

function eliminarGrupo() {

    if (!puedeEliminar("grupos")) {
        mostrarAccesoDenegado();
        return;
    }

    const nombre = obtenerValor("grupo-nombre");

    const indice = datos.grupos.findIndex(
        g => String(g.nombre).toLowerCase() === nombre.toLowerCase()
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrado",
            "No existe ese grupo."
        );

        return;
    }

    confirmarEliminacion(
        "¿Eliminar grupo? 🗑️",
        `¿Seguro que deseas eliminar el grupo "${nombre}"?`,
        () => {

            datos.grupos.splice(indice, 1);

            guardarDatos();

            mostrarGrupos();

            mostrarMensaje(
                "Grupo eliminado",
                "El grupo fue eliminado correctamente."
            );
        }
    );
}

/* =========================================================
   MATERIAS
========================================================= */

function mostrarMaterias() {

    const editable = puedeEditar("materias");
    const eliminable = puedeEliminar("materias");

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>📚 Materias</h1>
                <p>Catálogo de materias escolares.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Clave</label>
                    <input id="materia-clave" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Nombre</label>
                    <input id="materia-nombre" class="campo">
                </div>

                <div class="campo-grupo">
                    <label>Horas</label>
                    <input id="materia-horas" type="number" class="campo">
                </div>

            </div>

            <div class="botones-grid">

                ${editable ? `
                    <button class="boton boton-principal"
                        onclick="guardarMateria()">
                        GUARDAR
                    </button>

                    <button class="boton boton-secundario"
                        onclick="editarMateria()">
                        EDITAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="buscarMateria()">
                    BUSCAR
                </button>

                ${eliminable ? `
                    <button class="boton boton-salir"
                        onclick="eliminarMateria()">
                        ELIMINAR
                    </button>
                ` : ""}

                <button class="boton boton-secundario"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>

        </div>

        <div class="tarjeta">

            <h2>Lista de materias</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Clave</th>
                            <th>Nombre</th>
                            <th>Horas</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            datos.materias.length
                            ? datos.materias.map(m => `
                                <tr>
                                    <td>${escaparHTML(m.clave)}</td>
                                    <td>${escaparHTML(m.nombre)}</td>
                                    <td>${escaparHTML(m.horas)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="3" class="sin-datos">
                                        No hay materias registradas.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarMateria() {

    if (!puedeEditar("materias")) {
        mostrarAccesoDenegado();
        return;
    }

    const clave = obtenerValor("materia-clave");
    const nombre = obtenerValor("materia-nombre");
    const horas = obtenerValor("materia-horas");

    if (!clave || !nombre) {

        mostrarMensaje(
            "Faltan datos",
            "Ingresa clave y nombre de la materia."
        );

        return;
    }

    const existe = datos.materias.some(
        m => String(m.clave).toLowerCase() === clave.toLowerCase()
    );

    if (existe) {

        mostrarMensaje(
            "Clave existente",
            "Ya existe una materia con esa clave."
        );

        return;
    }

    datos.materias.push({
        clave,
        nombre,
        horas
    });

    guardarDatos();

    mostrarMensaje(
        "Materia guardada 🍒",
        "La materia se registró correctamente."
    );

    mostrarMaterias();
}

function buscarMateria() {

    const clave = obtenerValor("materia-clave");

    if (!clave) {

        mostrarMensaje(
            "Buscar materia",
            "Ingresa la clave."
        );

        return;
    }

    const materia = datos.materias.find(
        m => String(m.clave).toLowerCase() === clave.toLowerCase()
    );

    if (!materia) {

        mostrarMensaje(
            "No encontrada",
            "No existe una materia con esa clave."
        );

        return;
    }

    document.getElementById("materia-nombre").value = materia.nombre || "";
    document.getElementById("materia-horas").value = materia.horas || "";
}

function editarMateria() {

    if (!puedeEditar("materias")) {
        mostrarAccesoDenegado();
        return;
    }

    const clave = obtenerValor("materia-clave");

    const materia = datos.materias.find(
        m => String(m.clave).toLowerCase() === clave.toLowerCase()
    );

    if (!materia) {

        mostrarMensaje(
            "No encontrada",
            "Primero busca una materia existente."
        );

        return;
    }

    materia.nombre = obtenerValor("materia-nombre");
    materia.horas = obtenerValor("materia-horas");

    guardarDatos();

    mostrarMensaje(
        "Materia actualizada ✨",
        "Los datos fueron actualizados correctamente."
    );

    mostrarMaterias();
}

function eliminarMateria() {

    if (!puedeEliminar("materias")) {
        mostrarAccesoDenegado();
        return;
    }

    const clave = obtenerValor("materia-clave");

    const indice = datos.materias.findIndex(
        m => String(m.clave).toLowerCase() === clave.toLowerCase()
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrada",
            "No existe una materia con esa clave."
        );

        return;
    }

    confirmarEliminacion(
        "¿Eliminar materia? 🗑️",
        `¿Seguro que deseas eliminar "${datos.materias[indice].nombre}"?`,
        () => {

            datos.materias.splice(indice, 1);

            guardarDatos();

            mostrarMaterias();

            mostrarMensaje(
                "Materia eliminada",
                "La materia fue eliminada correctamente."
            );
        }
    );
}

/* =========================================================
   CALIFICACIONES
========================================================= */

function mostrarCalificaciones() {

    const puedeModificar = puedeEditar("calificaciones");
    const puedeBorrar = puedeEliminar("calificaciones");

    let registros = datos.calificaciones;

    if (esAlumno()) {

        registros = datos.calificaciones.filter(
            c => String(c.matricula) === String(usuarioActual.matricula)
        );
    }

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>📝 Calificaciones</h1>
                <p>Control de calificaciones.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        ${
            puedeModificar
            ? `
            <div class="tarjeta">

                <div class="formulario-grid">

                    <div class="campo-grupo">
                        <label>Matrícula</label>
                        <input id="cal-matricula" class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Materia</label>
                        <input id="cal-materia" class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Calificación</label>
                        <input id="cal-calificacion"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Periodo</label>
                        <input id="cal-periodo" class="campo">
                    </div>

                </div>

                <div class="botones-grid">

                    <button class="boton boton-principal"
                        onclick="guardarCalificacion()">
                        GUARDAR
                    </button>

                    ${
                        puedeBorrar
                        ? `
                        <button class="boton boton-salir"
                            onclick="eliminarCalificacion()">
                            ELIMINAR
                        </button>
                        `
                        : ""
                    }

                    <button class="boton boton-secundario"
                        onclick="limpiarModulo()">
                        LIMPIAR
                    </button>

                </div>

            </div>
            `
            : ""
        }

        <div class="tarjeta">

            <h2>Calificaciones registradas</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Materia</th>
                            <th>Calificación</th>
                            <th>Periodo</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            registros.length
                            ? registros.map(c => `
                                <tr>
                                    <td>${escaparHTML(c.matricula)}</td>
                                    <td>${escaparHTML(c.materia)}</td>
                                    <td>${escaparHTML(c.calificacion)}</td>
                                    <td>${escaparHTML(c.periodo)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="4" class="sin-datos">
                                        No hay calificaciones registradas.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarCalificacion() {

    if (!puedeEditar("calificaciones")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("cal-matricula");
    const materia = obtenerValor("cal-materia");
    const calificacion = obtenerValor("cal-calificacion");
    const periodo = obtenerValor("cal-periodo");

    if (!matricula || !materia || !calificacion) {

        mostrarMensaje(
            "Faltan datos",
            "Completa matrícula, materia y calificación."
        );

        return;
    }

    datos.calificaciones.push({
        matricula,
        materia,
        calificacion,
        periodo
    });

    guardarDatos();

    mostrarMensaje(
        "Calificación guardada 🍒",
        "La calificación fue registrada."
    );

    mostrarCalificaciones();
}

function eliminarCalificacion() {

    if (!puedeEliminar("calificaciones")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("cal-matricula");
    const materia = obtenerValor("cal-materia");

    const indice = datos.calificaciones.findIndex(
        c =>
            String(c.matricula).toLowerCase() === matricula.toLowerCase() &&
            String(c.materia).toLowerCase() === materia.toLowerCase()
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrada",
            "No se encontró esa calificación."
        );

        return;
    }

    confirmarEliminacion(
        "¿Eliminar calificación? 🗑️",
        "¿Seguro que deseas eliminar esta calificación?",
        () => {

            datos.calificaciones.splice(indice, 1);

            guardarDatos();

            mostrarCalificaciones();

            mostrarMensaje(
                "Calificación eliminada",
                "La calificación fue eliminada."
            );
        }
    );
}

/* =========================================================
   ASISTENCIAS
========================================================= */

function mostrarAsistencias() {

    const puedeModificar = puedeEditar("asistencias");
    const puedeBorrar = puedeEliminar("asistencias");

    let registros = datos.asistencias;

    if (esAlumno()) {

        registros = datos.asistencias.filter(
            a => String(a.matricula) === String(usuarioActual.matricula)
        );
    }

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>📅 Asistencias</h1>
                <p>Control de asistencia.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        ${
            puedeModificar
            ? `
            <div class="tarjeta">

                <div class="formulario-grid">

                    <div class="campo-grupo">
                        <label>Matrícula</label>
                        <input id="asis-matricula" class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Fecha</label>
                        <input id="asis-fecha"
                            type="date"
                            class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Estado</label>
                        <select id="asis-estado" class="campo">
                            <option value="">Selecciona</option>
                            <option value="Presente">Presente</option>
                            <option value="Falta">Falta</option>
                            <option value="Retardo">Retardo</option>
                            <option value="Justificada">Justificada</option>
                        </select>
                    </div>

                    <div class="campo-grupo">
                        <label>Observaciones</label>
                        <textarea id="asis-observaciones"
                            class="campo"></textarea>
                    </div>

                </div>

                <div class="botones-grid">

                    <button class="boton boton-principal"
                        onclick="guardarAsistencia()">
                        GUARDAR
                    </button>

                    ${
                        puedeBorrar
                        ? `
                        <button class="boton boton-salir"
                            onclick="eliminarAsistencia()">
                            ELIMINAR
                        </button>
                        `
                        : ""
                    }

                    <button class="boton boton-secundario"
                        onclick="limpiarModulo()">
                        LIMPIAR
                    </button>

                </div>

            </div>
            `
            : ""
        }

        <div class="tarjeta">

            <h2>Registro de asistencias</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Observaciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            registros.length
                            ? registros.map(a => `
                                <tr>
                                    <td>${escaparHTML(a.matricula)}</td>
                                    <td>${escaparHTML(a.fecha)}</td>
                                    <td>${escaparHTML(a.estado)}</td>
                                    <td>${escaparHTML(a.observaciones)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="4" class="sin-datos">
                                        No hay asistencias registradas.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarAsistencia() {

    if (!puedeEditar("asistencias")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("asis-matricula");
    const fecha = obtenerValor("asis-fecha");
    const estado = obtenerValor("asis-estado");
    const observaciones = obtenerValor("asis-observaciones");

    if (!matricula || !fecha || !estado) {

        mostrarMensaje(
            "Faltan datos",
            "Completa matrícula, fecha y estado."
        );

        return;
    }

    datos.asistencias.push({
        matricula,
        fecha,
        estado,
        observaciones
    });

    guardarDatos();

    mostrarMensaje(
        "Asistencia guardada 🍒",
        "La asistencia fue registrada."
    );

    mostrarAsistencias();
}

function eliminarAsistencia() {

    if (!puedeEliminar("asistencias")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("asis-matricula");
    const fecha = obtenerValor("asis-fecha");

    const indice = datos.asistencias.findIndex(
        a =>
            String(a.matricula).toLowerCase() === matricula.toLowerCase() &&
            String(a.fecha) === fecha
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrada",
            "No se encontró esa asistencia."
        );

        return;
    }

    confirmarEliminacion(
        "¿Eliminar asistencia? 🗑️",
        "¿Seguro que deseas eliminar este registro?",
        () => {

            datos.asistencias.splice(indice, 1);

            guardarDatos();

            mostrarAsistencias();

            mostrarMensaje(
                "Asistencia eliminada",
                "El registro fue eliminado."
            );
        }
    );
}

/* =========================================================
   TAREAS
========================================================= */

function mostrarTareas() {

    const puedeModificar = puedeEditar("tareas");
    const puedeBorrar = puedeEliminar("tareas");

    let registros = datos.tareas;

    if (esAlumno()) {

        registros = datos.tareas.filter(
            t => String(t.matricula) === String(usuarioActual.matricula)
        );
    }

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>📚 Tareas</h1>
                <p>Control de tareas escolares.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        ${
            puedeModificar
            ? `
            <div class="tarjeta">

                <div class="formulario-grid">

                    <div class="campo-grupo">
                        <label>Matrícula</label>
                        <input id="tarea-matricula" class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Materia</label>
                        <input id="tarea-materia" class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Tarea</label>
                        <input id="tarea-nombre" class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Fecha de entrega</label>
                        <input id="tarea-fecha"
                            type="date"
                            class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Calificación</label>
                        <input id="tarea-calificacion"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            class="campo">
                    </div>

                    <div class="campo-grupo">
                        <label>Estado</label>
                        <select id="tarea-estado" class="campo">
                            <option value="">Selecciona</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Entregada">Entregada</option>
                            <option value="Calificada">Calificada</option>
                        </select>
                    </div>

                </div>

                <div class="botones-grid">

                    <button class="boton boton-principal"
                        onclick="guardarTarea()">
                        GUARDAR
                    </button>

                    ${
                        puedeBorrar
                        ? `
                        <button class="boton boton-salir"
                            onclick="eliminarTarea()">
                            ELIMINAR
                        </button>
                        `
                        : ""
                    }

                    <button class="boton boton-secundario"
                        onclick="limpiarModulo()">
                        LIMPIAR
                    </button>

                </div>

            </div>
            `
            : ""
        }

        <div class="tarjeta">

            <h2>Lista de tareas</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Materia</th>
                            <th>Tarea</th>
                            <th>Fecha</th>
                            <th>Calificación</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${
                            registros.length
                            ? registros.map(t => `
                                <tr>
                                    <td>${escaparHTML(t.matricula)}</td>
                                    <td>${escaparHTML(t.materia)}</td>
                                    <td>${escaparHTML(t.tarea)}</td>
                                    <td>${escaparHTML(t.fecha)}</td>
                                    <td>${escaparHTML(t.calificacion)}</td>
                                    <td>${escaparHTML(t.estado)}</td>
                                </tr>
                            `).join("")
                            : `
                                <tr>
                                    <td colspan="6" class="sin-datos">
                                        No hay tareas registradas.
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>

        </div>
    `;
}

function guardarTarea() {

    if (!puedeEditar("tareas")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("tarea-matricula");
    const materia = obtenerValor("tarea-materia");
    const tarea = obtenerValor("tarea-nombre");
    const fecha = obtenerValor("tarea-fecha");
    const calificacion = obtenerValor("tarea-calificacion");
    const estado = obtenerValor("tarea-estado");

    if (!matricula || !materia || !tarea) {

        mostrarMensaje(
            "Faltan datos",
            "Completa matrícula, materia y tarea."
        );

        return;
    }

    datos.tareas.push({
        matricula,
        materia,
        tarea,
        fecha,
        calificacion,
        estado
    });

    guardarDatos();

    mostrarMensaje(
        "Tarea guardada 🍒",
        "La tarea fue registrada correctamente."
    );

    mostrarTareas();
}

function eliminarTarea() {

    if (!puedeEliminar("tareas")) {
        mostrarAccesoDenegado();
        return;
    }

    const matricula = obtenerValor("tarea-matricula");
    const materia = obtenerValor("tarea-materia");
    const tarea = obtenerValor("tarea-nombre");

    const indice = datos.tareas.findIndex(
        t =>
            String(t.matricula).toLowerCase() === matricula.toLowerCase() &&
            String(t.materia).toLowerCase() === materia.toLowerCase() &&
            String(t.tarea).toLowerCase() === tarea.toLowerCase()
    );

    if (indice === -1) {

        mostrarMensaje(
            "No encontrada",
            "No se encontró esa tarea."
        );

        return;
    }

    confirmarEliminacion(
        "¿Eliminar tarea? 🗑️",
        `¿Seguro que deseas eliminar la tarea "${tarea}"?`,
        () => {

            datos.tareas.splice(indice, 1);

            guardarDatos();

            mostrarTareas();

            mostrarMensaje(
                "Tarea eliminada",
                "La tarea fue eliminada correctamente."
            );
        }
    );
}

/* =========================================================
   REPORTES
========================================================= */

function mostrarReportes() {

    let alumnos = datos.alumnos;

    if (esAlumno()) {

        alumnos = datos.alumnos.filter(
            a => String(a.matricula) === String(usuarioActual.matricula)
        );
    }

    let calificaciones = datos.calificaciones;

    if (esAlumno()) {

        calificaciones = datos.calificaciones.filter(
            c => String(c.matricula) === String(usuarioActual.matricula)
        );
    }

    let asistencias = datos.asistencias;

    if (esAlumno()) {

        asistencias = datos.asistencias.filter(
            a => String(a.matricula) === String(usuarioActual.matricula)
        );
    }

    let tareas = datos.tareas;

    if (esAlumno()) {

        tareas = datos.tareas.filter(
            t => String(t.matricula) === String(usuarioActual.matricula)
        );
    }

    const promedio = calcularPromedio(calificaciones);

    document.getElementById("contenido-modulo").innerHTML = `

        <div class="encabezado">

            <div>
                <h1>📊 Reportes</h1>
                <p>Resumen del sistema escolar.</p>
            </div>

            <button class="boton boton-secundario"
                onclick="volverMenu()">
                ← VOLVER
            </button>

        </div>

        <div class="tarjetas-reportes">

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${alumnos.length}
                </span>
                <span>Alumnos</span>
            </div>

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${esAlumno() ? "-" : datos.profesores.length}
                </span>
                <span>Profesores</span>
            </div>

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${esAlumno() ? "-" : datos.grupos.length}
                </span>
                <span>Grupos</span>
            </div>

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${esAlumno() ? "-" : datos.materias.length}
                </span>
                <span>Materias</span>
            </div>

        </div>

        <div class="tarjeta reporte-detalle">

            <h2>
                ${
                    esAlumno()
                    ? "Mi información académica"
                    : "Información académica"
                }
            </h2>

            <div class="indicadores">

                <div class="indicador">
                    <strong>${calificaciones.length}</strong>
                    <span>Calificaciones</span>
                </div>

                <div class="indicador">
                    <strong>${asistencias.length}</strong>
                    <span>Asistencias</span>
                </div>

                <div class="indicador">
                    <strong>${tareas.length}</strong>
                    <span>Tareas</span>
                </div>

                <div class="indicador">
                    <strong>${promedio}</strong>
                    <span>Promedio</span>
                </div>

            </div>

        </div>
    `;
}

function calcularPromedio(registros = datos.calificaciones) {

    const calificacionesValidas = registros
        .map(c => Number(c.calificacion))
        .filter(c => !isNaN(c));

    if (calificacionesValidas.length === 0) {
        return "0.0";
    }

    const suma = calificacionesValidas.reduce(
        (total, calificacion) => total + calificacion,
        0
    );

    return (suma / calificacionesValidas.length).toFixed(1);
}

/* =========================================================
   ENTER EN LOGIN
========================================================= */

document.addEventListener("keydown", function(event) {

    if (event.key !== "Enter") {
        return;
    }

    const pantallaLogin =
        document.getElementById("pantalla-login");

    if (
        pantallaLogin &&
        pantallaLogin.classList.contains("activa")
    ) {

        const activo = document.activeElement;

        if (
            activo &&
            (
                activo.id === "campo-id" ||
                activo.id === "campo-pin"
            )
        ) {
            validarAcceso();
        }
    }
});

/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", function() {

    guardarDatos();
    guardarUsuarios();

    mostrarPantalla("pantalla-inicio");

    cerrarModal();
});