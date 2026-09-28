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