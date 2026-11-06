# Crocheteando Ando

Plataforma web y móvil para aprender crochet con cursos en video, descargar patrones, agendar asesorías y comprar productos de crochet.

Proyecto de **Ingeniería de Software** (IV semestre) de la Tecnología en Programación de Sistemas Informáticos, FESAD, Universidad Pedagógica y Tecnológica de Colombia (UPTC).

**Autora:** Diana Marcela Suárez

## Contenido del repositorio

| Archivo | Descripción |
|---|---|
| `crocheteando.js` | Clases y funciones del dominio: `Curso`, `Patron`, `Producto`, `HorarioDisponible`, `Asesoria`, `CarritoCompras` y `filtrarCursosPorNivel`. |
| `crocheteando.test.js` | Pruebas automáticas con Jest. |
| `demo.js` | Demostración que imprime resultados en la consola. |

## Reglas de negocio implementadas

- La fecha de una asesoría debe ser válida y futura (se valida con `isNaN`).
- Un horario ocupado no se puede reservar de nuevo.
- Una asesoría solo se cancela hasta 24 horas antes y genera reembolso.
- El stock se descuenta al confirmar la compra, no al agregar al carrito.
- El carrito permite quitar productos.

## Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org/).

```bash
npm install
npm test      # ejecuta las pruebas con cobertura
npm run demo  # ejecuta la demostración
```
