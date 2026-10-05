/* =========================================================
   CHERRY ACADEMY - CONTROL ESCOLAR
   Aplicación web
========================================================= */

const PIN_CORRECTO = "1234";
const CLAVE_DATOS = "cherryAcademyDatos";

const DATOS_INICIALES = {
    alumnos: [],
    profesores: [],
    grupos: [],
    materias: [],
    calificaciones: [],
    asistencias: [],
    tareas: []
};

let datos = cargarDatos();

/* =========================================================
   DATOS / LOCAL STORAGE
========================================================= */

function cargarDatos() {
    try {
        const guardado = localStorage.getItem(CLAVE_DATOS);

        if (!guardado) {
            return JSON.parse(JSON.stringify(DATOS_INICIALES));
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
        return JSON.parse(JSON.stringify(DATOS_INICIALES));
    }
}

function guardarDatos() {
    try {
        localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
    } catch (error) {
        console.error("Error al guardar datos:", error);
    }
}

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

    window.scrollTo(0, 0);
}

function mostrarInicio() {
    const campo = document.getElementById("campo-pin");
    const mensaje = document.getElementById("mensaje-login");

    if (campo) {
        campo.value = "";
    }

    if (mensaje) {
        mensaje.textContent = "";
    }

    mostrarPantalla("pantalla-inicio");
}

function mostrarLogin() {
    mostrarPantalla("pantalla-login");

    setTimeout(() => {
        const campo = document.getElementById("campo-pin");

        if (campo) {
            campo.focus();
        }
    }, 100);
}

function validarAcceso() {
    const campo = document.getElementById("campo-pin");
    const mensaje = document.getElementById("mensaje-login");

    if (!campo || !mensaje) {
        return;
    }

    const pin = campo.value.trim();

    if (pin === PIN_CORRECTO) {
        mensaje.textContent = "";
        campo.value = "";

        mostrarPantalla("pantalla-menu");

    } else {
        mensaje.textContent = "PIN incorrecto. Intenta nuevamente.";
        campo.value = "";
        campo.focus();
    }
}

function salirSistema() {
    cerrarModal();
    mostrarInicio();
}

/* =========================================================
   UTILIDADES
========================================================= */

