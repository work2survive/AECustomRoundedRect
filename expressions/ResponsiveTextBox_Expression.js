/**
 * Responsive Text Box with Custom Rounded Corners
 * 
 * Automatically sizes the rounded rectangle around a Text Layer using sourceRectAtTime(),
 * with individual corner radii and proportional anti-overlap protection.
 * 
 * Instructions:
 * 1. Place this Shape Layer directly below your Text Layer.
 * 2. Paste this expression into Contents > Shape 1 > Path 1 > Path.
 * 3. (Optional) Paste the Position expression (at bottom of this file) into the Shape Layer's Transform > Position
 *    to keep the box automatically centered on the text.
 */

// ============================================================================
// PATH EXPRESSION
// ============================================================================
(function() {
    // 1. Target Text Layer (defaults to layer immediately above, or change to layer name)
    var textLayer = thisComp.layer(index - 1);

    // Padding (Extra space around text)
    var padX = 40; // Horizontal padding in pixels
    var padY = 24; // Vertical padding in pixels

    // 2. Measure text bounds
    var bounds = textLayer.sourceRectAtTime(time, false);
    var w = Math.max(0, bounds.width + padX * 2);
    var h = Math.max(0, bounds.height + padY * 2);

    // 3. Define Corner Radii (customize each corner here or link to sliders)
    // E.g. Chat bubble with sharp bottom-left corner:
    var rTL = 24;
    var rTR = 24;
    var rBR = 24;
    var rBL = 4; // Sharp tail corner

    // 4. Overlap Prevention (Proportional CSS standard)
    var topSum    = rTL + rTR;
    var bottomSum = rBL + rBR;
    var leftSum   = rTL + rBL;
    var rightSum  = rTR + rBR;

    var f = 1.0;
    if (topSum > w && topSum > 0)       f = Math.min(f, w / topSum);
    if (bottomSum > w && bottomSum > 0) f = Math.min(f, w / bottomSum);
    if (leftSum > h && leftSum > 0)     f = Math.min(f, h / leftSum);
    if (rightSum > h && rightSum > 0)   f = Math.min(f, h / rightSum);

    rTL *= f;
    rTR *= f;
    rBR *= f;
    rBL *= f;

    // 5. Bezier Geometry
    var K = 0.5522847498307936;
    var halfW = w / 2;
    var halfH = h / 2;
    var xMin = -halfW;
    var xMax =  halfW;
    var yMin = -halfH;
    var yMax =  halfH;

    var points = [
        [xMin + rTL, yMin],
        [xMax - rTR, yMin],
        [xMax, yMin + rTR],
        [xMax, yMax - rBR],
        [xMax - rBR, yMax],
        [xMin + rBL, yMax],
        [xMin, yMax - rBL],
        [xMin, yMin + rTL]
    ];

    var inTangents = [
        [-rTL * K, 0],
        [0, 0],
        [0, -rTR * K],
        [0, 0],
        [rBR * K, 0],
        [0, 0],
        [rBL * K, 0],
        [0, 0]
    ];

    var outTangents = [
        [0, 0],
        [rTR * K, 0],
        [0, 0],
        [0, rBR * K],
        [0, 0],
        [-rBL * K, 0],
        [0, 0],
        [0, -rTL * K]
    ];

    return createPath(points, inTangents, outTangents, true);
})();

// ============================================================================
// (OPTIONAL) POSITION EXPRESSION FOR SHAPE LAYER (Transform > Position)
// Keeps the box locked to the center of the text layer even if text changes!
// ============================================================================
/*
(function() {
    var textLayer = thisComp.layer(index - 1);
    var bounds = textLayer.sourceRectAtTime(time, false);
    var centerInText = [bounds.left + bounds.width / 2, bounds.top + bounds.height / 2];
    textLayer.toComp(centerInText);
})();
*/
