const { NivelDificultad, Curso, Producto, HorarioDisponible, Asesoria, CarritoCompras, filtrarCursosPorNivel } = require('./crocheteando');
const cursos = [new Curso('Amigurumi desde cero', NivelDificultad.PRINCIPIANTE, 120000, 8), new Curso('Prendas de bebé', NivelDificultad.INTERMEDIO, 110000, 10)];
console.log('Cursos para principiantes:', filtrarCursosPorNivel(cursos, NivelDificultad.PRINCIPIANTE).map(c => c.titulo).join(', '));
const llavero = new Producto('Llavero amigurumi', 18000, 5);
const carrito = new CarritoCompras();
carrito.agregar(cursos[0]); carrito.agregar(llavero, 2);
console.log('Stock tras agregar al carrito (no se descuenta):', llavero.stock);
console.log('Total del carrito: $', carrito.calcularTotal());
carrito.confirmarCompra();
console.log('Stock tras confirmar la compra:', llavero.stock);
const manana = new Date(Date.now() + 48 * 36e5);
const horario = new HorarioDisponible(manana);
const ase = new Asesoria(horario, 'Punto bajo');
console.log('Asesoría confirmada:', ase.confirmar());
try { new Asesoria(new HorarioDisponible(''), 'Tema'); } catch (e) { console.log('Fecha vacía rechazada:', e.message); }
try { new Asesoria(horario, 'Otro tema').confirmar(); } catch (e) { console.log('Horario ocupado:', e.message); }
console.log('Cancelación con 48 h de anticipación:', ase.cancelar());
