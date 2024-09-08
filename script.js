const canvas = document.getElementById('scene'); 
const ctx = canvas.getContext('2d');

const textDrawers = [];
const snakes = [];

let fontSize = 20;
let canvasWidth, canvasHeight;

class VerticalTextDrawer {
    constructor() {
        this.text = '';
        this.x = 0;
        this.y = 0;
        this.color = '#0f0';
        this.fontSize = fontSize;
        this.tick = 0;
        this.updateInterval = getRandomInt(100, 200);
        this.isActive = false;
    }
    draw() {
        if (this.tick++ % this.updateInterval === 0) this.text = getRandomChar();

        ctx.shadowColor = this.isActive ? 'rgba(0, 255, 0, 0.5)' : 'transparent';
        ctx.shadowBlur = this.isActive ? 4 : 0;

        ctx.fillStyle = this.color;  
        ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.text.length; i++) {
            ctx.fillText(this.text[i], this.x, this.y + (fontSize * i)); 
        }
        
        ctx.shadowBlur = 0;
    }
}

class Snake {
    constructor() {
        this.column = 0;
        this.height = getRandomInt(7, 35);
        this.tick = 0;
        this.updateInterval = getRandomInt(2, 8);
        this.startY = -this.height;
    }

    update() {
        if (this.tick++ % this.updateInterval === 0) this.startY++;
        if (this.startY > canvasHeight - 1) this.startY = -this.height;

        for (let y = this.startY; y < this.startY + this.height; y++) {
            if (y < 0 || y > canvasHeight - 1) continue;

            textDrawers[y][this.column].isActive = true;
            textDrawers[y][this.column].color = y === this.startY + this.height - 1
                ? "#fff"
                : `rgb(0, ${Math.floor(255 * ((y - this.startY) / (this.height - 1)))}, 0)`;
        }
    }
}

const getRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345789@#$%^&*()+=?/{}|\\`' +
        'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン' +
        'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω' +
        '漢字仮名カタカナひらがな';
    return chars.charAt(Math.floor(Math.random() * chars.length));
};

const generateTextDrawers = (rows, cols) => {
    for (let x = 0; x < cols; x++) {
        textDrawers[x] = [];
        for (let y = 0; y < rows; y++) {
            const drawer = new VerticalTextDrawer();
            drawer.color = "#000";
            drawer.text = getRandomChar();
            drawer.y = x * fontSize + fontSize;
            drawer.x = y * fontSize + fontSize / 2;

            textDrawers[x].push(drawer);
            snakes[y] = new Snake();  
            snakes[y].column = y;
        }
    }
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandom = (min, max) => Math.random() * (max - min) + min;

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawTextDrawers = () => {
    clearCanvas();
    textDrawers.forEach(row => row.forEach(drawer => {
        drawer.draw();
        drawer.isActive = false;
    }));
};

const updateSnakes = () => {
    snakes.forEach(snake => snake.update());
};

const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateFontSize();

    canvasWidth = Math.floor(canvas.width / fontSize);
    canvasHeight = Math.floor(canvas.height / fontSize);

    textDrawers.length = 0;
    snakes.length = 0;
    generateTextDrawers(canvasWidth, canvasHeight);
};

const updateFontSize = () => {
    fontSize = Math.max(10, Math.min(20, canvas.width / 50));
};

const animate = () => {
    drawTextDrawers();
    updateSnakes();
    requestAnimationFrame(animate);
};

const init = () => {
    resizeCanvas();
    animate();
};

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', resizeCanvas);
