export default class Canvas {
    constructor (elem) {
        this.styles = {
            defaultFillColor: "#333333",
            defaultStrokeColor: "#BBBBBB",
            defaultLineWidth: 2
        };
        
        this.cont = elem.getContext('2d');
        
        this.cont.textBaseline = "top";
        
        this.width = elem.width = elem.offsetWidth;
        this.height = elem.height = elem.offsetHeight;
        
        window.addEventListener("resize", () => {
            this.width = elem.width = elem.offsetWidth;
            this.height = elem.height = elem.offsetHeight;
        });
    }
    
    drawRect(x, y, width, height, option = {}) {
        if (option.fillColor)
            this.cont.fillStyle = option.fillColor;
        else
            this.cont.fillStyle = this.styles.defaultFillColor;
        
        if (option.strokeColor)
            this.cont.strokeStyle = option.strokeColor;
        else
            this.cont.strokeStyle = this.styles.defaultStrokeColor;
            
        if (option.lineWidth)
            this.cont.lineWidth = option.lineWidth;
        else
            this.cont.lineWidth = this.styles.defaultLineWidth;
        
        if (option.mode == "stroke")
            this.cont.strokeRect(x, y, width, height);
        else
            this.cont.fillRect(x, y, width, height);
    }
    
    drawCircle(x, y, radius, option = {}) {
        if (option.fillColor)
            this.cont.fillStyle = option.fillColor;
        else
            this.cont.fillStyle = this.styles.defaultFillColor;
        
        if (option.strokeColor)
            this.cont.strokeStyle = option.strokeColor;
        else
            this.cont.strokeStyle = this.styles.defaultStrokeColor;
            
        if (option.lineWidth)
            this.cont.lineWidth = option.lineWidth;
        else
            this.cont.lineWidth = this.styles.defaultLineWidth;
        
        this.cont.beginPath();
		this.cont.arc(x + radius, y + radius, radius, 0, 2 * Math.PI, false);
        
        if (option.mode == "stroke")
            this.cont.stroke();
        else
            this.cont.fill();
        
		this.cont.closePath();
    }
    
    drawImage(src, x, y, width, height, dx, dy, dwidth, dheight) {
        let img = new Image();
        img.onload = () => {
            this.cont.drawImage(img, x, y, width, height, dx, dy, dwidth, dheight);
        };
        
        img.src = src;
    }
    
    drawText(text, x, y, {
        fillColor = this.style.defaultFillColor,
        textAlign = "left",
        textBaseline = "alphabetic",
        ...option
    } = {}) {
        this.cont.fillStyle = fillColor;
        this.cont.textAlign = textAlign;
        this.cont.textBaseline = textBaseline;
        
        if (option.fontFamily && option.fontSize)
            this.cont.font = option.fontSize + "px " + option.fontFamily;
        else if (option.fontFamily)
            this.cont.font = this.cont.font.split(" ")[0] + option.fontFamily;
        else if (option.fontSize)
            this.cont.font = option.fontSize + "px " + this.cont.font.split(" ")[1];
        else
            this.cont.font = "";
        
        
        this.cont.fillText(text, x, y);
    }
    
    
    drawLine(x, y, x2, y2, {
        lineWidth = 3,
        strokeColor = "#333"
    } = {}) {
        if (strokeColor)
            this.cont.strokeStyle = strokeColor;
        else
            this.cont.strokeStyle = this.styles.defaultStrokeColor;
        
        if (lineWidth)
            this.cont.lineWidth = lineWidth;
        else
            this.cont.lineWidth = this.styles.defaultLineWidth;
        
        this.cont.beginPath();
        this.cont.moveTo(x, y);
        this.cont.lineTo(x2, y2);
        this.cont.closePath();
        this.cont.stroke();
    }
    
    clearAll() {
        this.cont.clearRect(0, 0, this.width, this.height);
    }
    
    getTextWidth (txt) {
        return this.cont.measureText(txt).width;
    }
}