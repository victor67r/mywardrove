const API_URL = "http://localhost:8080/prendas";


// ========================================
// VARIABLES
// ========================================

let prendaEditandoId = null;


// ========================================
// CARGAR PRENDAS
// ========================================

async function cargarPrendas() {

    try {

        const respuesta = await fetch(API_URL);

        const prendas = await respuesta.json();

        mostrarPrendas(prendas);

    } catch (error) {

        console.error(
            "Error al cargar las prendas:",
            error
        );
    }
}


// ========================================
// MOSTRAR PRENDAS
// ========================================

function mostrarPrendas(prendas) {

    const lista =
        document.getElementById("lista-prendas");

    lista.innerHTML = "";


    prendas.forEach(prenda => {

        const tarjeta =
            document.createElement("div");

        tarjeta.classList.add(
            "tarjeta-prenda"
        );


        let imagenHTML;


        if (prenda.imagen) {

            imagenHTML = `
                <img
                    src="${API_URL}/imagen/${prenda.imagen}"
                    alt="${prenda.nombre}"
                >
            `;

        } else {

            imagenHTML = `
                <span>👕</span>
            `;
        }


        tarjeta.innerHTML = `

            <div class="imagen-prenda">
                ${imagenHTML}
            </div>

            <div class="informacion-prenda">

                <h3>
                    ${prenda.nombre}
                </h3>

                <p>
                    ${prenda.marca}
                </p>

                <span class="categoria">
                    ${prenda.categoria}
                </span>

                <p class="color">
                    Color: ${prenda.color}
                </p>

                <div class="botones-prenda">

                    <button
                        class="btn-editar"
                        onclick="editarPrenda(${prenda.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarPrenda(${prenda.id})"
                    >
                        🗑️ Eliminar
                    </button>

                </div>

            </div>

        `;


        lista.appendChild(tarjeta);

    });
}


// ========================================
// NUEVA PRENDA
// ========================================

const btnNuevaPrenda =
    document.getElementById(
        "btn-nueva-prenda"
    );


const formularioPrenda =
    document.getElementById(
        "formulario-prenda"
    );


btnNuevaPrenda.addEventListener(
    "click",
    () => {

        prendaEditandoId = null;

        document.querySelector(
            "#formulario-prenda h3"
        ).textContent =
            "Nueva prenda";

        btnGuardarPrenda.textContent =
            "Guardar prenda";

        limpiarFormulario();

        formularioPrenda.classList.toggle(
            "formulario-oculto"
        );

    }
);


// ========================================
// GUARDAR PRENDA
// ========================================

const btnGuardarPrenda =
    document.getElementById(
        "btn-guardar-prenda"
    );


btnGuardarPrenda.addEventListener(
    "click",
    async () => {

        const nombre =
            document.getElementById(
                "nombre"
            ).value;


        const categoria =
            document.getElementById(
                "categoria"
            ).value;


        const color =
            document.getElementById(
                "color"
            ).value;


        const marca =
            document.getElementById(
                "marca"
            ).value;


        const inputImagen =
            document.getElementById(
                "imagen"
            );


        const archivo =
            inputImagen.files[0];


        try {

            let nombreImagen = "";


            // ========================================
            // EDITAR PRENDA
            // ========================================

            if (prendaEditandoId !== null) {

                const respuestaPrendas =
                    await fetch(API_URL);


                const prendas =
                    await respuestaPrendas.json();


                const prendaActual =
                    prendas.find(
                        prenda =>
                            prenda.id ===
                            prendaEditandoId
                    );


                nombreImagen =
                    prendaActual.imagen;


                if (archivo) {

                    nombreImagen =
                        await subirImagen(
                            archivo
                        );
                }


                const prendaActualizada = {

                    nombre: nombre,

                    categoria: categoria,

                    color: color,

                    marca: marca,

                    imagen: nombreImagen

                };


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
                                    prendaActualizada
                                )
                        }
                    );


                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudo actualizar la prenda"
                    );
                }


                console.log(
                    "Prenda actualizada correctamente"
                );


            } else {


                // ========================================
                // CREAR PRENDA
                // ========================================

                if (archivo) {

                    nombreImagen =
                        await subirImagen(
                            archivo
                        );
                }


                const nuevaPrenda = {

                    nombre: nombre,

                    categoria: categoria,

                    color: color,

                    marca: marca,

                    imagen: nombreImagen

                };


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
                        "No se pudo guardar la prenda"
                    );
                }


                console.log(
                    "Prenda guardada correctamente"
                );

            }


            limpiarFormulario();

            prendaEditandoId = null;

            formularioPrenda.classList.add(
                "formulario-oculto"
            );

            btnGuardarPrenda.textContent =
                "Guardar prenda";


            cargarPrendas();


        } catch (error) {

            console.error(
                "Error:",
                error
            );
        }

    }
);


