/**
 * Custom Rounded Rectangle - After Effects ScriptUI Panel & Shape Generator
 * 
 * Version: 1.0.0
 * Compatibility: Adobe After Effects CC 2018 (v15.1) and newer
 * OS: Windows & macOS
 * 
 * Description:
 * Creates parametric vector shape rectangles with individually customizable
 * corner radii (Top-Left, Top-Right, Bottom-Right, Bottom-Left).
 * Features mathematical proportional scaling to prevent overlapping corner curves
 * when radii exceed width or height (adhering to W3C CSS border-radius standard).
 * 
 * Can be installed in:
 * - Windows: C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\
 * - macOS:   /Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/
 * 
 * Or run via File > Scripts > Run Script File...
 */

(function (thisObj) {
    "use strict";

    // =========================================================================
    // Core Expression String
    // =========================================================================
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
            "    // Bezier circle constant K = 4/3 * (sqrt(2) - 1)",
            "    var K = 0.5522847498307936;",
            "    var halfW = w / 2;",
            "    var halfH = h / 2;",
            "    var xMin = -halfW;",
            "    var xMax =  halfW;",
            "    var yMin = -halfH;",
            "    var yMax =  halfH;",
            "",
            "    // 8 path vertices arranged clockwise starting from top edge",
            "    var points = [",
            "        [xMin + rTL, yMin],        // P0: Top edge, TL curve end",
            "        [xMax - rTR, yMin],        // P1: Top edge, TR curve start",
            "        [xMax, yMin + rTR],        // P2: Right edge, TR curve end",
            "        [xMax, yMax - rBR],        // P3: Right edge, BR curve start",
            "        [xMax - rBR, yMax],        // P4: Bottom edge, BR curve end",
            "        [xMin + rBL, yMax],        // P5: Bottom edge, BL curve start",
            "        [xMin, yMax - rBL],        // P6: Left edge, BL curve end",
            "        [xMin, yMin + rTL]         // P7: Left edge, TL curve start",
            "    ];",
            "",
            "    // In-Tangents (relative vector from vertex to incoming handle)",
            "    var inTangents = [",
            "        [-rTL * K, 0],             // P0: receives TL curve from P7",
            "        [0, 0],                    // P1: straight line along top",
            "        [0, -rTR * K],             // P2: receives TR curve from P1",
            "        [0, 0],                    // P3: straight line along right",
            "        [rBR * K, 0],              // P4: receives BR curve from P3",
            "        [0, 0],                    // P5: straight line along bottom",
            "        [0, rBL * K],              // P6: receives BL curve from P5",
            "        [0, 0]                     // P7: straight line along left",
            "    ];",
            "",
            "    // Out-Tangents (relative vector from vertex to outgoing handle)",
            "    var outTangents = [",
            "        [0, 0],                    // P0: straight line along top",
            "        [rTR * K, 0],              // P1: starts TR curve to P2",
            "        [0, 0],                    // P2: straight line along right",
            "        [0, rBR * K],              // P3: starts BR curve to P4",
            "        [0, 0],                    // P4: straight line along bottom",
            "        [-rBL * K, 0],             // P5: starts BL curve to P6",
            "        [0, 0],                    // P6: straight line along left",
            "        [0, -rTL * K]              // P7: starts TL curve to P0",
            "    ];",
            "",
            "    return createPath(points, inTangents, outTangents, true);",
            "})();"
        ].join("\n");
    }

    // =========================================================================
    // Geometry Calculation for Static Fallback
    // =========================================================================
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

        return {
            points: points,
            inTangents: inTangents,
            outTangents: outTangents
        };
    }

    // =========================================================================
    // Layer & Effect Setup Helper
    // =========================================================================
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

    function applyCustomRoundedRect(targetLayer, config) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select or open an active composition first.");
            return null;
        }

        var isNewLayer = false;
        if (!targetLayer) {
            targetLayer = comp.layers.addShape();
            targetLayer.name = "Custom Rounded Rectangle";
            isNewLayer = true;
        }

        // 1. Add Effect Controls to the layer
        var fxGroup = targetLayer.property("ADBE Effect Parade");
        if (!fxGroup) {
            fxGroup = targetLayer.property("Effects");
        }

        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Width",                config.width);
        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Height",               config.height);
        getOrCreateControl(fxGroup, "ADBE Checkbox Control", "Link All Corners",     config.linkAll ? 1 : 0);
        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius All",           config.radiusAll);
        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Top-Left",      config.radiusTL);
        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Top-Right",     config.radiusTR);
        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Bottom-Right",  config.radiusBR);
        getOrCreateControl(fxGroup, "ADBE Slider Control",   "Radius Bottom-Left",   config.radiusBL);
        getOrCreateControl(fxGroup, "ADBE Checkbox Control", "Prevent Overlap",      config.preventOverlap ? 1 : 0);

        // 2. Add or find Shape Group and Path
        var contents = targetLayer.property("ADBE Root Vectors Group");
        if (!contents) {
            contents = targetLayer.property("Contents");
        }

        var shapeGroup = contents.addProperty("ADBE Vector Group");
        shapeGroup.name = "Rounded Rectangle";

        var groupContents = shapeGroup.property("ADBE Vectors Group");
        if (!groupContents) {
            groupContents = shapeGroup.property("Contents");
        }

        // Add Path property
        var pathGroup = groupContents.addProperty("ADBE Vector Shape - Group");
        pathGroup.name = "Path";
        var pathProp = pathGroup.property("ADBE Vector Shape");
        if (!pathProp) {
            pathProp = pathGroup.property("Path");
        }

        // Initialize with calculated Shape geometry so it's valid even if expressions are paused
        var rTL = config.linkAll ? config.radiusAll : config.radiusTL;
        var rTR = config.linkAll ? config.radiusAll : config.radiusTR;
        var rBR = config.linkAll ? config.radiusAll : config.radiusBR;
        var rBL = config.linkAll ? config.radiusAll : config.radiusBL;
        var shapeData = computeShapeData(config.width, config.height, rTL, rTR, rBR, rBL, config.preventOverlap);

        var shapeObj = new Shape();
        shapeObj.vertices = shapeData.points;
        shapeObj.inTangents = shapeData.inTangents;
        shapeObj.outTangents = shapeData.outTangents;
        shapeObj.closed = true;

        try {
            pathProp.setValue(shapeObj);
        } catch(e) {}

        // Set the dynamic bezier path expression
        pathProp.expression = getShapeExpression();

        // 3. Optional Fill
        if (config.addFill) {
            var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
            fill.name = "Fill";
            var fillCol = fill.property("ADBE Vector Fill Color");
            if (!fillCol) fillCol = fill.property("Color");
            if (fillCol) {
                fillCol.setValue(config.fillColor || [0.22, 0.58, 0.98, 1.0]); // Accent blue
            }
        }

        // 4. Optional Stroke
        if (config.addStroke) {
            var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
            stroke.name = "Stroke";
            var strokeCol = stroke.property("ADBE Vector Stroke Color");
            if (!strokeCol) strokeCol = stroke.property("Color");
            if (strokeCol) strokeCol.setValue([1.0, 1.0, 1.0, 1.0]);

            var strokeWidth = stroke.property("ADBE Vector Stroke Width");
            if (!strokeWidth) strokeWidth = stroke.property("Stroke Width");
            if (strokeWidth) strokeWidth.setValue(config.strokeWidth || 4);
        }

        return targetLayer;
    }

    // =========================================================================
    // Expression Clipboard / Inspection Modal
    // =========================================================================
    function showExpressionDialog() {
        var expr = getShapeExpression();
        var dlg = new Window("dialog", "Custom Rounded Rectangle Expression");
        dlg.orientation = "column";
        dlg.alignChildren = ["fill", "top"];
        dlg.spacing = 10;
        dlg.margins = 16;

        var header = dlg.add("statictext", undefined, "Copy and paste this expression into any Shape Layer's Path property:");
        header.graphics.foregroundColor = dlg.graphics.newPen(dlg.graphics.PenType.SOLID_COLOR, [0.85, 0.85, 0.85, 1], 1);

        var edit = dlg.add("edittext", [0, 0, 520, 260], expr, { multiline: true, scrolling: true });
        edit.active = true;

        var btnGroup = dlg.add("group");
        btnGroup.orientation = "row";
        btnGroup.alignment = ["right", "bottom"];

        var closeBtn = btnGroup.add("button", undefined, "Close", { name: "ok" });
        closeBtn.onClick = function () {
            dlg.close();
        };

        dlg.center();
        dlg.show();
    }

    // =========================================================================
    // ScriptUI Panel Builder
    // =========================================================================
    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) 
            ? thisObj 
            : new Window("palette", "Custom Rounded Rect", undefined, { resizeable: true });

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 10;
        win.margins = 14;

        // ---------- Section 1: Dimensions ----------
        var sizePanel = win.add("panel", undefined, "Dimensions (px)");
        sizePanel.orientation = "column";
        sizePanel.alignChildren = ["fill", "top"];
        sizePanel.spacing = 6;
        sizePanel.margins = 10;

        var rowSize = sizePanel.add("group");
        rowSize.orientation = "row";
        rowSize.alignChildren = ["left", "center"];
        rowSize.spacing = 10;

        rowSize.add("statictext", undefined, "W:");
        var editW = rowSize.add("edittext", [0, 0, 65, 22], "500");
        rowSize.add("statictext", undefined, "H:");
        var editH = rowSize.add("edittext", [0, 0, 65, 22], "300");

        // Quick dimension buttons
        var rowDimPresets = sizePanel.add("group");
        rowDimPresets.orientation = "row";
        rowDimPresets.spacing = 6;
        var btnDimCard = rowDimPresets.add("button", [0, 0, 70, 20], "Card (500x300)");
        var btnDimSquare = rowDimPresets.add("button", [0, 0, 70, 20], "Square (400x400)");
        var btnDimHD = rowDimPresets.add("button", [0, 0, 70, 20], "HD (1920x1080)");

        btnDimCard.onClick = function () { editW.text = "500"; editH.text = "300"; };
        btnDimSquare.onClick = function () { editW.text = "400"; editH.text = "400"; };
        btnDimHD.onClick = function () { editW.text = "1920"; editH.text = "1080"; };

        // ---------- Section 2: Corner Radii ----------
        var cornerPanel = win.add("panel", undefined, "Corner Radii (px)");
        cornerPanel.orientation = "column";
        cornerPanel.alignChildren = ["fill", "top"];
        cornerPanel.spacing = 8;
        cornerPanel.margins = 10;

        // Link All Checkbox
        var chkLink = cornerPanel.add("checkbox", undefined, "Link All Corners");
        chkLink.value = false;

        // Master Slider for Linked Corners
        var rowMaster = cornerPanel.add("group");
        rowMaster.orientation = "row";
        rowMaster.alignChildren = ["left", "center"];
        rowMaster.spacing = 6;
        rowMaster.add("statictext", undefined, "All:");
        var sldMaster = rowMaster.add("slider", [0, 0, 110, 20], 50, 0, 500);
        var editMaster = rowMaster.add("edittext", [0, 0, 50, 22], "50");
        rowMaster.enabled = false;

        // 2x2 Grid for Individual Corners:
        // [ Top-Left ]      [ Top-Right ]
        // [ Bottom-Left ]   [ Bottom-Right ]
        var gridBox = cornerPanel.add("group");
        gridBox.orientation = "column";
        gridBox.alignChildren = ["fill", "top"];
        gridBox.spacing = 6;

        var rowTop = gridBox.add("group");
        rowTop.orientation = "row";
        rowTop.spacing = 10;
        rowTop.add("statictext", undefined, "TL:");
        var editTL = rowTop.add("edittext", [0, 0, 55, 22], "50");
        rowTop.add("statictext", undefined, "TR:");
        var editTR = rowTop.add("edittext", [0, 0, 55, 22], "50");

        var rowBottom = gridBox.add("group");
        rowBottom.orientation = "row";
        rowBottom.spacing = 10;
        rowBottom.add("statictext", undefined, "BL:");
        var editBL = rowBottom.add("edittext", [0, 0, 55, 22], "50");
        rowBottom.add("statictext", undefined, "BR:");
        var editBR = rowBottom.add("edittext", [0, 0, 55, 22], "50");

        // Synchronize Link Checkbox
        chkLink.onClick = function () {
            var linked = chkLink.value;
            rowMaster.enabled = linked;
            gridBox.enabled = !linked;
            if (linked) {
                editTL.text = editMaster.text;
                editTR.text = editMaster.text;
                editBR.text = editMaster.text;
                editBL.text = editMaster.text;
            }
        };

        sldMaster.onChanging = function () {
            var val = Math.round(sldMaster.value);
            editMaster.text = String(val);
            if (chkLink.value) {
                editTL.text = String(val);
                editTR.text = String(val);
                editBR.text = String(val);
                editBL.text = String(val);
            }
        };

        editMaster.onChange = function () {
            var val = parseFloat(editMaster.text) || 0;
            sldMaster.value = val;
            if (chkLink.value) {
                editTL.text = String(val);
                editTR.text = String(val);
                editBR.text = String(val);
                editBL.text = String(val);
            }
        };

        // Quick Presets
        var presetGroup = cornerPanel.add("group");
        presetGroup.orientation = "column";
        presetGroup.alignChildren = ["fill", "top"];
        presetGroup.spacing = 4;

        var presetRow1 = presetGroup.add("group");
        presetRow1.orientation = "row";
        presetRow1.spacing = 6;
        var btnPill = presetRow1.add("button", [0, 0, 68, 20], "Capsule / Pill");
        var btnTopTab = presetRow1.add("button", [0, 0, 68, 20], "Top Tab");
        var btnBotTab = presetRow1.add("button", [0, 0, 68, 20], "Bottom Tab");

        var presetRow2 = presetGroup.add("group");
        presetRow2.orientation = "row";
        presetRow2.spacing = 6;
        var btnDiag = presetRow2.add("button", [0, 0, 68, 20], "Diagonal");
        var btnCard = presetRow2.add("button", [0, 0, 68, 20], "Card (30px)");
        var btnSharp = presetRow2.add("button", [0, 0, 68, 20], "Sharp (0)");

        btnPill.onClick = function () {
            chkLink.value = false;
            rowMaster.enabled = false;
            gridBox.enabled = true;
            editTL.text = "999"; editTR.text = "999"; editBR.text = "999"; editBL.text = "999";
        };
        btnTopTab.onClick = function () {
            chkLink.value = false;
            rowMaster.enabled = false;
            gridBox.enabled = true;
            editTL.text = "40"; editTR.text = "40"; editBR.text = "0"; editBL.text = "0";
        };
        btnBotTab.onClick = function () {
            chkLink.value = false;
            rowMaster.enabled = false;
            gridBox.enabled = true;
            editTL.text = "0"; editTR.text = "0"; editBR.text = "40"; editBL.text = "40";
        };
        btnDiag.onClick = function () {
            chkLink.value = false;
            rowMaster.enabled = false;
            gridBox.enabled = true;
            editTL.text = "60"; editTR.text = "0"; editBR.text = "60"; editBL.text = "0";
        };
        btnCard.onClick = function () {
            chkLink.value = false;
            rowMaster.enabled = false;
            gridBox.enabled = true;
            editTL.text = "30"; editTR.text = "30"; editBR.text = "30"; editBL.text = "30";
        };
        btnSharp.onClick = function () {
            chkLink.value = false;
            rowMaster.enabled = false;
            gridBox.enabled = true;
            editTL.text = "0"; editTR.text = "0"; editBR.text = "0"; editBL.text = "0";
        };

        // ---------- Section 3: Options ----------
        var optPanel = win.add("panel", undefined, "Options");
        optPanel.orientation = "column";
        optPanel.alignChildren = ["fill", "top"];
        optPanel.spacing = 6;
        optPanel.margins = 10;

        var chkOverlap = optPanel.add("checkbox", undefined, "Prevent Overlap (Proportional Scaling)");
        chkOverlap.value = true;
        chkOverlap.helpTip = "Scales radii proportionally if sum of adjacent corners exceeds width or height (CSS standard).";

        var styleRow = optPanel.add("group");
        styleRow.orientation = "row";
        styleRow.spacing = 10;
        var chkFill = styleRow.add("checkbox", undefined, "Add Fill");
        chkFill.value = true;
        var chkStroke = styleRow.add("checkbox", undefined, "Add Stroke");
        chkStroke.value = false;
        var editStrokeW = styleRow.add("edittext", [0, 0, 35, 20], "4");
        styleRow.add("statictext", undefined, "px");

        // ---------- Section 4: Action Buttons ----------
        var actGroup = win.add("group");
        actGroup.orientation = "column";
        actGroup.alignChildren = ["fill", "top"];
        actGroup.spacing = 6;

        var btnCreate = actGroup.add("button", undefined, "Create Rounded Rectangle");
        btnCreate.alignment = ["fill", "top"];

        var subActRow = actGroup.add("group");
        subActRow.orientation = "row";
        subActRow.spacing = 6;
        var btnApplySelected = subActRow.add("button", [0, 0, 110, 24], "Apply to Selected");
        var btnCopyExpr = subActRow.add("button", [0, 0, 105, 24], "Expression Code");

        // Status Label
        var lblStatus = win.add("statictext", undefined, "Ready.");
        lblStatus.graphics.foregroundColor = win.graphics.newPen(win.graphics.PenType.SOLID_COLOR, [0.65, 0.65, 0.65, 1], 1);

        // Helper to extract configuration from UI
        function getConfigFromUI() {
            return {
                width: parseFloat(editW.text) || 500,
                height: parseFloat(editH.text) || 300,
                linkAll: chkLink.value,
                radiusAll: parseFloat(editMaster.text) || 50,
                radiusTL: parseFloat(editTL.text) || 0,
                radiusTR: parseFloat(editTR.text) || 0,
                radiusBR: parseFloat(editBR.text) || 0,
                radiusBL: parseFloat(editBL.text) || 0,
                preventOverlap: chkOverlap.value,
                addFill: chkFill.value,
                addStroke: chkStroke.value,
                strokeWidth: parseFloat(editStrokeW.text) || 4,
                fillColor: [0.22, 0.58, 0.98, 1.0]
            };
        }

        // Action Handlers
        btnCreate.onClick = function () {
            app.beginUndoGroup("Create Custom Rounded Rectangle");
            try {
                var config = getConfigFromUI();
                var layer = applyCustomRoundedRect(null, config);
                if (layer) {
                    lblStatus.text = "Created layer: '" + layer.name + "'";
                }
            } catch (err) {
                alert("Error creating rounded rectangle: " + err.toString());
                lblStatus.text = "Error: " + err.message;
            } finally {
                app.endUndoGroup();
            }
        };

        btnApplySelected.onClick = function () {
            var comp = app.project.activeItem;
            if (!comp || !(comp instanceof CompItem)) {
                alert("Please select or open an active composition first.");
                return;
            }
            if (comp.selectedLayers.length === 0) {
                alert("Please select an existing Shape Layer first.");
                return;
            }
            var target = comp.selectedLayers[0];
            if (!(target instanceof ShapeLayer)) {
                alert("Selected layer is not a Shape Layer. Please select a Shape Layer.");
                return;
            }

            app.beginUndoGroup("Apply Custom Rounded Rectangle");
            try {
                var config = getConfigFromUI();
                applyCustomRoundedRect(target, config);
                lblStatus.text = "Applied to layer: '" + target.name + "'";
            } catch (err) {
                alert("Error applying to layer: " + err.toString());
                lblStatus.text = "Error: " + err.message;
            } finally {
                app.endUndoGroup();
            }
        };

        btnCopyExpr.onClick = function () {
            showExpressionDialog();
        };

        // Window Layout Finalization
        if (win instanceof Window) {
            win.center();
            win.show();
        } else {
            win.layout.layout(true);
        }

        return win;
    }

    // Launch UI
    buildUI(thisObj);

})(this);
