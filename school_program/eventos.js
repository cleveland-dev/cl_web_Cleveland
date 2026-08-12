document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Obtener elementos
    const btnResults = document.getElementById('btn-show-games-results');
    const mainGamesSection = document.querySelector('.cleveland-games-bg:not(.hidden-section)'); // La sección principal
    const resultsSection = document.getElementById('cleveland-games-results');

    // 2. Verificar que los elementos existan para evitar errores
    if (btnResults && mainGamesSection && resultsSection) {

        // 3. Escuchar el clic en el botón de resultados
        btnResults.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que el navegador salte al ancla (#) bruscamente

            // Ocultar la sección principal
            mainGamesSection.style.display = 'none';

            // Mostrar la sección de resultados (eliminando la clase hidden y agregando transición)
            resultsSection.classList.remove('hidden-section');
            resultsSection.classList.add('visible');
            
            // Hacer scroll suave hacia la sección de resultados para que el usuario la vea
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // (OPCIONAL) Si en el futuro quieres un botón para volver atrás, agrega esta lógica:
        /*
        const btnBack = resultsSection.querySelector('.event-btn-results');
        if(btnBack) {
            btnBack.addEventListener('click', function(e) {
                e.preventDefault();
                resultsSection.classList.add('hidden-section');
                resultsSection.classList.remove('visible');
                mainGamesSection.style.display = 'flex';
                mainGamesSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
        */
    }
});