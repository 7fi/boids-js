//Vector class written entirely by me (7fi)
class Vector {
  //Constructors
  // constructor(){
  //   this.x = 0
  //   this.y = 0
  // }

  constructor(dir, mag, placeholder) {
    //System.out.println(x + " " + y);
    if (arguments.length == 0) {
      this.x = 0
      this.y = 0
    } else {
      if (placeholder) {
        this.x = dir
        this.y = mag
      } else {
        this.x = mag * Math.cos(dir)
        this.y = mag * Math.sin(dir)
      }
    }
  }

  // constructor(x, y, placeholder){ // to differentiate between the other contructor
  //     this.x = x;
  //     this.y = y;
  // }

  //Getters
  get dir() {
    // updates the direction
    return Math.atan2(this.y, this.x)
  }

  get mag() {
    // updates the magnitude
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  //Setters
  setMag(mag) {
    // sets the magnitude and updates x & y
    let tempDir = this.dir
    this.x = mag * Math.cos(tempDir)
    this.y = mag * Math.sin(tempDir)
  }

  setDir(dir) {
    // sets the direction and updates x & y
    let tempMag = mag()
    this.x = tempMag * Math.cos(dir)
    this.y = tempMag * Math.sin(dir)
    console.log(x + ' ' + y)
  }

  //Other useful functions
  normalize() {
    divide(this.mag)
  }

  limit(max) {
    if (this.mag > max) {
      setMag(max)
    }
  }

  dot(other) {
    return x * other.x + y * other.y
  }

  angle(other) {
    // unused currently
    return Math.atan2(dot(other), x * other.x - y * other.y)
  }

  //Math
  add(x, y) {
    if (arguments.length == 1) {
      this.x += x.x
      this.y += x.y
    } else {
      this.x += x
      this.y += y
    }
  }

  subtract(input) {
    this.x -= input.x
    this.y -= input.y
  }
  multiply(num) {
    this.x *= num
    this.y *= num
  }

  divide(divisor) {
    if (divisor != 0) {
      this.x /= divisor
      this.y /= divisor
    } else {
      console.log('Tried to divide by zero.')
      this.x = 0
      this.y = 0
    }
  }
}
