/**
 * Lógica para la página de Resultados Cleveland Games y Spelling Bee
 */
document.addEventListener('DOMContentLoaded', function() {
    
    console.log("Página de Resultados cargada correctamente.");

    // ==========================================================
    // VARIABLES GLOBALES
    // ==========================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentSections = document.querySelectorAll('.event-content-section');
    const yearButtons = document.querySelectorAll('.year-btn');
    const yearContents = document.querySelectorAll('.year-content');

    // ==========================================================
    // FUNCIÓN PARA GUARDAR EL ESTADO EN LOCALSTORAGE
    // ==========================================================
    function saveState(activeTabId, activeYearId) {
        const state = {
            tab: activeTabId,
            year: activeYearId || null // Si no hay año (Cleveland Games), guardamos null
        };
        localStorage.setItem('resultadosEventosState', JSON.stringify(state));
    }

    // ==========================================================
    // FUNCIÓN PARA CARGAR EL ESTADO DESDE LOCALSTORAGE
    // ==========================================================
    function loadState() {
        const saved = localStorage.getItem('resultadosEventosState');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // ==========================================================
    // FUNCIÓN PARA CAMBIAR EL FONDO DEL BODY
    // ==========================================================
    function changeBodyBackground(tabId) {
        const body = document.body;
        if (tabId === 'cleveland-games') {
            // Fondo oscuro para Cleveland Games
            body.style.backgroundImage = 'url("../img/cleveland games.png")';
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundAttachment = 'fixed';
            body.style.backgroundColor = '#1f2a1a'; // Color de respaldo
        } else if (tabId === 'spelling-bee') {
            // Fondo de panales para Spelling Bee
            body.style.backgroundImage = 'url("../img/backgrouns speelling.svg")';
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundAttachment = 'fixed';
            body.style.backgroundColor = '#ffffff'; // Color de respaldo
        }
    }

    // ==========================================================
    // 1. Lógica para cambiar entre Eventos Principales
    // ==========================================================
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Ocultar todas las secciones
            contentSections.forEach(section => section.style.display = 'none');

            // Mostrar la sección correspondiente al botón clickeado
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // Si es Spelling Bee, aseguramos que muestre el año activo por defecto
                let currentYearId = null;
                if(targetId === 'spelling-bee') {
                    const firstYear = targetSection.querySelector('.year-content.active-year');
                    if(firstYear) {
                        firstYear.style.display = 'block';
                        currentYearId = firstYear.id;
                    }
                }
                
                // Guardar el estado actual
                saveState(targetId, currentYearId);

                // CAMBIAR EL FONDO DEL BODY
                changeBodyBackground(targetId);
            }
        });
    });

    // ==========================================================
    // 2. Lógica para cambiar entre años dentro de Spelling Bee
    // ==========================================================
    yearButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de los botones de año
            yearButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Ocultar todos los años
            yearContents.forEach(content => content.style.display = 'none');

            // Mostrar el año seleccionado
            const targetYear = this.getAttribute('data-year');
            const targetContent = document.getElementById('spelling-bee-' + targetYear);
            if (targetContent) {
                targetContent.style.display = 'block';
                
                // Guardar el estado actual (tab activo + año activo)
                const activeTab = document.querySelector('.tab-btn.active');
                if (activeTab) {
                    saveState(activeTab.getAttribute('data-target'), targetContent.id);
                }
            }
        });
    });

    // ==========================================================
    // 3. RESTAURAR ESTADO AL CARGAR LA PÁGINA
    // ==========================================================
    const state = loadState();
    if (state && state.tab) {
        // Buscar el botón de la pestaña guardada y hacer clic en él
        const tabToClick = document.querySelector(`.tab-btn[data-target="${state.tab}"]`);
        if (tabToClick) {
            // Simular clic para activar la pestaña y su contenido
            tabToClick.click();

            // Si además hay un año guardado y es Spelling Bee
            if (state.year && state.tab === 'spelling-bee') {
                // Buscar el botón del año guardado
                const yearToClick = document.querySelector(`.year-btn[data-year="${state.year.replace('spelling-bee-', '')}"]`);
                if (yearToClick) {
                    // Pequeño retraso para asegurar que la pestaña principal ya cargó
                    setTimeout(() => {
                        yearToClick.click();
                    }, 50);
                }
            }
        }
    } else {
        // Si no hay estado guardado, asegurar que Cleveland Games esté visible por defecto
        const defaultTab = document.querySelector('.tab-btn.active');
        if (defaultTab) {
            defaultTab.click();
        }
    }

    // ==========================================================
    // 4. Efecto de aparición para los elementos
    // ==========================================================
    const allItems = document.querySelectorAll('.result-podio-item, .result-skill-item');
    if (allItems.length > 0) {
        allItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 150 + (index * 120));
        });
    }

    // ==========================================================
    // 5. APLICAR EL FONDO INICIAL AL CARGAR LA PÁGINA
    // ==========================================================
    const initialActiveTab = document.querySelector('.tab-btn.active');
    if (initialActiveTab) {
        changeBodyBackground(initialActiveTab.getAttribute('data-target'));
    }

        // ==========================================================
    // 6. DETECTAR ANCLA (#) EN LA URL AL CARGAR LA PÁGINA
    // ==========================================================
    const hash = window.location.hash;
    if (hash) {
        const targetTab = hash.replace('#', ''); // Obtiene 'spelling-bee' o 'cleveland-games'
        const tabToClick = document.querySelector(`.tab-btn[data-target="${targetTab}"]`);
        if (tabToClick) {
            // Simular clic en la pestaña correspondiente
            setTimeout(() => {
                tabToClick.click();
            }, 100);
        }
    }
});

