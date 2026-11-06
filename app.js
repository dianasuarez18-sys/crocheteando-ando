// ---------- Datos ----------
const cursos = [
  { id: 1, titulo: 'Amigurumi desde cero', nivel: 'Principiante', lecciones: 8, precio: 120000 },
  { id: 2, titulo: 'Tejido de bolsos', nivel: 'Intermedio', lecciones: 6, precio: 95000 },
  { id: 3, titulo: 'Prendas de bebé', nivel: 'Avanzado', lecciones: 10, precio: 110000 }
];

const productos = [
  { id: 101, titulo: 'Llavero amigurumi', precio: 18000, stock: 5 },
  { id: 102, titulo: 'Gorro de lana', precio: 35000, stock: 3 }
];

let carrito = []; // cada ítem: { tipo, item, cantidad }

const contenedorCursos = document.getElementById('lista-cursos');
const contenedorProductos = document.getElementById('lista-productos');
const contenedorCarrito = document.getElementById('carrito');
const mensaje = document.getElementById('mensaje');
const botones = document.querySelectorAll('.filtros button');

function formatoPrecio(valor) {
  return '$' + valor.toLocaleString('es-CO');
}

// ---------- Cursos ----------
function filtrarCursosPorNivel(nivel) {
  if (nivel === 'Todos') {
    return cursos;
  }
  return cursos.filter(function (curso) {
    return curso.nivel === nivel;
  });
}

function mostrarCursos(nivel) {
  const lista = filtrarCursosPorNivel(nivel);
  contenedorCursos.innerHTML = '';

  if (lista.length === 0) {
    contenedorCursos.innerHTML = '<p>No se encontraron cursos.</p>';
    return;
  }

  lista.forEach(function (curso) {
    contenedorCursos.innerHTML +=
      '<div class="tarjeta">' +
      '<h3>' + curso.titulo + '</h3>' +
      '<p>Nivel: ' + curso.nivel + ' · ' + curso.lecciones + ' lecciones</p>' +
      '<p class="precio">' + formatoPrecio(curso.precio) + '</p>' +
      '<button class="agregar" data-tipo="curso" data-id="' + curso.id + '">Agregar al carrito</button>' +
      '</div>';
  });
}

// ---------- Productos ----------
function mostrarProductos() {
  contenedorProductos.innerHTML = '';

  productos.forEach(function (p) {
    let boton;
    if (p.stock > 0) {
      boton = '<button class="agregar" data-tipo="producto" data-id="' + p.id + '">Agregar al carrito</button>';
    } else {
      boton = '<p class="agotado">Agotado</p>';
    }
    contenedorProductos.innerHTML +=
      '<div class="tarjeta">' +
      '<h3>' + p.titulo + '</h3>' +
      '<p>Disponibles: ' + p.stock + '</p>' +
      '<p class="precio">' + formatoPrecio(p.precio) + '</p>' +
      boton +
      '</div>';
  });
}

// ---------- Carrito ----------
function cantidadEnCarrito(id) {
  let total = 0;
  carrito.forEach(function (linea) {
    if (linea.item.id === id) {
      total += linea.cantidad;
    }
  });
  return total;
}

function agregarAlCarrito(tipo, id) {
  mensaje.textContent = '';
  const lista = tipo === 'curso' ? cursos : productos;
  const item = lista.find(function (x) { return x.id === id; });

  if (tipo === 'curso' && cantidadEnCarrito(id) > 0) {
    mensaje.textContent = 'Ese curso ya está en el carrito.';
    return;
  }

  // El stock solo se revisa aquí, NO se descuenta
  if (tipo === 'producto' && cantidadEnCarrito(id) + 1 > item.stock) {
    mensaje.textContent = 'No hay más unidades disponibles de ' + item.titulo + '.';
    return;
  }

  const existente = carrito.find(function (linea) { return linea.item.id === id; });
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ tipo: tipo, item: item, cantidad: 1 });
  }
  mostrarCarrito();
}

function quitarDelCarrito(posicion) {
  carrito.splice(posicion, 1);
  mensaje.textContent = '';
  mostrarCarrito();
}

function calcularTotal() {
  let total = 0;
  carrito.forEach(function (linea) {
    total += linea.item.precio * linea.cantidad;
  });
  return total;
}

function mostrarCarrito() {
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }

  let html = '';
  carrito.forEach(function (linea, posicion) {
    html +=
      '<div class="item-carrito">' +
      '<span>' + linea.item.titulo + ' (x' + linea.cantidad + ') · ' +
      formatoPrecio(linea.item.precio * linea.cantidad) + '</span>' +
      '<button class="quitar" data-pos="' + posicion + '">Quitar</button>' +
      '</div>';
  });
  html += '<p class="total">Total: ' + formatoPrecio(calcularTotal()) + '</p>';
  html += '<button class="pagar">Pagar</button>';
  contenedorCarrito.innerHTML = html;
}

// El stock se descuenta SOLO cuando se confirma la compra
function pagar() {
  carrito.forEach(function (linea) {
    if (linea.tipo === 'producto') {
      linea.item.stock -= linea.cantidad;
    }
  });
  carrito = [];
  mostrarProductos();
  mostrarCarrito();
  mensaje.textContent = 'Compra confirmada. ¡Gracias!';
}

// ---------- Eventos ----------
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('agregar')) {
    agregarAlCarrito(e.target.dataset.tipo, Number(e.target.dataset.id));
  }
  if (e.target.classList.contains('quitar')) {
    quitarDelCarrito(Number(e.target.dataset.pos));
  }
  if (e.target.classList.contains('pagar')) {
    pagar();
  }
});

botones.forEach(function (boton) {
  boton.addEventListener('click', function () {
    botones.forEach(function (b) { b.classList.remove('activo'); });
    boton.classList.add('activo');
    mostrarCursos(boton.dataset.nivel);
  });
});

// ---------- Inicio ----------
mostrarCursos('Todos');
botones[0].classList.add('activo');
mostrarProductos();
mostrarCarrito();