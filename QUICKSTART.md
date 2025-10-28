# 🚀 Guía de Inicio Rápido - Flowly

## ✅ La aplicación está corriendo en <http://localhost:5500>

### 🎯 Pruebas Rápidas Esenciales

#### 1. **Test Básico del Canvas** (30 segundos)
1. Abre http://localhost:5500 en tu navegador
2. Verifica que veas:
   - ✓ Barra de herramientas superior con iconos
   - ✓ Panel izquierdo con "Formas"
   - ✓ Panel derecho con "Propiedades"
   - ✓ Canvas central con grid visible
   - ✓ Sin errores en la consola (F12)

#### 2. **Test de Dibujo** (1 minuto)
1. Click en el botón de **Rectángulo** (cuadrado en toolbar)
2. Arrastra en el canvas para dibujar
3. ✓ Debe aparecer un rectángulo azul con borde negro
4. ✓ Debe tener handles de transformación
5. Prueba redimensionar con los handles
6. Prueba rotar con el ícono de rotación

#### 3. **Test de Propiedades** (1 minuto)
1. Con el rectángulo seleccionado:
2. Cambia el **color de relleno** (panel derecho)
3. Cambia el **grosor del borde** (slider)
4. Ajusta la **opacidad** (slider)
5. ✓ Los cambios deben verse en tiempo real

#### 4. **Test de Herramientas** (2 minutos)
Prueba cada herramienta:
- **V** - Seleccionar (debe permitir mover elementos)
- **R** - Rectángulo ✓
- **C** - Círculo (debe crearse desde el centro)
- **L** - Línea (línea recta)
- **A** - Flecha (con punta de flecha)
- **T** - Texto (doble-click para editar)

#### 5. **Test de Zoom** (30 segundos)
1. Presiona **+** varias veces
2. ✓ El canvas debe hacer zoom
3. Presiona **-** para alejar
4. Click en el botón "Ajustar a pantalla"
5. ✓ El porcentaje se muestra en el toolbar

#### 6. **Test de Historial** (1 minuto)
1. Dibuja 3 formas diferentes
2. Presiona **Ctrl+Z** (Deshacer)
3. ✓ La última forma debe desaparecer
4. Presiona **Ctrl+Y** (Rehacer)
5. ✓ La forma debe reaparecer
6. Los botones de undo/redo deben habilitarse/deshabilitarse

#### 7. **Test de Exportación** (1 minuto)
1. Dibuja algunas formas
2. Click en el botón **Exportar** (icono de descarga)
3. Se abre un modal con opciones
4. Click en **PNG**
5. ✓ Debe descargarse un archivo "diagram.png"
6. Abre el archivo PNG
7. ✓ Debe contener tus formas

#### 8. **Test de Guardado** (1 minuto)
1. Presiona **Ctrl+S**
2. Ingresa nombre: "Mi Primer Diagrama"
3. ✓ Debe aparecer mensaje de confirmación
4. Recarga la página (F5)
5. ✓ Tu diagrama debe reaparecer (auto-carga última sesión)

---

## 🐛 Si encuentras problemas:

### Canvas no se muestra
- **Solución**: Abre la consola (F12) y busca errores
- Verifica que las librerías CDN se carguen (pestaña Network)

### Formas no se dibujan
- **Solución**: Asegúrate de hacer click y arrastrar
- Las formas muy pequeñas (<5px) se ignoran automáticamente

### Exportación no funciona
- **Solución**: Verifica que jsPDF y FileSaver.js se carguen
- Algunos bloqueadores de anuncios pueden interferir

### Guardado no funciona
- **Solución**: No uses modo incógnito del navegador
- Verifica que localStorage esté habilitado

---

## 🎨 Funcionalidades Destacadas para Probar:

### 🔹 Selección Múltiple
- Mantén **Shift** y click en varios elementos
- Puedes moverlos/transformarlos juntos

### 🔹 Copiar/Pegar
1. Selecciona un elemento
2. **Ctrl+C** para copiar
3. **Ctrl+V** para pegar
4. El elemento copiado aparece con offset

