const API_URL = "http://localhost:8080/prendas";

// =========================
// CARGAR PRENDAS
// =========================

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

// =========================
// MOSTRAR PRENDAS
// =========================

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

        // Si la prenda tiene imagen
        if (prenda.imagen) {

            imagenHTML = `
                <img
                    src="${API_URL}/imagen/${prenda.imagen}"
                    alt="${prenda.nombre}"
                >
            `;

        } else {

            // Si no tiene imagen
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

            </div>
        `;

        lista.appendChild(tarjeta);
    });
}

// =========================
// MOSTRAR / OCULTAR FORMULARIO
// =========================

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

        formularioPrenda.classList.toggle(
            "formulario-oculto"
        );

    }
);

// =========================
// GUARDAR PRENDA
// =========================

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

            // =========================
            // SUBIR IMAGEN
            // =========================

            if (archivo) {

                const formularioImagen =
                    new FormData();

                formularioImagen.append(
                    "imagen",
                    archivo
                );

                const respuestaImagen =
                    await fetch(
                        API_URL + "/imagen",
                        {
                            method: "POST",
                            body: formularioImagen
                        }
                    );

                if (!respuestaImagen.ok) {

                    throw new Error(
                        "No se pudo subir la imagen"
                    );
                }

                nombreImagen =
                    await respuestaImagen.text();

                console.log(
                    "Imagen guardada:",
                    nombreImagen
                );
            }

            // =========================
            // CREAR PRENDA
            // =========================

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

            // =========================
            // LIMPIAR FORMULARIO
            // =========================

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

            // Ocultar formulario

            formularioPrenda.classList.add(
                "formulario-oculto"
            );

            // Recargar prendas

            cargarPrendas();

        } catch (error) {

            console.error(
                "Error:",
                error
            );
        }
    }
);

// =========================
// INICIAR APLICACIÓN
// =========================

cargarPrendas();