# COS30045 Data Visualisation — Demo 2

**Energy Lens** is a student data-visualisation project about television energy use in Australia.
This repository completes the **Week 4** and **Week 5** components of Demo 2: SVG drawing, D3
selections, CSV loading, data binding, scales, axes, vertical bars, a scatter-to-line chart and a
donut chart.

## Live pages

| Page | What it demonstrates |
| --- | --- |
| `index.html` | Energy Lens dashboard with the final responsive D3 bar chart |
| `exercises/index.html` | Weeks 4–5 workbook overview and demonstration checklist |
| `exercises/exercise-4.1.html` | Simple SVG house, coordinate annotations, window group, before/after and DOM evidence |
| `exercises/exercise-4.2.html` | D3 selections, styles, appended paragraph and SVG rectangle |
| `exercises/exercise-4.3-4.7.html` | Build log from the responsive canvas to the labelled bar chart |
| `exercises/exercise-5.html` | Week 5 multi-chart page: 5.1 vertical bars, 5.2 scatter + line, 5.3 donut, plus the KNIME recipe |

## Run the site

The charts load CSV files with `d3.csv()`, so they must be viewed through a local web server.
Opening the pages directly with `file://` will be blocked by the browser's file access rules.

### Option 1 — VS Code Live Server (recommended)

1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html` → **Open with Live Server**.
4. The site opens at a local address such as `http://127.0.0.1:5500/`.

### Option 2 — Python

```powershell
python -m http.server 5500
```

Then open `http://localhost:5500/` and navigate to
`http://localhost:5500/exercises/exercise-5.html`.

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

## Week 5 checklist

### Exercise 5.1 — Vertical bar chart

- [x] Vertical bars, not horizontal.
- [x] x-axis: screen technology; y-axis: average energy consumption (kWh/year).
- [x] Margins and an inner chart group.
- [x] `scaleBand` for the screen types and `scaleLinear` for the energy values.
- [x] Both axes have ticks and descriptive labels.
- [x] Value labels and model counts above/below the bars.
- [x] Data loaded from `data/tvScreenEnergy55.csv`.
- [x] Chart sorts the rows from highest to lowest.
- [x] Responsive SVG through a `viewBox`.

### Exercise 5.2 — Scatter plot and line chart

- [x] One circle per year (scatter plot) drawn before the line.
- [x] `Year` and `Average Price (notTas-Snowy)` converted to numbers.
- [x] `d3.extent` used for the year domain.
- [x] `d3.scaleLinear` used for both axes.
- [x] `d3.line` used to connect the points in year order.
- [x] Area fill added behind the line as a subtle visual aid.
- [x] x-axis uses `d3.format("d")` so years are integers.
- [x] Axes labelled “Year” and “Average price ($/MWh)”.
- [x] Peak and final-year annotations.
- [x] Data loaded from `data/ARE_Spot_Prices.csv`.

### Exercise 5.3 — Donut chart

- [x] `d3.pie()` used to turn values into angles.
- [x] `d3.arc()` used to draw each slice.
- [x] `innerRadius` creates the donut hole.
- [x] Top eight brands shown separately; the remaining 17 combined as **Other**.
- [x] Legend gives the count and percentage for every group.
- [x] Centre shows the total (4,240 models).
- [x] Data loaded from `data/tvBrandCount.csv`.

### KNIME — 55-inch summary

- [x] `CSV Reader` loads the cleaned TV table.
- [x] `Row Filter` keeps `screensize` between 138.7 and 138.8 cm (668 models).
- [x] `Rule Engine` maps `LCD (LED)` → LED, `OLED` → OLED and `LCD` → LCD.
- [x] `GroupBy` calculates the mean of `Labelled energy consumption (kWh/year)`.
- [x] `Column Filter` and `Column Renamer` produce `screen_tech`, `avg_energy_kwh`, `count`.
- [x] `CSV Writer` writes three rows with quote values set to **Never** (or **Only when needed**).
- [x] The output opens cleanly in Excel/Notepad without quotes around the numbers.

## Project structure

