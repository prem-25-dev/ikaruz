const glow = document.querySelector(".cursor-glow");
const hero = document.querySelector(".hero");

if (window.innerWidth < 768) {
    glow.style.display = "none";
} else {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let lastX = 0, lastY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        currentX += (mouseX - currentX) * 0.06;
        currentY += (mouseY - currentY) * 0.06;

        const dx = mouseX - lastX;
        const dy = mouseY - lastY;
        const speed = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        glow.style.left = currentX + "px";
        glow.style.top  = currentY + "px";
        glow.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(${1 + speed * 0.01})`;

        const size = 180 + speed * 1.5;
        glow.style.width  = size + "px";
        glow.style.height = size + "px";

        lastX = mouseX;
        lastY = mouseY;

        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener("mousemove", () => {
        const rect = hero.getBoundingClientRect();
        glow.style.opacity = (mouseY > rect.top && mouseY < rect.bottom) ? "1" : "0.35";
    });

    document.querySelectorAll("a, button").forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            glow.style.background = `radial-gradient(circle, rgba(0,191,255,0.9), rgba(0,191,255,0.4), transparent 70%)`;
        });
        btn.addEventListener("mouseleave", () => {
            glow.style.background = `radial-gradient(circle, rgba(13,91,209,0.5), rgba(13,91,209,0.2), transparent 70%)`;
        });
    });
}