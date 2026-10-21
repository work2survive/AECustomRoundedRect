/**
 * Custom Rounded Rectangle - Standalone After Effects Expressions
 * 
 * Paste this expression directly into the "Path" property of any Shape Layer
 * (Contents > Shape 1 > Path 1 > Path).
 * 
 * Supports Adobe After Effects CC 2018 (v15.1) through AE 2026+.
 * Works in both "Modern JavaScript" and "Legacy ExtendScript" expression engines.
 */

// ============================================================================
// OPTION A: Driven by Effect Controls (Sliders & Checkboxes on the Layer)
// Add the following controls to your Shape Layer:
//   - "Width" (Slider Control)
//   - "Height" (Slider Control)
//   - "Link All Corners" (Checkbox Control)
//   - "Radius All" (Slider Control)
//   - "Radius Top-Left" (Slider Control)
//   - "Radius Top-Right" (Slider Control)
//   - "Radius Bottom-Right" (Slider Control)
//   - "Radius Bottom-Left" (Slider Control)
//   - "Prevent Overlap" (Checkbox Control)
// ============================================================================

(function () {
    // Safe property getter with fallback to handle missing or renamed effects
    function getVal(name, fallback) {
        try {
            return effect(name)(1).value;
        } catch (e) {
            return fallback;
        }
    }

    // 1. Dimensions
    var w = Math.max(0, getVal("Width", 500));
    var h = Math.max(0, getVal("Height", 300));

    // 2. Corner Radii
    var linkAll = getVal("Link All Corners", 0);
    var masterR = Math.max(0, getVal("Radius All", 50));

    var rTL = linkAll ? masterR : Math.max(0, getVal("Radius Top-Left", 50));
    var rTR = linkAll ? masterR : Math.max(0, getVal("Radius Top-Right", 50));
    var rBR = linkAll ? masterR : Math.max(0, getVal("Radius Bottom-Right", 50));
    var rBL = linkAll ? masterR : Math.max(0, getVal("Radius Bottom-Left", 50));

    // 3. Proportional Overlap Prevention (W3C CSS Backgrounds & Borders Level 3)
    var preventOverlap = getVal("Prevent Overlap", 1);
    if (preventOverlap > 0) {
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
    }

    // 4. Cubic Bezier Circle Constant
    // K = 4/3 * (sqrt(2) - 1) approx 0.5522847498307936
    var K = 0.5522847498307936;
    var halfW = w / 2;
    var halfH = h / 2;
    var xMin = -halfW;
    var xMax =  halfW;
    var yMin = -halfH;
    var yMax =  halfH;

    // 5. Compute 8 Vertices (Clockwise starting from top edge)
    var points = [
        [xMin + rTL, yMin],        // P0: Top edge, TL curve end
        [xMax - rTR, yMin],        // P1: Top edge, TR curve start
        [xMax, yMin + rTR],        // P2: Right edge, TR curve end
        [xMax, yMax - rBR],        // P3: Right edge, BR curve start
        [xMax - rBR, yMax],        // P4: Bottom edge, BR curve end
        [xMin + rBL, yMax],        // P5: Bottom edge, BL curve start
        [xMin, yMax - rBL],        // P6: Left edge, BL curve end
        [xMin, yMin + rTL]         // P7: Left edge, TL curve start
    ];

    // 6. In-Tangents (Vector from vertex to incoming control handle)
    var inTangents = [
        [-rTL * K, 0],             // P0 receives TL arc
        [0, 0],                    // P1 straight edge
        [0, -rTR * K],             // P2 receives TR arc
        [0, 0],                    // P3 straight edge
        [rBR * K, 0],              // P4 receives BR arc
        [0, 0],                    // P5 straight edge
        [0, rBL * K],              // P6 receives BL arc
        [0, 0]                     // P7 straight edge
    ];

    // 7. Out-Tangents (Vector from vertex to outgoing control handle)
    var outTangents = [
        [0, 0],                    // P0 straight edge
        [rTR * K, 0],              // P1 starts TR arc
        [0, 0],                    // P2 straight edge
        [0, rBR * K],              // P3 starts BR arc
        [0, 0],                    // P4 straight edge
        [-rBL * K, 0],             // P5 starts BL arc
        [0, 0],                    // P6 straight edge
        [0, -rTL * K]              // P7 starts TL arc
    ];

    return createPath(points, inTangents, outTangents, true);
})();


// ============================================================================
// OPTION B: Pure Hardcoded Expression (No Effect Controls required)
// Perfect for responsive text boxes (using sourceRectAtTime) or quick scripts.
// ============================================================================
/*
(function() {
    var w = 600;
    var h = 350;
    var rTL = 40;
    var rTR = 40;
    var rBR = 0;
    var rBL = 0;
    var preventOverlap = true;

    if (preventOverlap) {
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
    }

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
        [0, rBL * K],
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
*/
