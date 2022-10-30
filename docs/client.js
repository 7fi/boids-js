let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

//Watch for window resizing
const observer = new ResizeObserver((entries) => {
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
  resetBoids()
})
observer.observe(canvas)

// Slider values to change
let numBoids = 150
let visionRange = 100
let alignmentMult = 0.5
let separationMult = 1 // 0.7
let cohesionMult = 0.3 // 0.1
let speed = 5

//Checkbox values to change
let avoidEdges = false
let drawDebugCircles = false
let debugLines = false
let shadows = true
let triangles = true

let boids = []

function randNum(min, max) {
  return Math.random() * (max - min) + min
}

//Set starting conditions
resetBoids()
function resetBoids() {
  const { width, height } = canvas

  //Create boids with space around edges
  let edgeGap = 50
  for (let i = 0; i < numBoids; i++) {
    boids[i] = new Boid(Math.floor(randNum(edgeGap, width - edgeGap)), Math.floor(randNum(edgeGap, height - edgeGap)), randNum(0, Math.PI * 2), 5)
  }
}

// begin animation
requestAnimationFrame(update)
function update(time) {
  //Get canvas size
  const { width, height } = canvas

  //Paint background
  ctx.fillStyle = '#555'
  ctx.fillRect(0, 0, width, height)

  //if slider value changed update boid array length and amount
  if (numBoids > boids.length) {
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
  const { width, height } = canvas
  // Applies rules to every boid
  boids.forEach((boid) => {
    // console.log('applying rules')
    //Create default vectors
    let separationForce = new Vector()
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
        //separationForce = separationForce - (other.pos - boid.pos);

        let tempDiff = new Vector()
        tempDiff.add(boid.getPos)
        tempDiff.subtract(other.getPos)
        tempDiff.divide(other.distSquared(boid, other))

        //add up (for avg)
        separationForce.add(tempDiff)
        cohesionForce.add(other.getPos)
        alignmentForce.add(other.getVel)

        numBoidsInRange++ // add to total boids in range

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
      tempDiff = new Vector(0, height - boid.getPos.y, true)
      if (boid.getPos.y != 0) {
        tempDiff.divide(Math.pow(height - boid.getPos.y, 2))
        tempDiff.multiply(-edgeAvoidanceForce)
        edgeForce.add(tempDiff)
      }

      //Right
      tempDiff = new Vector(width - boid.getPos.x, 0, true)
      if (boid.getPos.x != 0) {
        tempDiff.divide(Math.pow(width - boid.getPos.x, 2))
        tempDiff.multiply(-edgeAvoidanceForce)
        edgeForce.add(tempDiff)
      }
    }

    if (numBoidsInRange > 0) {
      // if there are no boids in range its divide by zero
      //hard coded offsets (not sure why they are so weird tbh)
      let alignmentStr = 150
      let cohesionStr = 4000
      let separationStr = 1.03

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

      //separation Force // steer away from nearest neighbors (working) c = c - (b.position - bJ.position)
      separationForce.divide(numBoidsInRange) // finish taking avg to get desired
      separationForce.subtract(boid.getVel) // subtract current
      separationForce.divide(separationStr) // divide by damper
      // separationForce.limit(boid.maxForce * 5) // limit by maxForce

      //Scale by slider values
      alignmentForce.multiply(alignmentMult)
      separationForce.multiply(separationMult)
      cohesionForce.multiply(cohesionMult)
    }
    //Add up forces
    boid.addAcl(edgeForce)
    boid.addAcl(alignmentForce)
    boid.addAcl(separationForce)
    boid.addAcl(cohesionForce)
  })
}
