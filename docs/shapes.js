function drawTri(x, y, r, factor) {
  let angle = (110 * Math.PI) / 180

  let topx = x + parseInt(Math.round(7 * factor * Math.cos(r)))
  let topy = y + parseInt(Math.round(7 * factor * Math.sin(r)))

  let rightx = x + parseInt(Math.round(3 * factor * Math.cos(r + angle)))
  let righty = y + parseInt(Math.round(3 * factor * Math.sin(r + angle)))

  let leftx = x + parseInt(Math.round(3 * factor * Math.cos(r - angle)))
  let lefty = y + parseInt(Math.round(3 * factor * Math.sin(r - angle)))

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
