function setup() {
  createCanvas(600, 600);
  ship = new Ship();
  enemies = 5;
  asteroids = [];
  for (i = 0; i < enemies; i++) {
    asteroids.push(new Asteroid());
  }
  bullets = [];
}

function draw() {
  background(0);
  ship.render();
  ship.move();
  let asteroidsNr = asteroids.length;
  for (i=0; i < asteroidsNr; i++) {
    if (asteroids[i].hit == 1) {
      let newAsteroid = new Asteroid();
      newAsteroid.r = asteroids[i].r;
      newAsteroid.pos = createVector(asteroids[i].pos.x, asteroids[i].pos.y);
      newAsteroid.shrink();
      asteroids[i].shrink();
      asteroids.push(newAsteroid);
    }
  }

  for (i=0; i < asteroids.length; i++) {
    asteroids[i].render();
    asteroids[i].move();
    if (ship.hits(asteroids[i])) {
      ship.color = 60;
    }
    if (asteroids[i].remove > 0) {
      asteroids.splice(i, 1);
    }
  }

  for(k = 0; k < bullets.length; k++) {
    bullets[k].render();
    bullets[k].update();
    
    for (j = 0; j < asteroids.length; j++) {
      if (bullets[k].hits(asteroids[j])) {
        asteroids[j].destroid();
      }
    }

    if (bullets[k].out()) {
      bullets.splice(k, 1);
    }

  }

}

function Ship() {
  this.pos = createVector(width / 2, height / 2);
  this.heading = PI/2;
  this.dir = 0;
  this.r = 15;
  this.vel = createVector(0, 0);
  this.boost = false;
  this.color = 255;
  
  this.render = function(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    noStroke();
    if (this.color < 255){
      this.color++;
    }
    fill(this.color);
    // noFill();
    // stroke(255);
    triangle(-this.r, this.r, 0, -this.r, this.r, this.r);
    pop();
  }
  
  this.move = function() {

    if (this.boost) {
      this.boosting();
    }
    this.pos.add(this.vel);
    this.checkEdges();
    this.heading += this.dir;
    this.vel.mult(0.99);
  }

  this.setRotation = function(angle){
    this.dir = angle;
  }

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  };

  this.boosting = function() {
    var force = p5.Vector.fromAngle(this.heading - PI/2);
    force.mult(0.1);
    this.vel.add(force);
  };

  this.setBoost = function(flag) {
    this.boost = flag;
  };

  this.checkEdges = function() {
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
  };
};

function Asteroid() {
  this.r = random(15, 30);
  this.total = 8;
  this.pos = createVector(random(width), random(height));
  this.dir = createVector(random(3), random(2));
  this.hit = 0;
  this.remove = 0;

  this.offset = [];
  for (var i = 0; i < this.total; i++) {
    this.offset[i] = random(-this.r * 0.2, this.r * 0.5);
  }
  
  this.shrink = function() {
    this.r = this.r / 3;
    for (var i = 0; i < this.total; i++) {
      this.offset[i] = random(-this.r * 0.2, this.r * 0.5);
    }
    this.hit = 2;
  }

  this.move = function(){
    
    if(this.pos.x < 0) {
      this.pos.x = width;
      if (this.hit >= 2) {this.removeMe()};
    } else if (this.pos.x >= width) {
      this.pos.x = 0;
      if (this.hit >= 2) {this.removeMe()};
    }
    
    if (this.pos.y < 0) {
      this.pos.y = height;
      if (this.hit >= 2) {this.removeMe()};
    } else if (this.pos.y >= height) {
      this.pos.y = 0;
      if (this.hit >= 2) {this.removeMe()};
    }
    
    this.pos.add(this.dir);
    
  }
  
  this.removeMe = function(){
    this.remove++;
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
  
    //vertex();
    
    endShape(CLOSE);
    pop();
  };


  this.destroid = function() {
    this.hit++;
  };
  
};

function Bullet(shipPos, heading) {
  this.pos = createVector(shipPos.x, shipPos.y);
  this.vel = p5.Vector.fromAngle(heading-PI/2); // default len = 1.0
  this.vel.mult(10);

  this.update = function() {
    this.pos.add(this.vel);
  };

  this.render = function() {
    push();
    stroke(255);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
    pop();
  };

  this.hits = function(asteroid) {
    var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < asteroid.r) {
      return true;
    } else {
      return false;
    }
  };

  this.out = function() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  };
}

function keyPressed() {
    
  if (keyCode == 32) {
    bullets.push(new Bullet(ship.pos, ship.heading));
  } else if (keyCode == UP_ARROW) {
    ship.setBoost(true);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.05);
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.05); 
  }
  
};

function keyReleased() {
    
  if (keyCode == UP_ARROW){
    ship.setBoost(false);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(0);
  } else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0); 
  }
};
