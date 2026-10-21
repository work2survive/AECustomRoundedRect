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
│   ├── CustomRoundedRect_Expression.js # Standalone path expression (Effect Controls & hardcoded)
│   └── ResponsiveTextBox_Expression.js # Auto-sizing text box expression with sourceRectAtTime()
│
└── tools/                              # Build utilities
    ├── ZXPSignCmd.exe                  # Adobe's official signing utility
    └── certificate.p12                 # 10-year self-signed digital certificate
```

---

## 🚀 Submitting to Adobe Exchange (Marketplace)

The package [`CustomRoundedRect.zxp`](file:///g:/My%20Drive/_openProjects/AEthingy/CustomRoundedRect.zxp) has been built and digitally signed using Adobe's official `ZXPSignCmd` utility with Digicert timestamping. It is ready for direct submission to the Adobe Exchange Producer Portal.

### Step-by-Step Submission Instructions:

1. **Log in to Adobe Exchange Producer Portal**:
   - Visit: [Adobe Exchange Producer Portal](https://exchange.adobe.com/creativecloud/producer.html)
   - Sign in with your Adobe ID (or create a free Developer profile).
2. **Create a New Product Listing**:
   - Click **Add Product** / **New Product**.
   - Product Type: **Creative Cloud Extension / Add-on**.
   - Supported Apps: Check **After Effects**.
3. **Upload the ZXP Package**:
   - Upload [`CustomRoundedRect.zxp`](file:///g:/My%20Drive/_openProjects/AEthingy/CustomRoundedRect.zxp).
   - Adobe's automated validator will verify the `CSXS/manifest.xml`, digital signature, and bundle ID `com.aethingy.customroundedrect`.
4. **Fill In Metadata & Listing Info**:
   - **Title**: `Custom Rounded Rectangle for After Effects`
   - **Version**: `1.0.0`
   - **Category**: *Animation & Effects* or *Workflow & Utilities*
   - **Pricing**: Free or Paid (your choice)
   - **Description**: Highlight individual corner radii, CSS proportional overlap prevention, and vector shape compatibility.
5. **Add Artwork**:
   - Icon (512x512 PNG)
   - Featured cover image (1280x720 PNG/JPG)
   - At least 1-2 screenshots of the panel inside After Effects.
6. **Submit for Review**:
   - Click **Submit**. Adobe usually reviews submissions within 2-5 business days. Once approved, Adobe re-signs the package with Adobe's production key and publishes it on the Creative Cloud Desktop App Marketplace.

---

## 🛠️ Re-Building the ZXP Package

If you make any changes to `index.html`, `main.js`, `style.css`, or `hostscript.jsx`, you can regenerate and sign the `.zxp` in one step:

- **Windows**: Double-click [`build_zxp.bat`](file:///g:/My%20Drive/_openProjects/AEthingy/build_zxp.bat) or run in PowerShell:
  ```powershell
  .\build_zxp.ps1
  ```
- The script automatically:
  1. Validates the existence of `tools/ZXPSignCmd.exe` and `tools/certificate.p12`.
  2. Compiles and signs the `extension/` folder into `CustomRoundedRect.zxp`.
  3. Verifies package integrity and timestamp against Adobe's certificate standards.

---

## 💻 Local Testing During Development

To test the CEP panel inside After Effects before uploading:

### Option A: Local CEP Extension Directory (Live Reload)
1. Enable CEP Debug Mode (allows unsigned panels to run in AE):
   - **Windows**: In PowerShell (Run as Administrator):
     ```powershell
     reg add "HKCU\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f
     reg add "HKCU\Software\Adobe\CSXS.10" /v PlayerDebugMode /t REG_SZ /d 1 /f
     reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f
     reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f
     ```
2. Copy (or create a symbolic link to) the [`extension`](file:///g:/My%20Drive/_openProjects/AEthingy/extension) folder into AE's extensions directory:
   - **Windows**: `%APPDATA%\Adobe\CEP\extensions\CustomRoundedRect`
   - **macOS**: `~/Library/Application Support/Adobe/CEP/extensions/CustomRoundedRect`
3. Launch After Effects.
4. In the top menu, open **Window > Extensions > Custom Rounded Rectangle**.
5. *(Optional)* For live web debugging, open Chrome and navigate to `http://localhost:8088`.

### Option B: Install the Signed ZXP File
Use any standard ZXP installer:
- [Anastasiy's Extension Manager](https://install.anastasiy.com/)
- [ZXPInstaller](https://zxpinstaller.com/)
Drag and drop `CustomRoundedRect.zxp` into the installer.

---

## 📄 Manifest Specification (`CSXS/manifest.xml`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionManifest Version="9.0" 
                   ExtensionBundleId="com.aethingy.customroundedrect" 
                   ExtensionBundleVersion="1.0.0" 
                   ExtensionBundleName="Custom Rounded Rectangle" 
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <ExtensionList>
        <Extension Id="com.aethingy.customroundedrect.panel" Version="1.0.0" />
    </ExtensionList>
    <ExecutionEnvironment>
        <HostList>
            <!-- AECT is Adobe After Effects. Covers AE CC 2018 (v15.0) through AE 2026+ -->
            <Host Name="AECT" Version="[15.0,99.9]" />
        </HostList>
        <LocaleList>
            <Locale Code="All" />
        </LocaleList>
        <RequiredRuntimeList>
            <RequiredRuntime Name="CSXS" Version="9.0" />
        </RequiredRuntimeList>
    </ExecutionEnvironment>
    <DispatchInfoList>
        <Extension Id="com.aethingy.customroundedrect.panel">
            <DispatchInfo>
                <Resources>
                    <MainPath>./index.html</MainPath>
                    <ScriptPath>./jsx/hostscript.jsx</ScriptPath>
                </Resources>
                <UI>
                    <Type>Panel</Type>
                    <Menu>Custom Rounded Rectangle</Menu>
                    <Geometry>
                        <Size><Height>600</Height><Width>340</Width></Size>
                        <MinSize><Height>450</Height><Width>280</Width></MinSize>
                    </Geometry>
                </UI>
            </DispatchInfo>
        </Extension>
    </DispatchInfoList>
</ExtensionManifest>
```

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
