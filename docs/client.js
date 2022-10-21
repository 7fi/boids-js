const speedSlider = document.getElementById('speed')
const numBoidsSlider = document.getElementById('numBoids')
const visionSlider = document.getElementById('vision')
const alignmentSlider = document.getElementById('alignment')
const cohesionSlider = document.getElementById('cohesion')
const seperationSlider = document.getElementById('seperation')

const resetBtn = document.getElementById('reset')

const visionCircleBx = document.getElementById('visionCircles')
const visionLinesBx = document.getElementById('visionLines')
const trianglesBx = document.getElementById('triangles')
const shadowsBx = document.getElementById('shadows')
const edgesBx = document.getElementById('edges')

let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let w = window.innerWidth
let h = window.innerHeight

const observer = new ResizeObserver((entries) => {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
})
observer.observe(canvas)

// Slider values to change
let numBoids = 50
let visionRange = 100
let alignmentMult = 0.5
let seperationMult = 1 // 0.7
let cohesionMult = 0.3 // 0.1
let speed = 5

let fps = 30

//Checkbox values to change
let avoidEdges = false
let drawDebugCircles = false
let debugLines = false
let shadows = true
let triangles = true

let boids = []

speedSlider.oninput = function () {
  speed = this.value
}
numBoidsSlider.oninput = function () {
  numBoids = this.value
}
visionSlider.oninput = function () {
  visionRange = this.value
}
alignmentSlider.oninput = function () {
  alignmentMult = this.value / 10
}
cohesionSlider.oninput = function () {
  cohesionMult = this.value / 10
}
seperationSlider.oninput = function () {
  seperationMult = this.value / 10
}

resetBtn.addEventListener('click', () => {
  resetBoids()
})

visionCircleBx.addEventListener('change', function () {
  drawDebugCircles = this.checked
})
visionLinesBx.addEventListener('change', function () {
  debugLines = this.checked
})
trianglesBx.addEventListener('change', function () {
  triangles = this.checked
})
edgesBx.addEventListener('change', function () {
  avoidEdges = this.checked
})
shadowsBx.addEventListener('change', function () {
  shadows = this.checked
})

// let boids = new Boid[numBoids]()

function randNum(min, max) {
  return Math.random() * (max - min) + min
}

Math.toRadians = function (degrees) {
  return (degrees * Math.PI) / 180
}
Math.toDegrees = function (radians) {
  return (radians * 180) / Math.PI
}

resetBoids()
function resetBoids() {
  const { width, height } = canvas

  for (let i = 0; i < numBoids; i++) {
    //                                     X getPos()                       Y getPos()              Rotation                    Speed
    boids[i] = new Boid(Math.floor(randNum(50, width - 50)), Math.floor(randNum(50, height - 50)), randNum(0, Math.PI * 2), 5)
  }
}

requestAnimationFrame(update)
function update(time) {
  //Get scene size
  const { width, height } = canvas

  //Paint background
  ctx.fillStyle = '#555'
  ctx.fillRect(0, 0, width, height)

  //if slider value changed update boid array length and amount
  if (numBoids > boids.length) {
    console.log('Changing boid length')
    let oldLength = boids.length
    boids = boids.slice(0, numBoids)
    for (let i = oldLength - 1; i < numBoids; i++) {
      //       X getPos()               Y getPos()                 Rotation                    Speed
      boids[i] = new Boid(randNum(50, width - 50), randNum(50, height - 50), randNum(0, Math.PI * 2), 5)
    }
  } else if (numBoids < boids.length) {
    boids = boids.slice(0, numBoids)
  }

  // Update and draw boids

  applyRules() // applies rules
  boids.forEach((boid) => {
    boid.update(boids)
    boid.render()
  })
  requestAnimationFrame(update)
}

