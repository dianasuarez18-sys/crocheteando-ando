// Lista de cursos del catálogo
const cursos = [
  { titulo: 'Amigurumi desde cero', nivel: 'Principiante', lecciones: 8, precio: 120000 },
  { titulo: 'Tejido de bolsos', nivel: 'Intermedio', lecciones: 6, precio: 95000 },
  { titulo: 'Prendas de bebé', nivel: 'Avanzado', lecciones: 10, precio: 110000 }
];

const contenedor = document.getElementById('lista-cursos');
const botones = document.querySelectorAll('.filtros button');

// Devuelve los cursos del nivel pedido
function filtrarCursosPorNivel(nivel) {
  if (nivel === 'Todos') {
    return cursos;
  }
  return cursos.filter(function (curso) {
    return curso.nivel === nivel;
  });
}

// Dibuja las tarjetas en la página
function mostrarCursos(nivel) {
  const lista = filtrarCursosPorNivel(nivel);
  contenedor.innerHTML = '';

  if (lista.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron cursos.</p>';
    return;
  }

  lista.forEach(function (curso) {
    contenedor.innerHTML +=
      '<div class="tarjeta">' +
      '<h3>' + curso.titulo + '</h3>' +
      '<p>Nivel: ' + curso.nivel + ' · ' + curso.lecciones + ' lecciones</p>' +
      '<p class="precio">$' + curso.precio.toLocaleString('es-CO') + '</p>' +
      '</div>';
  });
}

// Cada botón filtra al hacer clic
botones.forEach(function (boton) {
  boton.addEventListener('click', function () {
    botones.forEach(function (b) { b.classList.remove('activo'); });
    boton.classList.add('activo');
    mostrarCursos(boton.dataset.nivel);
  });
});

// Al abrir la página se muestran todos
mostrarCursos('Todos');
botones[0].classList.add('activo');