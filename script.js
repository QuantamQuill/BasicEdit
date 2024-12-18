const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let originalImage = null;

// Load image onto the canvas
function loadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.onload = function() {
                originalImage = image;
                drawImage();
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Draw image on canvas
function drawImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// Apply Grayscale effect
function applyGrayscale() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        let gray = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
    }

    ctx.putImageData(imgData, 0, 0);
}

// Apply Sepia effect
function applySepia() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = Math.min(255, (r * .393) + (g * .769) + (b * .189));     // Red
        data[i + 1] = Math.min(255, (r * .349) + (g * .686) + (b * .168)); // Green
        data[i + 2] = Math.min(255, (r * .272) + (g * .534) + (b * .131)); // Blue
    }

    ctx.putImageData(imgData, 0, 0);
}

// Apply Brightness adjustment
function applyBrightness(factor) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * factor);     // Red
        data[i + 1] = Math.min(255, data[i + 1] * factor); // Green
        data[i + 2] = Math.min(255, data[i + 2] * factor); // Blue
    }

    ctx.putImageData(imgData, 0, 0);
}

// Apply Contrast adjustment
function applyContrast(factor) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] - 128) * factor + 128;     // Red
        data[i + 1] = (data[i + 1] - 128) * factor + 128; // Green
        data[i + 2] = (data[i + 2] - 128) * factor + 128; // Blue
    }

    ctx.putImageData(imgData, 0, 0);
}

// Apply Blur effect
function applyBlur() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.filter = "blur(5px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";
}

// Apply Pixelate effect
function applyPixelate() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    const pixelSize = 10;
    for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index], g = data[index + 1], b = data[index + 2];
            for (let i = 0; i < pixelSize; i++) {
                for (let j = 0; j < pixelSize; j++) {
                    const idx = ((y + i) * canvas.width + (x + j)) * 4;
                    data[idx] = r;
                    data[idx + 1] = g;
                    data[idx + 2] = b;
                }
            }
        }
    }

    ctx.putImageData(imgData, 0, 0);
}

// Apply Invert colors
function applyInvert() {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
    }

    ctx.putImageData(imgData, 0, 0);
}

// Add noise effect
function applyNoise() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 50 - 25;
        data[i] += noise;     // Red
        data[i + 1] += noise; // Green
        data[i + 2] += noise; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

// Add Text to image
function addText() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Quantum Quill", 50, 50);
}

// Reset image to original
function resetImage() {
    if (originalImage) {
        image = new Image();
        image.onload = function() {
            drawImage();
        };
        image.src = originalImage.src;
    }
}

// Download the edited image
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
}