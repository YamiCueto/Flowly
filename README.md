# 🎨 Flowly - Creador de Diagramas Interactivo

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)

Una aplicación web moderna y ligera para crear diagramas de flujo, esquemas y diseños visuales. Similar a draw.io pero más simple y rápida, construida con tecnologías web nativas.

🔗 **Demo en vivo**: [yamicueto.github.io/Flowly](https://yamicueto.github.io/Flowly)

## ✨ Características Principales

### 🎯 Canvas Interactivo
- **Área de trabajo infinita** con zoom y pan
- **Grid configurable** con snap-to-grid
- **Selección múltiple** de elementos (Shift + Click o arrastre de área)
- **Drag & drop** intuitivo
- **Transformaciones** completas: resize, rotación, reordenamiento

### 🔧 Herramientas de Dibujo
- **Formas básicas**: Rectángulos, círculos, elipses, triángulos
- **Rectángulos redondeados** personalizables
- **Líneas y flechas** con diferentes estilos
- **Texto editable** con doble-click
- **Conectores inteligentes** (próximamente)

### 🎨 Personalización
- **Colores personalizables** (relleno y borde)
- **Grosor de línea** ajustable
- **Opacidad** configurable
- **Propiedades de texto** (tamaño, fuente, color)
- **Panel de propiedades** contextual

### 💾 Gestión de Proyectos
- **Guardado local** en navegador (localStorage)
- **Auto-guardado** de última sesión
- **Historial** con deshacer/rehacer (Ctrl+Z / Ctrl+Y)
- **Copiar/Pegar** elementos (Ctrl+C / Ctrl+V)

### 📤 Exportación Multi-Formato
- **PNG** - Imagen de alta calidad (2x resolution)
- **JPG** - Imagen comprimida con fondo blanco
- **SVG** - Gráfico vectorial escalable
- **PDF** - Documento portable con ajuste automático
- **JSON** - Formato nativo para reimportar

## 🚀 Instalación

### Opción 1: Clonar el repositorio

```bash
git clone https://github.com/YamiCueto/Flowly.git
cd Flowly
```

Luego simplemente abre `index.html` en tu navegador. ¡Así de simple!

### Opción 2: Descargar ZIP

1. Descarga el archivo ZIP desde [releases](https://github.com/YamiCueto/Flowly/releases)
2. Extrae el contenido
3. Abre `index.html` en tu navegador

### Opción 3: Deployment en GitHub Pages

1. Fork este repositorio
2. Ve a Settings → Pages
3. Selecciona la rama `main` como source
4. ¡Tu aplicación estará disponible en `https://tu-usuario.github.io/Flowly`!

## 📖 Cómo Usar

### Herramientas Básicas

#### Seleccionar (V)
- Click en un elemento para seleccionarlo
- Shift + Click para selección múltiple
- Arrastra para mover elementos
- Usa los handles para redimensionar

#### Dibujar Formas (R, C, L, A, T)
- Selecciona una herramienta de la barra superior
- Click y arrastra en el canvas para crear la forma
- Ajusta propiedades en el panel derecho

#### Editar Texto
- Doble-click en cualquier texto para editarlo
- Presiona Ctrl+Enter o Esc para finalizar la edición
- Cambia tamaño, fuente y color en el panel de propiedades

### Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Seleccionar | `V` |
| Rectángulo | `R` |
| Círculo | `C` |
| Línea | `L` |
| Flecha | `A` |
| Texto | `T` |
| Mover vista | `H` |
| Deshacer | `Ctrl+Z` |
| Rehacer | `Ctrl+Y` o `Ctrl+Shift+Z` |
| Copiar | `Ctrl+C` |
| Pegar | `Ctrl+V` |
| Eliminar | `Delete` o `Backspace` |
| Zoom In | `+` o `=` |
| Zoom Out | `-` |
| Nuevo proyecto | `Ctrl+N` |
| Guardar | `Ctrl+S` |
| Cargar | `Ctrl+O` |

### Panel de Propiedades

El panel derecho muestra las propiedades del elemento seleccionado:

- **Color de relleno**: Click en el selector de color
- **Color de borde**: Personaliza el contorno
- **Grosor**: Slider de 0-20px
- **Opacidad**: Control de transparencia 0-100%
- **Posición**: Coordenadas X, Y exactas
- **Tamaño**: Ancho y alto en píxeles
- **Orden**: Traer al frente / Enviar atrás

### Exportar Diagramas

1. Click en el botón **Exportar** (icono de descarga)
2. Selecciona el formato deseado:
   - **PNG**: Mejor para compartir en web y presentaciones
   - **JPG**: Archivo más pequeño, ideal para email
   - **SVG**: Perfecto para impresión y escalado
   - **PDF**: Para documentación profesional
   - **JSON**: Para editar más tarde en Flowly

3. El archivo se descargará automáticamente

### Guardar y Cargar Proyectos

#### Guardar
- Click en el botón **Guardar** o presiona `Ctrl+S`
- Ingresa un nombre para tu proyecto
- Se guardará en tu navegador (máximo 10 proyectos)

#### Cargar
- Click en el botón **Cargar** o presiona `Ctrl+O`
- Selecciona un proyecto de la lista
- O carga un archivo JSON externo

**Nota**: Los proyectos se guardan localmente en tu navegador. Si limpias la caché, se perderán. Exporta como JSON para respaldos.

## 🏗️ Estructura del Proyecto

```
Flowly/
├── index.html              # Página principal
├── css/
│   ├── main.css           # Estilos generales
│   ├── toolbar.css        # Estilos de barra de herramientas
│   └── modals.css         # Estilos de modales
├── js/
│   ├── app.js             # Inicialización de la aplicación
│   ├── canvas-manager.js  # Gestión del canvas Konva
│   ├── tools.js           # Herramientas de dibujo
│   ├── shapes.js          # Factory de formas
│   ├── export-manager.js  # Exportación multi-formato
│   └── storage.js         # Gestión de localStorage
└── README.md              # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Librerías Principales

- **[Konva.js](https://konvajs.org/)** `v9.x` - Canvas interactivo y manipulación de formas
  - Licencia: MIT
  - Uso: Renderizado y gestión del canvas principal

- **[jsPDF](https://github.com/parallax/jsPDF)** `v2.5.1` - Generación de PDFs
  - Licencia: MIT
  - Uso: Exportación a formato PDF

- **[html2canvas](https://html2canvas.hertzen.com/)** `v1.4.1` - Screenshots HTML
  - Licencia: MIT
  - Uso: Exportación a PNG/JPG de alta calidad

- **[FileSaver.js](https://github.com/eligrey/FileSaver.js/)** `v2.0.5` - Descarga de archivos
  - Licencia: MIT
  - Uso: Gestión de descargas en el navegador

- **[Font Awesome](https://fontawesome.com/)** `v6.4.0` - Iconografía
  - Licencia: Font Awesome Free License
  - Uso: Iconos de interfaz

### Tecnologías Base

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript ES6+** - Módulos, clases, arrow functions
- **Canvas API** - Renderizado 2D

## 🎯 Arquitectura del Código

### Patrones de Diseño

- **Singleton**: `CanvasManager` - Una sola instancia del canvas
- **Factory**: `ShapeFactory` - Creación estandarizada de formas
- **Observer**: Sistema de eventos entre componentes
- **Module Pattern**: Organización en módulos ES6

### Flujo de Datos

```
Usuario → Toolbar/Tools → ToolManager → CanvasManager → Konva Stage
                                            ↓
                                      EventEmitter
                                            ↓
                                    PropertiesPanel
```

### Gestión de Estado

- **Canvas State**: Manejado por `CanvasManager`
- **History**: Stack de estados para undo/redo (max 50 pasos)
- **Selection**: Array de formas seleccionadas con transformer
- **Clipboard**: Copia temporal de objetos

## 🔮 Roadmap - Próximas Características

### Fase 2: Conectores Avanzados ⏳
- [ ] Conectores que se adhieren a formas
- [ ] Puntos de anclaje inteligentes
- [ ] Curvas Bezier automáticas
- [ ] Conectores que se actualizan al mover formas

### Fase 3: Más Formas y Herramientas ⏳
- [ ] Polígonos personalizados
- [ ] Curvas libres (pen tool)
- [ ] Formas de diagrama de flujo (decisión, proceso, etc.)
- [ ] Sticky notes / Post-its
- [ ] Imágenes importadas

### Fase 4: Colaboración 🔮
- [ ] Compartir diagrama por URL
- [ ] Edición colaborativa en tiempo real
- [ ] Comentarios y anotaciones
- [ ] Historial de versiones

### Fase 5: Templates y Bibliotecas 🔮
- [ ] Templates predefinidos (flowchart, UML, wireframe)
- [ ] Biblioteca de iconos y símbolos
- [ ] Importar SVGs personalizados
- [ ] Temas de color

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si quieres mejorar Flowly:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Usa **ES6+ JavaScript** moderno
- Mantén el código **limpio y comentado**
- Sigue los **patrones de diseño** existentes
- Añade **documentación** para nuevas características
- Prueba en **múltiples navegadores**

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/YamiCueto/Flowly/issues) con:

- **Descripción clara** del problema
- **Pasos para reproducir** el bug
- **Comportamiento esperado** vs actual
- **Screenshots** si es posible
- **Navegador y versión** donde ocurre

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Yami Cueto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Autor

**Yami Cueto**
- GitHub: [@YamiCueto](https://github.com/YamiCueto)

## 🙏 Agradecimientos

- [Konva.js](https://konvajs.org/) por el excelente framework de canvas
- [draw.io](https://draw.io) por la inspiración
- [Excalidraw](https://excalidraw.com/) por las ideas de UX
- [Figma](https://figma.com) por el diseño de referencia

## 📊 Stats

- **Líneas de código**: ~1500 JavaScript, ~800 CSS
- **Tamaño total**: ~50KB (sin librerías)
- **Dependencias**: 4 librerías CDN
- **Navegadores soportados**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

⭐ Si te gusta Flowly, ¡danos una estrella en GitHub!

🐛 ¿Encontraste un bug? [Repórtalo aquí](https://github.com/YamiCueto/Flowly/issues)

💡 ¿Tienes una idea? [Compártela aquí](https://github.com/YamiCueto/Flowly/discussions)
