# 📋 Checklist de Verificación - Flowly v1.0

Use este checklist para verificar que todas las funcionalidades estén operativas.

## ✅ Funcionalidades Básicas

### Canvas
- [ ] El canvas se renderiza correctamente
- [ ] El grid es visible
- [ ] Toggle de grid funciona (checkbox superior)
- [ ] Snap to grid funciona cuando está activado
- [ ] Zoom in/out funciona (botones + y -)
- [ ] Zoom con porcentaje se actualiza correctamente
- [ ] Ajustar a pantalla funciona

### Herramientas de Dibujo
- [ ] **Seleccionar (V)**: Click selecciona elementos
- [ ] **Rectángulo (R)**: Se puede dibujar arrastrando
- [ ] **Rectángulo redondeado**: Tiene esquinas redondeadas
- [ ] **Círculo (C)**: Se dibuja desde el centro
- [ ] **Elipse**: Permite diferentes radios X/Y
- [ ] **Triángulo**: Apunta hacia arriba
- [ ] **Línea (L)**: Línea recta simple
- [ ] **Flecha (A)**: Tiene punta de flecha
- [ ] **Texto (T)**: Crea texto editable
- [ ] **Pan (H)**: Permite mover la vista

### Selección y Manipulación
- [ ] Click selecciona un elemento
- [ ] Shift+Click selecciona múltiples elementos
- [ ] Arrastra área para selección múltiple (TODO en v2)
- [ ] Handles de resize aparecen
- [ ] Resize funciona correctamente
- [ ] Rotación funciona
- [ ] Drag and drop mueve elementos
- [ ] Transformer se muestra en elementos seleccionados

### Edición de Texto
- [ ] Doble-click en texto permite editar
- [ ] Textarea aparece sobre el texto
- [ ] Ctrl+Enter finaliza edición
- [ ] Esc cancela edición
- [ ] Click fuera finaliza edición
- [ ] El texto se actualiza correctamente

### Panel de Propiedades
- [ ] Se muestra al seleccionar un elemento
- [ ] Se oculta cuando no hay selección
- [ ] Color de relleno cambia el elemento
- [ ] Color de borde cambia el elemento
- [ ] Input de color hex funciona
- [ ] Slider de grosor funciona (0-20px)
- [ ] Slider de opacidad funciona (0-100%)
- [ ] Inputs de posición (X, Y) funcionan
- [ ] Inputs de tamaño (Ancho, Alto) funcionan
- [ ] Propiedades de texto aparecen solo para texto
- [ ] Tamaño de fuente funciona
- [ ] Color de texto funciona

### Ordenamiento
- [ ] "Traer al frente" funciona
- [ ] "Enviar atrás" funciona
- [ ] Elementos se superponen correctamente

### Historial (Undo/Redo)
- [ ] Ctrl+Z deshace la última acción
- [ ] Ctrl+Y rehace la acción deshecha
- [ ] Ctrl+Shift+Z también rehace
- [ ] Botones de undo/redo funcionan
- [ ] Los botones se deshabilitan apropiadamente
- [ ] Historial se limita a 50 pasos

### Copiar/Pegar
- [ ] Ctrl+C copia elementos seleccionados
- [ ] Ctrl+V pega elementos
- [ ] Elementos pegados tienen offset
- [ ] Múltiples elementos se copian juntos

### Eliminar
- [ ] Tecla Delete elimina selección
- [ ] Tecla Backspace elimina selección
- [ ] Botón "Eliminar" en panel funciona
- [ ] Eliminación se puede deshacer

### Biblioteca de Formas
- [ ] Panel izquierdo muestra formas
- [ ] Click en forma la añade al centro
- [ ] Formas añadidas tienen tamaño razonable
- [ ] Formas se seleccionan automáticamente

## 💾 Gestión de Proyectos

### Guardar
- [ ] Ctrl+S abre diálogo de guardar
- [ ] Botón "Guardar" funciona
- [ ] Se solicita nombre del proyecto
- [ ] Proyecto se guarda en localStorage
- [ ] Confirmación de guardado aparece

### Cargar
- [ ] Ctrl+O abre modal de carga
- [ ] Botón "Cargar" funciona
- [ ] Lista de proyectos guardados se muestra
- [ ] Click en proyecto lo carga
- [ ] Botón de eliminar proyecto funciona
- [ ] Cargar archivo JSON funciona
- [ ] Selector de archivo JSON funciona

### Auto-guardado
- [ ] Última sesión se guarda automáticamente
- [ ] Al recargar página, se restaura última sesión
- [ ] Cambios se persisten

### Nuevo Proyecto
- [ ] Ctrl+N crea nuevo proyecto
- [ ] Botón "Nuevo" funciona
- [ ] Confirmación antes de limpiar canvas
- [ ] Canvas se limpia completamente
- [ ] Historial se reinicia

## 📤 Exportación

