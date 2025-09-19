# NEXTBLOCK - Guida Integrazione WordPress

## 🎯 Opzioni di Integrazione Homepage WordPress

### **Opzione 1: WordPress come Homepage + React App come Sottopagina**
```
Struttura consigliata:
- nextblock.com → Homepage WordPress (SEO, blog, contenuti)
- nextblock.com/app → Piattaforma React (dashboard, trading)
- nextblock.com/platform → Piattaforma React alternativa
```

**Vantaggi:**
- ✅ SEO ottimizzato con WordPress
- ✅ Gestione contenuti facile
- ✅ Blog e news integrate
- ✅ Piattaforma React separata e performante

### **Opzione 2: Subdomain Strategy**
```
Struttura:
- nextblock.com → Homepage WordPress
- app.nextblock.com → Piattaforma React
- platform.nextblock.com → Piattaforma React alternativa
```

**Vantaggi:**
- ✅ Separazione completa dei servizi
- ✅ Scalabilità indipendente
- ✅ Deployment separati
- ✅ Performance ottimali

### **Opzione 3: WordPress Headless + React Frontend**
```
Struttura:
- WordPress come CMS backend (API)
- React frontend che consuma API WordPress
- Piattaforma integrata con contenuti dinamici
```

**Vantaggi:**
- ✅ Gestione contenuti WordPress
- ✅ Performance React
- ✅ Contenuti dinamici
- ✅ Architettura moderna

## 🔧 Implementazione Tecnica

### **Setup Opzione 1 (Consigliata)**

#### 1. **Configurazione WordPress**
```apache
# .htaccess WordPress
RewriteEngine On
RewriteBase /

# Redirect /app to React application
RewriteRule ^app/?(.*)$ https://your-react-app-domain.com/$1 [R=301,L]

# WordPress rules
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

#### 2. **Configurazione React App**
```javascript
// vite.config.js - Configurazione per sottocartella
export default defineConfig({
  base: '/app/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

#### 3. **Nginx Configuration (se usi Nginx)**
```nginx
server {
    listen 80;
    server_name nextblock.com;
    
    # WordPress homepage
    location / {
        try_files $uri $uri/ /index.php?$args;
    }
    
    # React app
    location /app {
        alias /path/to/react/dist;
        try_files $uri $uri/ /app/index.html;
    }
    
    # PHP processing for WordPress
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
    }
}
```

### **Setup Opzione 2 (Subdomain)**

#### 1. **DNS Configuration**
```
A record: nextblock.com → WordPress Server IP
A record: app.nextblock.com → React App Server IP
```

#### 2. **WordPress Configuration**
```php
// wp-config.php
define('WP_HOME','https://nextblock.com');
define('WP_SITEURL','https://nextblock.com');
```

#### 3. **React App Configuration**
```javascript
// Nessuna modifica necessaria - app indipendente
// Deploy normale su app.nextblock.com
```

## 🎨 Design Consistency

### **Elementi da Condividere**

#### 1. **CSS Variables Globali**
```css
/* Shared variables per entrambe le piattaforme */
:root {
  --nextblock-primary: #0A192F;
  --nextblock-secondary: #1E293B;
  --nextblock-accent: #3B82F6;
  --nextblock-text: #E2E8F0;
  --nextblock-muted: #94A3B8;
}
```

#### 2. **Logo e Branding**
```html
<!-- Logo condiviso -->
<img src="/assets/nextblock-logo.svg" alt="NextBlock" />
```

#### 3. **Navigation Consistency**
```javascript
// Shared navigation component
const SharedNav = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about">About</Link>
    <Link to="/app">Platform</Link>
    <Link to="/blog">Blog</Link>
  </nav>
)
```

## 🔗 Integrazione Dati

### **WordPress REST API Integration**
```javascript
// React component per contenuti WordPress
import { useState, useEffect } from 'react'

const WordPressContent = () => {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('https://nextblock.com/wp-json/wp/v2/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{__html: post.excerpt.rendered}} />
        </article>
      ))}
    </div>
  )
}
```

### **Shared Authentication**
```javascript
// JWT token sharing tra WordPress e React
const authToken = localStorage.getItem('nextblock_auth')

// Headers per API calls
const apiHeaders = {
  'Authorization': `Bearer ${authToken}`,
  'Content-Type': 'application/json'
}
```

## 🚀 Deployment Strategy

### **Opzione 1: Deployment Separati**
```bash
# WordPress deployment
rsync -av wordpress/ user@server:/var/www/nextblock.com/

# React app deployment  
npm run build
rsync -av dist/ user@server:/var/www/nextblock.com/app/
```

### **Opzione 2: Docker Compose**
```yaml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "80:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_NAME: nextblock
    volumes:
      - ./wordpress:/var/www/html
      
  react-app:
    build: ./react-app
    ports:
      - "3000:3000"
    volumes:
      - ./react-app/dist:/usr/share/nginx/html
      
  db:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: nextblock
      MYSQL_ROOT_PASSWORD: password
```

## 📱 Mobile & SEO Considerations

### **WordPress SEO Benefits**
- ✅ Yoast SEO plugin
- ✅ Schema markup automatico
- ✅ Sitemap XML
- ✅ Meta tags ottimizzati

### **React App Performance**
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Service workers
- ✅ PWA capabilities

## 🔧 Strumenti Consigliati

### **WordPress Plugins**
- **Yoast SEO** - Ottimizzazione SEO
- **WP REST API** - API endpoints
- **JWT Authentication** - Token auth
- **Advanced Custom Fields** - Campi personalizzati

### **React Libraries**
- **React Router** - Routing
- **Axios** - HTTP requests
- **React Query** - Data fetching
- **Framer Motion** - Animazioni (già implementato)

## 💡 Raccomandazione Finale

**Consiglio l'Opzione 1** per NEXTBLOCK:
- WordPress homepage per SEO e contenuti
- React app su `/app` per la piattaforma
- Design consistency mantenuto
- Performance ottimali per entrambi

Vuoi che implementi una di queste soluzioni?