function escaparHTML(valor) {
    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function obtenerValor(id) {
    const elemento = document.getElementById(id);

    if (!elemento) {
        return "";
    }

    return elemento.value.trim();
}

function limpiarModulo() {
    document
        .querySelectorAll("#contenido-modulo input, #contenido-modulo select, #contenido-modulo textarea")
        .forEach(elemento => {
            elemento.value = "";
        });
}

function mostrarMensaje(titulo, mensaje) {
    const modal = document.getElementById("modal");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalContenido = document.getElementById("modal-contenido");

    if (!modal) {
        return;
    }

    if (modalTitulo) {
        modalTitulo.textContent = titulo;
    }

    if (modalContenido) {
        modalContenido.textContent = mensaje;
    }

    modal.classList.remove("oculto");
    modal.classList.add("activo");
}

function cerrarModal() {
    const modal = document.getElementById("modal");

    if (!modal) {
        return;
    }

    modal.classList.remove("activo");
    modal.classList.add("oculto");
}

function volverMenu() {
    document.getElementById("contenido-modulo").innerHTML = "";
    mostrarPantalla("pantalla-menu");
}

/* =========================================================
   ABRIR MÓDULOS
========================================================= */

function abrirModulo(modulo) {

    const contenido = document.getElementById("contenido-modulo");

    if (!contenido) {
        return;
    }

    mostrarPantalla("pantalla-modulo");

    switch (modulo) {

        case "alumnos":
            moduloAlumnos();
            break;

        case "profesores":
            moduloProfesores();
            break;

        case "grupos":
            moduloGrupos();
            break;

        case "materias":
            moduloMaterias();
            break;

        case "calificaciones":
            moduloCalificaciones();
            break;

        case "asistencias":
            moduloAsistencias();
            break;

        case "tareas":
            moduloTareas();
            break;

        case "reportes":
            moduloReportes();
            break;

        default:
            volverMenu();
            break;
    }
}

/* =========================================================
   ALUMNOS
========================================================= */

function moduloAlumnos() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Alumnos</h1>
                <p>Administración de estudiantes</p>
            </div>

            <button class="boton boton-secundario" type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Matrícula</label>
                    <input id="alumno-matricula" class="campo"
                        placeholder="Ej. A001">
                </div>

                <div class="campo-grupo">
                    <label>Nombre</label>
                    <input id="alumno-nombre" class="campo"
                        placeholder="Nombre">
                </div>

                <div class="campo-grupo">
                    <label>Apellido</label>
                    <input id="alumno-apellido" class="campo"
                        placeholder="Apellido">
                </div>

                <div class="campo-grupo">
                    <label>Grupo</label>
                    <input id="alumno-grupo" class="campo"
                        placeholder="Ej. 502-B">
                </div>

                <div class="campo-grupo">
                    <label>Teléfono</label>
                    <input id="alumno-telefono" class="campo"
                        placeholder="Teléfono">
                </div>

                <div class="campo-grupo">
                    <label>Correo</label>
                    <input id="alumno-correo" class="campo"
                        type="email"
                        placeholder="correo@ejemplo.com">
                </div>

                <div class="campo-grupo">
                    <label>Fecha de nacimiento</label>
                    <input id="alumno-fecha" class="campo"
                        type="date">
                </div>

            </div>

            <div class="botones-grid">

                <button class="boton boton-principal"
                    type="button"
                    onclick="guardarAlumno()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="buscarAlumno()">
                    BUSCAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="editarAlumno()">
                    EDITAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarAlumno()">
                    ELIMINAR
                </button>

            </div>

        </div>

        <div class="tarjeta">
            <h2>Alumnos registrados</h2>

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
                            <th>Fecha nacimiento</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-alumnos"></tbody>
                </table>
            </div>
        </div>
    `;

    actualizarTablaAlumnos();
}

function guardarAlumno() {

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
            "Completa matrícula, nombre y apellido."
        );
        return;
    }

    const existe = datos.alumnos.some(
        alumno => alumno.matricula.toLowerCase() === matricula.toLowerCase()
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
    actualizarTablaAlumnos();
    limpiarModulo();

    mostrarMensaje(
        "Alumno guardado",
        "El alumno se registró correctamente."
    );
}

function buscarAlumno() {

    const matricula = obtenerValor("alumno-matricula");

    if (!matricula) {
        mostrarMensaje(
            "Buscar alumno",
            "Escribe una matrícula para buscar."
        );
        return;
    }

    const alumno = datos.alumnos.find(
        elemento =>
            elemento.matricula.toLowerCase() === matricula.toLowerCase()
    );

    if (!alumno) {
        mostrarMensaje(
            "No encontrado",
            "No existe un alumno con esa matrícula."
        );
        return;
    }

    document.getElementById("alumno-nombre").value = alumno.nombre;
    document.getElementById("alumno-apellido").value = alumno.apellido;
    document.getElementById("alumno-grupo").value = alumno.grupo;
    document.getElementById("alumno-telefono").value = alumno.telefono;
    document.getElementById("alumno-correo").value = alumno.correo;
    document.getElementById("alumno-fecha").value = alumno.fecha;

    mostrarMensaje(
        "Alumno encontrado",
        "Los datos del alumno fueron cargados."
    );
}

function editarAlumno() {

    const matricula = obtenerValor("alumno-matricula");

    const alumno = datos.alumnos.find(
        elemento =>
            elemento.matricula.toLowerCase() === matricula.toLowerCase()
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
    actualizarTablaAlumnos();

    mostrarMensaje(
        "Alumno actualizado",
        "Los datos fueron modificados correctamente."
    );
}

function eliminarAlumno() {

    const matricula = obtenerValor("alumno-matricula");

    const posicion = datos.alumnos.findIndex(
        elemento =>
            elemento.matricula.toLowerCase() === matricula.toLowerCase()
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrado",
            "No existe ese alumno."
        );
        return;
    }

    datos.alumnos.splice(posicion, 1);

    guardarDatos();
    actualizarTablaAlumnos();
    limpiarModulo();

    mostrarMensaje(
        "Alumno eliminado",
        "El alumno fue eliminado correctamente."
    );
}

function actualizarTablaAlumnos() {

    const tabla = document.getElementById("tabla-alumnos");

    if (!tabla) {
        return;
    }

    if (datos.alumnos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="sin-datos">
                    No hay alumnos registrados.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.alumnos.map(alumno => `
        <tr>
            <td>${escaparHTML(alumno.matricula)}</td>
            <td>${escaparHTML(alumno.nombre)}</td>
            <td>${escaparHTML(alumno.apellido)}</td>
            <td>${escaparHTML(alumno.grupo)}</td>
            <td>${escaparHTML(alumno.telefono)}</td>
            <td>${escaparHTML(alumno.correo)}</td>
            <td>${escaparHTML(alumno.fecha)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   PROFESORES
========================================================= */

function moduloProfesores() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Profesores</h1>
                <p>Administración de docentes</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Número de empleado</label>
                    <input id="profesor-numero" class="campo"
                        placeholder="Ej. P001">
                </div>

                <div class="campo-grupo">
                    <label>Nombre</label>
                    <input id="profesor-nombre" class="campo"
                        placeholder="Nombre">
                </div>

                <div class="campo-grupo">
                    <label>Apellido</label>
                    <input id="profesor-apellido" class="campo"
                        placeholder="Apellido">
                </div>

                <div class="campo-grupo">
                    <label>Especialidad</label>
                    <input id="profesor-especialidad" class="campo"
                        placeholder="Especialidad">
                </div>

                <div class="campo-grupo">
                    <label>Teléfono</label>
                    <input id="profesor-telefono" class="campo"
                        placeholder="Teléfono">
                </div>

                <div class="campo-grupo">
                    <label>Correo</label>
                    <input id="profesor-correo" class="campo"
                        type="email"
                        placeholder="correo@ejemplo.com">
                </div>

            </div>

            <div class="botones-grid">

                <button class="boton boton-principal"
                    type="button"
                    onclick="guardarProfesor()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="buscarProfesor()">
                    BUSCAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="editarProfesor()">
                    EDITAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarProfesor()">
                    ELIMINAR
                </button>

            </div>
        </div>

        <div class="tarjeta">
            <h2>Profesores registrados</h2>

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

                    <tbody id="tabla-profesores"></tbody>
                </table>
            </div>
        </div>
    `;

    actualizarTablaProfesores();
}

function guardarProfesor() {

    const numero = obtenerValor("profesor-numero");
    const nombre = obtenerValor("profesor-nombre");
    const apellido = obtenerValor("profesor-apellido");
    const especialidad = obtenerValor("profesor-especialidad");
    const telefono = obtenerValor("profesor-telefono");
    const correo = obtenerValor("profesor-correo");

    if (!numero || !nombre || !apellido) {
        mostrarMensaje(
            "Faltan datos",
            "Completa número de empleado, nombre y apellido."
        );
        return;
    }

    if (datos.profesores.some(
        profesor => profesor.numero.toLowerCase() === numero.toLowerCase()
    )) {
        mostrarMensaje(
            "Empleado existente",
            "Ya existe ese número de empleado."
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
    actualizarTablaProfesores();
    limpiarModulo();

    mostrarMensaje(
        "Profesor guardado",
        "El profesor fue registrado correctamente."
    );
}

function buscarProfesor() {

    const numero = obtenerValor("profesor-numero");

    const profesor = datos.profesores.find(
        elemento =>
            elemento.numero.toLowerCase() === numero.toLowerCase()
    );

    if (!profesor) {
        mostrarMensaje(
            "No encontrado",
            "No existe ese profesor."
        );
        return;
    }

    document.getElementById("profesor-nombre").value = profesor.nombre;
    document.getElementById("profesor-apellido").value = profesor.apellido;
    document.getElementById("profesor-especialidad").value = profesor.especialidad;
    document.getElementById("profesor-telefono").value = profesor.telefono;
    document.getElementById("profesor-correo").value = profesor.correo;

    mostrarMensaje(
        "Profesor encontrado",
        "Los datos fueron cargados."
    );
}

function editarProfesor() {

    const numero = obtenerValor("profesor-numero");

    const profesor = datos.profesores.find(
        elemento =>
            elemento.numero.toLowerCase() === numero.toLowerCase()
    );

    if (!profesor) {
        mostrarMensaje(
            "No encontrado",
            "Primero busca un profesor."
        );
        return;
    }

    profesor.nombre = obtenerValor("profesor-nombre");
    profesor.apellido = obtenerValor("profesor-apellido");
    profesor.especialidad = obtenerValor("profesor-especialidad");
    profesor.telefono = obtenerValor("profesor-telefono");
    profesor.correo = obtenerValor("profesor-correo");

    guardarDatos();
    actualizarTablaProfesores();

    mostrarMensaje(
        "Profesor actualizado",
        "Los datos fueron modificados."
    );
}

function eliminarProfesor() {

    const numero = obtenerValor("profesor-numero");

    const posicion = datos.profesores.findIndex(
        elemento =>
            elemento.numero.toLowerCase() === numero.toLowerCase()
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrado",
            "No existe ese profesor."
        );
        return;
    }

    datos.profesores.splice(posicion, 1);

    guardarDatos();
    actualizarTablaProfesores();
    limpiarModulo();

    mostrarMensaje(
        "Profesor eliminado",
        "El profesor fue eliminado."
    );
}

function actualizarTablaProfesores() {

    const tabla = document.getElementById("tabla-profesores");

    if (!tabla) {
        return;
    }

    if (datos.profesores.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="sin-datos">
                    No hay profesores registrados.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.profesores.map(profesor => `
        <tr>
            <td>${escaparHTML(profesor.numero)}</td>
            <td>${escaparHTML(profesor.nombre)}</td>
            <td>${escaparHTML(profesor.apellido)}</td>
            <td>${escaparHTML(profesor.especialidad)}</td>
            <td>${escaparHTML(profesor.telefono)}</td>
            <td>${escaparHTML(profesor.correo)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   GRUPOS
========================================================= */

function moduloGrupos() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Grupos</h1>
                <p>Administración de grupos escolares</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Nombre del grupo</label>
                    <input id="grupo-nombre" class="campo"
                        placeholder="Ej. 502-B">
                </div>

                <div class="campo-grupo">
                    <label>Grado</label>
                    <input id="grupo-grado" class="campo"
                        placeholder="Ej. 4">
                </div>

                <div class="campo-grupo">
                    <label>Especialidad</label>
                    <input id="grupo-especialidad" class="campo"
                        placeholder="Ej. Programación">
                </div>

                <div class="campo-grupo">
                    <label>Turno</label>
                    <select id="grupo-turno" class="campo">
                        <option value="">Selecciona</option>
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                    </select>
                </div>

            </div>

            <div class="botones-grid">

                <button class="boton boton-principal"
                    type="button"
                    onclick="guardarGrupo()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="buscarGrupo()">
                    BUSCAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="editarGrupo()">
                    EDITAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarGrupo()">
                    ELIMINAR
                </button>

            </div>
        </div>

        <div class="tarjeta">

            <h2>Grupos registrados</h2>

            <div class="tabla-contenedor">

                <table class="tabla">

                    <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Grado</th>
                            <th>Especialidad</th>
                            <th>Turno</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-grupos"></tbody>

                </table>

            </div>
        </div>
    `;

    actualizarTablaGrupos();
}

function guardarGrupo() {

    const nombre = obtenerValor("grupo-nombre");
    const grado = obtenerValor("grupo-grado");
    const especialidad = obtenerValor("grupo-especialidad");
    const turno = obtenerValor("grupo-turno");

    if (!nombre) {
        mostrarMensaje(
            "Faltan datos",
            "Escribe el nombre del grupo."
        );
        return;
    }

    if (datos.grupos.some(
        grupo => grupo.nombre.toLowerCase() === nombre.toLowerCase()
    )) {
        mostrarMensaje(
            "Grupo existente",
            "Ese grupo ya está registrado."
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
    actualizarTablaGrupos();
    limpiarModulo();

    mostrarMensaje(
        "Grupo guardado",
        "El grupo fue registrado correctamente."
    );
}

function buscarGrupo() {

    const nombre = obtenerValor("grupo-nombre");

    const grupo = datos.grupos.find(
        elemento =>
            elemento.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!grupo) {
        mostrarMensaje(
            "No encontrado",
            "No existe ese grupo."
        );
        return;
    }

    document.getElementById("grupo-grado").value = grupo.grado;
    document.getElementById("grupo-especialidad").value = grupo.especialidad;
    document.getElementById("grupo-turno").value = grupo.turno;

    mostrarMensaje(
        "Grupo encontrado",
        "Los datos fueron cargados."
    );
}

function editarGrupo() {

    const nombre = obtenerValor("grupo-nombre");

    const grupo = datos.grupos.find(
        elemento =>
            elemento.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (!grupo) {
        mostrarMensaje(
            "No encontrado",
            "Primero busca un grupo."
        );
        return;
    }

    grupo.grado = obtenerValor("grupo-grado");
    grupo.especialidad = obtenerValor("grupo-especialidad");
    grupo.turno = obtenerValor("grupo-turno");

    guardarDatos();
    actualizarTablaGrupos();

    mostrarMensaje(
        "Grupo actualizado",
        "Los datos fueron modificados."
    );
}

function eliminarGrupo() {

    const nombre = obtenerValor("grupo-nombre");

    const posicion = datos.grupos.findIndex(
        elemento =>
            elemento.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrado",
            "No existe ese grupo."
        );
        return;
    }

    datos.grupos.splice(posicion, 1);

    guardarDatos();
    actualizarTablaGrupos();
    limpiarModulo();

    mostrarMensaje(
        "Grupo eliminado",
        "El grupo fue eliminado correctamente."
    );
}

function actualizarTablaGrupos() {

    const tabla = document.getElementById("tabla-grupos");

    if (!tabla) {
        return;
    }

    if (datos.grupos.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="sin-datos">
                    No hay grupos registrados.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.grupos.map(grupo => `
        <tr>
            <td>${escaparHTML(grupo.nombre)}</td>
            <td>${escaparHTML(grupo.grado)}</td>
            <td>${escaparHTML(grupo.especialidad)}</td>
            <td>${escaparHTML(grupo.turno)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   MATERIAS
========================================================= */

function moduloMaterias() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Materias</h1>
                <p>Catálogo de materias</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Clave</label>
                    <input id="materia-clave" class="campo"
                        placeholder="Ej. MAT001">
                </div>

                <div class="campo-grupo">
                    <label>Nombre</label>
                    <input id="materia-nombre" class="campo"
                        placeholder="Nombre de la materia">
                </div>

                <div class="campo-grupo">
                    <label>Horas</label>
                    <input id="materia-horas" class="campo"
                        type="number"
                        min="1"
                        placeholder="Ej. 4">
                </div>

            </div>

            <div class="botones-grid">

                <button class="boton boton-principal"
                    type="button"
                    onclick="guardarMateria()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="buscarMateria()">
                    BUSCAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="editarMateria()">
                    EDITAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarMateria()">
                    ELIMINAR
                </button>

            </div>
        </div>

        <div class="tarjeta">
            <h2>Materias registradas</h2>

            <div class="tabla-contenedor">
                <table class="tabla">
                    <thead>
                        <tr>
                            <th>Clave</th>
                            <th>Materia</th>
                            <th>Horas</th>
                        </tr>
                    </thead>

                    <tbody id="tabla-materias"></tbody>
                </table>
            </div>
        </div>
    `;

    actualizarTablaMaterias();
}

function guardarMateria() {

    const clave = obtenerValor("materia-clave");
    const nombre = obtenerValor("materia-nombre");
    const horas = obtenerValor("materia-horas");

    if (!clave || !nombre) {
        mostrarMensaje(
            "Faltan datos",
            "Completa clave y nombre."
        );
        return;
    }

    if (datos.materias.some(
        materia => materia.clave.toLowerCase() === clave.toLowerCase()
    )) {
        mostrarMensaje(
            "Materia existente",
            "Esa clave ya está registrada."
        );
        return;
    }

    datos.materias.push({
        clave,
        nombre,
        horas
    });

    guardarDatos();
    actualizarTablaMaterias();
    limpiarModulo();

    mostrarMensaje(
        "Materia guardada",
        "La materia fue registrada correctamente."
    );
}

function buscarMateria() {

    const clave = obtenerValor("materia-clave");

    const materia = datos.materias.find(
        elemento =>
            elemento.clave.toLowerCase() === clave.toLowerCase()
    );

    if (!materia) {
        mostrarMensaje(
            "No encontrada",
            "No existe esa materia."
        );
        return;
    }

    document.getElementById("materia-nombre").value = materia.nombre;
    document.getElementById("materia-horas").value = materia.horas;

    mostrarMensaje(
        "Materia encontrada",
        "Los datos fueron cargados."
    );
}

function editarMateria() {

    const clave = obtenerValor("materia-clave");

    const materia = datos.materias.find(
        elemento =>
            elemento.clave.toLowerCase() === clave.toLowerCase()
    );

    if (!materia) {
        mostrarMensaje(
            "No encontrada",
            "Primero busca una materia."
        );
        return;
    }

    materia.nombre = obtenerValor("materia-nombre");
    materia.horas = obtenerValor("materia-horas");

    guardarDatos();
    actualizarTablaMaterias();

    mostrarMensaje(
        "Materia actualizada",
        "Los datos fueron modificados."
    );
}

function eliminarMateria() {

    const clave = obtenerValor("materia-clave");

    const posicion = datos.materias.findIndex(
        elemento =>
            elemento.clave.toLowerCase() === clave.toLowerCase()
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrada",
            "No existe esa materia."
        );
        return;
    }

    datos.materias.splice(posicion, 1);

    guardarDatos();
    actualizarTablaMaterias();
    limpiarModulo();

    mostrarMensaje(
        "Materia eliminada",
        "La materia fue eliminada."
    );
}

function actualizarTablaMaterias() {

    const tabla = document.getElementById("tabla-materias");

    if (!tabla) {
        return;
    }

    if (datos.materias.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="3" class="sin-datos">
                    No hay materias registradas.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.materias.map(materia => `
        <tr>
            <td>${escaparHTML(materia.clave)}</td>
            <td>${escaparHTML(materia.nombre)}</td>
            <td>${escaparHTML(materia.horas)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   CALIFICACIONES
========================================================= */

function moduloCalificaciones() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Calificaciones</h1>
                <p>Registro de calificaciones</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Matrícula</label>
                    <input id="cal-matricula" class="campo"
                        placeholder="Matrícula">
                </div>

                <div class="campo-grupo">
                    <label>Materia</label>
                    <input id="cal-materia" class="campo"
                        placeholder="Materia">
                </div>

                <div class="campo-grupo">
                    <label>Calificación</label>
                    <input id="cal-calificacion" class="campo"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0 - 10">
                </div>

                <div class="campo-grupo">
                    <label>Periodo</label>
                    <select id="cal-periodo" class="campo">
                        <option value="">Selecciona</option>
                        <option value="Primer periodo">Primer periodo</option>
                        <option value="Segundo periodo">Segundo periodo</option>
                        <option value="Tercer periodo">Tercer periodo</option>
                    </select>
                </div>

            </div>

            <div class="botones-grid">

                <button class="boton boton-principal"
                    type="button"
                    onclick="guardarCalificacion()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarCalificacion()">
                    ELIMINAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>
        </div>

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

                    <tbody id="tabla-calificaciones"></tbody>
                </table>
            </div>
        </div>
    `;

    actualizarTablaCalificaciones();
}

function guardarCalificacion() {

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

    const numero = Number(calificacion);

    if (numero < 0 || numero > 10) {
        mostrarMensaje(
            "Calificación inválida",
            "La calificación debe estar entre 0 y 10."
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
    actualizarTablaCalificaciones();
    limpiarModulo();

    mostrarMensaje(
        "Calificación guardada",
        "La calificación fue registrada."
    );
}

function eliminarCalificacion() {

    const matricula = obtenerValor("cal-matricula");
    const materia = obtenerValor("cal-materia");

    const posicion = datos.calificaciones.findIndex(
        elemento =>
            elemento.matricula.toLowerCase() === matricula.toLowerCase() &&
            elemento.materia.toLowerCase() === materia.toLowerCase()
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrada",
            "No se encontró esa calificación."
        );
        return;
    }

    datos.calificaciones.splice(posicion, 1);

    guardarDatos();
    actualizarTablaCalificaciones();
    limpiarModulo();

    mostrarMensaje(
        "Calificación eliminada",
        "La calificación fue eliminada."
    );
}

function actualizarTablaCalificaciones() {

    const tabla = document.getElementById("tabla-calificaciones");

    if (!tabla) {
        return;
    }

    if (datos.calificaciones.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="sin-datos">
                    No hay calificaciones registradas.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.calificaciones.map(cal => `
        <tr>
            <td>${escaparHTML(cal.matricula)}</td>
            <td>${escaparHTML(cal.materia)}</td>
            <td>${escaparHTML(cal.calificacion)}</td>
            <td>${escaparHTML(cal.periodo)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   ASISTENCIAS
========================================================= */

function moduloAsistencias() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Asistencias</h1>
                <p>Control de asistencia</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Matrícula</label>
                    <input id="asis-matricula" class="campo"
                        placeholder="Matrícula">
                </div>

                <div class="campo-grupo">
                    <label>Fecha</label>
                    <input id="asis-fecha" class="campo"
                        type="date">
                </div>

                <div class="campo-grupo">
                    <label>Estado</label>
                    <select id="asis-estado" class="campo">
                        <option value="">Selecciona</option>
                        <option value="Presente">Presente</option>
                        <option value="Ausente">Ausente</option>
                        <option value="Retardo">Retardo</option>
                    </select>
                </div>

                <div class="campo-grupo">
                    <label>Observaciones</label>
                    <textarea id="asis-observaciones"
                        class="campo"
                        rows="3"
                        placeholder="Observaciones"></textarea>
                </div>

            </div>

            <div class="botones-grid">

                <button class="boton boton-principal"
                    type="button"
                    onclick="guardarAsistencia()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarAsistencia()">
                    ELIMINAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>
        </div>

        <div class="tarjeta">
            <h2>Asistencias registradas</h2>

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

                    <tbody id="tabla-asistencias"></tbody>
                </table>
            </div>
        </div>
    `;

    actualizarTablaAsistencias();
}

function guardarAsistencia() {

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
    actualizarTablaAsistencias();
    limpiarModulo();

    mostrarMensaje(
        "Asistencia guardada",
        "La asistencia fue registrada."
    );
}

function eliminarAsistencia() {

    const matricula = obtenerValor("asis-matricula");
    const fecha = obtenerValor("asis-fecha");

    const posicion = datos.asistencias.findIndex(
        elemento =>
            elemento.matricula.toLowerCase() === matricula.toLowerCase() &&
            elemento.fecha === fecha
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrada",
            "No se encontró esa asistencia."
        );
        return;
    }

    datos.asistencias.splice(posicion, 1);

    guardarDatos();
    actualizarTablaAsistencias();
    limpiarModulo();

    mostrarMensaje(
        "Asistencia eliminada",
        "La asistencia fue eliminada."
    );
}

function actualizarTablaAsistencias() {

    const tabla = document.getElementById("tabla-asistencias");

    if (!tabla) {
        return;
    }

    if (datos.asistencias.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="sin-datos">
                    No hay asistencias registradas.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.asistencias.map(asistencia => `
        <tr>
            <td>${escaparHTML(asistencia.matricula)}</td>
            <td>${escaparHTML(asistencia.fecha)}</td>
            <td>${escaparHTML(asistencia.estado)}</td>
            <td>${escaparHTML(asistencia.observaciones)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   TAREAS
========================================================= */

function moduloTareas() {

    const contenido = document.getElementById("contenido-modulo");

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Tareas</h1>
                <p>Control de tareas escolares</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjeta">

            <div class="formulario-grid">

                <div class="campo-grupo">
                    <label>Matrícula</label>
                    <input id="tarea-matricula" class="campo"
                        placeholder="Matrícula">
                </div>

                <div class="campo-grupo">
                    <label>Materia</label>
                    <input id="tarea-materia" class="campo"
                        placeholder="Materia">
                </div>

                <div class="campo-grupo">
                    <label>Tarea</label>
                    <input id="tarea-nombre" class="campo"
                        placeholder="Nombre de la tarea">
                </div>

                <div class="campo-grupo">
                    <label>Fecha de entrega</label>
                    <input id="tarea-fecha" class="campo"
                        type="date">
                </div>

                <div class="campo-grupo">
                    <label>Calificación</label>
                    <input id="tarea-calificacion" class="campo"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        placeholder="0 - 10">
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
                    type="button"
                    onclick="guardarTarea()">
                    GUARDAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="eliminarTarea()">
                    ELIMINAR
                </button>

                <button class="boton boton-secundario"
                    type="button"
                    onclick="limpiarModulo()">
                    LIMPIAR
                </button>

            </div>
        </div>

        <div class="tarjeta">
            <h2>Tareas registradas</h2>

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

                    <tbody id="tabla-tareas"></tbody>
                </table>
            </div>
        </div>
    `;

    actualizarTablaTareas();
}

function guardarTarea() {

    const matricula = obtenerValor("tarea-matricula");
    const materia = obtenerValor("tarea-materia");
    const nombre = obtenerValor("tarea-nombre");
    const fecha = obtenerValor("tarea-fecha");
    const calificacion = obtenerValor("tarea-calificacion");
    const estado = obtenerValor("tarea-estado");

    if (!matricula || !materia || !nombre) {
        mostrarMensaje(
            "Faltan datos",
            "Completa matrícula, materia y tarea."
        );
        return;
    }

    datos.tareas.push({
        matricula,
        materia,
        tarea: nombre,
        fecha,
        calificacion,
        estado
    });

    guardarDatos();
    actualizarTablaTareas();
    limpiarModulo();

    mostrarMensaje(
        "Tarea guardada",
        "La tarea fue registrada correctamente."
    );
}

function eliminarTarea() {

    const matricula = obtenerValor("tarea-matricula");
    const materia = obtenerValor("tarea-materia");
    const nombre = obtenerValor("tarea-nombre");

    const posicion = datos.tareas.findIndex(
        elemento =>
            elemento.matricula.toLowerCase() === matricula.toLowerCase() &&
            elemento.materia.toLowerCase() === materia.toLowerCase() &&
            elemento.tarea.toLowerCase() === nombre.toLowerCase()
    );

    if (posicion === -1) {
        mostrarMensaje(
            "No encontrada",
            "No se encontró esa tarea."
        );
        return;
    }

    datos.tareas.splice(posicion, 1);

    guardarDatos();
    actualizarTablaTareas();
    limpiarModulo();

    mostrarMensaje(
        "Tarea eliminada",
        "La tarea fue eliminada."
    );
}

function actualizarTablaTareas() {

    const tabla = document.getElementById("tabla-tareas");

    if (!tabla) {
        return;
    }

    if (datos.tareas.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="6" class="sin-datos">
                    No hay tareas registradas.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = datos.tareas.map(tarea => `
        <tr>
            <td>${escaparHTML(tarea.matricula)}</td>
            <td>${escaparHTML(tarea.materia)}</td>
            <td>${escaparHTML(tarea.tarea)}</td>
            <td>${escaparHTML(tarea.fecha)}</td>
            <td>${escaparHTML(tarea.calificacion)}</td>
            <td>${escaparHTML(tarea.estado)}</td>
        </tr>
    `).join("");
}

/* =========================================================
   REPORTES
========================================================= */

function moduloReportes() {

    const contenido = document.getElementById("contenido-modulo");

    const promedio = calcularPromedio();

    contenido.innerHTML = `
        <div class="encabezado">
            <div>
                <p class="marca">🍒 CHERRY ACADEMY</p>
                <h1>Reportes</h1>
                <p>Resumen general del sistema</p>
            </div>

            <button class="boton boton-secundario"
                type="button"
                onclick="volverMenu()">
                VOLVER
            </button>
        </div>

        <div class="tarjetas-reportes">

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${datos.alumnos.length}
                </span>
                <span>Alumnos</span>
            </div>

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${datos.profesores.length}
                </span>
                <span>Profesores</span>
            </div>

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${datos.grupos.length}
                </span>
                <span>Grupos</span>
            </div>

            <div class="reporte-card">
                <span class="reporte-numero">
                    ${datos.materias.length}
                </span>
                <span>Materias</span>
            </div>

        </div>

        <div class="tarjeta reporte-detalle">

            <h2>Resumen académico</h2>

            <div class="indicadores">

                <div class="indicador">
                    <strong>${datos.calificaciones.length}</strong>
                    <span>Calificaciones registradas</span>
                </div>

                <div class="indicador">
                    <strong>${datos.asistencias.length}</strong>
                    <span>Asistencias registradas</span>
                </div>

                <div class="indicador">
                    <strong>${datos.tareas.length}</strong>
                    <span>Tareas registradas</span>
                </div>

                <div class="indicador">
                    <strong>${promedio}</strong>
                    <span>Promedio general</span>
                </div>

            </div>

        </div>
    `;
}

function calcularPromedio() {

    if (datos.calificaciones.length === 0) {
        return "0.0";
    }

    const suma = datos.calificaciones.reduce(
        (total, elemento) =>
            total + Number(elemento.calificacion || 0),
        0
    );

    return (suma / datos.calificaciones.length).toFixed(1);
}

/* =========================================================
   TECLA ENTER EN LOGIN
========================================================= */

document.addEventListener("keydown", function(evento) {

    if (evento.key === "Enter") {

        const elementoActivo = document.activeElement;

        if (elementoActivo && elementoActivo.id === "campo-pin") {
            validarAcceso();
        }
    }
});

/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", function() {

    guardarDatos();

    mostrarPantalla("pantalla-inicio");

    cerrarModal();
});