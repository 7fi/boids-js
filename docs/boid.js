//Boid class by 7fi
class Boid {
  constructor(x = 0, y = 0, r = 0, vmag = 0) {
    this.pos = new Vector(x, y, true)
    this.vel = new Vector(r, vmag)
    this.acl = new Vector()
    this.maxForce = 0.2
  }

  //Getters
  get getPos() {
    return this.pos
  }
  get getVel() {
    return this.vel
  }
  get getAcl() {
    return this.acl
  }

  //Setter
  addAcl(acl) {
    this.acl.add(acl)
  }

  update(boids) {
    // update vel with acl
    this.vel.add(this.acl)

    this.vel.setMag(speed / 4)

    //update position with velocity
    if (this.isInBounds) {
      // if inside of borders
      this.pos.add(this.vel)
    } else {
      // otherwise tp to other side
      this.wrap()
    }

    this.acl = new Vector() // reset acceleration for next frame
  }

  render() {
    if (shadows) {
      // if shadows are on
      ctx.fillStyle = 'rgba(0,0,0,0.4)' // set to shadow color
      if (triangles) {
        drawTri(this.pos.x + 4, this.pos.y + 4, this.vel.dir, 2)
      } else {
        fillCircle(this.pos.x + 4, this.pos.y + 4, 8, 2)
      }
    }

    ctx.fillStyle = '#ddd' // set to boid color
    if (triangles) {
      drawTri(this.pos.x, this.pos.y, this.vel.dir, 2)
    } else {
      fillCircle(this.pos.x, this.pos.y, 8, 2)
    }

    //setup debug circles
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.lineWidth = 2
    if (drawDebugCircles) {
      drawCircle(this.pos.x, this.pos.y, visionRange, 2)
    }
  }

  wrap() {
    const { width, height } = canvas
    // teleports a boid across the screen
    if (this.pos.x <= 0) {
      this.pos.x += width
    } else if (this.pos.y <= 0) {
      this.pos.y += height
    } else if (this.pos.x >= width) {
      this.pos.x = 1
    } else if (this.pos.y >= height) {
      this.pos.y = 1
    }
  }

  // returns the distance between two points
  dist(firstx, firsty, secondx, secondy) {
    if (arguments.length == 0) {
      return Math.sqrt(Math.pow(firsty.pos.x - firstx, 2) + Math.pow(firstyy.pos.y - firsty, 2))
    }
    return Math.sqrt(Math.pow(secondx - firstx, 2) + Math.pow(secondy - firsty, 2))
  }
  // returns the distance squared between two points
  distSquared(firstx, firsty, secondx, secondy) {
    if (arguments.length == 2) {
      return (firsty.pos.x - firstx.pos.x) * (firsty.pos.x - firstx.pos.x) + (firsty.pos.y - firstx.pos.y) * (firsty.pos.y - firstx.pos.y)
    } else {
      return (secondx - firstx) * (secondx - firstx) + (secondy - firsty) * (secondy - firsty)
    }
  }
  get isInBounds() {
    const { width, height } = canvas
    // Returns boolean value based on if a boid is in the bounds of the screen
    return this.pos.x <= width && this.pos.y <= height && this.pos.x >= 0 && this.pos.y >= 0
  }
}
