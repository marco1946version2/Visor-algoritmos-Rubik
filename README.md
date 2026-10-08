# Visor de algoritmos Rubik

Herramienta web para estudiar y practicar algoritmos del cubo de Rubik 3x3 con el método CFOP. Funciona sin internet y sin instalar nada: basta abrir `index.html` en el navegador.

## Funciones

- **Visor 3D** del cubo con animación paso a paso, control de velocidad, retroceso y reinicio. La vista se gira arrastrando.
- **Catálogo** con 123 algoritmos: 21 PLL, 57 OLL, 41 F2L y movimientos básicos. Incluye búsqueda, filtros, orden por longitud, favoritos y marca de aprendidos.
- **Mis casos:** escritura de algoritmos propios (admite paréntesis y repeticiones, como `(R U R' U')3`), teclado en pantalla, categorías, importación de listas y exportación de datos.
- **Qué mostrar y pintar:** plantillas para ver solo las piezas de interés (capa superior, cara de arriba, dos capas, el par, la cruz, solo aristas, solo esquinas), pincel de colores y modo pieza completa para elegir a mano qué piezas se muestran.
- **Identificar:** reconoce un caso F2L, OLL o PLL a partir de los stickers pintados en el cubo.
- **Resolver:** valida un cubo pintado en el cubo desplegado (o genera una mezcla) y calcula su solución completa:
  - Cruz blanca calculada por búsqueda, con la solución más corta.
  - F2L con detección de cada caso; las piezas mal insertadas se sacan con un sexy move incompleto y se indica como paso extra.
  - OLL y PLL con los algoritmos del catálogo.
  - Reproducción en el visor con cámara automática y resaltado de las piezas que se arman.
- **Guía de movimientos** accesible desde todas las secciones.
- Modo claro y oscuro, hoja imprimible y diseño adaptado a celular.

Los favoritos, aprendidos y casos propios se guardan solo en el navegador del usuario. No se envía información a ningún servidor.

## Uso

Abrir `index.html` con doble clic. En GitHub Pages se publica igual, sin configuración adicional.

## Añadir un algoritmo

Agregar una línea con el formato `"Nombre|movimientos"` en el archivo de su categoría (`cfop-pll.js`, `cfop-oll.js`, `cfop-f2l.js` o `basicos.js`). El solver usa ese mismo catálogo para F2L, OLL y PLL.

## Estructura de archivos

Todos los archivos están en una sola carpeta.

| Archivo | Contenido |
|---|---|
| `index.html`, `style.css` | Página y diseño |
| `cfop-pll.js`, `cfop-oll.js`, `cfop-f2l.js`, `basicos.js` | Algoritmos, uno por línea |
| `library.js` | Reúne las listas y define el orden de las pestañas del catálogo |
| `cubo-base.js`, `visor3d.js`, `parser.js`, `reproductor.js` | Motor del cubo: movimientos, dibujo 3D, lectura de algoritmos y reproducción |
| `cfop.js` | Solver CFOP, independiente de la pantalla |
| `catalogo.js`, `mis-casos.js`, `identificar.js`, `resolver.js`, `solucion.js`, `teclado.js`, `extras.js`, `miniaturas.js`, `vista3d.js`, `guia.js`, `pestanas.js` | Pantallas y controles |
| `storage.js` | Almacenamiento en el navegador |
| `app.js` | Arranque |

El orden de los `<script>` en `index.html` es importante: primero los datos, después el motor, las pantallas y, al final, `app.js`.

## Notas

- Los algoritmos son secuencias estándar del método CFOP, de uso común en la comunidad, y se verificaron por simulación: los PLL y OLL producen casos distintos entre sí y los F2L resuelven su par sin alterar el resto del cubo.
- Los dibujos de cada caso los genera el propio código.
- «Rubik» y «Rubik's Cube» son marcas registradas de sus respectivos titulares. Este es un proyecto personal sin fines de lucro y sin relación con ellos.
