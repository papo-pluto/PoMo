// 🎈 Balloon Class with Responsive Size
class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.size = window.innerWidth < 1024 ? Math.random() * 30 + 30 : Math.random() * 40 + 40; // Smaller on mobile
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
