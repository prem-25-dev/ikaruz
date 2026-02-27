/* ─────────────────────────────────────
   IKARUZ — home.js
───────────────────────────────────── */


/* ══════════════════════════════
   HERO CANVAS — Particle Network
══════════════════════════════ */

(function () {

    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let W, H;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener("resize", () => { resize(); });
    resize();

    const heroEl = document.getElementById("hero");

    heroEl.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    heroEl.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    /* generate particles */
    const COUNT = window.innerWidth < 768 ? 55 : 120;

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x:     Math.random() * window.innerWidth,
            y:     Math.random() * window.innerHeight,
            vx:    (Math.random() - 0.5) * 0.35,
            vy:    (Math.random() - 0.5) * 0.35,
            r:     Math.random() * 1.4 + 0.3,
            alpha: Math.random() * 0.45 + 0.08,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        /* connection lines */
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 115) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37,99,255,${(1 - dist / 115) * 0.14})`;
                    ctx.lineWidth   = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        /* particles */
        particles.forEach(p => {

            /* mouse repulsion */
            const dx   = p.x - mouse.x;
            const dy   = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
                const force = (90 - dist) / 90;
                p.vx += (dx / dist) * force * 0.45;
                p.vy += (dy / dist) * force * 0.45;
            }

            p.vx *= 0.98;
            p.vy *= 0.98;
            p.x  += p.vx;
            p.y  += p.vy;

            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100,160,255,${p.alpha})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();

})();


/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */

(function () {

    const style = document.createElement("style");
    style.textContent = `
        .reveal {
            opacity: 0;
            transform: translateY(28px);
            transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll(
        ".card, .why-item, .testi-card, .vision-quote, .vision-body, .section-header"
    );

    targets.forEach((el, i) => {
        el.classList.add("reveal");
        el.style.transitionDelay = (i % 4) * 0.08 + "s";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));

})();


/* ══════════════════════════════
   FOOTER BUG GAME 🐛
══════════════════════════════ */

(function () {

    const area     = document.getElementById("gameArea");
    const bug      = document.getElementById("gameBug");
    const scoreEl  = document.getElementById("gameScore");
    const bestEl   = document.getElementById("gameBest");
    const timerEl  = document.getElementById("gameTimer");
    const overlay  = document.getElementById("gameOverlay");
    const startBtn = document.getElementById("gameStartBtn");
    const titleEl  = document.getElementById("gameOverlayTitle");
    const msgEl    = document.getElementById("gameOverlayMsg");

    if (!area) return;

    let score = 0, best = 0, timeLeft = 15, interval = null, active = false;

    function moveBug() {
        const aW = area.offsetWidth  - 60;
        const aH = area.offsetHeight - 60;
        bug.style.left = (Math.random() * aW + 10) + "px";
        bug.style.top  = (Math.random() * (aH - 40) + 44) + "px";
    }

    function startGame() {
        score    = 0;
        timeLeft = 15;
        active   = true;

        scoreEl.textContent       = 0;
        timerEl.textContent       = 15;
        overlay.style.display     = "none";
        bug.style.display         = "block";

        moveBug();

        interval = setInterval(() => {
            timeLeft--;
            timerEl.textContent = timeLeft;
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    function endGame() {
        clearInterval(interval);
        active             = false;
        bug.style.display  = "none";

        if (score > best) {
            best = score;
            bestEl.textContent = best;
        }

        titleEl.textContent  = score >= 20 ? "🔥 Legendary!" : score >= 12 ? "😎 Nice work!" : "😅 Try again!";
        msgEl.textContent    = `You caught the bug ${score} time${score !== 1 ? "s" : ""}!`;
        startBtn.textContent = "▶ Play Again";
        overlay.style.display = "flex";
    }

    bug.addEventListener("click", (e) => {
        if (!active) return;
        e.stopPropagation();
        score++;
        scoreEl.textContent = score;

        bug.style.filter = "drop-shadow(0 0 20px rgba(0,255,100,1))";
        setTimeout(() => {
            bug.style.filter = "drop-shadow(0 0 10px rgba(0,200,100,0.5))";
        }, 100);

        moveBug();
    });

    startBtn.addEventListener("click", startGame);

})();