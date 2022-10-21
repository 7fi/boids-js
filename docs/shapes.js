function drawTri(x, y, r, factor) {
  let topx = x + parseInt(Math.round(7 * factor * Math.cos(r)))
  let topy = y + parseInt(Math.round(7 * factor * Math.sin(r)))

  let rightx = x + parseInt(Math.round(3 * factor * Math.cos(r + Math.toRadians(110))))
  let righty = y + parseInt(Math.round(3 * factor * Math.sin(r + Math.toRadians(110))))

  let leftx = x + parseInt(Math.round(3 * factor * Math.cos(r - Math.toRadians(110))))
  let lefty = y + parseInt(Math.round(3 * factor * Math.sin(r - Math.toRadians(110))))

  ctx.beginPath()
  ctx.moveTo(topx, topy)
  ctx.lineTo(rightx, righty)
  ctx.lineTo(leftx, lefty)
  ctx.closePath()
  ctx.fill()
}
function fillCircle(x, y, rad, factor) {
  ctx.beginPath()
  ctx.arc(x, y, rad, 0, Math.PI * 2, true)
  ctx.fill()
}
function drawCircle(x, y, rad, factor) {
  ctx.beginPath()
  ctx.arc(x, y, rad, 0, Math.PI * 2, true)
  ctx.stroke()
}
