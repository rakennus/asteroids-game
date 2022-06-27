class Asteroid {
    static minRadius = 30;
    static maxRadius = 90;
    
    minRadius = 30;
    maxRadius = 90;
    minEdges = 5;
    maxEdges = 7;

    shape = [];

    constructor(pos, vel) {
        this.x = pos.x;
        this.y = pos.y;

        this.velocityX = vel.x;
        this.velocityY = vel.y;

        this.edges = ~~(Math.random() * (this.maxEdges - this.minEdges + 1) + this.minEdges);

        for (let i = 0; i < this.edges; i++) {
            let radius = ~~(Math.random() * (this.maxRadius - this.minRadius + 1) + this.minRadius);
            let x = this.x + radius * Math.cos(1 / this.edges * i * 2 * Math.PI);
            let y = this.y + radius * Math.sin(1 / this.edges * i * 2 * Math.PI);
            this.shape.push(new point(x, y));
        }
    }

    update() {
        this.x += this.velocityX * secondsPassed;
        this.y += this.velocityY * secondsPassed;

        if (this.x < -this.maxRadius) {
            this.x = canvas.width + this.maxRadius;
        } else if (this.x > canvas.width + this.maxRadius) {
            this.x = -this.maxRadius;
        }
        if (this.y < -this.maxRadius) {
            this.y = canvas.height + this.maxRadius;
        } else if (this.y > canvas.height + this.maxRadius) {
            this.y = -this.maxRadius;
        }
    }

    draw() {
        for (let current = 0; current < this.shape.length; current++) {
            let next = current + 1;
            if (next == this.shape.length) next = 0;
            ctx.beginPath();

            ctx.moveTo(this.shape[current].x + this.x, this.shape[current].y + this.y);
            ctx.lineTo(this.shape[next].x + this.x, this.shape[next].y + this.y);

            ctx.stroke();
            ctx.closePath();
        }
    }
}