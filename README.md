# COS30045 Data Visualisation — Demo 2

**Energy Lens** is a student data-visualisation project about television energy use in Australia.
This repository currently completes the **Week 4** component of Demo 2: SVG drawing, D3
selections, CSV loading, data binding, scales and labels.

## Live pages

| Page | What it demonstrates |
| --- | --- |
| `index.html` | Energy Lens dashboard with the final responsive D3 bar chart |
| `exercises/index.html` | Week 4 workbook overview and demonstration checklist |
| `exercises/exercise-4.1.html` | Simple SVG house, coordinate annotations, window group, before/after and DOM evidence |
| `exercises/exercise-4.2.html` | D3 selections, styles, appended paragraph and SVG rectangle |
| `exercises/exercise-4.3-4.7.html` | Build log from the responsive canvas to the labelled bar chart |

## Run the site

The chart loads a CSV with `d3.csv()`, so it must be viewed through a local web server.
Opening `index.html` directly with `file://` will be blocked by the browser's file access rules.

### Option 1 — VS Code Live Server (recommended)

1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` → **Open with Live Server**.
4. The site opens at a local address such as `http://127.0.0.1:5500/`.

### Option 2 — Python

```powershell
python -m http.server 5500
```

Then open `http://localhost:5500/`.

## Week 4 checklist

### Exercise 4.1 — Draw SVGs

- [x] House scene built with `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polyline>`,
      `<polygon>`, `<path>` and `<text>`.
- [x] Styling with fills, strokes, stroke widths, opacity and CSS classes.
- [x] Customised from a simple initial sketch (tree, winding path, two windows, grass tuft).
- [x] Two windows inside one `<g class="window-group">` with `transform="translate(320 310)"`.
- [x] Annotated screenshot showing the SVG coordinate system and each shape type.
- [x] DOM evidence panel showing the SVG hierarchy.
- [x] Before/after screenshots and AI acknowledgement.

### Exercise 4.2 — D3 selections

- [x] New JavaScript file (`js/exercise-4.2.js`).
- [x] D3 library loaded in the HTML.
- [x] `d3.select("#demo-heading").style("color", "green")`.
- [x] Paragraph appended to a container with `.append("p").text(...)`.
- [x] Rectangle appended to an SVG with position, size and fill attributes.
- [x] `selectAll()` experiment documented.

### Exercises 4.3–4.7 — Bar chart

- [x] Responsive `.responsive-svg-container` with an SVG `viewBox`.
- [x] Test rectangle in the responsive canvas.
- [x] `d3.csv()` with a row conversion function (`+d.count`).
- [x] Data statistics logged to the console (`length`, `max`, `min`, `extent`).
- [x] Data sorted from largest to smallest.
- [x] Data bound to rectangles with `.data()` and `.join()`.
- [x] Linear scale for count and band scale for brand.
- [x] Padding between bars.
- [x] One `<g>` per brand containing the bar, brand label and value label.
- [x] `transform="translate(0, yScale(d.brand))"` to position each group.
- [x] Final chart integrated into the dashboard.

## Project structure

```text
.
├── index.html                     # Energy Lens dashboard
├── style.css                      # Shared site and exercise styles
├── js/
│   ├── d3.v7.min.js               # D3 v7, stored locally for reliable demos
│   ├── main.js                    # Exercises 4.3–4.7 bar chart
│   └── exercise-4.2.js            # Exercise 4.2 experiments
├── data/
│   ├── tvBrandCount.csv           # Summary used by the chart
│   └── README.md                  # Data provenance and fields
├── exercises/
│   ├── index.html                 # Week 4 workbook
│   ├── exercise-4.1.html          # SVG house and annotation overlay
│   ├── exercise-4.2.html          # D3 selection demo
│   └── exercise-4.3-4.7.html      # Bar chart build log
├── assets/
│   ├── house-initial.svg          # Simple starting sketch
│   └── dom-view.html              # DOM evidence panel used for the screenshot
└── images/
    ├── house-initial.png
    ├── house-final.png
    ├── house-annotated.png
    ├── svg-dom.png
    └── chart-final.png
```

## Data

The chart uses `data/tvBrandCount.csv`, a two-column summary of the 2026 TV registration data:

```csv
brand,count
samsung,1096
kogan,788
lg,677
...
```

- **25 brands**
- **4,240 registered models**
- **Range:** 24 to 1,096 models
- **Top three:** Samsung (1,096), Kogan (788), LG (677) — 60.4% of all registrations

The summary was produced from the `2026 TV Data.knwf` KNIME workflow. The workflow cleans the
brand names, filters the relevant rows and groups the registrations by brand. The CSV used here is
the grouped summary, not the raw registration file.

## Screenshots

The `images/` folder contains the visual evidence used across the site:

- `house-initial.png` — the simple starting sketch.
- `house-final.png` — the customised house with tree, sun and winding path.
- `house-annotated.png` — the coordinate annotation overlay, captured from
  `exercise-4.1.html?annotate=1`.
- `svg-dom.png` — a DOM evidence panel showing the SVG hierarchy (generated from the same inline markup).
- `chart-final.png` — the finished D3 bar chart.

## AI acknowledgement

AI was used as a drafting, coding and debugging assistant for this submission. The initial SVG
house sketch, the page scaffolding and parts of the documentation were drafted with AI help. The
final illustration, the coordinate annotations, the data processing decisions and the chart
explanation were reviewed and customised for this project. The student can explain the purpose of
each SVG element, the group/transform behaviour, the D3 data join, both scales and the label
placement.

## Notes for the demonstration

1. Start with `index.html` and resize the window to show the responsive SVG.
2. Hover a bar to show the tooltip, then open the data table.
3. Open `js/main.js` and point to:
   - the row conversion (`count: +row.count`);
   - `xScale` and `yScale`;
   - the `barAndLabel` group and its `transform`;
   - the rectangle, brand label and value label appended to each group.
4. Open `exercises/exercise-4.1.html`:
   - click **Show coordinates** to reveal the annotated overlay;
   - click **Highlight windows** to show the shared group styling;
   - show the annotated screenshot, before/after pair and DOM evidence panel.
5. Open the browser Elements panel and show the live `<svg>`, `<g class="house">`,
   `<g class="window-group">` and the generated bar chart `<g class="bar-row">` elements.
