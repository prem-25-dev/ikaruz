// FAQ Accordion
document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains("open");

        // close all
        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));

        // open clicked if it wasn't open
        if (!isOpen) item.classList.add("open");
    });
});
