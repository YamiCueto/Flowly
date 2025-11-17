# Por qué construí otra herramienta de diagramas (y por qué debería importarte)

---

## El problema que nadie está resolviendo

Estaba diseñando la arquitectura de un sistema distribuido en mi laptop durante un vuelo. Sin internet. Sin acceso a Lucidchart. Sin poder instalar nada porque era una laptop corporativa con permisos bloqueados.

Intenté con draw.io en modo offline, pero requería descarga previa. Probé Miro en el navegador, pero pedía login y sincronización. Excalidraw era genial, pero exportar a PDF limpio era un dolor de cabeza.

**¿Por qué diablos necesito crear una cuenta para dibujar un maldito rectángulo?**

Ahí nació **Flowly**: una herramienta de diagramas que abre en 2 segundos, funciona offline desde el minuto cero y exporta a 5 formatos sin pedirte ni tu email.

---

## Lo que hace diferente a Flowly

### 1️⃣ Cero fricción de inicio
- **No install, no sign-up, no bullshit**. Abres la URL → ya estás dibujando.
- Funciona offline completamente (PWA en el roadmap para v1.1).
- Tu data vive en tu navegador (LocalStorage). No subimos nada a la nube sin tu permiso.

### 2️⃣ Arquitectura para developers
- **~1500 líneas de JavaScript vanilla**. Sin frameworks. Sin bundle. Sin node_modules.
- Basado en [Konva.js](https://konvajs.org/) (canvas API de alto rendimiento).
- ES6 modules. Código limpio. Contribuciones bienvenidas.

### 3️⃣ Export real
- **SVG con transformaciones preservadas** (rotación/escala via matrices absolutas).
- **PDF multi-página** con auto-layout.
- **JSON para backup** → ideal para versionado Git.

### 4️⃣ Pensado para diagramas técnicos
Usa casos reales donde estoy enfocado:
- **Database schemas** (ERD con formas personalizables)
- **Architecture diagrams** (sistemas distribuidos, cloud infra)
- **Flowcharts** (algoritmos, decision trees)

No es para wireframes. No es para mockups. Es para **explicar cómo funciona la mierda compleja**.

---

## El pitch técnico

**Si eres developer**, esto te va a resonar:

```javascript
// Este es el core loop de Flowly:
1. User dibuja shape → Konva renderiza en canvas
2. Shape se convierte en JSON → LocalStorage.setItem()
3. Export → Custom serializer de Konva → SVG/PDF/PNG
4. Undo/Redo → History stack de 50 estados
5. Connectors (v1.2) → Auto-routing con Dijkstra
```

**Stack completo:**
- Konva.js 9.x (canvas rendering)
- html2canvas + jsPDF (raster/PDF export)
- Bootstrap 5 + Font Awesome (UI sin build)
- Vanilla JS (porque sí, se puede en 2025)

**Por qué sin framework?**
Porque necesitaba que corriera en **cualquier browser desde 2020** sin transpilar. Porque el bundle de React/Vue sería más pesado que toda la app. Porque quería que cualquier dev junior pudiera abrir `index.html` y entender todo en 10 minutos.

---

## Lo que sigue (y por qué necesito tu feedback)

**Estoy en la v1.0**. Funciona. Exporta. No crashea. Pero es solo el piso.

**Roadmap para los próximos 6 meses:**

### v1.1 (Q2 2025) — Export++
- Import de draw.io XML
- Export a Figma/Sketch
- Share via URL (Firebase backend opcional)

### v1.2 (Q3 2025) — Smart Connectors
- Auto-routing de flechas (elbow, bezier)
- Magnetic snapping a anchors
- Labels en connectors

### v2.0 (2026) — Real-time Collab
- Multi-user editing (WebRTC)
- Cursors con presencia
- Comments en shapes

**¿Qué feature matarías por tener?** → [Vota aquí en GitHub Discussions](https://github.com/YamiCueto/Flowly/discussions)

---

## Cómo puedes ayudar

### Si eres developer:
- ⭐ **Star el repo** → [github.com/YamiCueto/Flowly](https://github.com/YamiCueto/Flowly)
- 🐛 **Reporta bugs** o contribuye (buscamos `good first issues`)
- 🧪 **Test en tu browser** (especialmente Safari/mobile)

### Si eres designer/architect:
- 📝 **Usa Flowly para tu próximo diagrama** → [Pruébalo aquí](https://yamicueto.github.io/Flowly/)
- 💬 **Feedback brutal bienvenido** (qué falta, qué sobra, qué rompe)

### Si eres recruiter/lead:
- 🔗 **Comparte con tu equipo** (especialmente si están hartos de paywalls)
- 📢 **RT/Share** este post para que llegue a más devs

---

## Demo en vivo

👉 **Pruébalo ahora**: [yamicueto.github.io/Flowly](https://yamicueto.github.io/Flowly/)

![Flowly Demo](https://via.placeholder.com/800x400/3498db/ffffff?text=Flowly+Demo+%E2%80%94+Animated+GIF+here)
*[TODO: Grabar GIF de 30seg mostrando: draw shapes → rotate → export SVG → open in Figma]*

**Cómo empezar en 10 segundos:**
1. Abre la URL
2. Arrastra un rectángulo desde la sidebar
3. Doble-click para editar propiedades
4. Export → SVG/PDF/PNG

**Keyboard shortcuts para power users:**
- `R` = Rectangle, `C` = Circle, `L` = Line, `T` = Text
- `Ctrl+Z` / `Ctrl+Shift+Z` = Undo/Redo
- `Ctrl+C` / `Ctrl+V` = Copy/Paste
- `Delete` = Borrar seleccionados

---

## Preguntas frecuentes (porque sé que las vas a hacer)

### ¿Por qué no usar draw.io?
**draw.io es increíble**. Pero pesa 5MB solo de JS. Tiene 200+ features que nunca voy a usar. Flowly es el 20% de features que uso el 80% del tiempo.

### ¿Por qué gratis/open source?
Porque **odio los paywalls en herramientas básicas**. Porque aprendí a programar gracias a proyectos open source. Porque si esto le sirve a 10 devs más, ya valió la pena.

### ¿Cómo lo monetizas?
**No lo hago (todavía)**. Si esto crece, quizás:
- Premium features (real-time collab, private hosting)
- Managed cloud option para empresas
- Donations via GitHub Sponsors

Pero la versión core **siempre será gratis** y open source.

### ¿Va a morir como el 90% de side projects?
**Posiblemente**. Pero al menos el código queda ahí para quien lo quiera forkear. Y honestamente, ya lo uso yo mismo todos los días, así que tiene garantizado al menos 1 usuario activo 😂

---

## TL;DR

**Flowly = Diagramming tool for developers who hate bullshit.**

- ✅ Instant start (no install/signup)
- ✅ Offline-first
- ✅ Export a SVG/PDF/PNG/JSON
- ✅ Open source (MIT license)
- ✅ ~1500 líneas de JS vanilla
- ✅ Built with Konva.js

**Pruébalo**: [yamicueto.github.io/Flowly](https://yamicueto.github.io/Flowly/)  
**GitHub**: [github.com/YamiCueto/Flowly](https://github.com/YamiCueto/Flowly)

Si te gustó, deja una ⭐ en GitHub. Si no, dime por qué en los comments.

---

**#webdev #opensource #javascript #diagramming #developer_tools #canvas #konvajs #vanilla_js**

---

*PD: Si trabajas en Google/Figma/Miro y esto les da ideas para simplificar sus onboardings, no me enojo. Solo denme crédito en el footer 😉*
