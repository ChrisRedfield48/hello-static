/* global window, document, requestAnimationFrame */

const canvas = document.getElementById('stars')
const ctx = canvas.getContext('2d')
const counterEl = document.getElementById('counter')
const incrementBtn = document.getElementById('increment')

const STAR_COUNT = 800
const FOV = 400
const SPEED = 2.5

const stars = []
let mouseX = 0
let mouseY = 0
let rotX = 0
let rotY = 0

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function createStar() {
  return {
    x: (Math.random() - 0.5) * 2000,
    y: (Math.random() - 0.5) * 2000,
    z: Math.random() * 2000 + 1,
    color: Math.random() > 0.85 ? '#ff2e88' : '#00eaff'
  }
}

function initStars() {
  stars.length = 0
  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push(createStar())
  }
}

function rotatePoint(p, cosX, sinX, cosY, sinY) {
  const y1 = p.y * cosX - p.z * sinX
  const z1 = p.y * sinX + p.z * cosX
  const x2 = p.x * cosY + z1 * sinY
  const z2 = -p.x * sinY + z1 * cosY
  return { x: x2, y: y1, z: z2 }
}

function animate() {
  ctx.fillStyle = 'rgba(11, 11, 26, 0.35)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const targetRotX = mouseY * 0.0015
  const targetRotY = mouseX * 0.0015
  rotX += (targetRotX - rotX) * 0.05
  rotY += (targetRotY - rotY) * 0.05

  const cosX = Math.cos(rotX)
  const sinX = Math.sin(rotX)
  const cosY = Math.cos(rotY)
  const sinY = Math.sin(rotY)

  const cx = canvas.width / 2
  const cy = canvas.height / 2

  for (const star of stars) {
    star.z -= SPEED
    if (star.z <= 1) {
      Object.assign(star, createStar())
      star.z = 2000
    }

    const p = rotatePoint(star, cosX, sinX, cosY, sinY)
    if (p.z <= 0) continue

    const scale = FOV / (FOV + p.z)
    const x = cx + p.x * scale
    const y = cy + p.y * scale
    const size = Math.max(0.3, scale * 2.5)
    const alpha = Math.min(1, scale * 1.5)

    if (x < -50 || x > canvas.width + 50 || y < -50 || y > canvas.height + 50) {
      continue
    }

    ctx.globalAlpha = alpha
    ctx.fillStyle = star.color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
  requestAnimationFrame(animate)
}

window.addEventListener('resize', resize)
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX - window.innerWidth / 2
  mouseY = e.clientY - window.innerHeight / 2
})

let count = 0
incrementBtn.addEventListener('click', () => {
  count += 1
  counterEl.textContent = String(count)
})

resize()
initStars()
animate()
