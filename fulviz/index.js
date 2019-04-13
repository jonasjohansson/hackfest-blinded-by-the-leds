var canvas, ctx, T, ws

var COLORS = [
    '#1abc9c',
    '#2ecc71',
    '#9b59b6',
    '#34495e',
    '#f1c40f',
    '#e67e22',
    '#e74c3c'
]

var ps = []

function emit(x,y,radius,color) {
    var life = 100
    var vx = -1 + Math.random() * 2
    var vy = -4 + Math.random() * 3
    p = {
        x,
        y,
        vx,
        vy,
        radius,
        color,
        life
    }
    ps.push(p)
    return p
}


function updateparticles() {
    ps.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.997
        p.vy *= 0.997
        p.vx += 0.0
        p.vy += 0.05
        p.life -= 0.6
    })

    // kill dead particles
    ps = ps.filter(p => p.life > 0)
}

function render() {
    // queueRender()
    ctx.globalAlpha = 1.0
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0.8)'
    ctx.fillRect(0, 0, 500, 500)

    ps.forEach(p => {
        ctx.globalAlpha = p.life / 150
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = p.color
        ctx.beginPath()
        var R = p.radius * p.life / 100
        ctx.arc(p.x, p.y, R, 0, 2 * Math.PI);
        ctx.fill();
    })

    updateparticles()

    queueRender()
}

function queueRender() {
    requestAnimationFrame(render)
}

function tap() {
    for(var k=0; k<1; k++) {
        emit(
            200 + Math.random() * 100,
            200 + Math.random() * 100,
            20 + Math.random() * 80,
            COLORS[Math.floor(Math.random() * COLORS.length)]
        )
    }
}

function emitbg() {
    emit(
        50 + Math.random() * 400,
        50 + Math.random() * 400,
        30 + Math.random() * 70,
        '#013'
    )
}

function init() {
    T = 0
    ws = new WebSocket('ws://possan.ngrok.io');
    ws.onmessage = data => {
        console.log('data', data);
        tap();
    }
    window.addEventListener('keydown', k => {
        console.log('key', k)
        tap()
    })
    canvas = document.getElementById('c')
    canvas.width = 500
    canvas.height = 500
    ctx = canvas.getContext('2d')
    queueRender()
    // setInterval(() => tap(), 1000);
    setInterval(() => emitbg(), 300);
}

window.addEventListener('load', () => init())
