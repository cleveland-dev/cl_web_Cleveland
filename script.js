document.addEventListener("DOMContentLoaded", () => {
    // Usamos rutas relativas (sin basePath fijo)
    const getBasePath = () => {
        const path = window.location.pathname;
        // Si estamos en /feedbacks/docs/cleveland/
        if (path.includes('/cleveland/')) {
            const parts = path.split('/cleveland/');
            return parts[0] + '/cleveland/';
        }
        return '/feedbacks/docs/cleveland/';
    };

    const basePath = getBasePath();

    // Cargar Navbar
    const mainNav = document.querySelector(".main-nav");
    if (mainNav) {
        fetch(`${basePath}components/nav.html`)
            .then(response => {
                if (!response.ok) throw new Error('No se pudo encontrar nav.html');
                return response.text();
            })
            .then(data => {
                mainNav.innerHTML = data;
                
                // Ajustamos las rutas de los enlaces y la imagen del Logo dentro del Nav
                mainNav.querySelectorAll("a, img").forEach(el => {
                    const attr = el.tagName === "IMG" ? "src" : "href";
                    const val = el.getAttribute(attr);
                    if (val && val.startsWith("/") && !val.startsWith(basePath)) {
                        el.setAttribute(attr, basePath + val.substring(1));
                    }
                });
            })
            .catch(error => console.error("Error cargando el menú:", error));
    }

    // Cargar Footer
    const siteFooter = document.querySelector(".site-footer");
    if (siteFooter) {
        fetch(`${basePath}components/footer.html`)
            .then(response => {
                if (!response.ok) throw new Error('No se pudo encontrar footer.html');
                return response.text();
            })
            .then(data => {
                siteFooter.innerHTML = data;

                siteFooter.querySelectorAll("a").forEach(el => {
                    const href = el.getAttribute("href");
                    if (href && href.startsWith("/") && !href.startsWith(basePath)) {
                        el.setAttribute("href", basePath + href.substring(1));
                    }
                });

                if (typeof initBackToTop === 'function') {
                    initBackToTop();
                }
            })
            .catch(error => console.error("Error cargando el footer:", error));
    }
});