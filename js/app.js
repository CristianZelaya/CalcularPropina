let cliente = {
    mesa: "",
    hora: "",
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisar si hay campos vacios
    const camposVacios = [ mesa, hora ].some( campo => campo === '');

    if (camposVacios) {

        const existeAlerta = document.querySelector('.alerta');

        if( !existeAlerta ){

            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center', 'alerta');
            alerta.textContent = 'Todos los campos son obligatorios';

            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {

                alerta.remove();
                
            }, 2000);

        }

        return;
        
    }

    // Asignar datos del formulario al cliente
    cliente = { ...cliente, mesa, hora }
    //console.log(cliente);

    // Ocultar formulario
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    // Mostrar las secciones
    mostrarSecciones();

    // Obtener platillos de la API
    obtenerPlatillos();

}

function mostrarSecciones() {

    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));

}

function obtenerPlatillos() {

    const url = 'http://localhost:4000/platillos';

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( data => mostrarPlatillos(data))
        .catch( error => console.log(error));

}

function mostrarPlatillos( data ) {

    // console.log(data);
    const contenido = document.querySelector('#platillos .contenido');
    data.forEach( platillo => {

        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$ ${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // funcion que detecta la cantidad y platillo que se esta agergando 
        inputCantidad.onchange = () => {

            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo( {...platillo, cantidad} );

        };
        
        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);

    });

}

function agregarPlatillo( producto ) {

    //Extraer el pedido actual
    let = { pedido } = cliente;

    // revisar que la cantidad sea mayor a 0
    if ( producto.cantidad  > 0) {

        // comprueba si el elemento ya existe en el array
        if ( pedido.some( articulo => articulo.id === producto.id )) {

            // Si existe, actualizar la cantidad
            const pedidoActualizado = pedido.map( articulo => {

                if ( articulo.id === producto.id ) {

                    articulo.cantidad = producto.cantidad;
                    
                }

                return articulo;

            });

            // Se asigna el nuevo array al cliente 
            cliente.pedido = [... pedidoActualizado ];
            
        } else {

            cliente.pedido = [...pedido, producto];

        }

    } else {
        
        // Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
        
    }

    // Limpiar el html previo
    limpiarHTML();

    // Mostrar Resumen
    actualizarResumen();

}

function actualizarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    // Información de la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('span');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa;

    // Información de la hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('span');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;

    // Agregar a los elementos padres
    mesa.appendChild( mesaSpan );
    hora.appendChild( horaSpan );

    // Titulo de la sección
    const heading = document.createElement('h3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // Iterar sobre el rray de contenido
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {

        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('h4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        // Cantidad del articulo
        const cantidadEl = document.createElement('p');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio del articulo
        const precioEl = document.createElement('p');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$ ${precio}`;

        // Subtotal del articulo
        const subTotalEl = document.createElement('p');
        subTotalEl.classList.add('fw-bold');
        subTotalEl.textContent = 'Subtotal: ';

        const subTotalValor = document.createElement('span');
        subTotalValor.classList.add('fw-normal');
        subTotalValor.textContent = calcularSubTotal( precio, cantidad);

        // Agregar valor a sus contenedores
        cantidadEl.appendChild( cantidadValor );
        precioEl.appendChild( precioValor );
        subTotalEl.appendChild( subTotalValor );

        // Agregar elementos al li
        lista.appendChild( nombreEl );
        lista.appendChild( cantidadEl );
        lista.appendChild( precioEl );
        lista.appendChild( subTotalEl );

        // Agregar lista al grupo principal
        grupo.appendChild( lista );

    });
    
    // Agregar al resumen
    resumen.appendChild( mesa );
    resumen.appendChild( hora );
    resumen.appendChild( heading );
    resumen.appendChild( grupo );

    // agregar al contenido
    contenido.appendChild(resumen);

}

function limpiarHTML() {

    const contenido = document.querySelector('#resumen .contenido');

    while ( contenido.firstChild ) {

        contenido.removeChild( contenido.firstChild );

    }

}

function calcularSubTotal( precio, cantidad ) {

    return `$ ${ precio * cantidad }`;
    
}