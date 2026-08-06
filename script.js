document.addEventListener("DOMContentLoaded", () => {
  // Detectar base path de manera robusta
  const getBasePath = () => {
    // Opción 1: Desde el script actual
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('script.js')) {
        return script.src.substring(0, script.src.lastIndexOf('/') + 1);
      }
    }
    
    // Opción 2: Desde la URL actual
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s.length > 0);
    
    // Si estamos en una subcarpeta, subimos los niveles necesarios
    if (segments.length > 0 && !segments[segments.length - 1].includes('.')) {
      // Estamos en una ruta como /cursos/ -> subimos un nivel
      return '../';
    }
    
    return './';
  };

  const basePath = getBasePath();
  console.log('🔍 Base path detectado:', basePath);

  // Cache para evitar múltiples fetches
  const componentCache = new Map();

  const loadComponent = async (selector, path) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`⚠️ Elemento no encontrado: ${selector}`);
      return;
    }

    const fullPath = basePath + path;
    
    // Usar cache si está disponible
    if (componentCache.has(fullPath)) {
      const html = componentCache.get(fullPath);
      injectHTML(element, html);
      return;
    }

    try {
      console.log(`📥 Cargando componente: ${fullPath}`);
      const response = await fetch(fullPath);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Validar que el HTML no esté vacío
      if (!html || html.trim().length === 0) {
        throw new Error('El componente está vacío');
      }
      
      // Guardar en cache
      componentCache.set(fullPath, html);
      
      // Inyectar HTML
      injectHTML(element, html);
      
      console.log(`✅ Componente cargado: ${selector}`);
      
    } catch (error) {
      console.error(`❌ Error cargando ${selector}:`, error);
      // Fallback: mostrar mensaje de error
      element.innerHTML = `<div class="component-error">Error al cargar ${selector}</div>`;
    }
  };

  const injectHTML = (element, html) => {
    // Crear contenedor temporal
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Procesar recursos (scripts, estilos, imágenes)
    const processResources = (container) => {
      // Procesar <link> y <script> que podrían estar en el componente
      const links = container.querySelectorAll('link[href], script[src], img[src], a[href]');
      
      links.forEach(el => {
        const attr = el.hasAttribute('src') ? 'src' : 
                    el.hasAttribute('href') ? 'href' : null;
        
        if (!attr) return;
        
        let url = el.getAttribute(attr);
        
        // Convertir rutas relativas a absolutas
        if (url && !url.startsWith('http') && !url.startsWith('//') && !url.startsWith('#')) {
          // Si la ruta empieza con /, es absoluta desde la raíz
          if (url.startsWith('/')) {
            // Obtener la ruta base del sitio
            const origin = window.location.origin;
            el.setAttribute(attr, origin + url);
          } else if (!url.startsWith('./') && !url.startsWith('../') && !url.includes('://')) {
            // Ruta relativa simple - mantenerla relativa al componente
            // pero asegurar que funcione correctamente
            el.setAttribute(attr, basePath + 'components/' + url);
          }
        }
      });
      
      // Procesar scripts que necesitan ejecutarse
      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copiar atributos
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copiar contenido si es inline
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        
        // Reemplazar el script original
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    };
    
    // Procesar recursos antes de inyectar
    processResources(temp);
    
    // Inyectar el HTML limpio
    element.innerHTML = temp.innerHTML;
    
    // Inicializar funcionalidades específicas del footer
    if (element.classList.contains('site-footer')) {
      initBackToTop();
    }
  };

  // Función para el botón "Volver arriba"
  const initBackToTop = () => {
    const btn = document.getElementById('backToTop');
    if (!btn) {
      console.warn('⚠️ Botón backToTop no encontrado');
      return;
    }
    
    // Remover listeners anteriores para evitar duplicados
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    const handleScroll = () => {
      if (window.scrollY > 400) {
        newBtn.classList.add('show');
      } else {
        newBtn.classList.remove('show');
      }
    };
    
    // Usar throttle para mejor performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Verificar estado inicial
    handleScroll();
  };

  // Cargar componentes
  loadComponent('.main-nav', 'components/nav.html');
  loadComponent('.site-footer', 'components/footer.html');
});

// Exportar para uso en otros archivos si es necesario
window.loadComponent = loadComponent;