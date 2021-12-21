# Sword hero

Side scroller en donde la espada se usa como herramienta.

## Instalar dependencias

* Correr `npm install` en / (raiz del proyecto)

## Compilar fuentes (con webpack)

Antes de pushear cambios al repo, compilar el juego para produccion:
* Correr `npm run compile_prod`.

De esta manera se genera el archivo `public/main.js` que contiene el codigo productivo del juego compilado con webpack

## Abrir juego en browser

Correr `npm start` y abrir una ventana del browser en `localhost:8080`.

## Desarrollo

Correr `npm run compile_watch` para iniciar una configuracion de webpack que constantemente monitoree cambios en el codebase y recompile automaticamente.