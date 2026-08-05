document.addEventListener("DOMContentLoaded", () => {
    const cardWrapper = document.querySelector(".course-card-wrapper");

    if (cardWrapper) {
        // Al recibir el foco (Mouse encima o Tabulación de teclado)
        cardWrapper.addEventListener("focusin", () => {
            cardWrapper.classList.add("sliding-focused");
        });

        // Al perder el foco total de la tarjeta
        cardWrapper.addEventListener("focusout", () => {
            cardWrapper.classList.remove("sliding-focused");
        });
    }
});