function applyRules() {
  // Applies rules to every boid
  boids.forEach((boid) => {
    // console.log('applying rules')
    //Create default vectors
    let seperationForce = new Vector()
    let cohesionForce = new Vector()
    let alignmentForce = new Vector()
    let edgeForce = new Vector()

    let numBoidsInRange = 0

    boids.forEach((other) => {
      // add up steering forces
      // console.log(other.distSquared(boid, other))
      if (other.distSquared(boid, other) < Math.pow(visionRange, 2) && boid != other) {
        // if boid is in range and is not self
        // Inversely scaled vector in opposite direction of other boid || c = c - (b.position - bJ.position)
        //seperationForce = seperationForce - (other.pos - boid.pos);

        let tempDiff = new Vector()
        tempDiff.add(boid.getPos)
        tempDiff.subtract(other.getPos)
        tempDiff.divide(other.distSquared(boid, other))

        //add up (for avg)
        seperationForce.add(tempDiff)
        cohesionForce.add(other.getPos)
        alignmentForce.add(other.getVel)

        numBoidsInRange++ // add to total boids in range

        // console.log('boid is in range and is not self', numBoidsInRange)
        if (debugLines) {
          // draws lines between two boids (very inefficient because it draws every line twice)
          ctx.lineWidth = 0.5
          ctx.moveTo(boid.getPos.x, boid.getPos.y)
          ctx.lineTo(other.getPos.x, other.getPos.y)
          ctx.stroke()
        }
      }
    })

    if (avoidEdges) {
      // if edge avoidance setting is on, avoid edges
      let edgeAvoidanceForce = 2 // not currently changeable apart from here

      /*
                    Essentially this method creates a vector that points in the opposite direction of each edge, 
                    and that is scaled proportionally to how close each boid is to the edge.
                */

      //Top
      let tempDiff = new Vector(0, boid.getPos.y, true)
      if (boid.getPos.y != 0) {
        tempDiff.divide(Math.pow(boid.getPos.y, 2))
      }
      tempDiff.multiply(edgeAvoidanceForce)
      edgeForce.add(tempDiff)

      // Left
      tempDiff = new Vector(boid.getPos.x, 0, true)
      if (boid.getPos.x != 0) {
        tempDiff.divide(Math.pow(boid.getPos.x, 2))
      }
      tempDiff.multiply(edgeAvoidanceForce)
      edgeForce.add(tempDiff)

      //Bottom
      tempDiff = new Vector(0, h - boid.getPos.y, true)
      if (boid.getPos.y != 0) {
        tempDiff.divide(Math.pow(h - boid.getPos.y, 2))
        tempDiff.multiply(-edgeAvoidanceForce)
        edgeForce.add(tempDiff)
      }

      //Right
      tempDiff = new Vector(w - boid.getPos.x, 0, true)
      if (boid.getPos.x != 0) {
        tempDiff.divide(Math.pow(w - boid.getPos.x, 2))
        tempDiff.multiply(-edgeAvoidanceForce)
        edgeForce.add(tempDiff)
      }
    }

    if (numBoidsInRange > 0) {
      // if there are no boids in range its divide by zero
      //hard coded offsets (not sure why they are so weird tbh)
      let alignmentStr = 150
      let cohesionStr = 4000
      let seperationStr = 1.03

      //desired_velocity = normalize (position - target) * max_speed
      //steering = desired_velocity - velocity

      //Alignment Force (steer towards avg dir = (Desired - Current) / damper then limit by maxForce
      alignmentForce.divide(numBoidsInRange) // finish taking avg to get desired
      alignmentForce.subtract(boid.getVel) // subtract current
      alignmentForce.divide(alignmentStr) // divide by damper
      alignmentForce.limit(boid.maxForce) // limit by maxForce

      //Cohesion Force Steer towards avg pos
      cohesionForce.divide(numBoidsInRange) // finish taking avg to get desired
      cohesionForce.subtract(boid.getPos) // subtract current pos
      cohesionForce.divide(cohesionStr) // divide by damper
      cohesionForce.limit(boid.maxForce) // limit by maxForce

      //Seperation Force // steer away from nearest neighbors (working) c = c - (b.position - bJ.position)
      seperationForce.divide(numBoidsInRange) // finish taking avg to get desired
      seperationForce.subtract(boid.getVel) // subtract current
      seperationForce.divide(seperationStr) // divide by damper
      // seperationForce.limit(boid.maxForce); // limit by maxForce

      //Scale by slider values
      alignmentForce.multiply(alignmentMult)
      seperationForce.multiply(seperationMult)
      cohesionForce.multiply(cohesionMult)
    }
    //Add up forces
    boid.addAcl(edgeForce)
    boid.addAcl(alignmentForce)
    boid.addAcl(seperationForce)
    boid.addAcl(cohesionForce)

    // console.log(boid)
  })
}
