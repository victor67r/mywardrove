const API_URL = "http://localhost:8080/prendas";

let prendaEditandoId = null;
let guardandoPrenda = false;


// =====================================================
// ELEMENTOS DEL DOM
// =====================================================

const btnNuevaPrenda =
    document.getElementById("btn-nueva-prenda");

const formularioPrenda =
    document.getElementById("formulario-prenda");

const btnGuardarPrenda =
    document.getElementById("btn-guardar-prenda");

const listaPrendas =
    document.getElementById("lista-prendas");

const estadoSubida =
    document.getElementById("estado-subida");


// =====================================================
// NUEVA PRENDA
// =====================================================

btnNuevaPrenda.addEventListener(
    "click",
    () => {

        prendaEditandoId = null;

        limpiarFormulario();

        btnGuardarPrenda.textContent =
            "Guardar prenda";

        formularioPrenda.classList.toggle(
            "formulario-oculto"
        );

        limpiarEstado();
    }
);


// =====================================================
// GUARDAR / EDITAR PRENDA
// =====================================================

btnGuardarPrenda.addEventListener(
    "click",
    async (event) => {

        event.preventDefault();

        // Evitar varios clics mientras se procesa
        if (guardandoPrenda) {

            console.log(
                "Ya se está guardando una prenda."
            );

            return;
        }

        guardandoPrenda = true;

        btnGuardarPrenda.disabled = true;

        btnGuardarPrenda.textContent =
            "⏳ Procesando...";

        estadoSubida.textContent =
            "⏳ Procesando prenda...";


        console.log(
            "1 - BOTÓN GUARDAR PULSADO"
        );


        // =================================================
        // OBTENER DATOS
        // =================================================

        const nombre =
            document
                .getElementById("nombre")
                .value
                .trim();

        const categoria =
            document
                .getElementById("categoria")
                .value;

        const color =
            document
                .getElementById("color")
                .value
                .trim();

        const marca =
            document
                .getElementById("marca")
                .value
                .trim();

        const inputImagen =
            document.getElementById("imagen");

        const archivo =
            inputImagen.files[0];


        console.log(
            "2 - Nombre:",
            nombre
        );

        console.log(
            "3 - Categoría:",
            categoria
        );

        console.log(
            "4 - Color:",
            color
        );

        console.log(
            "5 - Marca:",
            marca
        );

        console.log(
            "6 - Archivo:",
            archivo
        );


        // =================================================
        // VALIDACIONES
        // =================================================

        if (!nombre) {

            alert(
                "Introduce el nombre de la prenda."
            );

            resetearEstadoGuardar();

            return;
        }


        if (!categoria) {

            alert(
                "Selecciona una categoría."
            );

            resetearEstadoGuardar();

            return;
        }


        try {

            let nombreImagen = "";


            // =================================================
            // EDITAR PRENDA
            // =================================================

            if (prendaEditandoId !== null) {

                console.log(
                    "7 - Editando prenda:",
                    prendaEditandoId
                );


                const respuestaPrendas =
                    await fetch(API_URL);


                if (!respuestaPrendas.ok) {

                    throw new Error(
                        "No se pudieron obtener las prendas."
                    );
                }


                const prendas =
                    await respuestaPrendas.json();


                const prendaActual =
                    prendas.find(
                        prenda =>
                            prenda.id ===
                            prendaEditandoId
                    );


                // Mantener la imagen actual
                if (prendaActual) {

                    nombreImagen =
                        prendaActual.imagen || "";
                }


                // Si se selecciona una imagen nueva
                if (archivo) {

                    estadoSubida.textContent =
                        "⏳ Preparando tu prenda...";


                    console.log(
                        "8 - Subiendo nueva imagen..."
                    );


                    nombreImagen =
                        await subirImagen(
                            archivo
                        );


                    console.log(
                        "9 - Nueva imagen procesada:",
                        nombreImagen
                    );
                }


                const prendaEditada = {

                    nombre: nombre,

                    categoria: categoria,

                    color: color,

                    marca: marca,

                    imagen: nombreImagen
                };


                estadoSubida.textContent =
                    "⏳ Guardando cambios...";


                console.log(
                    "10 - Actualizando prenda..."
                );


                const respuesta =
                    await fetch(
                        `${API_URL}/${prendaEditandoId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    prendaEditada
                                )
                        }
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudo editar la prenda."
                    );
                }


                const prendaGuardada =
                    await respuesta.json();


                console.log(
                    "11 - Prenda editada:",
                    prendaGuardada
                );


            } else {


                // =================================================
                // CREAR NUEVA PRENDA
                // =================================================

                console.log(
                    "7 - Creando nueva prenda"
                );


                // -------------------------------------------------
                // SUBIR Y PROCESAR IMAGEN
                // -------------------------------------------------

                if (archivo) {

                    estadoSubida.textContent =
                        "⏳ Eliminando fondo de la imagen...";


                    console.log(
                        "8 - Subiendo imagen..."
                    );


                    nombreImagen =
                        await subirImagen(
                            archivo
                        );


                    console.log(
                        "9 - Imagen procesada:",
                        nombreImagen
                    );

                } else {

                    console.log(
                        "8 - No se seleccionó imagen."
                    );
                }


                // -------------------------------------------------
                // CREAR OBJETO
                // -------------------------------------------------

                const nuevaPrenda = {

                    nombre: nombre,

                    categoria: categoria,

                    color: color,

                    marca: marca,

                    imagen: nombreImagen
                };


                estadoSubida.textContent =
                    "⏳ Guardando prenda...";


                console.log(
                    "10 - Guardando prenda en MySQL..."
                );


                const respuesta =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    nuevaPrenda
                                )
                        }
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudo guardar la prenda."
                    );
                }


                const prendaGuardada =
                    await respuesta.json();


                console.log(
                    "11 - Prenda guardada:",
                    prendaGuardada
                );
            }


            // =================================================
            // FINALIZAR
            // =================================================

            limpiarFormulario();

            prendaEditandoId = null;

            formularioPrenda.classList.add(
                "formulario-oculto"
            );

            btnGuardarPrenda.textContent =
                "Guardar prenda";


            await cargarPrendas();


            guardandoPrenda = false;

            btnGuardarPrenda.disabled = false;


            estadoSubida.textContent =
                "✅ Prenda guardada correctamente";


            console.log(
                "12 - PROCESO COMPLETADO"
            );


            setTimeout(
                () => {

                    limpiarEstado();

                },
                3000
            );


        } catch (error) {

            console.error(
                "ERROR AL GUARDAR:",
                error
            );


            guardandoPrenda = false;

            btnGuardarPrenda.disabled = false;

            btnGuardarPrenda.textContent =
                "Guardar prenda";


            estadoSubida.textContent =
                "❌ Error al guardar la prenda";


            alert(
                "Ha ocurrido un error al guardar la prenda. Mira la consola."
            );
        }
    }
);


// =====================================================
// SUBIR IMAGEN
// =====================================================

async function subirImagen(archivo) {

    console.log(
        "SUBIR IMAGEN - Archivo:",
        archivo.name
    );


    const formulario =
        new FormData();


    formulario.append(
        "imagen",
        archivo
    );


    console.log(
        "SUBIR IMAGEN - Enviando a Spring Boot..."
    );


    const respuesta =
        await fetch(
            `${API_URL}/imagen`,
            {
                method: "POST",

                body: formulario
            }
        );


    console.log(
        "SUBIR IMAGEN - Respuesta:",
        respuesta.status
    );


    if (!respuesta.ok) {

        throw new Error(
            "No se pudo subir la imagen."
        );
    }


    const nombreImagen =
        await respuesta.text();


    console.log(
        "SUBIR IMAGEN - Nombre recibido:",
        nombreImagen
    );


    if (
        !nombreImagen ||
        nombreImagen.startsWith("Error")
    ) {

        throw new Error(
            "Spring Boot no pudo procesar la imagen."
        );
    }


    return nombreImagen;
}


// =====================================================
// CARGAR PRENDAS
// =====================================================

async function cargarPrendas(
    categoriaSeleccionada = "Todas"
) {

    try {

        console.log(
            "Cargando prendas..."
        );


        const respuesta =
            await fetch(API_URL);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las prendas."
            );
        }


        const prendas =
            await respuesta.json();


        console.log(
            "Prendas recibidas:",
            prendas
        );


        listaPrendas.innerHTML = "";


        // =================================================
        // FILTRAR CATEGORÍA
        // =================================================

        let prendasFiltradas =
            prendas;


        if (
            categoriaSeleccionada !==
            "Todas"
        ) {

            prendasFiltradas =
                prendas.filter(
                    prenda =>
                        prenda.categoria ===
                        categoriaSeleccionada
                );
        }


        // =================================================
        // NO HAY PRENDAS
        // =================================================

        if (
            prendasFiltradas.length === 0
        ) {

            listaPrendas.innerHTML = `
                <p class="sin-prendas">
                    No hay prendas en esta categoría.
                </p>
            `;

            return;
        }


        // =================================================
        // CREAR TARJETAS
        // =================================================

        prendasFiltradas.forEach(
            prenda => {

                const tarjeta =
                    document.createElement(
                        "div"
                    );


                tarjeta.classList.add(
                    "tarjeta-prenda"
                );


                // -------------------------------------------------
                // IMAGEN
                // -------------------------------------------------

                let imagenHTML = "";


                if (prenda.imagen) {

                    imagenHTML = `
                        <div class="imagen-prenda">

                            <img
                                src="http://localhost:8080/prendas/imagen/${prenda.imagen}"
                                alt="${prenda.nombre}"
                            >

                        </div>
                    `;

                } else {

                    imagenHTML = `
                        <div class="imagen-prenda">

                            <div class="sin-imagen">
                                Sin imagen
                            </div>

                        </div>
                    `;
                }


                // -------------------------------------------------
                // INFORMACIÓN
                // -------------------------------------------------

                tarjeta.innerHTML = `

                    ${imagenHTML}


                    <div class="informacion-prenda">

                        <h3>
                            ${prenda.nombre}
                        </h3>


                        <div class="categoria">
                            ${prenda.categoria}
                        </div>


                        ${
                            prenda.color
                                ? `
                                    <p class="color">
                                        Color: ${prenda.color}
                                    </p>
                                  `
                                : ""
                        }


                        ${
                            prenda.marca
                                ? `
                                    <p>
                                        Marca: ${prenda.marca}
                                    </p>
                                  `
                                : ""
                        }


                        <div class="botones-prenda">

                            <button
                                type="button"
                                class="btn-editar"
                                onclick="editarPrenda(${prenda.id})"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                type="button"
                                class="btn-eliminar"
                                onclick="eliminarPrenda(${prenda.id})"
                            >
                                🗑️ Eliminar
                            </button>

                        </div>

                    </div>
                `;


                listaPrendas.appendChild(
                    tarjeta
                );
            }
        );


    } catch (error) {

        console.error(
            "Error al cargar prendas:",
            error
        );


        listaPrendas.innerHTML = `
            <p>
                ❌ No se pudieron cargar las prendas.
            </p>
        `;
    }
}


// =====================================================
// EDITAR PRENDA
// =====================================================

async function editarPrenda(id) {

    try {

        const respuesta =
            await fetch(API_URL);


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las prendas."
            );
        }


        const prendas =
            await respuesta.json();


        const prenda =
            prendas.find(
                elemento =>
                    elemento.id === id
            );


        if (!prenda) {

            alert(
                "No se encontró la prenda."
            );

            return;
        }


        prendaEditandoId =
            id;


        document.getElementById(
            "nombre"
        ).value =
            prenda.nombre || "";


        document.getElementById(
            "categoria"
        ).value =
            prenda.categoria || "";


        document.getElementById(
            "color"
        ).value =
            prenda.color || "";


        document.getElementById(
            "marca"
        ).value =
            prenda.marca || "";


        document.getElementById(
            "imagen"
        ).value = "";


        formularioPrenda.classList.remove(
            "formulario-oculto"
        );


        btnGuardarPrenda.textContent =
            "Guardar cambios";


        limpiarEstado();


        formularioPrenda.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Error al editar:",
            error
        );


        alert(
            "No se pudo cargar la prenda."
        );
    }
}


// =====================================================
// ELIMINAR PRENDA
// =====================================================

async function eliminarPrenda(id) {

    const confirmar =
        confirm(
            "¿Seguro que quieres eliminar esta prenda?"
        );


    if (!confirmar) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo eliminar la prenda."
            );
        }


        console.log(
            "Prenda eliminada correctamente"
        );


        await cargarPrendas();


    } catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );


        alert(
            "No se pudo eliminar la prenda."
        );
    }
}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================

function limpiarFormulario() {

    document.getElementById(
        "nombre"
    ).value = "";


    document.getElementById(
        "categoria"
    ).value = "";


    document.getElementById(
        "color"
    ).value = "";


    document.getElementById(
        "marca"
    ).value = "";


    document.getElementById(
        "imagen"
    ).value = "";
}


// =====================================================
// RESTABLECER ESTADO DEL BOTÓN
// =====================================================

function resetearEstadoGuardar() {

    guardandoPrenda = false;

    btnGuardarPrenda.disabled = false;

    btnGuardarPrenda.textContent =
        "Guardar prenda";

    limpiarEstado();
}


// =====================================================
// LIMPIAR MENSAJE DE ESTADO
// =====================================================

function limpiarEstado() {

    if (estadoSubida) {

        estadoSubida.textContent = "";
    }
}


// =====================================================
// FILTROS DE CATEGORÍA
// =====================================================

const botonesCategoria =
    document.querySelectorAll(
        ".btn-categoria"
    );


botonesCategoria.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                botonesCategoria.forEach(
                    elemento => {

                        elemento.classList.remove(
                            "activa"
                        );
                    }
                );


                boton.classList.add(
                    "activa"
                );


                const categoria =
                    boton.dataset.categoria;


                cargarPrendas(
                    categoria
                );
            }
        );
    }
);


// =====================================================
// GENERADOR DE OUTFIT
// =====================================================

const btnGenerarOutfit =
    document.getElementById(
        "btn-generar-outfit"
    );


const modalOutfit =
    document.getElementById(
        "modal-outfit"
    );


const btnCerrarModal =
    document.getElementById(
        "btn-cerrar-modal"
    );


const botonesOcasion =
    document.querySelectorAll(
        ".btn-ocasion"
    );


btnGenerarOutfit.addEventListener(
    "click",
    () => {

        modalOutfit.classList.remove(
            "modal-oculto"
        );
    }
);


btnCerrarModal.addEventListener(
    "click",
    () => {

        modalOutfit.classList.add(
            "modal-oculto"
        );
    }
);


botonesOcasion.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                const ocasion =
                    boton.dataset.ocasion;


                console.log(
                    "Ocasión seleccionada:",
                    ocasion
                );


                alert(
                    `Has elegido: ${ocasion}`
                );


                modalOutfit.classList.add(
                    "modal-oculto"
                );
            }
        );
    }
);


// =====================================================
// CARGAR PRENDAS AL INICIAR
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
cargarPrendas();
});