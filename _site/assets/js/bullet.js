function Bullet(pos, vel, dir) {
    this.x = pos.x;
    this.y = pos.y;
    this.width = 4;
    this.height = 4;
    this.xDir = -dir.x;
    this.yDir = -dir.y;
    this.velocityX = 400 + Math.abs(vel.x);
    this.velocityY = 400 + Math.abs(vel.y);

    this.lifeTiem = 0.8;

    this.update = function () {
        this.x += this.velocityX * this.xDir * secondsPassed;
        this.y += this.velocityY * this.yDir * secondsPassed;

        if (this.x < 0) {
            this.x = canvas.width;
        } else if (this.x > canvas.width) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = canvas.height;
        } else if (this.y > canvas.height) {
            this.y = 0;
        }

        this.lifeTiem -= secondsPassed;
    }

    this.draw = function () {
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}