```text
.
├── index.html                     # Energy Lens dashboard
├── style.css                      # Shared site and exercise styles
├── js/
│   ├── d3.v7.min.js               # D3 v7, stored locally for reliable demos
│   ├── main.js                    # Exercises 4.3–4.7 bar chart
│   ├── exercise-4.2.js            # Exercise 4.2 experiments
│   ├── bar-chart.js               # Exercise 5.1 vertical bar chart
│   ├── line-chart.js              # Exercise 5.2 scatter + line chart
│   └── donut-chart.js             # Exercise 5.3 donut chart
├── data/
│   ├── tvBrandCount.csv           # Week 4 brand summary (donut chart)
│   ├── tvScreenEnergy55.csv       # Week 5 55-inch screen-energy summary (bar chart)
│   ├── ARE_Spot_Prices.csv        # Week 5 spot-price series (line chart)
│   ├── tv_2026_cleaned.csv        # Cleaned 25-brand TV table (KNIME input)
│   └── README.md                  # Data provenance and fields
├── exercises/
│   ├── index.html                 # Weeks 4–5 workbook
│   ├── exercise-4.1.html          # SVG house and annotation overlay
│   ├── exercise-4.2.html          # D3 selection demo
│   ├── exercise-4.3-4.7.html      # Bar chart build log
│   └── exercise-5.html            # Week 5 multi-chart page
├── assets/
│   ├── house-initial.svg          # Simple starting sketch
│   └── dom-view.html              # DOM evidence panel used for the screenshot
└── images/
    ├── house-initial.png
    ├── house-final.png
    ├── house-annotated.png
    ├── svg-dom.png
    ├── chart-final.png
    ├── week5-bar.png
    ├── week5-bar-mobile.png
    ├── week5-line.png
    ├── week5-donut.png
    └── week5-knime.png
```

## Data

### `data/tvBrandCount.csv`

A two-column summary of the 2026 TV registration data used by the dashboard and the Week 5 donut:

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

### `data/tvScreenEnergy55.csv`

The chart-ready summary for Exercise 5.1:

```csv
screen_tech,avg_energy_kwh,count
led,372.05,536
oled,361.69,61
lcd,329.45,71
```

- **668 models** in the 55-inch class
- The class is defined by `screensize` between **138.7 and 138.8 cm**; the median is 138.783 cm.
- The mean uses `Labelled energy consumption (kWh/year)`.
- The values differ slightly from the sample numbers on the slide because this summary is
  calculated from the cleaned 2026 table used in Week 4.

### `data/ARE_Spot_Prices.csv`

The course-provided spot-price series used by Exercise 5.2:

- **27 annual rows**, 1998–2024.
- Columns include `Year`, the state series and `Average Price (notTas-Snowy)`.
- The average excludes Tasmania and Snowy because those series do not cover the full period.
- The chart uses the `Average Price (notTas-Snowy)` column.

### `data/tv_2026_cleaned.csv`

The cleaned 25-brand television table used as the KNIME input:

- **4,240 rows × 33 columns**.
- Brand names are lower-case; `samsung electronics` is merged into `samsung`.
- Filters: `Availability Status = Available` and `SoldIn` in the four Australian combinations.
- Contains the columns needed for the Week 5 KNIME recipe, including `screensize`,
  `Screen_Tech` and `Labelled energy consumption (kWh/year)`.
- The raw registration export and the class workflow (`2026 TV Data.knwf`) are not committed; the
  cleaned table is included so the charts and the KNIME recipe can be reproduced.

## Screenshots

The `images/` folder contains the visual evidence used across the site:

- `house-initial.png` — the simple starting sketch.
- `house-final.png` — the customised house with tree, sun and winding path.
- `house-annotated.png` — the coordinate annotation overlay, captured from
  `exercise-4.1.html?annotate=1`.
- `svg-dom.png` — a DOM evidence panel showing the SVG hierarchy.
- `chart-final.png` — the finished Week 4 D3 bar chart.
- `week5-bar.png` — the Exercise 5.1 vertical bar chart.
- `week5-bar-mobile.png` — the same chart at a 390 px viewport, showing the responsive layout.
- `week5-line.png` — the Exercise 5.2 scatter + line chart.
- `week5-donut.png` — the Exercise 5.3 donut chart and legend.
- `week5-knime.png` — the step-by-step KNIME section.

## AI acknowledgement

AI was used as a drafting, coding and debugging assistant for this submission. The SVG house
sketch, page scaffolding, chart JavaScript, CSS layout and parts of the documentation were drafted
with AI help. The data processing decisions, the KNIME recipe, the chart values and the explanatory
text were reviewed and customised for this project. The student can explain the purpose of each SVG
element, the group/transform behaviour, the D3 data join, the scales, the axes, the line generator,
the pie/arc geometry and each KNIME node.

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
5. Open `exercises/exercise-5.html`:
   - **5.1** — explain the zero baseline, sorted bars, `scaleBand`, `scaleLinear`, axes and value
     labels. Open `js/bar-chart.js`.
   - **KNIME** — show the 55-inch filter (138.7–138.8 cm), the Rule Engine, the GroupBy mean and the
     three-row CSV. Explain why quote values are set to **Never**.
   - **5.2** — show the scatter circles, the line path, `d3.extent`, `d3.scaleLinear`, `d3.line` and
     the integer year format. Open `js/line-chart.js`.
   - **5.3** — show `d3.pie()`, `d3.arc()`, the inner radius, the top-eight grouping and the HTML
     legend. Open `js/donut-chart.js`.
6. Resize the browser on each chart to show the `viewBox` behaviour.
7. Open the browser console and confirm that there are no errors.
