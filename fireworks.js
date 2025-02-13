const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const balloons = [];
const roses = [];
let isTabActive = true;

// Pause animations when tab is inactive
document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;
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
        let totalParticles = window.innerWidth < 600 ? 50 : 100;
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
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.size *= 0.95;
            particle.life--;
        });

        this.particles = this.particles.filter(particle => particle.life > 0);
    }

    draw() {
        this.particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = particle.glow ? 15 : 0;
            ctx.shadowColor = particle.color;
            ctx.fill();
        });
    }
}

// Rose Class
class Rose {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 50 + 50;
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

// Balloon Class
class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 40 + 40;
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
        let waveSize = 3;
        for (let i = 0; i < 10; i++) {
            let waveX = startX + (i % 2 === 0 ? waveSize : -waveSize);
            let waveY = startY + (i * (this.stringLength / 10));
            ctx.lineTo(waveX, waveY);
        }

        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw balloon
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size / 2, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add highlight
        ctx.beginPath();
        ctx.ellipse(this.x - this.size / 4, this.y - this.size / 4, this.size / 6, this.size / 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
    }
}

// Limits to prevent lag
const MAX_FIREWORKS = 15;
const MAX_BALLOONS = 20;
const MAX_ROSES = 15;

// Object Cleanup
function cleanUpElements() {
    while (fireworks.length > MAX_FIREWORKS) fireworks.shift();
    while (balloons.length > MAX_BALLOONS) balloons.shift();
    while (roses.length > MAX_ROSES) roses.shift();
}

// Object Creation with Throttling
let lastFireworkTime = 0, lastBalloonTime = 0, lastRoseTime = 0;
const SPAWN_INTERVAL_FIREWORK = 600;
const SPAWN_INTERVAL_BALLOON = 4000;
const SPAWN_INTERVAL_ROSE = 5000;

function tryCreateFirework() {
    let now = Date.now();
    if (now - lastFireworkTime >= SPAWN_INTERVAL_FIREWORK) {
        fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * canvas.height));
        lastFireworkTime = now;
    }
}

function tryCreateBalloon() {
    let now = Date.now();
    if (now - lastBalloonTime >= SPAWN_INTERVAL_BALLOON) {
        balloons.push(new Balloon());
        lastBalloonTime = now;
    }
}

function tryCreateRose() {
    let now = Date.now();
    if (now - lastRoseTime >= SPAWN_INTERVAL_ROSE) {
        roses.push(new Rose());
        lastRoseTime = now;
    }
}

// Animation Loop
function animate() {
    if (!isTabActive) {
        requestAnimationFrame(animate);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tryCreateFirework();
    tryCreateBalloon();
    tryCreateRose();

    fireworks.forEach((f, index) => {
        f.update();
        f.draw();
        if (f.particles.length === 0) fireworks.splice(index, 1);
    });

    balloons.forEach((b, index) => {
        b.update();
        b.draw();
        if (b.y + b.size < 0) balloons.splice(index, 1);
    });

    roses.forEach((r, index) => {
        r.update();
        r.draw();
        if (r.y + r.size < 0) roses.splice(index, 1);
    });

    cleanUpElements();
    requestAnimationFrame(animate);
}

// Firework on Click
canvas.addEventListener("click", (event) => {
    fireworks.push(new Firework(event.clientX, event.clientY));
});

animate();
