# Elisa · Un día para la historia

Landing interactiva para celebrar 102 años con una estética Art Déco / jazz de los años 20.

## Desarrollo

```bash
bun install
bun run dev
```

## RSVP

El formulario usa `POST /api/rsvp` y guarda una persona por DNI en SQLite. La base se crea automáticamente en `DATABASE_PATH` y la tabla aplica un índice único sobre el DNI.

Para reiniciar los invitados desde la terminal del servidor, ejecutar en runtime:

```bash
npm run db:reset
```

También se puede ejecutar directamente con `node ./scripts/reset-db.mjs`. El comando elimina los registros de `guests` y reinicia su contador; no requiere detener el servidor.

## Coolify

El proyecto incluye un `Dockerfile` multi-stage. En Coolify:

- Puerto: `4321`
- Volumen persistente: `/app/data`
- Variable opcional: `DATABASE_PATH=/app/data/app.db`

La etapa de build usa Bun; la imagen final usa Node 22 para ejecutar el adaptador SSR de Astro y `better-sqlite3` de forma estable.
