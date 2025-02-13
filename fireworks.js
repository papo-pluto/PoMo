const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const balloons = [];
const roses = [];
let isTabActive = true;

// Pause animations when tab is inactive & resume when active
document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;
    if (isTabActive) {
        animate(); // Restart animation smoothly
    }
});

// Fireworks Class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        let totalParticles = window.innerWidth < 1024 ? 40 : 100; // Reduce for mobile
        for (let i = 0; i < totalParticles; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 7 + 3;
            this.particles.push({
                x: this.x,
                y: this.y,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                size: Math.random() * 5 + 3,
                life: Math.random() * 60 + 50,
                color: `hsl(${Math.random() * 360}, 100%, 70%)`,
                glow: true
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.size *= 0.95;
            p.life--;
        });

        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw() {
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = p.glow ? 15 : 0;
            ctx.shadowColor = p.color;
            ctx.fill();
        });
    }
}

// 🌹 Rose Class (Ensures Visibility on Mobile)
class Rose {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * (window.innerWidth < 1024 ? 50 : 70) + 40; // Increased min size for mobile
        this.speed = Math.random() * 2 + 1;
        this.wobbleAngle = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
    }

    update() {
        this.y -= this.speed;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += Math.sin(this.wobbleAngle) * 0.7;
    }

    draw() {
        let img = new Image();
        img.src = "rose-svgrepo-com.svg";
        ctx.drawImage(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}

// 🎈 Balloon Class (Ensures Visibility on Mobile)
class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * (window.innerWidth < 1024 ? 50 : 70) + 40; // Increased min size for mobile
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.speed = Math.random() * 2 + 1;
        this.wobbleAngle = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.stringLength = Math.random() * 50 + 40;
    }

    update() {
        this.y -= this.speed;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += Math.sin(this.wobbleAngle) * 0.5;
    }

    draw() {
        // Draw wavy thread
        ctx.beginPath();
        let startX = this.x;
        let startY = this.y + this.size * 0.6;
        let endY = startY + this.stringLength;

        ctx.moveTo(startX, startY);

        let waveSize = 5;
        for (let i = 0; i < 10; i++) {
            let waveX = startX + (i % 2 === 0 ? waveSize : -waveSize);
            let waveY = startY + (i * (this.stringLength / 10));
            ctx.lineTo(waveX, waveY);
        }

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw oval balloon
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size / 2, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add a glossy highlight
        ctx.beginPath();
        ctx.ellipse(this.x - this.size / 4, this.y - this.size / 4, this.size / 6, this.size / 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
    }
}


function createFirework() {
    fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * canvas.height));
}

function createBalloon() {
    balloons.push(new Balloon());
}

function createRose() {
    roses.push(new Rose());
}

function animate() {
    if (!isTabActive) {
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(f => { f.update(); f.draw(); });
    balloons.forEach(b => { b.update(); b.draw(); });
    roses.forEach((r, index) => {
        r.update();
        r.draw();
        if (r.y + r.size < 0) roses.splice(index, 1);
    });

    requestAnimationFrame(animate);
}

// Generate fireworks, balloons, and roses
setInterval(createFirework, 500);
setInterval(createBalloon, 1000);
setInterval(createRose, 1200);

canvas.addEventListener("click", (event) => createFirework(event.clientX, event.clientY));

animate();
