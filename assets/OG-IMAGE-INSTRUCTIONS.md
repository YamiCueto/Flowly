# 🖼️ Imagen de Vista Previa para Redes Sociales

Para que Flowly se vea profesional al compartirse en redes sociales, necesitas crear una imagen de vista previa (OG Image).

## 📐 Especificaciones de la Imagen

### Dimensiones Recomendadas
- **Facebook/LinkedIn**: 1200 x 630 px
- **Twitter**: 1200 x 675 px (16:9)
- **Recomendación general**: **1200 x 630 px** (funciona en todas las plataformas)

### Formato
- **PNG** o **JPG**
- Peso máximo: 8 MB (recomendado: menos de 300 KB)

## 🎨 Diseño Sugerido

### Opción 1: Diseño Minimalista
```
┌────────────────────────────────────────┐
│                                        │
│         🎨 Flowly                      │
│                                        │
│    Creador de Diagramas Interactivo   │
│                                        │
│    ✓ Canvas Interactivo                │
│    ✓ Exporta a PNG, SVG, PDF          │
│    ✓ 100% Gratis y Open Source        │
│                                        │
│    [Tu Foto]  Por Yami Cueto          │
│                                        │
└────────────────────────────────────────┘
```

### Opción 2: Screenshot de la App
- Toma un screenshot de Flowly con un diagrama atractivo
- Añade tu foto de perfil en una esquina
- Agrega el logo y título en la parte superior

## 🛠️ Herramientas para Crear la Imagen

### Online (Gratuitas)
1. **Canva** - https://canva.com
   - Template: "Open Graph Image"
   - Dimensiones: 1200 x 630 px

2. **Figma** - https://figma.com
   - Muy profesional
   - Plantillas gratuitas de OG images

3. **Photopea** - https://photopea.com
   - Alternativa gratuita a Photoshop
   - Funciona en el navegador

### Offline
- **GIMP** (gratuito)
- **Photoshop**
- **Affinity Photo**

## 📝 Pasos para Crear tu Imagen

### Con Canva (Recomendado - 5 minutos)

1. Ve a https://canva.com
2. Busca "Open Graph Image" o crea diseño personalizado (1200 x 630 px)
3. Elige una plantilla o empieza desde cero
4. Añade:
   - Título: "Flowly"
   - Subtítulo: "Creador de Diagramas Interactivo"
   - Tu foto de perfil de GitHub
   - Iconos relevantes (opcional)
   - Colores del tema (#3498db, #2c3e50)
5. Descarga como PNG
6. Guarda en `assets/og-image.png`

### Alternativa Rápida: Usar tu Foto de GitHub

Si quieres algo rápido, puedes:
1. Descargar tu foto de perfil de GitHub en alta resolución
2. Usar una herramienta online para agregarle texto
3. Dimensiones: 1200 x 630 px
4. Guardar como `og-image.png`

## 📂 Ubicación del Archivo

Una vez creada la imagen, guárdala en:
```
Flowly/
└── assets/
    └── og-image.png
```

Luego actualiza el `index.html`:
```html
<!-- En lugar de usar la foto de GitHub directamente -->
<meta property="og:image" content="https://yamicueto.github.io/Flowly/assets/og-image.png">
<meta name="twitter:image" content="https://yamicueto.github.io/Flowly/assets/og-image.png">
```

## 🧪 Probar la Vista Previa

### Facebook/LinkedIn Debugger
- https://developers.facebook.com/tools/debug/
- Pega tu URL y verifica cómo se ve

### Twitter Card Validator
- https://cards-dev.twitter.com/validator
- Verifica la tarjeta de Twitter

### Herramienta Universal
- https://www.opengraph.xyz/
- Muestra cómo se ve en todas las plataformas

## 💡 Tips de Diseño

1. **Texto legible**: Usa fuentes grandes (mínimo 60px para títulos)
2. **Contraste alto**: Asegura que el texto sea fácil de leer
3. **Zona segura**: Deja 100px de margen en los bordes (algunas plataformas recortan)
4. **Branding**: Usa los colores de Flowly (#3498db azul principal)
5. **Simple es mejor**: No sobrecargues la imagen con información

## 🎨 Paleta de Colores de Flowly

```css
--primary-color: #3498db    /* Azul principal */
--primary-dark: #2980b9     /* Azul oscuro */
--secondary-color: #2c3e50  /* Gris oscuro */
--background: #ecf0f1       /* Gris claro */
--surface: #ffffff          /* Blanco */
```

## 📸 Ejemplo de Prompt para IA (DALL-E, Midjourney)

Si quieres usar IA para generar la imagen:

```
Create a modern, minimalist Open Graph image for a web app called "Flowly" 
- a diagram creator tool. 1200x630px. Clean design with blue (#3498db) 
and dark gray (#2c3e50) colors. Include simple flowchart icons, 
the text "Flowly" in a modern sans-serif font, and "Interactive Diagram Creator" 
as subtitle. Professional developer portfolio style.
```

## ✅ Checklist

- [ ] Imagen creada (1200 x 630 px)
- [ ] Guardada en `assets/og-image.png`
- [ ] Actualizado `index.html` con la nueva ruta
- [ ] Subido a GitHub
- [ ] Probado con Facebook Debugger
- [ ] Probado con Twitter Card Validator

---

¿Necesitas ayuda? Puedes usar temporalmente tu foto de GitHub directamente, 
que ya está configurada en el `index.html` actual.
