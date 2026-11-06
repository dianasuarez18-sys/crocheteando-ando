const { NivelDificultad: N, Curso, Patron, Producto, HorarioDisponible, Asesoria, CarritoCompras, filtrarCursosPorNivel } = require('./crocheteando');
const horas = h => new Date(Date.now() + h * 36e5);

describe('PF-02 Filtrar cursos por nivel', () => {
  test('solo devuelve cursos del nivel pedido', () => {
    const cs = [new Curso('A', N.PRINCIPIANTE, 1000, 5), new Curso('B', N.AVANZADO, 2000, 5)];
    expect(filtrarCursosPorNivel(cs, N.PRINCIPIANTE)).toHaveLength(1);
  });
});
describe('Patrón', () => {
  test('un patrón sin precio es gratuito', () => { expect(new Patron('Gorro', N.PRINCIPIANTE, 0).esGratuito()).toBe(true); });
});
describe('PF-03 Carrito y stock', () => {
  test('rechaza una cantidad mayor al stock', () => {
    const c = new CarritoCompras(); expect(() => c.agregar(new Producto('Llavero', 18000, 2), 3)).toThrow('Stock insuficiente');
  });
  test('PF-06 el stock NO se descuenta al agregar al carrito', () => {
    const p = new Producto('Llavero', 18000, 5); const c = new CarritoCompras(); c.agregar(p, 2); expect(p.stock).toBe(5);
  });
  test('PF-06 el stock se descuenta al confirmar la compra', () => {
    const p = new Producto('Llavero', 18000, 5); const c = new CarritoCompras(); c.agregar(p, 2); c.confirmarCompra(); expect(p.stock).toBe(3);
  });
  test('el total es la suma de precio por cantidad', () => {
    const c = new CarritoCompras(); c.agregar(new Curso('A', N.PRINCIPIANTE, 120000, 8)); c.agregar(new Producto('L', 18000, 5), 2); expect(c.calcularTotal()).toBe(156000);
  });
  test('permite quitar productos del carrito', () => {
    const c = new CarritoCompras(); c.agregar(new Producto('L', 18000, 5)); c.quitar(0); expect(c.items).toHaveLength(0);
  });
  test('cantidad menor a 1 es rechazada', () => {
    const c = new CarritoCompras(); expect(() => c.agregar(new Producto('L', 18000, 5), 0)).toThrow();
  });
});
describe('PF-04 Confirmar asesoría', () => {
  test('confirma con fecha futura y tema', () => {
    expect(new Asesoria(new HorarioDisponible(horas(48)), 'Punto bajo').confirmar()).toBe(true);
  });
  test('rechaza fecha pasada', () => {
    expect(() => new Asesoria(new HorarioDisponible(horas(-2)), 'Tema').confirmar()).toThrow('futura');
  });
  test('rechaza fecha vacía', () => {
    expect(() => new HorarioDisponible('')).toThrow('obligatoria');
  });
  test('rechaza fecha inválida con isNaN', () => {
    expect(() => new HorarioDisponible('no-es-fecha')).toThrow('no es válida');
  });
  test('rechaza tema vacío', () => {
    expect(() => new Asesoria(new HorarioDisponible(horas(48)), '  ').confirmar()).toThrow('tema');
  });
  test('PF-07 no permite agendar un horario ocupado', () => {
    const h = new HorarioDisponible(horas(48)); new Asesoria(h, 'A').confirmar();
    expect(() => new Asesoria(h, 'B').confirmar()).toThrow('ocupado');
  });
});
describe('PF-08 Cancelar asesoría', () => {
  test('con 24 h o más: cancela, libera el horario y genera reembolso', () => {
    const h = new HorarioDisponible(horas(48)); const a = new Asesoria(h, 'A'); a.confirmar();
    expect(a.cancelar()).toEqual({ reembolso: true }); expect(h.ocupado).toBe(false);
  });
  test('con menos de 24 h: rechaza la cancelación', () => {
    const a = new Asesoria(new HorarioDisponible(horas(10)), 'A'); a.confirmar();
    expect(() => a.cancelar()).toThrow('24 horas');
  });
});