### PNG
- [ ] Exportación PNG funciona
- [ ] Archivo se descarga automáticamente
- [ ] Imagen tiene alta calidad (2x)
- [ ] Solo elementos visibles se exportan
- [ ] Padding adecuado alrededor de elementos

### JPG
- [ ] Exportación JPG funciona
- [ ] Tiene fondo blanco
- [ ] Archivo se descarga
- [ ] Calidad es aceptable (90%)

### SVG
- [ ] Exportación SVG funciona
- [ ] Archivo .svg se descarga
- [ ] SVG es válido (se puede abrir en navegador)
- [ ] Formas se mantienen vectoriales
- [ ] Colores se preservan

### PDF
- [ ] Exportación PDF funciona
- [ ] Archivo .pdf se descarga
- [ ] PDF se puede abrir
- [ ] Contenido está centrado
- [ ] Orientación es correcta (landscape/portrait)
- [ ] Calidad de imagen es buena

### JSON
- [ ] Exportación JSON funciona
- [ ] Archivo .json se descarga
- [ ] JSON es válido
- [ ] JSON se puede reimportar
- [ ] Metadata incluida (version, fecha, etc.)

## ⌨️ Atajos de Teclado

### Herramientas
- [ ] V - Seleccionar
- [ ] R - Rectángulo
- [ ] C - Círculo
- [ ] L - Línea
- [ ] A - Flecha
- [ ] T - Texto
- [ ] H - Pan/Mover vista

### Edición
- [ ] Ctrl+Z - Deshacer
- [ ] Ctrl+Y - Rehacer
- [ ] Ctrl+Shift+Z - Rehacer
- [ ] Ctrl+C - Copiar
- [ ] Ctrl+V - Pegar
- [ ] Delete - Eliminar
- [ ] Backspace - Eliminar

### Archivo
- [ ] Ctrl+N - Nuevo
- [ ] Ctrl+S - Guardar
- [ ] Ctrl+O - Cargar

### Vista
- [ ] + o = - Zoom in
- [ ] - - Zoom out

## 🎨 UI/UX

### Toolbar
- [ ] Todos los iconos se muestran
- [ ] Herramienta activa se resalta
- [ ] Hover effects funcionan
- [ ] Tooltips se muestran al pasar mouse
- [ ] Responsive en pantallas pequeñas

### Sidebars
- [ ] Panel izquierdo se muestra correctamente
- [ ] Panel derecho se muestra correctamente
- [ ] Scroll funciona cuando hay mucho contenido
- [ ] Headers de secciones son claros

### Modales
- [ ] Modal de exportar se abre/cierra
- [ ] Modal de cargar se abre/cierra
- [ ] Click fuera del modal lo cierra
- [ ] Botón X cierra el modal
- [ ] Animaciones son suaves

### Canvas Controls
- [ ] Checkboxes funcionan
- [ ] Labels son claros
- [ ] Controles son accesibles

## 🔧 Técnico

### Consola del Navegador
- [ ] No hay errores de JavaScript
- [ ] No hay advertencias críticas
- [ ] Assets se cargan correctamente (200 status)
- [ ] Librerías CDN se cargan

### Rendimiento
- [ ] Canvas responde rápidamente
- [ ] No hay lag al arrastrar elementos
- [ ] Zoom es fluido
- [ ] Exportación toma tiempo razonable (<5s)

### Compatibilidad
- [ ] Chrome/Edge (último)
- [ ] Firefox (último)
- [ ] Safari (último)
- [ ] Pantalla 1920x1080
- [ ] Pantalla 1366x768

### LocalStorage
- [ ] Datos se guardan correctamente
- [ ] Datos persisten tras recargar
- [ ] No hay errores de quota excedida
- [ ] Funciona en modo normal (no incógnito)

## 🐛 Casos Edge

### Datos Vacíos
- [ ] Exportar sin elementos muestra mensaje
- [ ] Cargar proyecto vacío funciona
- [ ] Eliminar único elemento funciona

### Límites
- [ ] Muchos elementos (50+) funcionan
- [ ] Elementos muy grandes funcionan
- [ ] Elementos muy pequeños se manejan
- [ ] Historial llega a 50 pasos max

### Errores de Usuario
- [ ] Dibujar forma muy pequeña se ignora
- [ ] Color hex inválido no se aplica
- [ ] Inputs numéricos validan valores

## 📝 Documentación

- [ ] README.md está completo
- [ ] DEPLOYMENT.md tiene instrucciones claras
- [ ] LICENSE está presente
- [ ] Código JavaScript está comentado
- [ ] Funciones complejas tienen documentación

---

## Resultados

**Total de items**: ~150+
**Items completados**: ___
**Porcentaje**: ___%

### Bugs Encontrados

1. 
2. 
3. 

### Mejoras Sugeridas

1. 
2. 
3. 

---

**Testeado por**: ________________  
**Fecha**: ________________  
**Navegador**: ________________  
**OS**: ________________
