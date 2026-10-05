# Visor de algoritmos Rubik

Abre `index.html` con doble clic. Funciona sin internet.

## Estructura

```
index.html            la página (solo estructura)
css/style.css         todo el diseño
data/                 los algoritmos, uno por categoría
  cfop-pll.js  cfop-oll.js  cfop-f2l.js  basicos.js
  library.js          junta las listas (define el orden de las pestañas)
js/
  core/               lo que sirve para cualquier método
    cubo-base.js        constantes, colores, matemática y tabla de movimientos
    visor3d.js          el cubo 3D, paleta y plantillas
    parser.js           texto de algoritmo -> lista de movimientos
    reproductor.js      animar, avanzar, retroceder, invertir, espejo
  methods/            un archivo por método de resolución
    cfop.js             cruz calculada; F2L, OLL y PLL con el catálogo
  ui/                 una pieza por función de pantalla
    vista3d.js          girar la vista y pintar stickers
    miniaturas.js       dibujos pequeños de cada caso
    catalogo.js         lista, pestañas, búsqueda, favoritos, aprendidos
    mis-casos.js        guardar, variantes, categorías, importar/exportar
    teclado.js          teclado en pantalla
    extras.js           atajos, tema, exportar archivo, imprimir
    identificar.js      «¿Qué caso es?» para F2L, OLL y PLL
    resolver.js         cubo desplegado, validación, mezcla
    solucion.js         botón Resolver, lista de pasos, reproducir y copiar
    guia.js             guía de movimientos
  storage.js          estado guardado en el navegador
  app.js              arranque
```

## Añadir un algoritmo

Abre el archivo de `data/` de su categoría y agrega una línea con el formato `"Nombre|movimientos"`. El solver usa ese mismo catálogo para F2L, OLL y PLL.

## Orden de carga

Los `<script>` de `index.html` están en un orden que importa: `data/`, luego `core/`, `ui/`, `methods/` y al final `app.js`. No lo cambies.
