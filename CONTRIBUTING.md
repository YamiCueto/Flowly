# Contribuyendo a Flowly

¡Antes que nada, gracias por tomarte el tiempo para contribuir! 🎉

Este documento proporciona pautas y detalles técnicos para contribuir a Flowly. Ya sea que estés arreglando un bug, añadiendo una característica o mejorando la documentación, esta guía te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración para Desarrollo](#configuración-para-desarrollo)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Añadiendo Nuevas Características](#añadiendo-nuevas-características)
- [Guías de Estilo de Código](#guías-de-estilo-de-código)
- [Guías de Pruebas](#guías-de-pruebas)
- [Proceso de Pull Request](#proceso-de-pull-request)

---

## 🤝 Código de Conducta

Este proyecto se adhiere a un principio simple: **Sé respetuoso**. Todos estamos aquí para construir algo útil para la comunidad.

- **Sé amable** en las discusiones de issues y revisiones de código
- **Sé constructivo** con el feedback
- **Sé paciente** — los mantenedores son voluntarios
- **Sé inclusivo** — todos son bienvenidos

¿Violaciones? Contacta a [@YamiCueto](https://github.com/YamiCueto).

---

## 🛠️ ¿Cómo Puedo Contribuir?

### Reportar Bugs

Antes de crear un reporte de bug, verifica los [issues existentes](https://github.com/YamiCueto/Flowly/issues) para evitar duplicados.

**Un buen reporte de bug incluye:**
```markdown
**Descripción**: Una línea clara
**Pasos para Reproducir**:
1. Abre Flowly
2. Haz clic en la herramienta 'Rectángulo'
3. Dibuja un rectángulo
4. Haz clic en 'Exportar' → 'SVG'
5. Observa: [describe el problema]

**Esperado**: El SVG exporta con dimensiones correctas
**Obtenido**: El SVG tiene 0x0 píxeles

**Entorno**:
- Navegador: Chrome 120.0.6099.109
- OS: macOS 14.2
- Versión de Flowly: 1.0.0

**Capturas**: [adjuntar si es relevante]
```

### Sugerir Características

Usa [GitHub Discussions](https://github.com/YamiCueto/Flowly/discussions) para propuestas de características.

**Una buena solicitud de característica incluye:**
- **Caso de uso**: ¿Por qué necesitas esto?
- **Solución propuesta**: ¿Cómo funcionaría?
- **Alternativas consideradas**: ¿En qué más pensaste?
- **Mockups/diagramas**: Los ejemplos visuales ayudan

### Mejorar la Documentación

Los documentos viven junto al código. ¿Un simple error tipográfico? Corrígelo directamente en GitHub y envía un PR.

Mejoras de documentación más grandes:
- Actualizaciones del README.md
- Mejoras de comentarios de código
- Nuevo tutorial/guía en `/docs`

### Contribuir con Código

Ver [Configuración para Desarrollo](#configuración-para-desarrollo) abajo.

---

## 🚀 Configuración para Desarrollo

### Prerrequisitos

- **Navegador**: Chrome/Firefox/Edge (últimas 2 versiones)
- **Editor de texto**: VS Code recomendado (extensiones ESLint + Prettier)
- **Git**: Para control de versiones
- **Opcional**: Servidor web local (ver abajo)

### Configuración Inicial

```bash
# 1. Haz fork del repo en GitHub
# 2. Clona tu fork
git clone https://github.com/TU_USUARIO/Flowly.git
cd Flowly

# 3. Añade remote upstream
git remote add upstream https://github.com/YamiCueto/Flowly.git

# 4. Abre en el navegador
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

**Opcional: Ejecutar un servidor local** (evita problemas de CORS)
```bash
# Python 3
python -m http.server 8000

# Node.js (instala http-server primero: npm i -g http-server)
http-server -p 8000

# PHP
php -S localhost:8000

# Luego visita http://localhost:8000
```

### Flujo de Trabajo de Desarrollo

```bash
# 1. Crea una rama de feature
git checkout -b feature/mi-caracteristica-increible

# 2. Haz cambios (ver Guías de Estilo de Código)

# 3. Prueba manualmente en el navegador
# - Prueba que tu característica funciona
# - Prueba casos extremos
# - Prueba en viewport móvil

# 4. Commit con conventional commits
git add .
git commit -m "feat: añadir figura hexágono a la barra de herramientas"

# 5. Push a tu fork
git push origin feature/mi-caracteristica-increible

# 6. Abre PR en GitHub
```

**Formato de mensajes de commit:**
```
<tipo>(<alcance>): <asunto>

Tipos: feat, fix, docs, style, refactor, test, chore
Alcance: canvas, export, ui, shapes, tools, storage

Ejemplos:
feat(shapes): añadir figura polígono estrella
fix(export): corregir matriz de transformación SVG para figuras rotadas
docs(readme): añadir sección de troubleshooting
refactor(canvas): extraer lógica de selección a módulo separado
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
Flowly/
├── index.html              # HTML principal (estructura UI)
├── css/
│   ├── main.css           # Estilos globales, layout, canvas
│   ├── toolbar.css        # Estilos específicos de barra de herramientas/sidebar
│   └── modals.css         # Diálogos modales
├── js/
│   ├── app.js             # 🎯 Punto de entrada, inicialización de app
│   ├── canvas-manager.js  # 📐 Estado del canvas, gestión de figuras
│   ├── tools.js           # 🛠️ Cambio de herramientas, manejadores de dibujo
│   ├── shapes.js          # 🔷 Funciones factory de figuras
│   ├── export-manager.js  # 📤 Lógica de exportación multi-formato
│   ├── storage.js         # 💾 Wrapper de LocalStorage
│   ├── connectors.js      # 🔗 Sistema de conectores (en progreso)
│   ├── canvas/            # Subsistemas modulares del canvas
│   │   ├── init.js        # Inicialización del stage
│   │   ├── anchors.js     # Gestión de puntos de anclaje
│   │   ├── selection.js   # Selección/transformador
│   │   └── history.js     # Stack de deshacer/rehacer
│   └── ui/                # Módulos helper de UI
│       ├── toolbar.js     # Manejadores de eventos de barra de herramientas
│       ├── properties.js  # Lógica del panel de propiedades
│       ├── modals.js      # Abrir/cerrar modal
│       ├── shortcuts.js   # Atajos de teclado
│       └── notifications.js # Wrappers de toast/alerta
└── assets/                # Imágenes, íconos (si hay)
```

### Patrones de Arquitectura

#### 1. **Patrón Singleton** - CanvasManager

Solo existe una instancia del canvas por carga de página.

```javascript
// js/canvas-manager.js
export class CanvasManager {
    constructor(containerId) {
        this.stage = new Konva.Stage({ /* ... */ });
        // ... inicialización de estado
    }
}

// js/app.js
this.canvasManager = new CanvasManager('canvas-wrapper');
```

#### 2. **Patrón Factory** - Creación de Figuras

```javascript
// js/shapes.js
export function createRectangle(x, y, config = {}) {
    return new Konva.Rect({
        x, y,
        width: config.width || 100,
        height: config.height || 100,
        fill: config.fill || '#3498db',
        stroke: config.stroke || '#2c3e50',
        strokeWidth: config.strokeWidth || 2,
        draggable: true
    });
}

// Uso en tools.js
const rect = createRectangle(pos.x, pos.y, toolConfig);
canvasManager.addShape(rect);
```

#### 3. **Patrón Observer** - Sistema de Eventos

```javascript
// CanvasManager emite eventos
class CanvasManager {
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(...args));
        }
    }
}

// UI escucha eventos
canvasManager.on('selectionChanged', (shapes) => {
    updatePropertiesPanel(shapes);
});
```

#### 4. **Patrón Module** - Módulos ES6

```javascript
// Cada archivo exporta funciones/clases específicas
// import { createCircle } from './shapes.js';
// import { CanvasManager } from './canvas-manager.js';
```

### Flujo de Datos

```
Acción del Usuario (clic, arrastrar, tecla)
    ↓
Manejador de Evento (ui/toolbar.js, ui/shortcuts.js)
    ↓
ToolManager.handleTool() o método de CanvasManager
    ↓
ShapeFactory crea figura Konva
    ↓
CanvasManager.addShape(shape)
    ↓
    ├─→ Añadir al stage de Konva (renderizar)
    ├─→ Hacer seleccionable (event listeners)
    ├─→ Guardar en historial (deshacer/rehacer)
    └─→ Emitir evento 'shapeAdded'
            ↓
    UI escucha y actualiza (panel de propiedades, etc.)
```

### Clases/Módulos Clave

#### `FlowlyApp` (js/app.js)
**Responsabilidad**: Orquestador de la aplicación

```javascript
class FlowlyApp {
    init() {
        // 1. Inicializar managers
        this.canvasManager = new CanvasManager('canvas-wrapper');
        this.toolManager = new ToolManager(this.canvasManager);
        this.exportManager = new ExportManager(this.canvasManager);
        this.storageManager = new StorageManager();
        
        // 2. Configurar módulos UI
        setupToolbar(this.toolManager);
        setupShortcuts(this.canvasManager);
        setupPropertiesPanel(this.canvasManager);
        
        // 3. Conectar eventos
        this.canvasManager.on('selectionChanged', this.updateUI.bind(this));
    }
}
```

#### `CanvasManager` (js/canvas-manager.js)
**Responsabilidad**: Stage de Konva, figuras, selección, historial

**Métodos clave:**
```javascript
class CanvasManager {
    // Operaciones de figuras
    addShape(shape, saveToHistory = true)
    deleteSelected()
    copy() / paste()
    
    // Selección
    selectShape(shape)
    clearSelection()
    selectedShapes // array
    
    // Historial
    saveHistory()
    undo() / redo()
    canUndo() / canRedo()
    
    // Serialización
    toJSON() // exportar estado
    loadFromJSON(data) // importar estado
    
    // Eventos
    on(event, callback)
    emit(event, ...args)
}
```

#### `ToolManager` (js/tools.js)
**Responsabilidad**: Orquestación de herramientas de dibujo

```javascript
class ToolManager {
    setTool(toolName) {
        this.currentTool = toolName;
        this.stage.container().style.cursor = this.getCursor(toolName);
    }
    
    handleMouseDown(e) {
        if (this.currentTool === 'rectangle') {
            // Comenzar a dibujar rectángulo
        }
    }
}
```

#### `ExportManager` (js/export-manager.js)
**Responsabilidad**: Exportación multi-formato

```javascript
class ExportManager {
    export(format) {
        switch(format) {
            case 'png': return this.exportPNG();
            case 'svg': return this.exportSVG();
            // ...
        }
    }
    
    exportSVG() {
        // Serialización SVG personalizada con matrices de transformación
        const shapes = this.canvasManager.mainLayer.children;
        let svg = '<svg>...</svg>';
        shapes.forEach(shape => {
            svg += this.shapeToSVG(shape); // Convierte Konva → elementos SVG
        });
        return svg;
    }
}
```

---

## ➕ Añadiendo Nuevas Características

### Ejemplo 1: Añadir una Nueva Figura

**Objetivo**: Añadir una figura "Estrella"

#### 1. Crear factory de figura (js/shapes.js)

```javascript
export function createStar(x, y, config = {}) {
    return new Konva.Star({
        x, y,
        numPoints: config.numPoints || 5,
        innerRadius: config.innerRadius || 20,
        outerRadius: config.outerRadius || 50,
        fill: config.fill || '#f39c12',
        stroke: config.stroke || '#e67e22',
        strokeWidth: config.strokeWidth || 2,
        draggable: true
    });
}
```

#### 2. Añadir a la barra de herramientas (index.html)

```html
<button class="tool-btn" data-tool="star" title="Estrella (S)">
    <i class="fas fa-star"></i>
</button>
```

#### 3. Añadir a la librería de figuras del sidebar (index.html)

```html
<div class="shape-item" data-shape="star">
    <i class="fas fa-star"></i>
    <span>Estrella</span>
</div>
```

#### 4. Manejar herramienta en ToolManager (js/tools.js)

```javascript
// En handleMouseDown()
case 'star':
    const star = createStar(pos.x, pos.y, {
        outerRadius: 0, // Crecerá al arrastrar
        ...this.defaultStyles
    });
    this.tempShape = star;
    this.canvasManager.mainLayer.add(star);
    break;

// En handleMouseMove() (al arrastrar para dibujar)
case 'star':
    const radius = Math.sqrt(dx*dx + dy*dy);
    this.tempShape.outerRadius(radius);
    this.tempShape.innerRadius(radius * 0.4);
    this.canvasManager.mainLayer.batchDraw();
    break;
```

#### 5. Manejar clic de librería (js/ui/toolbar.js)

```javascript
document.getElementById('shapes-library').addEventListener('click', (e) => {
    const shapeItem = e.target.closest('.shape-item');
    if (shapeItem) {
        const shapeType = shapeItem.dataset.shape;
        if (shapeType === 'star') {
            const star = createStar(300, 200); // centro del canvas
            this.canvasManager.addShape(star);
        }
    }
});
```

#### 6. Añadir atajo de teclado (js/ui/shortcuts.js)

```javascript
case 'KeyS':
    if (!e.ctrlKey && !e.metaKey) {
        this.toolManager.setTool('star');
    }
    break;
```

#### 7. Actualizar exportación SVG (js/export-manager.js)

```javascript
// En switch statement de shapeToSVG()
case 'Star':
    const numPoints = attrs.numPoints || 5;
    const outerRadius = attrs.outerRadius * shape.scaleX();
    const innerRadius = attrs.innerRadius * shape.scaleX();
    // ... calcular puntos de estrella y retornar <polygon> o <path>
    break;
```

#### 8. Probar

- [ ] Dibujar estrella con el mouse
- [ ] Hacer clic en estrella en la librería
- [ ] Presionar tecla 'S' para activar herramienta
- [ ] Seleccionar estrella, cambiar color/tamaño en panel de propiedades
- [ ] Deshacer/rehacer después de crear estrella
- [ ] Exportar como PNG/SVG/PDF
- [ ] Guardar proyecto, recargar, verificar que la estrella persiste

---

## 📝 Guías de Estilo de Código

### JavaScript (ES6+)

**Usa JavaScript moderno:**
```javascript
// ✅ Bien
const shapes = [...this.selectedShapes];
const config = { fill: '#3498db', ...userConfig };
const filtered = shapes.filter(s => s.visible());

// ❌ Mal
var shapes = this.selectedShapes.slice();
var config = Object.assign({ fill: '#3498db' }, userConfig);
```

**Convenciones de nombres:**
```javascript
// Clases: PascalCase
class CanvasManager {}

// Funciones/variables: camelCase
function createRectangle() {}
const currentTool = 'select';

// Constantes: UPPER_SNAKE_CASE
const MAX_HISTORY_SIZE = 50;

// Métodos privados: _prefixUnderscore (convención, no forzada)
_updateInternalState() {}
```

**Documentación de funciones:**
```javascript
/**
 * Añade una figura al canvas
 * @param {Konva.Shape} shape - La figura Konva a añadir
 * @param {boolean} saveToHistory - Si añadir al stack de deshacer (predeterminado: true)
 * @returns {Konva.Shape} La figura añadida
 */
addShape(shape, saveToHistory = true) {
    // ...
}
```

**Manejo de errores:**
```javascript
// ✅ Bien: Degradación elegante
try {
    const matrix = shape.getAbsoluteTransform().getMatrix();
} catch (e) {
    console.warn('Matriz de transformación no disponible, usando identidad', e);
    matrix = [1, 0, 0, 1, 0, 0];
}

// ❌ Mal: Errores no capturados rompen la app
const matrix = shape.getAbsoluteTransform().getMatrix(); // Puede lanzar error
```

### CSS

**Usa Variables CSS:**
```css
:root {
    --primary-color: #3498db;
    --sidebar-width: 250px;
    --toolbar-height: 60px;
}

.toolbar {
    height: var(--toolbar-height);
    background: var(--primary-color);
}
```

**Nombrado tipo BEM** (Block__Element--Modifier):
```css
/* Block */
.toolbar {}

/* Element */
.toolbar__button {}
.toolbar__icon {}

/* Modifier */
.toolbar__button--active {}
```

**Responsive móvil-primero:**
```css
/* Base (móvil) */
.sidebar { width: 100%; }

/* Tablet+ */
@media (min-width: 768px) {
    .sidebar { width: 250px; }
}
```

### HTML

**Markup semántico:**
```html
<!-- ✅ Bien -->
<nav class="toolbar">
    <button class="tool-btn" data-tool="select">
        <i class="fas fa-mouse-pointer"></i>
        <span class="sr-only">Seleccionar</span>
    </button>
</nav>

<!-- ❌ Mal -->
<div class="toolbar">
    <div onclick="selectTool()">Seleccionar</div>
</div>
```

**Accesibilidad:**
- Usa `aria-label` para botones solo de íconos
- Incluye atributos `title` para tooltips
- Asegura que la navegación por teclado funcione (Tab, Enter, Esc)

---

## 🧪 Guías de Pruebas

Flowly usa **pruebas manuales** actualmente. ¡Pruebas automatizadas bienvenidas!

### Lista de Verificación de Pruebas Manuales

Antes de enviar un PR, prueba:

#### Funcionalidad Principal
- [ ] Dibujar todos los tipos de figuras (rectángulo, círculo, triángulo, etc.)
- [ ] Seleccionar figuras (simple, múltiple con Shift)
- [ ] Mover, redimensionar, rotar figuras
- [ ] Cambiar colores, ancho de contorno, opacidad en panel de propiedades
- [ ] Copiar/pegar figuras
- [ ] Deshacer/rehacer (probar 5+ pasos atrás/adelante)
- [ ] Eliminar figuras (tecla Delete + botón de barra de herramientas)

#### Operaciones de Archivo
- [ ] Guardar proyecto (Ctrl+S)
- [ ] Cargar proyecto (Ctrl+O)
- [ ] Nuevo proyecto (Ctrl+N) limpia el canvas
- [ ] Exportar a todos los formatos (PNG, JPG, SVG, PDF, JSON)

#### Casos Extremos
- [ ] Dibujar figuras muy pequeñas (<10px)
- [ ] Dibujar figuras muy grandes (>1000px)
- [ ] Hacer zoom in/out, verificar que las figuras permanecen visibles
- [ ] Redimensionar ventana del navegador, el canvas se adapta
- [ ] Pegar sin copiar primero (no debería hacer nada)
- [ ] Deshacer con historial vacío (no debería hacer nada)

#### Compatibilidad de Navegador
Probar en **al menos 2 navegadores**:
- Chrome/Edge (Chromium)
- Firefox
- Safari (si estás en macOS/iOS)

**Consejo**: Usa [BrowserStack](https://www.browserstack.com/open-source) (gratis para código abierto) o [LambdaTest](https://www.lambdatest.com/).

---

## 🔄 Proceso de Pull Request

### Antes de Enviar

1. **Prueba exhaustivamente** (ver lista de verificación arriba)
2. **Actualiza documentación** si cambiaste APIs o añadiste características
3. **Mantén PRs enfocados** — una característica/arreglo por PR
4. **Rebase en main más reciente**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Template de PR

Al abrir un PR, incluye:

```markdown
## Descripción
Breve resumen de lo que hace este PR.

## Tipo de Cambio
- [ ] Arreglo de bug
- [ ] Nueva característica
- [ ] Cambio que rompe compatibilidad
- [ ] Actualización de documentación

## Lista de Verificación
- [ ] El código sigue las guías de estilo
- [ ] Código auto-revisado
- [ ] Comentadas áreas difíciles de entender
- [ ] Documentación actualizada
- [ ] Probado manualmente (ver resultados de prueba abajo)
- [ ] Sin errores/advertencias en consola

## Resultados de Prueba
**Probado en:**
- [ ] Chrome 120 (macOS)
- [ ] Firefox 121 (Windows)

**Escenarios de prueba:**
- Creé 5 rectángulos, roté, cambié colores ✅
- Exporté a SVG, abrí en Figma ✅
- Copié/pegué figuras entre pestañas del navegador ✅

## Capturas de Pantalla
[Si hay cambios de UI, adjuntar capturas antes/después]

## Issues Relacionados
Cierra #123
```

### Proceso de Revisión

1. **Verificaciones automatizadas** ejecutan (linting, si está configurado)
2. **Mantenedor revisa** código
3. **Ciclo de feedback**: Aborda comentarios, push actualizaciones
4. **Aprobación**: Una vez aprobado, el mantenedor hace merge

**Tiempo típico de revisión**: 2-7 días (sé paciente, ¡los mantenedores son voluntarios!)

### Después del Merge

- Tu contribución se inmortaliza en [CHANGELOG.md](CHANGELOG.md)
- Te añaden a la lista de contribuidores
- 🎉 ¡Celebra! Acabas de hacer Flowly mejor.

---

## 💡 Consejos para Contribuidores Primerizos

### Buenos Issues Iniciales

Busca [issues etiquetados `good first issue`](https://github.com/YamiCueto/Flowly/labels/good%20first%20issue).

**Ejemplos:**
- Añadir nuevos tipos de figuras (diamante, estrella)
- Mejorar atajos de teclado
- Arreglar bugs de alineación CSS
- Añadir nuevas opciones de exportación (WebP, TIFF)
- Traducir UI a otro idioma

### Pide Ayuda

¿Atascado? No dudes en:
- Comentar en el issue en el que estás trabajando
- Preguntar en [Discussions](https://github.com/YamiCueto/Flowly/discussions)
- Etiquetar a [@YamiCueto](https://github.com/YamiCueto)

**¡Preferimos "preguntas tontas" sobre PRs abandonados!**

### Mantenlo Simple

- Comienza pequeño (arregla un error tipográfico, añade una característica pequeña)
- No refactorices todo en tu primer PR
- Coincide con el estilo de código existente (incluso si no estás de acuerdo)

---

## 📚 Recursos Adicionales

### Aprendiendo Konva.js
- [Documentación Oficial](https://konvajs.org/docs/)
- [Ejemplos](https://konvajs.org/docs/sandbox/)
- [Referencia API](https://konvajs.org/api/Konva.html)

### Mejores Prácticas de JavaScript
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [JavaScript Info](https://javascript.info/)

### Inspiración de UX de Diagramas
- [Excalidraw](https://excalidraw.com/) — estética dibujada a mano
- [tldraw](https://www.tldraw.com/) — interacciones suaves
- [draw.io](https://app.diagrams.net/) — completitud de características

---

## 🙏 ¡Gracias!

Cada contribución, no importa cuán pequeña, hace Flowly mejor para todos.

**Salón de la Fama de Contribuidores**: Ver [CONTRIBUTORS.md](CONTRIBUTORS.md) (¡próximamente!)

---

**¿Preguntas?** Abre una [Discusión](https://github.com/YamiCueto/Flowly/discussions) o contacta a [@YamiCueto](https://github.com/YamiCueto).

¡Feliz codificación! 🚀
