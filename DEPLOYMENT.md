# 🚀 Guía de Deployment - Flowly

Esta guía te ayudará a publicar Flowly en GitHub Pages de forma rápida y sencilla.

## Opción 1: GitHub Pages (Recomendado)

### Configuración Inicial

1. **Crea un repositorio en GitHub**
   ```bash
   # Si aún no has inicializado git
   git init
   git add .
   git commit -m "Initial commit: Flowly v1.0"
   ```

2. **Conecta con GitHub**
   ```bash
   # Reemplaza 'tu-usuario' con tu nombre de usuario de GitHub
   git remote add origin https://github.com/YamiCueto/Flowly.git
   git branch -M main
   git push -u origin main
   ```

3. **Activa GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Click en **Settings**
   - Navega a **Pages** en el menú lateral
   - En **Source**, selecciona `main` branch
   - Click en **Save**
   - ¡Listo! Tu sitio estará disponible en `https://tu-usuario.github.io/Flowly`

### Actualizaciones

```bash
# Cada vez que hagas cambios
git add .
git commit -m "Descripción de tus cambios"
git push
```

Los cambios se reflejarán automáticamente en GitHub Pages en 1-2 minutos.

## Opción 2: Netlify

1. **Registrate en [Netlify](https://netlify.com)**

2. **Deployment desde Git**
   - Click en "New site from Git"
   - Conecta tu repositorio de GitHub
   - Build settings:
     - Build command: (dejar vacío)
     - Publish directory: `.`
   - Click "Deploy site"

3. **Configuración Custom Domain** (opcional)
   - Ve a Site settings → Domain management
   - Añade tu dominio personalizado

## Opción 3: Vercel

1. **Registrate en [Vercel](https://vercel.com)**

2. **Import Project**
   - Click "New Project"
   - Import tu repositorio de GitHub
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Click "Deploy"

## Opción 4: Hosting Tradicional

Si prefieres hosting tradicional (Apache, Nginx, etc.):

1. **Descarga todo el proyecto**
2. **Sube los archivos** a tu servidor vía FTP/SFTP
3. **Asegúrate** de que el servidor sirva archivos estáticos
4. **Accede** a `https://tu-dominio.com/index.html`

### Configuración Nginx (ejemplo)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/flowly;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caché para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Verificación del Deployment

Después de deployar, verifica que:

- [ ] La página carga correctamente
- [ ] Todos los iconos y estilos se muestran
- [ ] Las librerías externas (Konva, jsPDF, etc.) se cargan desde CDN
- [ ] Puedes crear y manipular formas
- [ ] La exportación funciona correctamente
- [ ] El guardado en localStorage funciona
- [ ] No hay errores en la consola del navegador

## Problemas Comunes

### Las librerías CDN no cargan

**Problema**: Algunas empresas bloquean CDNs externos.

**Solución**: Descarga las librerías localmente:

1. Crea una carpeta `/lib`
2. Descarga:
   - [Konva.js](https://unpkg.com/konva@9/konva.min.js)
   - [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)
   - [html2canvas](https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js)
   - [FileSaver.js](https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js)
   - [Font Awesome CSS](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)

3. Actualiza las rutas en `index.html`:
   ```html
   <script src="lib/konva.min.js"></script>
   <!-- ... etc -->
   ```

### CORS Errors

**Problema**: Errores de Cross-Origin al abrir `index.html` directamente.

**Solución**: Usa un servidor local:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (instala http-server primero)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

### LocalStorage no funciona

**Problema**: LocalStorage puede estar deshabilitado en modo incógnito o por políticas empresariales.

**Solución**: 
- Usa el navegador en modo normal (no incógnito)
- Exporta proyectos como JSON para respaldo manual

## Optimizaciones de Producción

### Minificación (Opcional)

Para reducir el tamaño de los archivos:

```bash
# Instala UglifyJS
npm install -g uglify-js

# Minifica JavaScript
uglifyjs js/app.js -c -m -o js/app.min.js
uglifyjs js/canvas-manager.js -c -m -o js/canvas-manager.min.js
# ... repite para todos los archivos JS

# Instala csso-cli
npm install -g csso-cli

# Minifica CSS
csso css/main.css -o css/main.min.css
csso css/toolbar.css -o css/toolbar.min.css
csso css/modals.css -o css/modals.min.css
```

Luego actualiza las referencias en `index.html` a los archivos `.min.js` y `.min.css`.

### Service Worker (PWA) - Opcional

Para que funcione offline, agrega un service worker básico:

**sw.js**:
```javascript
      Download file helper
     */
    downloadFile(url, filename) {
const CACHE_NAME = 'flowly-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/toolbar.css',
  '/css/modals.css',
  '/js/app.js',
  '/js/canvas-manager.js',
  '/js/tools.js',
  '/js/shapes.js',
  '/js/export-manager.js',
  '/js/storage.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

Registra en `index.html`:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## Monitoreo

### Google Analytics (Opcional)

Agrega antes de `</head>` en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU-ID-AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU-ID-AQUI');
</script>
```

## Soporte

Si tienes problemas con el deployment:

1. Revisa la [documentación de GitHub Pages](https://docs.github.com/en/pages)
2. Abre un [issue en GitHub](https://github.com/YamiCueto/Flowly/issues)
3. Consulta la consola del navegador para errores

---

¡Buena suerte con tu deployment! 🚀
