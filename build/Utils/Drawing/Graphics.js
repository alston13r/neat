const graphics = {
    createCanvas() {
        return document.createElement('canvas');
    },
    setSize(canvas, size) {
        canvas.width = size[0];
        canvas.height = size[1];
        return canvas;
    },
    getSize(canvas) {
        return vec2.fromValues(canvas.width, canvas.height);
    },
    line(context, pos1, pos2) {
        context.beginPath();
        context.moveTo(pos1[0], pos1[1]);
        context.lineTo(pos2[0], pos2[1]);
        context.stroke();
    },
    strokeCircle(context, pos, radius) {
        context.beginPath();
        context.ellipse(pos[0], pos[1], radius, radius, 0, 0, TwoPi);
        context.stroke();
    },
    fillCircle(context, pos, radius) {
        context.beginPath();
        context.ellipse(pos[0], pos[1], radius, radius, 0, 0, TwoPi);
        context.fill();
    },
    strokeRect(context, pos, size) {
        context.strokeRect(pos[0], pos[1], size[0], size[1]);
    },
    fillRect(context, pos, size) {
        context.fillRect(pos[0], pos[1], size[0], size[1]);
    },
    strokeTriangle(context, pos1, pos2, pos3) {
        context.beginPath();
        context.moveTo(pos1[0], pos1[1]);
        context.lineTo(pos2[0], pos2[1]);
        context.lineTo(pos3[0], pos3[1]);
        context.closePath();
        context.stroke();
    },
    fillTriangle(context, pos1, pos2, pos3) {
        context.beginPath();
        context.moveTo(pos1[0], pos1[1]);
        context.lineTo(pos2[0], pos2[1]);
        context.lineTo(pos3[0], pos3[1]);
        context.closePath();
        context.fill();
    },
    strokePolygon(context, points, nPoints) {
        if (nPoints <= 1)
            return;
        if (nPoints == 2) {
            graphics.line(context, points[0], points[1]);
        }
        else {
            context.beginPath();
            for (let i = 0; i < nPoints; i++) {
                const point = points[i];
                if (i == 0)
                    context.moveTo(point[0], point[1]);
                else
                    context.lineTo(point[0], point[1]);
            }
            context.closePath();
            context.stroke();
        }
    },
    fillPolygon(context, points, nPoints) {
        if (nPoints <= 1)
            return;
        if (nPoints == 2) {
            graphics.line(context, points[0], points[1]);
        }
        else {
            context.beginPath();
            for (let i = 0; i < nPoints; i++) {
                const point = points[i];
                if (i == 0)
                    context.moveTo(point[0], point[1]);
                else
                    context.lineTo(point[0], point[1]);
            }
            context.closePath();
            context.fill();
        }
    },
    strokeText(context, text, pos) {
        context.strokeText(text, pos[0], pos[1]);
    },
    fillText(context, text, pos) {
        context.fillText(text, pos[0], pos[1]);
    },
    clearRect(context, pos, size) {
        context.clearRect(pos[0], pos[1], size[0], size[1]);
    }
};
class Graphics {
    canvas;
    ctx;
    constructor(canvas) {
        this.canvas = canvas || graphics.createCanvas();
        this.ctx = this.canvas.getContext('2d');
    }
    setSize(width, height) {
        graphics.setSize(this.canvas, vec2.fromValues(width, height));
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
        return graphics.getSize(this.canvas);
    }
    createCircle(x, y, radius = 10, options) {
        return new Circle(this, x, y, radius, options);
    }
    createLine(x1, y1, x2, y2, options) {
        return new Line(this, x1, y1, x2, y2, options);
    }
    createRectangle(x, y, width, height, options) {
        return new Rectangle(this, x, y, width, height, options);
    }
    createTriangle(x1, y1, x2, y2, x3, y3, options) {
        return new TriangleGraphics(this, x1, y1, x2, y2, x3, y3, options);
    }
    createPolygon(points, options) {
        return new Polygon(this, points, options);
    }
    createText(text, x, y, options) {
        return new TextGraphics(this, text, x, y, options);
    }
    bg(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=Graphics.js.map