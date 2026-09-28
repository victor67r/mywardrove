const API_URL = "http://localhost:8080/prendas";

async function cargarPrendas() {

    try {

        const respuesta = await fetch(API_URL);

        const prendas = await respuesta.json();

        mostrarPrendas(prendas);

    } catch (error) {

        console.error("Error al cargar las prendas:", error);

    }
}


function mostrarPrendas(prendas) {

    const lista = document.getElementById("lista-prendas");

    lista.innerHTML = "";

    prendas.forEach(prenda => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("tarjeta-prenda");

        tarjeta.innerHTML = `
            <div class="imagen-prenda">
                <span>👕</span>
            </div>

            <div class="informacion-prenda">
                <h3>${prenda.nombre}</h3>

                <p>${prenda.marca}</p>

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


cargarPrendas();

// Botón para mostrar/ocultar el formulario

const btnNuevaPrenda = document.getElementById("btn-nueva-prenda");
const formularioPrenda = document.getElementById("formulario-prenda");

btnNuevaPrenda.addEventListener("click", () => {

    formularioPrenda.classList.toggle("formulario-oculto");

});

// Botón para guardar una prenda

const btnGuardarPrenda = document.getElementById("btn-guardar-prenda");

btnGuardarPrenda.addEventListener("click", async () => {

    // Recoger los datos del formulario

    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const color = document.getElementById("color").value;
    const marca = document.getElementById("marca").value;


    // Crear el objeto que enviaremos al backend

    const nuevaPrenda = {

        nombre: nombre,
        categoria: categoria,
        color: color,
        marca: marca

    };


    // Enviar la prenda al backend

    try {

        const respuesta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(nuevaPrenda)

        });


        // Comprobar si todo ha ido bien

        if (respuesta.ok) {

            console.log("Prenda guardada correctamente");

            // Limpiar formulario

            document.getElementById("nombre").value = "";
            document.getElementById("categoria").value = "";
            document.getElementById("color").value = "";
            document.getElementById("marca").value = "";


            // Ocultar formulario

            formularioPrenda.classList.add("formulario-oculto");


            // Volver a cargar las prendas

            cargarPrendas();

        } else {

            console.error("Error al guardar la prenda");

        }

    } catch (error) {

        console.error("Error:", error);

    }

});