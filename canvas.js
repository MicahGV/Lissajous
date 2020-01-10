let context, canvas, then, now, animation, gui, controller;
let config = {
    cosRatio: 0.42,
    sinRatio: 0.8,
    numOfItems: 12,
    distanceBetweenItems: 15,
    offsetSize: 1
}


let squares = [];

function square({ x = 0, y = 0, color = 0, r = 0, g = 0, b = 0, cosRatio = 0, sinRatio = 0, offset = 0, lissajousRadius = 0 }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.r = r,
    this.g = g,
    this.b = b,
    this.offset = offset;
    this.lissajousRadius = lissajousRadius;
    this.cosRatio = cosRatio;
    this.sinRatio = sinRatio;
    this.colorIncrementDecrement = 1;

    this.render = (now, canvas) => {
        if (this.color > 255)
            this.colorIncrementDecrement = -1;
        if (this.color < 0)
            this.colorIncrementDecrement = 1;

        this.color += this.colorIncrementDecrement;
        context.strokeStyle = `hsl(${this.color},100%,50%)`;
        context.fillStyle = `hsl(${this.color},100%,50%)`;

        this.x = Math.cos((now + offset) * config.cosRatio) * (lissajousRadius) + canvas.width / 2;
        this.y = Math.sin((now + offset) * config.sinRatio) * (lissajousRadius) + canvas.height / 2;
        context.fillRect(
            this.x,
            this.y,
            10, 10);
    }

    this.updateSquare = ({
        x = this.x,
        y = this.y,
        color = this.color,
        cosRatio = this.cosRatio,
        sinRatio = this.sinRatio,
        offset = this.offset,
        lissajousRadius = this.lissajousRadius
    }) => {
        this.x = x;
        this.y = y;
        this.color = color;
        this.offset = offset;
        this.lissajousRadius = lissajousRadius;
        this.cosRatio = cosRatio;
        this.sinRatio = sinRatio;
        this.colorIncrementDecrement = colorIncrementDecrement;
    }
}

function getColorlissajous(now, r, g, b) {

}

function createSquares(size, canvas) {
    let newSquares = []
    for (let i = 0; i < size; i++) {
        const item = new square({
            x: canvas.width / 2,
            y: canvas.height / 2,
            color: 255 / (size) * i,
            sinRatio: config.sinRatio,
            cosRatio: config.cosRatio,
            lissajousRadius: config.distanceBetweenItems * i,
            offset: i*config.offsetSize/size
        });
        newSquares.push(item);
    }
    squares = newSquares;
}

function onLoad() {
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth - 16;
    canvas.height = window.innerHeight - 16;


    if (canvas.getContext) {
        context = canvas.getContext('2d');
        then = performance.now();
        animation = requestAnimationFrame(render);
        console.log(presets);
        createSquares(config.numOfItems, canvas);
        gui = new dat.GUI({
            load: presets
        });
        gui.remember(config)
        gui.add(config, "sinRatio")
        gui.add(config, "cosRatio")
        gui.add(config, "numOfItems", 0, 2000).onFinishChange((value) => createSquares(config.numOfItems, canvas));
        gui.add(config, "distanceBetweenItems", 0, 20).onFinishChange((value) => createSquares(config.numOfItems, canvas));
        gui.add(config, "offsetSize", 0, 3000).onFinishChange((value) => createSquares(config.numOfItems, canvas));

    }
}


function render(time) {
    let now = performance.now() * 0.001;
    let elapsed = now - then;
    then = now;
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    squares.forEach(square => square.render(now, canvas));
    requestAnimationFrame(render)
}