// ========================================
// SUBIR IMAGEN
// ========================================

async function subirImagen(archivo) {

    const formularioImagen =
        new FormData();


    formularioImagen.append(
        "imagen",
        archivo
    );


    const respuesta =
        await fetch(
            API_URL + "/imagen",
            {
                method: "POST",
                body: formularioImagen
            }
        );


    if (!respuesta.ok) {

        throw new Error(
            "No se pudo subir la imagen"
        );
    }


    return await respuesta.text();
}


// ========================================
// EDITAR PRENDA
// ========================================

async function editarPrenda(id) {

    try {

        const respuesta =
            await fetch(API_URL);


        const prendas =
            await respuesta.json();


        const prenda =
            prendas.find(
                prenda =>
                    prenda.id === id
            );


        if (!prenda) {

            throw new Error(
                "No se encontró la prenda"
            );
        }


        prendaEditandoId = id;


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


        document.querySelector(
            "#formulario-prenda h3"
        ).textContent =
            "Editar prenda";


        btnGuardarPrenda.textContent =
            "Guardar cambios";


        formularioPrenda.classList.remove(
            "formulario-oculto"
        );


        formularioPrenda.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Error al editar:",
            error
        );
    }
}


// ========================================
// LIMPIAR FORMULARIO
// ========================================

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


// ========================================
// ELIMINAR PRENDA
// ========================================

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
                "No se pudo eliminar la prenda"
            );
        }


        console.log(
            "Prenda eliminada correctamente"
        );


        cargarPrendas();


    } catch (error) {

        console.error(
            "Error al eliminar:",
            error
        );
    }
}


// ========================================
// FILTRAR POR CATEGORÍA
// ========================================

const botonesCategoria =
    document.querySelectorAll(
        ".btn-categoria"
    );


botonesCategoria.forEach(
    boton => {

        boton.addEventListener(
            "click",
            async () => {

                const categoria =
                    boton.dataset.categoria;


                botonesCategoria.forEach(
                    otroBoton => {

                        otroBoton.classList.remove(
                            "activa"
                        );

                    }
                );


                boton.classList.add(
                    "activa"
                );


                try {

                    const respuesta =
                        await fetch(API_URL);


                    const prendas =
                        await respuesta.json();


                    if (
                        categoria ===
                        "Todas"
                    ) {

                        mostrarPrendas(
                            prendas
                        );

                    } else {

                        const prendasFiltradas =
                            prendas.filter(
                                prenda =>
                                    prenda.categoria ===
                                    categoria
                            );


                        mostrarPrendas(
                            prendasFiltradas
                        );

                    }


                } catch (error) {

                    console.error(
                        "Error al filtrar:",
                        error
                    );

                }

            }
        );

    }
);


// ========================================
// MODAL GENERAR OUTFIT
// ========================================

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


// ========================================
// ABRIR MODAL
// ========================================

btnGenerarOutfit.addEventListener(
    "click",
    () => {

        modalOutfit.classList.remove(
            "modal-oculto"
        );

    }
);


// ========================================
// CERRAR MODAL
// ========================================

btnCerrarModal.addEventListener(
    "click",
    () => {

        modalOutfit.classList.add(
            "modal-oculto"
        );

    }
);


// ========================================
// SELECCIONAR OCASIÓN
// ========================================

const botonesOcasion =
    document.querySelectorAll(
        ".btn-ocasion"
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


                modalOutfit.classList.add(
                    "modal-oculto"
                );

            }
        );

    }
);


// ========================================
// INICIAR APLICACIÓN
// ========================================

cargarPrendas();