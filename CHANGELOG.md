# Registro de Cambios

Todos los cambios notables a Flowly serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

---

## [No Publicado]

### Planeado
- Conectores inteligentes con auto-enrutamiento (codo, curvas bezier)
- Librería de plantillas de figuras (estándares de flowchart, íconos AWS, UML)
- Colaboración en tiempo real (sincronización WebRTC o WebSocket)
- Agrupación y bloqueo de figuras
- Panel de capas (gestión de z-index)
- Mejoras de ajuste a grilla (guías magnéticas)
- Alternar tema oscuro
- Gestos táctiles para móvil (pinch-zoom, paneo con dos dedos)
- Sistema de plugins para figuras personalizadas

---

## [1.0.0] - 2025-01-17

🎉 **Lanzamiento Público Inicial** — Una herramienta de diagramas ligera y basada en navegador sin instalación requerida.

### Añadido

#### Canvas Principal
- **Canvas basado en Konva.js** con renderizado suave a 60fps
- **Librería de figuras**: Rectángulo, Círculo, Elipse, Triángulo, Pentágono, Hexágono, Línea, Flecha, Texto
- **Arrastrar y soltar** figuras desde la barra lateral al canvas
- **Multi-selección** con Shift+Clic y caja de arrastre para seleccionar
- **Transformador** para redimensionar, rotar, escalar con manijas visuales
- **Control de z-index**: Traer al Frente / Enviar al Fondo
- **Copiar/Pegar** con desplazamiento (Ctrl+C / Ctrl+V)
- **Deshacer/Rehacer** con historial de 50 pasos (Ctrl+Z / Ctrl+Shift+Z)

#### Panel de Propiedades
- **Selectores de color** para relleno y contorno (vista previa en tiempo real)
- **Deslizador de ancho de contorno** (0-20px)
- **Control de opacidad** (0-100%)
- **Entradas de posición** (coordenadas X, Y)
- **Entradas de tamaño** (ancho, alto con bloqueo de relación de aspecto)
- **Deslizador de rotación** (0-360°)
- **Edición de texto** para figuras de texto (fuente, tamaño, alineación)

#### Sistema de Exportación
- **Exportación PNG** — raster de alta calidad (relación de píxeles 2x)
- **Exportación JPG** — raster comprimido con deslizador de calidad
- **Exportación SVG** — formato vectorial preservando transformaciones (rotación/escala vía matriz)
- **Exportación PDF** — soporte multi-página con auto-diseño
- **Exportación JSON** — estado completo del proyecto para backup/compartir

#### Almacenamiento
- **Persistencia en LocalStorage** — auto-guarda últimos 10 proyectos
- **Gestión de proyectos** — guardar, cargar, eliminar proyectos con miniaturas
- **Importar/Exportar** archivos JSON para transferencia entre dispositivos

#### UI/UX
- **Layout responsive** — sidebar se colapsa en móvil (<768px)
- **Atajos de teclado** — 20+ atajos para herramientas, edición, operaciones de archivo
- **Tooltips** — tooltips de Bootstrap en todos los botones de la barra de herramientas
- **Alternar grilla** — guía visual (grilla de 10px, ajuste aún no habilitado)
- **Controles de zoom** — Ajustar a Pantalla, zoom in/out (Ctrl+Scroll)
- **Notificaciones toast** — feedback de éxito/error (SweetAlert2)

#### Experiencia del Desarrollador
- **Arquitectura modular** — módulos ES6 en `js/canvas/` y `js/ui/`
- **Patrón attacher** — refactorización incremental sin cambios que rompan compatibilidad
- **Sin paso de compilación** — ejecuta directamente en el navegador (dependencias CDN)
- **~1500 líneas de JS** — bien comentadas, base de código accesible

### Cambiado
- Refactorizado `CanvasManager` en subsistemas modulares:
  - `canvas/init.js` — inicialización del stage de Konva
  - `canvas/anchors.js` — puntos de anclaje de conexión (fundación para Fase 2)
  - `canvas/selection.js` — lógica de selección/transformador
  - `canvas/history.js` — stack de deshacer/rehacer
  - `canvas/creation.js` — copiar/pegar/factory de figuras
- Mejorada exportación SVG para usar matrices de transformación absolutas (preserva rotación/escala)

### Arreglado
- **Revocación de URL de Blob** en exportación SVG — retrasada 1500ms para prevenir cancelación de descarga
- **Verificación de disponibilidad de jsPDF** — error elegante si la librería PDF falla al cargar
- **Inicialización del canvas** — restaurado método `init()` faltante después de corrupción
- **Eliminación de código duplicado** — eliminados métodos redundantes a través de módulos

### Seguridad
- Todas las dependencias cargadas desde CDN con hashes SRI (Integridad de Subrecurso) planeados para v1.1

---

## [0.9.0] - 2024-12-01

### Beta Interna
- Fase inicial de desarrollo
- Renderizado principal del canvas con Konva.js
- Librería básica de figuras (rectángulo, círculo, línea)
- Prototipo del panel de propiedades
- Experimentos con LocalStorage

---

## Estrategia de Versiones

Flowly sigue **Versionado Semántico** (MAJOR.MINOR.PATCH):

- **MAJOR** (v2.0.0): Cambios de API que rompen compatibilidad, refactorizaciones mayores, cambios arquitectónicos
- **MINOR** (v1.1.0): Nuevas características, mejoras compatibles hacia atrás
- **PATCH** (v1.0.1): Arreglos de bugs, mejoras de rendimiento, parches de seguridad

### Calendario de Lanzamientos

- **Lanzamientos mayores**: Anuales (v2.0 planeado para 2026)
- **Lanzamientos menores**: Trimestrales (v1.1, v1.2, v1.3, etc.)
- **Lanzamientos de parche**: Según sea necesario (hotfixes dentro de 48 horas de bugs críticos)

### Vista Previa del Roadmap

#### v1.1.0 (T2 2025) — Exportación Mejorada & Colaboración
- Exportar a formato Figma/Sketch
- Compartir vía URL única (integración Firebase)
- Importar archivos XML de draw.io
- Eliminación de marca de agua para usuarios de código abierto

#### v1.2.0 (T3 2025) — Conectores Inteligentes
- Conectores de auto-enrutamiento (codo, bezier)
- Ajuste magnético a puntos de anclaje
- Etiquetas y estilos de conectores
- Algoritmos de auto-diseño de figuras

#### v2.0.0 (2026) — Colaboración en Tiempo Real
- Edición multi-usuario (WebRTC)
- Indicadores de presencia (cursores, selecciones)
- Hilos de comentarios en figuras
- Historial de versiones (viaje en el tiempo)

Ver [README.md — Roadmap](README.md#-roadmap) para detalles completos.

---

## Contribuyendo

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para cómo añadir tus cambios a este registro de cambios.

**Formato para nuevas entradas:**
```markdown
## [X.Y.Z] - AAAA-MM-DD

### Añadido
- Nuevas características

### Cambiado
- Cambios en funcionalidad existente

### Obsoleto
- Características que pronto se eliminarán

### Eliminado
- Características eliminadas

### Arreglado
- Arreglos de bugs

### Seguridad
- Mejoras de seguridad
```

---

## Contacto

¿Preguntas sobre un lanzamiento? Abre un issue en [GitHub](https://github.com/YamiCueto/Flowly/issues).

[No Publicado]: https://github.com/YamiCueto/Flowly/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YamiCueto/Flowly/releases/tag/v1.0.0
[0.9.0]: https://github.com/YamiCueto/Flowly/releases/tag/v0.9.0
