const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345789@#$%^&*()+=?/{}|\\`' +
    'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン' +
    'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω' +
    '漢字仮名カタカナひらがな';

const drawers = [], snakes = [];
let fontSize = 20, cw, ch;

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randChar = () => chars.charAt(Math.floor(Math.random() * chars.length));

class Drawer {
    constructor() {
        this.text = '';
        this.x = 0;
        this.y = 0;
        this.color = '#0f0';
        this.size = fontSize;
        this.tick = 0;
        this.interval = randInt(100, 200);
        this.active = false;
    }
    draw() {
        if (this.tick++ % this.interval === 0) this.text = randChar();

        ctx.shadowColor = this.active ? 'rgba(0, 255, 0, 0.5)' : 'transparent';
        ctx.shadowBlur = this.active ? 4 : 0;

        ctx.fillStyle = this.color;
        ctx.font = `${this.size}px monospace`;

        for (let i = 0; i < this.text.length; i++) {
            ctx.fillText(this.text[i], this.x, this.y + (fontSize * i));
        }

        ctx.shadowBlur = 0;
    }
}

class Snake {
    constructor() {
        this.col = 0;
        this.h = randInt(7, 35);
        this.tick = 0;
        this.interval = randInt(2, 8);
        this.startY = -this.h;
    }
    update() {
        if (this.tick++ % this.interval === 0) this.startY++;
        if (this.startY > ch - 1) this.startY = -this.h;

        for (let y = this.startY; y < this.startY + this.h; y++) {
            if (y < 0 || y > ch - 1) continue;

            drawers[y][this.col].active = true;
            drawers[y][this.col].color = y === this.startY + this.h - 1
                ? "#fff"
                : `rgb(0, ${Math.floor(255 * ((y - this.startY) / (this.h - 1)))}, 0)`;
        }
    }
}

const generateDrawers = (rows, cols) => {
    for (let x = 0; x < cols; x++) {
        drawers[x] = [];
        for (let y = 0; y < rows; y++) {
            const drawer = new Drawer();
            drawer.color = "#000";
            drawer.text = randChar();
            drawer.y = x * fontSize + fontSize;
            drawer.x = y * fontSize + fontSize / 2;

            drawers[x].push(drawer);
            snakes[y] = new Snake();
            snakes[y].col = y;
        }
    }
};

const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const drawAll = () => {
    clear();
    drawers.forEach(row => row.forEach(drawer => {
        drawer.draw();
        drawer.active = false;
    }));
};

const updateAll = () => snakes.forEach(snake => snake.update());

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    fontSize = Math.max(10, Math.min(20, canvas.width / 50));
    cw = Math.floor(canvas.width / fontSize);
    ch = Math.floor(canvas.height / fontSize);

    drawers.length = 0;
    snakes.length = 0;
    generateDrawers(cw, ch);
};

const animate = () => {
    drawAll();
    updateAll();
    requestAnimationFrame(animate);
};

const init = () => {
    resize();
    animate();
};

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', resize);
