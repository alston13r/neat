class Graphics {
    canvas;
    context;
    drawQueues = [];
    constructor(canvas) {
        this.canvas = canvas || document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }
    appendTo(ele) {
        ele.appendChild(this.canvas);
        return this;
    }
    appendToBody() {
        document.body.appendChild(this.canvas);
        return this;
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    get size() {
        return vec2.fromValues(this.width, this.height);
    }
    get fillStyle() {
        return this.context.fillStyle;
    }
    get strokeStyle() {
        return this.context.strokeStyle;
    }
    set fillStyle(fillStyle) {
        this.context.fillStyle = fillStyle;
    }
    set strokeStyle(strokeStyle) {
        this.context.strokeStyle = strokeStyle;
    }
    get lineWidth() {
        return this.context.lineWidth;
    }
    set lineWidth(lineWidth) {
        this.context.lineWidth = lineWidth;
    }
    get textAlign() {
        return this.context.textAlign;
    }
    get textBaseline() {
        return this.context.textBaseline;
    }
    set textAlign(textAlign) {
        this.context.textAlign = textAlign;
    }
    set textBaseline(textBaseline) {
        this.context.textBaseline = textBaseline;
    }
    get font() {
        return this.context.font;
    }
    set font(font) {
        this.context.font = font;
    }
    fill(a, b) {
        if (a instanceof Path2D)
            this.context.fill(a, b);
        else
            this.context.fill(a);
    }
    stroke(path) {
        this.context.stroke(path);
    }
    fillCircle(x, y, radius) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, TwoPi);
        this.context.fill();
    }
    strokeCircle(x, y, radius) {
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, TwoPi);
        this.context.stroke();
    }
    line(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
    fillRect(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }
    strokeRect(x, y, width, height) {
        this.context.strokeRect(x, y, width, height);
    }
    fillTriangle(x1, y1, x2, y2, x3, y3) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.lineTo(x3, y3);
        this.context.closePath();
        this.context.fill();
    }
    strokeTriangle(x1, y1, x2, y2, x3, y3) {
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.lineTo(x3, y3);
        this.context.closePath();
        this.context.stroke();
    }
    fillPolygon(points) {
        const nPoints = points.length;
        if (nPoints <= 2)
            return;
        const p1 = points[0];
        this.context.moveTo(p1[0], p1[1]);
        for (let i = 1; i < length; i++) {
            const p = points[i];
            this.context.lineTo(p[0], p[1]);
        }
        this.context.closePath();
        this.context.fill();
    }
    strokePolygon(points) {
        const nPoints = points.length;
        if (nPoints <= 2)
            return;
        const p1 = points[0];
        this.context.moveTo(p1[0], p1[1]);
        for (let i = 1; i < length; i++) {
            const p = points[i];
            this.context.lineTo(p[0], p[1]);
        }
        this.context.closePath();
        this.context.stroke();
    }
    fillText(text, x, y) {
        this.context.fillText(text, x, y);
    }
    strokeText(text, x, y) {
        this.context.strokeText(text, x, y);
    }
    bg(color = '#000') {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    clearRect(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
    }
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    initDrawQueue(color = '#fff', filling = false, stroking = true, lineWidth = 1) {
        let queue = new DrawQueue(this, color, filling, stroking, lineWidth);
        this.drawQueues.push(queue);
        return queue;
    }
    record(time, name = 'video', framerate = 0) {
        const chunks = [];
        const stream = this.canvas.captureStream(framerate);
        const rec = new MediaRecorder(stream);
        rec.ondataavailable = e => void chunks.push(e.data);
        rec.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const vid = document.createElement('video');
            vid.src = URL.createObjectURL(blob);
            vid.style.display = 'none';
            document.body.appendChild(vid);
            const a = document.createElement('a');
            a.download = name + '.webm';
            a.href = vid.src;
            document.body.appendChild(a);
            a.click();
            a.remove();
        };
        rec.start();
        setTimeout(() => rec.stop(), time);
    }
}
//# sourceMappingURL=Graphics.js.map