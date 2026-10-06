# Botonera de Sonidos

Sitio estatico con una botonera de sonidos. No necesita servidor ni build:
se abre el `index.html` y ya funciona.

## Como se usa

- **Un tap reproduce, el siguiente detiene.** Cada boton es independiente.
- **Puedes usar varios sonidos a la vez.** Cada uno sigue sonando hasta que
  termina o hasta que le des otro tap.
- **Buscador**: escribe arriba, o presiona <kbd>/</kbd> para enfocarlo.
  <kbd>Esc</kbd> limpia la busqueda.
- La busqueda **ignora acentos y mayusculas**: `rosad` encuentra
  *Rosa de Guadalupe*, `SANTO` encuentra *santo*.

## Como agregar un sonido

Son dos pasos. No hay que tocar el HTML.

**1. Copia el `.mp3` a la carpeta `audio/`**

El nombre del archivo es el que se usa en la lista. Ejemplo:

```
audio/perro.mp3
```

**2. Agrega UNA linea en `js/sonidos.js`, dentro de `SONIDOS`**

```js
'perro'
```

Eso es todo. El boton aparecera con el nombre del archivo.

### Ponerle un nombre mas lindo al boton

Si quieres que el boton se vea distinto al nombre del archivo:

```js
['perro', 'Perrito guau']
```

### Buscar por el nombre del archivo o por el que se ve

La busqueda revisa las dos cosas, asi que `perro` y `Perrito` encuentran
`['perro', 'Perrito guau']`.

### Ordenar por secciones

El array acepta comentarios, como el que ya esta. Agrupa por tema para que
la lista se lea mejor:

```js
const SONIDOS = [
  // --- Clasicos ---
  'airhorn',
  // --- Perros ---
  'perro',
];
```

### Quitar un sonido

Borra su linea de `js/sonidos.js`. Si el `.mp3` sigue en `audio/` ya no se
usara, y puedes borrarlo para no gastar espacio.

## Estructura

```
index.html          estructura de la pagina
css/estilos.css     estilos
js/sonidos.js       <- la lista de sonidos (edita esto para agregar)
js/app.js           buscador y reproduccion
audio/              todos los .mp3
img/                imagenes
fonts/              tipografias
```

## Como probarlo

Abre `index.html` en el navegador. Para subirlo a Netlify o GitHub Pages,
publica la carpeta tal cual: no hay build ni dependencias.

Si cambias `index.html` desde el editor de GitHub, el sitio se actualiza
solo si Netlify esta conectado al repositorio.

## Detalle util

El audio se carga recien en el primer tap, no al abrir la pagina. Con
decenas de archivos, cargarlos todos de entrada haria la pagina lenta y
gastaria datos de mas en el celular.
