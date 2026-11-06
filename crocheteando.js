'use strict';
/**
 * Crocheteando Ando - Modelos del dominio (versión 2, Unidad 3)
 * Reglas implementadas:
 *  - La fecha debe ser válida (isNaN) y futura; una fecha vacía se rechaza.
 *  - Se controla el horario ocupado y la cancelación hasta 24 horas antes.
 *  - El stock se descuenta al CONFIRMAR LA COMPRA, no al agregar al carrito.
 *  - El carrito permite quitar productos.
 */

/** Niveles de dificultad (constante congelada). */
const NivelDificultad = Object.freeze({
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
});

const HORAS_MINIMAS_CANCELACION = 24;

/**
 * Convierte un valor en Date y lanza un error si no es una fecha válida.
 * @param {Date|string|number} valor
 * @returns {Date}
 */
function validarFecha(valor) {
  if (valor === '' || valor === null || valor === undefined) {
    throw new Error('La fecha es obligatoria');
  }
  const fecha = new Date(valor);
  if (isNaN(fecha.getTime())) {
    throw new Error('La fecha no es válida');
  }
  return fecha;
}

/** Curso en video. */
class Curso {
  /**
   * @param {string} titulo
   * @param {string} nivel - Un valor de NivelDificultad
   * @param {number} precioCop
   * @param {number} numLecciones
   */
  constructor(titulo, nivel, precioCop, numLecciones) {
    if (!Object.values(NivelDificultad).includes(nivel)) throw new Error('Nivel no válido');
    if (!(precioCop >= 0)) throw new Error('El precio no puede ser negativo');
    this.titulo = titulo;
    this.nivel = nivel;
    this.precioCop = precioCop;
    this.numLecciones = numLecciones;
  }
  get precioUnitario() { return this.precioCop; }
}

/** Patrón de tejido descargable en PDF. */
class Patron {
  constructor(nombre, nivel, precioCop) {
    this.nombre = nombre;
    this.nivel = nivel;
    this.precioCop = precioCop;
  }
  get precioUnitario() { return this.precioCop; }
  /** @returns {boolean} true si el patrón no tiene costo */
  esGratuito() { return this.precioCop === 0; }
}

/** Producto físico de la tienda con control de inventario. */
class Producto {
  constructor(nombre, precioCop, stock) {
    if (!(precioCop > 0)) throw new Error('El precio debe ser mayor que cero');
    if (!(stock >= 0)) throw new Error('El stock debe ser mayor o igual a cero');
    this.nombre = nombre;
    this.precioCop = precioCop;
    this.stock = stock;
  }
  get precioUnitario() { return this.precioCop; }
  /** @param {number} cantidad @returns {boolean} */
  hayDisponibilidad(cantidad) { return this.stock >= cantidad; }
  /** Descuenta el stock; solo se invoca al confirmar la compra. */
  descontarStock(cantidad) {
    if (!this.hayDisponibilidad(cantidad)) throw new Error('Stock insuficiente');
    this.stock -= cantidad;
  }
}

/** Horario que la instructora deja disponible para asesorías. */
class HorarioDisponible {
  /** @param {Date|string} inicio @param {number} duracionMin */
  constructor(inicio, duracionMin = 60) {
    this.inicio = validarFecha(inicio);
    this.duracionMin = duracionMin;
    this.ocupado = false;
  }
  reservar() {
    if (this.ocupado) throw new Error('El horario ya está ocupado');
    this.ocupado = true;
  }
  liberar() { this.ocupado = false; }
}

/** Cita entre una estudiante y la instructora. */
class Asesoria {
  /** @param {HorarioDisponible} horario @param {string} tema */
  constructor(horario, tema) {
    this.horario = horario;
    this.tema = tema;
    this.estado = 'solicitada';
  }
  /**
   * Confirma la asesoría: valida tema, fecha válida y futura, y horario libre.
   * @param {Date} [ahora]
   * @returns {boolean}
   */
  confirmar(ahora = new Date()) {
    if (!this.tema || this.tema.trim() === '') throw new Error('El tema es obligatorio');
    const inicio = validarFecha(this.horario.inicio);
    if (inicio <= ahora) throw new Error('La fecha debe ser futura');
    this.horario.reservar();
    this.estado = 'confirmada';
    return true;
  }
  /**
   * Cancela la asesoría solo hasta 24 horas antes y libera el horario.
   * @param {Date} [ahora]
   * @returns {{reembolso: boolean}}
   */
  cancelar(ahora = new Date()) {
    if (this.estado !== 'confirmada') throw new Error('Solo se cancelan asesorías confirmadas');
    const horas = (this.horario.inicio - ahora) / 36e5;
    if (horas < HORAS_MINIMAS_CANCELACION) throw new Error('Solo se puede cancelar hasta 24 horas antes');
    this.horario.liberar();
    this.estado = 'cancelada';
    return { reembolso: true };
  }
}

/** Carrito de compras. */
class CarritoCompras {
  constructor() { this.items = []; }
  /** Agrega un ítem; para productos valida el stock pero NO lo descuenta. */
  agregar(item, cantidad = 1) {
    if (!Number.isInteger(cantidad) || cantidad < 1) throw new Error('La cantidad debe ser mayor o igual a 1');
    if (item instanceof Producto) {
      const yaEnCarrito = this.items.filter(i => i.item === item).reduce((s, i) => s + i.cantidad, 0);
      if (!item.hayDisponibilidad(yaEnCarrito + cantidad)) throw new Error('Stock insuficiente');
    }
    this.items.push({ item, cantidad });
  }
  /** Quita un ítem del carrito (posición base 0). */
  quitar(posicion) {
    if (posicion < 0 || posicion >= this.items.length) throw new Error('El ítem no existe');
    this.items.splice(posicion, 1);
  }
  calcularTotal() {
    return this.items.reduce((total, { item, cantidad }) => total + item.precioUnitario * cantidad, 0);
  }
  /** Se invoca cuando la pasarela aprueba el pago: descuenta el stock y vacía el carrito. */
  confirmarCompra() {
    const total = this.calcularTotal();
    for (const { item, cantidad } of this.items) {
      if (item instanceof Producto) item.descontarStock(cantidad);
    }
    this.items = [];
    return total;
  }
}

/** @returns {Curso[]} cursos del nivel indicado */
function filtrarCursosPorNivel(cursos, nivel) {
  return cursos.filter(c => c.nivel === nivel);
}

module.exports = { NivelDificultad, Curso, Patron, Producto, HorarioDisponible, Asesoria, CarritoCompras, filtrarCursosPorNivel, validarFecha };
