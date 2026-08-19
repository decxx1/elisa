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

## Administración

La página privada `/admin` permite iniciar sesión, editar mensajes, quitar un mensaje sin borrar la persona o eliminar el registro completo. Configurá estas variables en `.env` o en Coolify:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=una-contraseña-segura
ADMIN_SESSION_SECRET=una-clave-larga-y-aleatoria
```

`ADMIN_SESSION_SECRET` es opcional porque, si no está definido, se usa la contraseña para firmar la sesión. No expongas estas variables al navegador.

Desde el mismo panel se puede abrir o cerrar el formulario público de confirmaciones y saludos. El estado se guarda en SQLite, por lo que permanece después de reinicios y despliegues.

## Fotos del evento

La página `/fotos` permite elegir imágenes de la galería del dispositivo o abrir la cámara. Cada original se envía por separado, sin redimensionar ni recomprimir, con un máximo de 50 MB por foto. Al subirla se genera una miniatura WebP para la galería pública; el visor y las descargas usan el original. También se puede descargar el álbum completo en ZIP.

Las fotos recibidas se pueden revisar y eliminar desde la sección `Fotos recibidas` dentro de `/admin`. La gestión requiere la sesión de administración.

En producción los archivos quedan en `/app/data/uploads`, dentro del mismo almacenamiento persistente de Coolify. La ruta se puede cambiar con:

```bash
UPLOAD_DIR=/app/data/uploads
```

## Coolify

El proyecto incluye un `Dockerfile` multi-stage. En Coolify:

- Puerto: `4321`
- Volumen persistente: `/app/data`
- Variable opcional: `DATABASE_PATH=/app/data/app.db`
- Variable opcional: `UPLOAD_DIR=/app/data/uploads`

La etapa de build usa Bun; la imagen final usa Node 22 para ejecutar el adaptador SSR de Astro y `better-sqlite3` de forma estable.
