function setup() {
  createCanvas(800, 800);
  ship = new Ship();
  enemies = 5;
  asteroids = [];
  for (i = 0; i < enemies; i++) {
    asteroids.push(new Asteroid());
  }
}

function draw() {
  background(0);
  ship.render();
  ship.move();
  for (i=0; i < asteroids.length; i++) {
    asteroids[i].render();
    asteroids[i].move();
  }
}

function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.heading = -PI / 2;
  this.r = 15;
  this.dir = 0;
  
  this.render = function(){
    push();

    translate(this.pos);
    // A triangle
    rotate(this.heading);
    fill(255);
    triangle(-this.r, -this.r, 0, this.r, this.r, -this.r);
    pop();
  }
  
  this.move = function() {
    console.log(this.heading);
    this.heading += this.dir;

  }

  this.setRotation = function(angle){
    this.dir = angle;
  }
  
}

function Asteroid() {
  this.r = random(5, 15);
  this.total = 8;
  this.pos = createVector(random(width), random(height));
  this.dir = createVector(random(3), random(2));

  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.2, this.r * 0.5);
  }
  
  this.move = function(){
    
    if(this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x >= width) {
      this.pos.x = 0;
    }
    
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y >= height) {
      this.pos.y = 0;
    }
    
    this.pos.add(this.dir);
    
  }
  
  this.render = function() {
    push();
    noFill();
    stroke(255);
    translate(this.pos.x, this.pos.y);
    beginShape();
    // vector von 0 
    // laenge und winkel
    // 2PI auf 0-100 mapen
    // ueber 0-100 iterieren in nb schritten
    for (var i = 0; i < this.total; i++) {
      var angle = map(i, 0, this.total, 0, TWO_PI);
      var r = this.r + this.offset[i];
      vertex(r * cos(angle), r * sin(angle));
    }
    
    
    vertex();
    
    endShape(CLOSE);
    pop();
    
  }
  
}

function keyPressed() {
    
  if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.05);
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.05); 
  }
  
}

function keyReleased() {
    
  if (keyCode == LEFT_ARROW) {
    ship.setRotation(0);
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0); 
  }
}
