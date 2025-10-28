
document.addEventListener('DOMContentLoaded', () => {
    const galeriaContainer = document.getElementById('galeria-container');
    const paginacionContainer = document.getElementById('paginacion-container');
    const ITEMS_POR_PAGINA = 4;

    let todosLosDestinos = []; 
    let pagAct = 1;

    async function cargarDestinos() {
        try {
            const response = await fetch('datos/datos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            todosLosDestinos = await response.json();
            mostrarPagina(1);

        } catch (error) {
            console.error("Error al cargar los destinos:", error);
            galeriaContainer.innerHTML = `<p class="text-danger text-center">Error al cargar los datos. Por favor, intente más tarde.</p>`;
        }
    }

    function mostrarPagina(numeroDePagina) {
        pagAct = numeroDePagina;
        galeriaContainer.innerHTML = '';
        const indiceInicio = (pagAct - 1) * ITEMS_POR_PAGINA;
        const indiceFin = pagAct * ITEMS_POR_PAGINA;
        const destinosPagina = todosLosDestinos.slice(indiceInicio, indiceFin);
        destinosPagina.forEach(destino => {
            const cardHtml = `
                <div class="col">
                    <div class="card shadow-sm h-100">
                        <img src="${destino.img}" class="card-img-top" alt="${destino.titulo}">
                        <div class="card-body">
                            <h5 class="card-title">${destino.titulo}</h5>
                            <p class="card-text">${destino.descripcion}</p>
                        </div>
                    </div>
                </div>
            `;
            galeriaContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
        dibujarPaginacion();
    }
    function dibujarPaginacion() {
        paginacionContainer.innerHTML = '';
        const totalPaginas = Math.ceil(todosLosDestinos.length / ITEMS_POR_PAGINA);
        const prevLi = document.createElement('li');
        prevLi.classList.add('page-item');
        if (pagAct === 1) {
            prevLi.classList.add('disabled'); 
        }
        prevLi.innerHTML = `<a class="page-link" href="#" data-page="${pagAct - 1}">Anterior</a>`;
        paginacionContainer.appendChild(prevLi);

        for (let i = 1; i <= totalPaginas; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === pagAct) {
                li.classList.add('active'); 
            }
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            paginacionContainer.appendChild(li);
        }
        const nextLi = document.createElement('li');
        nextLi.classList.add('page-item');
        if (pagAct === totalPaginas) {
            nextLi.classList.add('disabled');
        }
        nextLi.innerHTML = `<a class="page-link" href="#" data-page="${pagAct + 1}">Siguiente</a>`;
        paginacionContainer.appendChild(nextLi);
    }
    function manejarClicPaginacion(e) {
        e.preventDefault(); 
        const target = e.target.closest('.page-link');
        if (!target) return; 
        if (target.closest('.page-item').classList.contains('disabled')) {
            return;
        }
        const nuevaPagina = parseInt(target.dataset.page);
        mostrarPagina(nuevaPagina);
    }
    cargarDestinos();
    paginacionContainer.addEventListener('click', manejarClicPaginacion);
});