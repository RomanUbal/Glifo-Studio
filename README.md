# Glifo Studio

[Probar la demo en línea](https://glifo-studio.vercel.app) · [Ver el código](https://github.com/RomanUbal/Glifo-Studio)

Editor visual de diseño web creado por **Román Ubal**. Permite construir una interfaz directamente sobre un lienzo, ajustar sus propiedades y exportar el resultado como un archivo HTML autónomo.

Glifo está pensado como una demostración de producto: combina interacción de escritorio, persistencia local, generación de código y una experiencia visual consistente en una sola aplicación.

## Funcionalidades

- Editor de arrastrar y soltar con componentes de texto, botones, imágenes, formularios y tarjetas.
- Panel de propiedades para posición, tamaño, tipografía, color, bordes, sombras y capas.
- Historial de hasta 80 estados con deshacer y rehacer.
- Vistas de escritorio, tablet y móvil, más zoom y modo de previsualización.
- Cinco plantillas iniciales: landing, contacto, precios, perfil y dashboard.
- Autoguardado en el navegador y recuperación automática del último borrador.
- Importación y exportación de proyectos en JSON.
- Exportación de un sitio completo como HTML independiente.
- Atajos de teclado, menú contextual y organización por capas.

## Tecnologías y decisiones

- **JavaScript sin dependencias en el editor:** toda la lógica principal vive en `public/glifo.html` y puede ejecutarse de forma autónoma.
- **Next.js 16 + React 19:** envoltura optimizada para despliegue en Vercel, metadatos y analítica de producción.
- **Node.js nativo:** servidor estático alternativo, sin dependencias, para probar el editor localmente.
- **Persistencia local:** el borrador se guarda en `localStorage`; ningún contenido del usuario se envía a un servidor.

## Ejecutar el proyecto

### Opción rápida, sin instalar dependencias

```bash
node server.js
```

Abrí `http://localhost:3000`. Para usar otro puerto:

```bash
PORT=8080 node server.js
```

### Desarrollo con Next.js

```bash
pnpm install
pnpm dev
```

### Verificación de producción

```bash
pnpm build
pnpm start
```

## Estructura principal

```text
app/
  layout.tsx            metadatos y configuración general
  opengraph-image.tsx   imagen social generada por Next.js
  page.tsx              punto de entrada del editor
public/
  glifo.html             editor completo: interfaz, estilos y lógica
  favicon.svg            icono de marca
  glifo-logo.svg         identidad visual
server.js                servidor HTTP estático alternativo
```

## Privacidad

El autoguardado utiliza únicamente el almacenamiento local del navegador. Los proyectos pueden descargarse como JSON o HTML y permanecen bajo control de la persona que usa la aplicación.

## Autor

**Román Ubal** — desarrollador de software junior con formación en Programación en UTN.