### 🔹 Edición de Texto
1. Click en el botón **T** (Texto)
2. Click en el canvas para crear texto
3. **Doble-click** en el texto para editar
4. Escribe tu contenido
5. **Ctrl+Enter** o **Esc** para finalizar

### 🔹 Grid y Snap
- Desmarca "Mostrar Grid" para ocultar el grid
- Desmarca "Snap to Grid" para movimiento libre
- Con Snap activado, las formas se alinean a la cuadrícula

### 🔹 Biblioteca de Formas
- Panel izquierdo: Click en cualquier forma
- Se añade automáticamente al centro del canvas
- Ya viene seleccionada para editar

### 🔹 Atajos de Teclado
Prueba estos atajos rápidos:
- **Delete** - Eliminar elemento seleccionado
- **Ctrl+Z** - Deshacer
- **Ctrl+Y** - Rehacer
- **Ctrl+C** - Copiar
- **Ctrl+V** - Pegar
- **+/-** - Zoom in/out

---

## 📊 Estado de Desarrollo

### ✅ Funcionalidades Implementadas (MVP v1.0)
- [x] Canvas interactivo con Konva.js
- [x] Formas básicas (rectángulo, círculo, línea, flecha, texto)
- [x] Transformaciones (mover, resize, rotar)
- [x] Panel de propiedades completo
- [x] Historial undo/redo (50 pasos)
- [x] Exportación (PNG, JPG, SVG, PDF, JSON)
- [x] Guardado local (localStorage)
- [x] Auto-guardado de última sesión
- [x] Grid con snap-to-grid
- [x] Zoom y pan
- [x] Copiar/pegar
- [x] Atajos de teclado
- [x] Biblioteca de formas

### ⏳ Próximamente (Fase 2)
- [ ] Conectores inteligentes que siguen a las formas
- [ ] Más tipos de formas (polígonos, curvas bezier)
- [ ] Templates predefinidos
- [ ] Importar imágenes
- [ ] Capas/Layers avanzados

---

## 🎓 Tutorial Rápido: Crea tu Primer Diagrama de Flujo

### Paso 1: Crear Inicio
1. Click en **Rectángulo Redondeado**
2. Dibuja un rectángulo en la parte superior
3. Doble-click en el rectángulo
4. Presiona **T** para añadir texto
5. Escribe "Inicio"

### Paso 2: Crear Decisión
1. Click en **Triángulo**
2. Dibuja debajo del primer rectángulo
3. Añade texto: "¿Condición?"

### Paso 3: Conectar con Flechas
1. Click en **Flecha** (A)
2. Dibuja desde el rectángulo al triángulo
3. Repite para conectar más elementos

### Paso 4: Personalizar Colores
1. Selecciona el inicio
2. Color de relleno: Verde claro
3. Selecciona la decisión
4. Color de relleno: Amarillo

### Paso 5: Exportar
1. **Ctrl+S** para guardar
2. Click en **Exportar** → **PNG**
3. ¡Listo! Tienes tu diagrama

---

## 📞 Soporte

Si encuentras bugs o tienes sugerencias:

1. **Verifica la consola**: F12 → Console
2. **Revisa el README**: Busca soluciones conocidas
3. **Crea un issue**: [GitHub Issues](https://github.com/YamiCueto/Flowly/issues)

---

## 🎉 ¡Disfruta creando diagramas!

La aplicación está 100% funcional y lista para usar. Todas las características básicas están implementadas y probadas.

**Versión**: 1.0.0 MVP  
**Última actualización**: 28 de Octubre, 2025  
**Estado**: ✅ Producción

---

### Consejos Pro 💡

1. **Trabaja con Grid activado** para diagramas profesionales
2. **Usa Ctrl+S frecuentemente** para no perder tu trabajo
3. **Exporta como JSON** antes de hacer cambios grandes (backup)
4. **Los proyectos se guardan en el navegador**, no en el servidor
5. **Limpia localStorage** si tienes problemas: F12 → Application → Local Storage → Clear

¡Happy Drawing! 🎨
