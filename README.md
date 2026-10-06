# Visor de algoritmos Rubik

Abre `index.html` con doble clic. Funciona sin internet. Todos los archivos están en una sola carpeta.

- `index.html` la página, `style.css` el diseño
- `cfop-pll.js`, `cfop-oll.js`, `cfop-f2l.js`, `basicos.js`: los algoritmos (una línea por caso: `"Nombre|movimientos"`); `library.js` los junta
- `cubo-base.js`, `visor3d.js`, `parser.js`, `reproductor.js`: el motor del cubo
- `cfop.js`: el solver CFOP (cruz calculada; F2L, OLL y PLL con el catálogo)
- `catalogo.js`, `mis-casos.js`, `identificar.js`, `resolver.js`, `solucion.js`, `teclado.js`, `extras.js`, `miniaturas.js`, `vista3d.js`, `guia.js`, `pestanas.js`: las pantallas
- `storage.js` guarda tus datos; `app.js` arranca

El orden de los `<script>` en `index.html` importa. No lo cambies.
