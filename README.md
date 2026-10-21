# Custom Rounded Rectangle for Adobe After Effects

A complete, production-grade tool, CEP extension, and expression engine for creating parametric vector rectangles with **individually customizable corner radii** in Adobe After Effects.

Unlike After Effects' built-in `Rectangle Path` (which only supports a single global roundness value), this tool enables full, independent control of each corner (**Top-Left, Top-Right, Bottom-Right, Bottom-Left**) with mathematical **proportional scaling** to prevent overlapping curves, adhering to the **W3C CSS `border-radius` standard**.

---

## 📦 What's Included

```
AEthingy/
├── CustomRoundedRect.zxp               # Signed package ready for Adobe Exchange submission
├── build_zxp.ps1                       # One-click automated packaging & signing script
├── build_zxp.bat                       # Windows launcher for build script
│
├── extension/                          # Adobe CEP Extension source directory
│   ├── CSXS/
│   │   └── manifest.xml                # Adobe CEP Manifest (v9.0, After Effects CC 2018-2026+)
│   ├── .debug                          # Remote debugging configuration (port 8088)
│   ├── index.html                      # HTML5 panel UI matching AE dark theme
│   ├── css/
│   │   └── style.css                   # Responsive panel styling
│   ├── js/
│   │   ├── CSInterface.js              # Adobe CEP host communication library
│   │   └── main.js                     # Panel UI event handling and ExtendScript bridge
│   ├── jsx/
│   │   └── hostscript.jsx              # ExtendScript backend running inside After Effects
│   └── icons/                          # Menu & panel icons (iconNormal, iconDark, rollovers)
│
├── CustomRoundedRect.jsx               # Standalone ScriptUI panel (for direct AE script usage)
├── expressions/
    ├── CustomRoundedRect_Expression.js # Standalone path expression (Effect Controls & hardcoded)
    └── ResponsiveTextBox_Expression.js # Auto-sizing text box expression with sourceRectAtTime()

```

---

## 🚀 Submitting to Adobe Exchange (Marketplace)

The package [`CustomRoundedRect.zxp`](CustomRoundedRect.zxp) has been built and digitally signed using Adobe's official `ZXPSignCmd` utility with Digicert timestamping. It is ready for direct submission to the Adobe Exchange Producer Portal.


---

---

## 📐 Mathematical Specification

### 1. Proportional Overlap Prevention (W3C CSS Algorithm)

When corner radii are large relative to the rectangle's dimensions, curves along the same edge would collide and cross over each other. 

The tool implements the official [W3C CSS Backgrounds and Borders Module Level 3 (§5.5)](https://www.w3.org/TR/css-backgrounds-3/#corner-overlap) scaling algorithm:

$$\begin{aligned}
S_{\text{top}}    &= r_{TL} + r_{TR} \\
S_{\text{bottom}} &= r_{BL} + r_{BR} \\
S_{\text{left}}   &= r_{TL} + r_{BL} \\
S_{\text{right}}  &= r_{TR} + r_{BR}
\end{aligned}$$

A scaling factor $f$ is calculated:

$$f = \min\left(1,\; \frac{W}{S_{\text{top}}},\; \frac{W}{S_{\text{bottom}}},\; \frac{H}{S_{\text{left}}},\; \frac{H}{S_{\text{right}}}\right)$$

If $f < 1$, all radii are scaled by $f$:

$$r'_{TL} = r_{TL} \cdot f, \quad r'_{TR} = r_{TR} \cdot f, \quad r'_{BR} = r_{BR} \cdot f, \quad r'_{BL} = r_{BL} \cdot f$$

---

### 2. Cubic Bézier Circle Approximation

A 90-degree quadrant of a circle of radius $r$ is modeled using a cubic Bézier curve. The optimal control tangent length factor $\kappa$ that minimizes radial error is:

$$\kappa = \frac{4}{3}\left(\sqrt{2} - 1\right) \approx 0.5522847498307936$$

For each corner of radius $r$, the tangent handle length is $L = r \times \kappa$.

```
           P0 (xMin + rTL, yMin)        P1 (xMax - rTR, yMin)
               *----------------------------*
             /                                \
   P7       /                                  \      P2
(xMin,     *                                    *   (xMax,
 yMin+rTL) |                                    |    yMin+rTR)
           |                                    |
           |                                    |
   P6      *                                    *     P3
(xMin,      \                                  /    (xMax,
 yMax-rBL)   \                                /      yMax-rBR)
               *----------------------------*
           P5 (xMin + rBL, yMax)        P4 (xMax - rBR, yMax)
```

The path consists of **8 vertices** and tangent vectors (relative to each vertex):

| Vertex | Description | Position $[x, y]$ | In-Tangent | Out-Tangent |
| :--- | :--- | :--- | :--- | :--- |
| **$P_0$** | Top edge, TL curve end | $[-W/2 + r_{TL},\; -H/2]$ | $[-r_{TL} \cdot \kappa,\; 0]$ | $[0,\; 0]$ |
| **$P_1$** | Top edge, TR curve start | $[W/2 - r_{TR},\; -H/2]$ | $[0,\; 0]$ | $[r_{TR} \cdot \kappa,\; 0]$ |
| **$P_2$** | Right edge, TR curve end | $[W/2,\; -H/2 + r_{TR}]$ | $[0,\; -r_{TR} \cdot \kappa]$ | $[0,\; 0]$ |
| **$P_3$** | Right edge, BR curve start | $[W/2,\; H/2 - r_{BR}]$ | $[0,\; 0]$ | $[0,\; r_{BR} \cdot \kappa]$ |
| **$P_4$** | Bottom edge, BR curve end | $[W/2 - r_{BR},\; H/2]$ | $[r_{BR} \cdot \kappa,\; 0]$ | $[0,\; 0]$ |
| **$P_5$** | Bottom edge, BL curve start | $[-W/2 + r_{BL},\; H/2]$ | $[0,\; 0]$ | $[-r_{BL} \cdot \kappa,\; 0]$ |
| **$P_6$** | Left edge, BL curve end | $[-W/2,\; H/2 - r_{BL}]$ | $[0,\; r_{BL} \cdot \kappa]$ | $[0,\; 0]$ |
| **$P_7$** | Left edge, TL curve start | $[-W/2,\; -H/2 + r_{TL}]$ | $[0,\; 0]$ | $[0,\; -r_{TL} \cdot \kappa]$ |

The curve is closed with `createPath(points, inTangents, outTangents, true)`.

---

## 📄 License

MIT License. Free for personal and commercial use in any motion design, broadcast, or VFX production.
