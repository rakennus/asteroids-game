let player = new function () {
  this.size = { width: 14, height: 20 };
  this.position = { x: 40, y: 40 };

  this.velocity = { x: 0, y: 0 };
  this.friction = 0.1;
  this.accelleration = 200;

  this.rotationVelocity = 0;
  this.rotationAccelleration = 10;
  this.rotationFriction = 0.0005;
  this.maxRotationVelocity = 3;
  this.rotation = 0;

  this.direction = { x: 0, y: 0 }
  this.shootCooldown = 0;

  this.update = function () {
    if (controls.touchControls) {
      this.rotationVelocity += this.rotationAccelleration * joyStick.stickX / (joyStick.size / 2) * secondsPassed
      this.accelleration = 600 * joyStick.stickY / (joyStick.size / 2);
    } else {
      if (!controls.right && !controls.left || controls.right && controls.left) {
        this.rotationVelocity *= Math.pow(this.rotationFriction, secondsPassed);
      } else if (controls.right) {
        this.rotationVelocity += this.rotationAccelleration * secondsPassed;
      } else if (controls.left) {
        this.rotationVelocity -= this.rotationAccelleration * secondsPassed;
      }

      if (!controls.up && !controls.down || controls.up && controls.down) {
        this.accelleration = 0;
        this.velocity.x *= Math.pow(this.friction, secondsPassed);
        this.velocity.y *= Math.pow(this.friction, secondsPassed);
      } else if (controls.up) {
        this.accelleration = -600;
      } else if (controls.down) {
        this.accelleration = 600;
      }
    }

    if (this.rotationVelocity >= this.maxRotationVelocity) {
      this.rotationVelocity = this.maxRotationVelocity;
    }
    if (this.rotationVelocity <= -this.maxRotationVelocity) {
      this.rotationVelocity = -this.maxRotationVelocity;
    }

    this.direction.x = -Math.sin(Math.PI * this.rotation);
    this.direction.y = Math.cos(Math.PI * this.rotation);

    this.velocity.x += this.direction.x * this.accelleration * secondsPassed;
    this.velocity.y += this.direction.y * this.accelleration * secondsPassed;

    this.position.x += this.velocity.x * secondsPassed;
    this.position.y += this.velocity.y * secondsPassed;

    this.rotation += this.rotationVelocity * secondsPassed;

    if (this.position.x < 0) {
      this.position.x = canvas.width;
    } else if (this.position.x > canvas.width) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = canvas.height;
    } else if (this.position.y > canvas.height) {
      this.position.y = 0;
    }

    this.shootCooldown -= secondsPassed;
  }

  this.draw = function () {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(Math.PI * this.rotation);
    ctx.beginPath();

    ctx.moveTo(0, -this.size.height / 2);
    ctx.lineTo(-this.size.width / 2, this.size.height / 2);
    ctx.lineTo(0, this.size.height / 2 - 4);
    ctx.lineTo(this.size.width / 2, this.size.height / 2);
    ctx.lineTo(0, -this.size.height / 2);

    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }

  this.shoot = function () {
    if (this.shootCooldown <= 0) {
      bullets.push(new Bullet(this.position, this.velocity, this.direction));
      this.shootCooldown = 0.1;
    }
  }
}