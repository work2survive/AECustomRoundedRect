/**
 * Custom Rounded Rectangle - Main UI Logic (CEP Panel)
 */

var csInterface = null;

try {
  csInterface = new CSInterface();
} catch (e) {
  console.warn("CSInterface not running inside Adobe CEP environment (browser preview mode).");
}

function setStatus(msg, isError) {
  var el = document.getElementById("status");
  if (el) {
    el.textContent = msg;
    el.style.color = isError ? "#f87171" : "#9ca3af";
  }
}

function setDimensions(w, h) {
  document.getElementById("width").value = w;
  document.getElementById("height").value = h;
}

function onLinkToggle() {
  var linked = document.getElementById("link-all").checked;
  var masterRow = document.getElementById("master-row");
  var cornerGrid = document.getElementById("corner-grid");

  if (linked) {
    masterRow.style.display = "flex";
    cornerGrid.style.opacity = "0.5";
    cornerGrid.style.pointerEvents = "none";
    var masterVal = document.getElementById("master-input").value;
    ["tl", "tr", "br", "bl"].forEach(function (id) {
      document.getElementById("r-" + id).value = masterVal;
    });
  } else {
    masterRow.style.display = "none";
    cornerGrid.style.opacity = "1";
    cornerGrid.style.pointerEvents = "auto";
  }
}

function onMasterChange() {
  var val = document.getElementById("master-slider").value;
  document.getElementById("master-input").value = val;
  if (document.getElementById("link-all").checked) {
    ["tl", "tr", "br", "bl"].forEach(function (id) {
      document.getElementById("r-" + id).value = val;
    });
  }
}

function onMasterInputChange() {
  var val = document.getElementById("master-input").value;
  document.getElementById("master-slider").value = val;
  if (document.getElementById("link-all").checked) {
    ["tl", "tr", "br", "bl"].forEach(function (id) {
      document.getElementById("r-" + id).value = val;
    });
  }
}

function onCornerChange() {
  // Can trigger live preview if desired
}

function setCornerPreset(type) {
  var chkLink = document.getElementById("link-all");
  chkLink.checked = false;
  onLinkToggle();

  var tl = 0, tr = 0, br = 0, bl = 0;
  switch (type) {
    case "pill":
      tl = 999; tr = 999; br = 999; bl = 999;
      break;
    case "topTab":
      tl = 40; tr = 40; br = 0; bl = 0;
      break;
    case "bottomTab":
      tl = 0; tr = 0; br = 40; bl = 40;
      break;
    case "diagonal":
      tl = 60; tr = 0; br = 60; bl = 0;
      break;
    case "card":
      tl = 30; tr = 30; br = 30; bl = 30;
      break;
    case "sharp":
      tl = 0; tr = 0; br = 0; bl = 0;
      break;
  }

  document.getElementById("r-tl").value = tl;
  document.getElementById("r-tr").value = tr;
  document.getElementById("r-br").value = br;
  document.getElementById("r-bl").value = bl;
}

function getConfig() {
  var linked = document.getElementById("link-all").checked;
  var masterR = parseFloat(document.getElementById("master-input").value) || 50;

  return {
    width: parseFloat(document.getElementById("width").value) || 500,
    height: parseFloat(document.getElementById("height").value) || 300,
    linkAll: linked,
    radiusAll: masterR,
    radiusTL: parseFloat(document.getElementById("r-tl").value) || 0,
    radiusTR: parseFloat(document.getElementById("r-tr").value) || 0,
    radiusBR: parseFloat(document.getElementById("r-br").value) || 0,
    radiusBL: parseFloat(document.getElementById("r-bl").value) || 0,
    preventOverlap: document.getElementById("prevent-overlap").checked,
    addFill: document.getElementById("add-fill").checked,
    addStroke: document.getElementById("add-stroke").checked,
    strokeWidth: 4,
    fillColor: [0.22, 0.58, 0.98, 1.0]
  };
}

function createRectangle() {
  var cfg = getConfig();
  setStatus("Creating shape layer...");

  if (!csInterface) {
    setStatus("Error: CSInterface unavailable. Running in browser?", true);
    return;
  }

  // Escape JSON for ExtendScript string evaluation
  var jsonStr = JSON.stringify(cfg).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  var script = 'CustomRoundedRectHost.createLayer("' + jsonStr + '");';

  csInterface.evalScript(script, function (res) {
    try {
      var result = JSON.parse(res);
      if (result.success) {
        setStatus("Created layer: '" + result.layerName + "'");
      } else {
        setStatus("Error: " + result.error, true);
      }
    } catch (e) {
      setStatus("Result: " + res);
    }
  });
}

function applyToSelected() {
  var cfg = getConfig();
  setStatus("Applying to selected shape layer...");

  if (!csInterface) {
    setStatus("Error: CSInterface unavailable. Running in browser?", true);
    return;
  }

  var jsonStr = JSON.stringify(cfg).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  var script = 'CustomRoundedRectHost.applyToSelected("' + jsonStr + '");';

  csInterface.evalScript(script, function (res) {
    try {
      var result = JSON.parse(res);
      if (result.success) {
        setStatus("Applied to layer: '" + result.layerName + "'");
      } else {
        setStatus("Error: " + result.error, true);
      }
    } catch (e) {
      setStatus("Result: " + res);
    }
  });
}

function copyExpression() {
  if (!csInterface) {
    setStatus("Expression copy available inside After Effects.", true);
    return;
  }

  csInterface.evalScript("CustomRoundedRectHost.getExpression();", function (expr) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(expr).then(function () {
        setStatus("Expression copied to clipboard!");
      }).catch(function () {
        fallbackCopy(expr);
      });
    } else {
      fallbackCopy(expr);
    }
  });
}

function fallbackCopy(text) {
  var ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    setStatus("Expression copied to clipboard!");
  } catch (err) {
    setStatus("Please copy expression manually from expressions folder.");
  }
  document.body.removeChild(ta);
}
