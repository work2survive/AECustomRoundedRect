/**
 * Custom Rounded Rectangle - ExtendScript Host Script for CEP Extension
 * 
 * Version: 1.0.0
 * Target: Adobe After Effects (AECT)
 */

var CustomRoundedRectHost = (function () {
    "use strict";

    function getShapeExpression() {
        return [
            "// Custom Rounded Rectangle Expression (W3C CSS Proportional Overlap)",
            "(function() {",
            "    function getVal(name, fallback) {",
            "        try {",
            "            return effect(name)(1).value;",
            "        } catch(e) {",
            "            return fallback;",
            "        }",
            "    }",
            "",
            "    var w = Math.max(0, getVal('Width', 500));",
            "    var h = Math.max(0, getVal('Height', 300));",
            "    var linkAll = getVal('Link All Corners', 0);",
            "    var masterR = Math.max(0, getVal('Radius All', 50));",
            "",
            "    var rTL = linkAll ? masterR : Math.max(0, getVal('Radius Top-Left', 50));",
            "    var rTR = linkAll ? masterR : Math.max(0, getVal('Radius Top-Right', 50));",
            "    var rBR = linkAll ? masterR : Math.max(0, getVal('Radius Bottom-Right', 50));",
            "    var rBL = linkAll ? masterR : Math.max(0, getVal('Radius Bottom-Left', 50));",
            "",
            "    var preventOverlap = getVal('Prevent Overlap', 1);",
            "",
            "    // Proportional scaling (W3C CSS Backgrounds & Borders Level 3, §5.5)",
            "    if (preventOverlap > 0) {",
            "        var topSum    = rTL + rTR;",
            "        var bottomSum = rBL + rBR;",
            "        var leftSum   = rTL + rBL;",
            "        var rightSum  = rTR + rBR;",
            "",
            "        var f = 1.0;",
            "        if (topSum > w && topSum > 0)       f = Math.min(f, w / topSum);",
            "        if (bottomSum > w && bottomSum > 0) f = Math.min(f, w / bottomSum);",
            "        if (leftSum > h && leftSum > 0)     f = Math.min(f, h / leftSum);",
            "        if (rightSum > h && rightSum > 0)   f = Math.min(f, h / rightSum);",
            "",
            "        rTL *= f;",
            "        rTR *= f;",
            "        rBR *= f;",
            "        rBL *= f;",
            "    }",
            "",
            "    var K = 0.5522847498307936;",
            "    var halfW = w / 2;",
            "    var halfH = h / 2;",
            "    var xMin = -halfW;",
            "    var xMax =  halfW;",
            "    var yMin = -halfH;",
            "    var yMax =  halfH;",
            "",
            "    var points = [",
            "        [xMin + rTL, yMin],",
            "        [xMax - rTR, yMin],",
            "        [xMax, yMin + rTR],",
            "        [xMax, yMax - rBR],",
            "        [xMax - rBR, yMax],",
            "        [xMin + rBL, yMax],",
            "        [xMin, yMax - rBL],",
            "        [xMin, yMin + rTL]",
            "    ];",
            "",
            "    var inTangents = [",
            "        [-rTL * K, 0],",
            "        [0, 0],",
            "        [0, -rTR * K],",
            "        [0, 0],",
            "        [rBR * K, 0],",
            "        [0, 0],",
            "        [0, rBL * K],",
            "        [0, 0]",
            "    ];",
            "",
            "    var outTangents = [",
            "        [0, 0],",
            "        [rTR * K, 0],",
            "        [0, 0],",
            "        [0, rBR * K],",
            "        [0, 0],",
            "        [-rBL * K, 0],",
            "        [0, 0],",
            "        [0, -rTL * K]",
            "    ];",
            "",
            "    return createPath(points, inTangents, outTangents, true);",
            "})();"
        ].join("\n");
    }

    function computeShapeData(w, h, rTL, rTR, rBR, rBL, preventOverlap) {
        w = Math.max(0, w);
        h = Math.max(0, h);
        rTL = Math.max(0, rTL);
        rTR = Math.max(0, rTR);
        rBR = Math.max(0, rBR);
        rBL = Math.max(0, rBL);

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

        return {
            points: [
                [xMin + rTL, yMin],
                [xMax - rTR, yMin],
                [xMax, yMin + rTR],
                [xMax, yMax - rBR],
                [xMax - rBR, yMax],
                [xMin + rBL, yMax],
                [xMin, yMax - rBL],
                [xMin, yMin + rTL]
            ],
            inTangents: [
                [-rTL * K, 0],
                [0, 0],
                [0, -rTR * K],
                [0, 0],
                [rBR * K, 0],
                [0, 0],
                [0, rBL * K],
                [0, 0]
            ],
            outTangents: [
                [0, 0],
                [rTR * K, 0],
                [0, 0],
                [0, rBR * K],
                [0, 0],
                [-rBL * K, 0],
                [0, 0],
                [0, -rTL * K]
            ]
        };
    }

    function getOrCreateControl(fxGroup, matchName, displayName, defaultValue) {
        var existing = null;
        for (var i = 1; i <= fxGroup.numProperties; i++) {
            if (fxGroup.property(i).name === displayName) {
                existing = fxGroup.property(i);
                break;
            }
        }
        if (!existing) {
            existing = fxGroup.addProperty(matchName);
            existing.name = displayName;
        }
        if (defaultValue !== undefined && defaultValue !== null) {
            existing.property(1).setValue(defaultValue);
        }
        return existing;
    }

    function parseJSON(str) {
        try {
            return eval("(" + str + ")");
        } catch (e) {
            return {};
        }
    }

    return {
        checkActiveComp: function () {
            var comp = app.project ? app.project.activeItem : null;
            return (comp && comp instanceof CompItem) ? "OK" : "NO_COMP";
        },

        createLayer: function (configStr) {
            var comp = app.project ? app.project.activeItem : null;
            if (!comp || !(comp instanceof CompItem)) {
                return JSON.stringify({ success: false, error: "Please open an active composition." });
            }

            var cfg = parseJSON(configStr);
            var w = cfg.width || 500;
            var h = cfg.height || 300;
            var linkAll = cfg.linkAll ? 1 : 0;
            var masterR = cfg.radiusAll || 50;
            var rTL = cfg.radiusTL !== undefined ? cfg.radiusTL : 50;
            var rTR = cfg.radiusTR !== undefined ? cfg.radiusTR : 50;
            var rBR = cfg.radiusBR !== undefined ? cfg.radiusBR : 50;
            var rBL = cfg.radiusBL !== undefined ? cfg.radiusBL : 50;
            var preventOverlap = cfg.preventOverlap !== false;

            app.beginUndoGroup("Create Custom Rounded Rectangle");
            try {
                var layer = comp.layers.addShape();
                layer.name = "Custom Rounded Rectangle";

                var fxGroup = layer.property("ADBE Effect Parade") || layer.property("Effects");
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Width",                w);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Height",               h);
                getOrCreateControl(fxGroup, "ADBE Checkbox Control", "Link All Corners",     linkAll);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius All",           masterR);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Top-Left",      rTL);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Top-Right",     rTR);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Bottom-Right",  rBR);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Bottom-Left",   rBL);
                getOrCreateControl(fxGroup, "ADBE Checkbox Control", "Prevent Overlap",      preventOverlap ? 1 : 0);

                var contents = layer.property("ADBE Root Vectors Group") || layer.property("Contents");
                var shapeGroup = contents.addProperty("ADBE Vector Group");
                shapeGroup.name = "Rounded Rectangle";

                var groupContents = shapeGroup.property("ADBE Vectors Group") || shapeGroup.property("Contents");
                var pathGroup = groupContents.addProperty("ADBE Vector Shape - Group");
                pathGroup.name = "Path";
                var pathProp = pathGroup.property("ADBE Vector Shape") || pathGroup.property("Path");

                // Initialize static geometry
                var curTL = linkAll ? masterR : rTL;
                var curTR = linkAll ? masterR : rTR;
                var curBR = linkAll ? masterR : rBR;
                var curBL = linkAll ? masterR : rBL;
                var shapeData = computeShapeData(w, h, curTL, curTR, curBR, curBL, preventOverlap);

                var shapeObj = new Shape();
                shapeObj.vertices = shapeData.points;
                shapeObj.inTangents = shapeData.inTangents;
                shapeObj.outTangents = shapeData.outTangents;
                shapeObj.closed = true;

                try { pathProp.setValue(shapeObj); } catch(e) {}
                pathProp.expression = getShapeExpression();

                if (cfg.addFill !== false) {
                    var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
                    fill.name = "Fill";
                    var fillCol = fill.property("ADBE Vector Fill Color") || fill.property("Color");
                    if (fillCol) {
                        fillCol.setValue(cfg.fillColor || [0.22, 0.58, 0.98, 1.0]);
                    }
                }

                if (cfg.addStroke) {
                    var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
                    stroke.name = "Stroke";
                    var strokeCol = stroke.property("ADBE Vector Stroke Color") || stroke.property("Color");
                    if (strokeCol) strokeCol.setValue([1.0, 1.0, 1.0, 1.0]);
                    var strokeWidth = stroke.property("ADBE Vector Stroke Width") || stroke.property("Stroke Width");
                    if (strokeWidth) strokeWidth.setValue(cfg.strokeWidth || 4);
                }

                return JSON.stringify({ success: true, layerName: layer.name });
            } catch (err) {
                return JSON.stringify({ success: false, error: err.toString() });
            } finally {
                app.endUndoGroup();
            }
        },

        applyToSelected: function (configStr) {
            var comp = app.project ? app.project.activeItem : null;
            if (!comp || !(comp instanceof CompItem)) {
                return JSON.stringify({ success: false, error: "Please open an active composition." });
            }
            if (!comp.selectedLayers || comp.selectedLayers.length === 0) {
                return JSON.stringify({ success: false, error: "Please select an existing Shape Layer." });
            }
            var layer = comp.selectedLayers[0];
            if (!(layer instanceof ShapeLayer)) {
                return JSON.stringify({ success: false, error: "Selected layer is not a Shape Layer." });
            }

            var cfg = parseJSON(configStr);
            var w = cfg.width || 500;
            var h = cfg.height || 300;
            var linkAll = cfg.linkAll ? 1 : 0;
            var masterR = cfg.radiusAll || 50;
            var rTL = cfg.radiusTL !== undefined ? cfg.radiusTL : 50;
            var rTR = cfg.radiusTR !== undefined ? cfg.radiusTR : 50;
            var rBR = cfg.radiusBR !== undefined ? cfg.radiusBR : 50;
            var rBL = cfg.radiusBL !== undefined ? cfg.radiusBL : 50;
            var preventOverlap = cfg.preventOverlap !== false;

            app.beginUndoGroup("Apply Custom Rounded Rectangle");
            try {
                var fxGroup = layer.property("ADBE Effect Parade") || layer.property("Effects");
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Width",                w);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Height",               h);
                getOrCreateControl(fxGroup, "ADBE Checkbox Control", "Link All Corners",     linkAll);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius All",           masterR);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Top-Left",      rTL);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Top-Right",     rTR);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Bottom-Right",  rBR);
                getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Bottom-Left",   rBL);
                getOrCreateControl(fxGroup, "ADBE Checkbox Control", "Prevent Overlap",      preventOverlap ? 1 : 0);

                var contents = layer.property("ADBE Root Vectors Group") || layer.property("Contents");
                var shapeGroup = contents.addProperty("ADBE Vector Group");
                shapeGroup.name = "Rounded Rectangle";

                var groupContents = shapeGroup.property("ADBE Vectors Group") || shapeGroup.property("Contents");
                var pathGroup = groupContents.addProperty("ADBE Vector Shape - Group");
                pathGroup.name = "Path";
                var pathProp = pathGroup.property("ADBE Vector Shape") || pathGroup.property("Path");

                var curTL = linkAll ? masterR : rTL;
                var curTR = linkAll ? masterR : rTR;
                var curBR = linkAll ? masterR : rBR;
                var curBL = linkAll ? masterR : rBL;
                var shapeData = computeShapeData(w, h, curTL, curTR, curBR, curBL, preventOverlap);

                var shapeObj = new Shape();
                shapeObj.vertices = shapeData.points;
                shapeObj.inTangents = shapeData.inTangents;
                shapeObj.outTangents = shapeData.outTangents;
                shapeObj.closed = true;

                try { pathProp.setValue(shapeObj); } catch(e) {}
                pathProp.expression = getShapeExpression();

                if (cfg.addFill !== false) {
                    var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
                    fill.name = "Fill";
                    var fillCol = fill.property("ADBE Vector Fill Color") || fill.property("Color");
                    if (fillCol) fillCol.setValue(cfg.fillColor || [0.22, 0.58, 0.98, 1.0]);
                }

                return JSON.stringify({ success: true, layerName: layer.name });
            } catch (err) {
                return JSON.stringify({ success: false, error: err.toString() });
            } finally {
                app.endUndoGroup();
            }
        },

        getExpression: function () {
            return getShapeExpression();
        }
    };
})();
