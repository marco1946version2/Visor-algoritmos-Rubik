# Visor de algoritmos Rubik

Abre `index.html` con doble clic. Funciona sin internet.

## Estructura

```
index.html        la página (solo estructura)
css/style.css     todo el diseño
js/app.js         la lógica de la aplicación
data/             los algoritmos, uno por categoría
  cfop-pll.js
  cfop-oll.js
  cfop-f2l.js
  basicos.js
  library.js      junta las listas (define el orden de las pestañas)
```

## Añadir un algoritmo

Abre el archivo de `data/` de su categoría y agrega una línea nueva con el formato `"Nombre|movimientos"`.

## Orden de carga

En `index.html` los archivos de `data/` van antes que `js/app.js`. No cambies ese orden.
