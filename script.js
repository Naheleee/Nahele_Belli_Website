/* SCRIPT 1: Animazione titoli */
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("h1, h2");
    const GLYPHS = "⢂⠣⠖⠱⡅⡌⡰⡱⢎⢢⡜⢯⣏⢶⣻⢿⣿";
    const REFRESH_RATE = 40;
    const REVEAL_SPEED = 1;

    links.forEach((link) => {
        const originalText = link.innerText;
        let interval = null;

        function scramble() {
            let iteration = 0;
            clearInterval(interval);
            interval = setInterval(() => {
                link.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        if (letter === " ") return " ";
                        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    })
                    .join("");
                if (iteration >= originalText.length) clearInterval(interval);
                iteration += REVEAL_SPEED;
            }, REFRESH_RATE);
        }

        scramble();
        link.addEventListener("mouseenter", scramble);
        link.addEventListener("mouseleave", () => {
            clearInterval(interval);
            link.innerText = originalText;
        });
    });
});


/* SCRIPT 2: Animazione testo */
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("p");
    const GLYPHS = "⢂⠣⠖⠱⡅⡌⡰⡱⢎⢢⡜⢯⣏⢶⣻⢿⣿";
    const REFRESH_RATE = 10;
    const REVEAL_SPEED = 5;

    links.forEach((link) => {
        const originalText = link.innerText;
        let interval = null;

        function scramble() {
            let iteration = 0;
            clearInterval(interval);
            interval = setInterval(() => {
                link.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        if (letter === " ") return " ";
                        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    })
                    .join("");
                if (iteration >= originalText.length) clearInterval(interval);
                iteration += REVEAL_SPEED;
            }, REFRESH_RATE);
        }

        scramble();
        link.addEventListener("mouseenter", scramble);
        link.addEventListener("mouseleave", () => {
            clearInterval(interval);
            link.innerText = originalText;
        });
    });
});


/* SCRIPT 2: Cursor con ritardo */
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".custom-cursor");
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.15;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        cursor.style.transform = `translate(${cursorX - 7}px, ${cursorY - 7}px)`;
        requestAnimationFrame(animate);
    }

    animate();
});


/* SCRIPT 3: Cambiare bordo cursore al hover dei link */
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".custom-cursor");
    const navLinks = document.querySelectorAll(".nav-right a");

    navLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            cursor.style.border = "1px solid transparent";
        });
        link.addEventListener("mouseleave", () => {
            cursor.style.border = "2px solid blue";
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.querySelector(".cursor");
    cursor.style.display = "none"; // inizialmente nascosto

    setTimeout(() => {
        cursor.style.display = "inline-block"; // appare dopo 3 secondi
    }, 1500);
});





const cursor = document.querySelector('.custom-cursor');
const iframes = document.querySelectorAll('iframe');


// nascondi il cursore sopra gli iframe
iframes.forEach(iframe => {
    iframe.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0';
    });

    iframe.addEventListener('mouseleave', () => {
        cursor.style.opacity = '1';
    });
});





