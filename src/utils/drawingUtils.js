export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
    } : null;
};

export const floodFill = (ctx, x, y, fillColor) => {
    // Get image data
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Convert hex color to rgba
    const fillRgb = hexToRgb(fillColor);

    // Get target color at starting position
    const startPos = (y * w + x) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    const startA = data[startPos + 3];

    // If color is already same, return
    if (startR === fillRgb.r && startG === fillRgb.g && startB === fillRgb.b && startA === fillRgb.a) {
        return;
    }

    const matchStartColor = (pos) => {
        return data[pos] === startR &&
            data[pos + 1] === startG &&
            data[pos + 2] === startB &&
            data[pos + 3] === startA;
    };

    const colorPixel = (pos) => {
        data[pos] = fillRgb.r;
        data[pos + 1] = fillRgb.g;
        data[pos + 2] = fillRgb.b;
        data[pos + 3] = fillRgb.a;
    };

    // Queue-based flood fill (Forest Fire algorithm)
    const queue = [[x, y]];

    while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        const pos = (cy * w + cx) * 4;

        if (cx < 0 || cx >= w || cy < 0 || cy >= h || !matchStartColor(pos)) {
            continue;
        }

        colorPixel(pos);

        queue.push([cx + 1, cy]);
        queue.push([cx - 1, cy]);
        queue.push([cx, cy + 1]);
        queue.push([cx, cy - 1]);
    }

    ctx.putImageData(imgData, 0, 0);
};

// Advanced: Flood fill that respects a separate "Boundary" layer (Top Layer)
export const smartFloodFill = (colorCtx, lineCtx, startX, startY, fillColor) => {
    const w = colorCtx.canvas.width;
    const h = colorCtx.canvas.height;

    const colorImgData = colorCtx.getImageData(0, 0, w, h);
    const colorData = colorImgData.data;

    const lineImgData = lineCtx.getImageData(0, 0, w, h);
    const lineData = lineImgData.data;

    const fill = hexToRgb(fillColor);

    // Get clicked color on Color Layer
    const startIdx = (startY * w + startX) * 4;
    const sr = colorData[startIdx];
    const sg = colorData[startIdx + 1];
    const sb = colorData[startIdx + 2];
    const sa = colorData[startIdx + 3];

    // If clicking on same color, exit
    if (sr === fill.r && sg === fill.g && sb === fill.b && sa === 255) return;

    // Helper to check if pixel is a "Line" boundary (Dark pixels on Line Layer)
    const isBoundary = (idx) => {
        // Assuming lines are black/dark. Check if alpha > 0 and brightness < threshold
        const r = lineData[idx];
        const g = lineData[idx + 1];
        const b = lineData[idx + 2];
        const a = lineData[idx + 3];

        // If it's visible and dark, it's a boundary
        return a > 50 && (r + g + b) < 300;
    };

    const pixelStack = [[startX, startY]];

    while (pixelStack.length) {
        const newPos = pixelStack.pop();
        const x = newPos[0];
        let y = newPos[1];

        let pixelPos = (y * w + x) * 4;

        // Move up as long as it's within canvas and matches start color and NOT a boundary
        while (y-- >= 0 &&
            (colorData[pixelPos] === sr && colorData[pixelPos + 1] === sg && colorData[pixelPos + 2] === sb && colorData[pixelPos + 3] === sa) &&
            !isBoundary(pixelPos)) {
            pixelPos -= w * 4;
        }

        pixelPos += w * 4;
        ++y;

        let reachLeft = false;
        let reachRight = false;

        while (y++ < h - 1 &&
            (colorData[pixelPos] === sr && colorData[pixelPos + 1] === sg && colorData[pixelPos + 2] === sb && colorData[pixelPos + 3] === sa) &&
            !isBoundary(pixelPos)) {

            // Paint pixel
            colorData[pixelPos] = fill.r;
            colorData[pixelPos + 1] = fill.g;
            colorData[pixelPos + 2] = fill.b;
            colorData[pixelPos + 3] = 255; // Full alpha

            if (x > 0) {
                const leftPos = pixelPos - 4;
                const matchLeft = (colorData[leftPos] === sr && colorData[leftPos + 1] === sg && colorData[leftPos + 2] === sb && colorData[leftPos + 3] === sa) && !isBoundary(leftPos);

                if (matchLeft) {
                    if (!reachLeft) {
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < w - 1) {
                const rightPos = pixelPos + 4;
                const matchRight = (colorData[rightPos] === sr && colorData[rightPos + 1] === sg && colorData[rightPos + 2] === sb && colorData[rightPos + 3] === sa) && !isBoundary(rightPos);

                if (matchRight) {
                    if (!reachRight) {
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }

            pixelPos += w * 4;
        }
    }

    colorCtx.putImageData(colorImgData, 0, 0);
};
