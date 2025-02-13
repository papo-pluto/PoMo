const canvas = document.getElementById("fireworkCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const balloons = [];
const roses = [];

// Fireworks Class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 7 + 3;
            this.particles.push({
                x: this.x,
                y: this.y,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle)* speed,
                size: Math.random() * 7 + 3,
                life: Math.random() * 80 + 60,
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

// Balloon Class with Wavy String & Oval Shape
class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.width = Math.random() * 30 + 35;
        this.height = this.width * 1.2;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.speed = Math.random() * 2 + 1;
        this.stringLength = Math.random() * 50 + 40;
        this.wobbleOffset = Math.random() * 20 - 10;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.wobbleAngle = Math.random() * Math.PI * 2;
    }

    update() {
        this.y -= this.speed;
        this.wobbleAngle += this.wobbleSpeed;
        this.x += Math.sin(this.wobbleAngle) * 0.7;
    }

    draw() {
        // Draw wavy string
        ctx.beginPath();
        let startX = this.x;
        let startY = this.y + this.height / 2;
        let endY = startY + this.stringLength;

        ctx.moveTo(startX, startY);

        let waveSize = 4;
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
        ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add a glossy highlight
        ctx.beginPath();
        ctx.ellipse(this.x - this.width / 4, this.y - this.height / 4, this.width / 6, this.height / 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
    }
}

// 🌹 Rose Class (Floating like Balloons)
class Rose {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = Math.random() * 50 + 50; // Random rose size
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
        img.src = "rose-svgrepo-com.svg"; // Ensure the file is in the same directory
        ctx.drawImage(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    balloons.forEach(balloon => {
        balloon.update();
        balloon.draw();
    });

    roses.forEach((rose, index) => {
        rose.update();
        rose.draw();
        if (rose.y + rose.size < 0) {
            roses.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// Generate fireworks, balloons, and roses
setInterval(createFirework, 500);
setInterval(createBalloon, 1000);
setInterval(createRose, 1200); // Roses appear slightly less often

// Fireworks on click
canvas.addEventListener("click", (event) => createFirework(event.clientX, event.clientY));

animate();
