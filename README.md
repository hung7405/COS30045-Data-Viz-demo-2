# COS30045 Data Visualisation — Demo 2

**Energy Lens** is a student data-visualisation project about television energy use in Australia.
This repository completes the **Week 4**, **Week 5** and **Week 6** components of Demo 2: SVG
drawing, D3 selections, CSV loading, data binding, scales, axes, vertical bars, a scatter-to-line
chart, a size-mix donut chart and a 14-bin energy histogram.

## Live pages

| Page | What it demonstrates |
| --- | --- |
| `index.html` | Energy Lens dashboard with the final responsive D3 bar chart |
| `exercises/index.html` | Weeks 4–6 workbook overview and demonstration checklist |
| `exercises/exercise-4.1.html` | Simple SVG house, coordinate annotations, window group, before/after and DOM evidence |
| `exercises/exercise-4.2.html` | D3 selections, styles, appended paragraph and SVG rectangle |
| `exercises/exercise-4.3-4.7.html` | Build log from the responsive canvas to the labelled bar chart |
| `exercises/exercise-5.html` | Week 5 multi-chart page: 5.1 vertical bars, 5.2 scatter + line, 5.3 size-mix donut, plus both KNIME recipes |
| `exercises/exercise-6.html` | Week 6 Exercise 6.1: responsive 14-bin histogram of TV energy consumption |

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
`http://localhost:5500/exercises/exercise-5.html` or
`http://localhost:5500/exercises/exercise-6.html`.

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
- [x] Three size groups: small (up to 42 in), medium (42–65 in) and large (over 65 in).
- [x] Legend gives the count and percentage for every group.
- [x] Centre shows the total (4,508 models).
- [x] Data loaded from `data/tvScreenSizeCount.csv`.
- [x] `d3.pie().sort(null)` keeps the KNIME order: large, medium, small.
- [x] Square 560 × 560 viewBox keeps the donut readable on mobile; the walkthrough's
  1000 × 500 canvas is the only deliberate layout adaptation.

### KNIME — 55-inch summary

- [x] `CSV Reader` loads the cleaned TV table.
- [x] `Row Filter` keeps `screensize` between 138.7 and 138.8 cm (668 models).
- [x] `Rule Engine` maps `LCD (LED)` → LED, `OLED` → OLED and `LCD` → LCD.
- [x] `GroupBy` calculates the mean of `Labelled energy consumption (kWh/year)`.
- [x] `Column Filter` and `Column Renamer` produce `screen_tech`, `avg_energy_kwh`, `count`.
- [x] `CSV Writer` writes three rows with quote values set to **Never** (or **Only when needed**).
- [x] The output opens cleanly in Excel/Notepad without quotes around the numbers.

### KNIME — TV-size summary

- [x] `CSV Reader` loads the exercise dataset (`2026 TV Data.csv` / `tv_2026_02_15.csv`).
- [x] `Row Filter` keeps `SoldIn` containing Australia and `Availability Status = Available`
  (4,508 rows).
- [x] `Math Formula` creates `screensize_inch = screensize / 2.54`.
- [x] `Rule Engine` maps `<= 42` → small, `<= 65` → medium and `TRUE` → large.
- [x] `GroupBy` groups by `Screensize_Category` and counts the models.
- [x] `CSV Writer` writes the three-row `data/tvScreenSizeCount.csv` (1,352 / 2,386 / 770).
- [x] GroupBy's alphabetical order is large, medium, small — the order the donut uses.

## Week 6 checklist

### Exercise 6.1 — Histogram

- [x] Separate files for loading, shared constants, interactions and the histogram.
- [x] `#histogram` container with a responsive `viewBox`.
- [x] `d3.csv()` loads `data/Ex6_TVdata_withStar.csv` and converts the numeric columns.
- [x] Loaded rows and the 14 bins are logged to the console.
- [x] `d3.bin().value(d => d.energyConsumption).thresholds(14)` creates 14 bins.
- [x] `xScale` uses the first bin's `x0` and the last bin's `x1`; `yScale` starts at zero.
- [x] One `<rect>` per bin, with a small gap between bars.
- [x] `d3.axisBottom()` and `d3.axisLeft()` draw the axes; both axes have labels.
- [x] The 2,652 kWh outlier is kept and explained rather than silently removed.
- [x] A taller 640 × 620 viewBox and larger axis text keep the histogram legible on mobile.
- [x] `js/interactions.js` is ready for the Exercise 6.2 filters.

## Project structure

```text
.
├── index.html                     # Energy Lens dashboard
├── style.css                      # Shared site and exercise styles
├── css/
│   ├── base.css                   # Week 6 base page styles
│   └── visualisation.css          # Week 6 histogram and axis styles
├── js/
│   ├── d3.v7.min.js               # D3 v7, stored locally for reliable demos
│   ├── main.js                    # Exercises 4.3–4.7 bar chart
│   ├── exercise-4.2.js            # Exercise 4.2 experiments
│   ├── bar-chart.js               # Exercise 5.1 vertical bar chart
│   ├── line-chart.js              # Exercise 5.2 scatter + line chart
│   ├── donut-chart.js             # Exercise 5.3 donut chart
│   ├── load-data.js               # Exercise 6.1 CSV loading
│   ├── shared-constants.js        # Exercise 6.1 dimensions, scales and bins
│   ├── interactions.js            # Exercise 6.2 filter placeholder
│   └── histogram.js               # Exercise 6.1 histogram drawing
├── data/
│   ├── tvBrandCount.csv           # Week 4 brand summary (dashboard bar chart)
│   ├── tvScreenEnergy55.csv       # Week 5 55-inch screen-energy summary (bar chart)
│   ├── tvScreenSizeCount.csv      # Week 5 small/medium/large summary (donut chart)
│   ├── ARE_Spot_Prices.csv        # Week 5 spot-price series (line chart)
│   ├── tv_2026_cleaned.csv        # Cleaned 25-brand TV table (KNIME input)
│   ├── Ex6_TVdata_withStar.csv    # Week 6 exercise table (histogram input)
│   ├── W6_TVdata.knwf             # Week 6 KNIME workflow (data preparation)
│   └── README.md                  # Data provenance and fields
├── exercises/
│   ├── index.html                 # Weeks 4–6 workbook
│   ├── exercise-4.1.html          # SVG house and annotation overlay
│   ├── exercise-4.2.html          # D3 selection demo
│   ├── exercise-4.3-4.7.html      # Bar chart build log
│   ├── exercise-5.html            # Week 5 multi-chart page
│   └── exercise-6.html            # Week 6 histogram page
├── assets/
│   ├── house-initial.svg          # Simple starting sketch
│   └── dom-view.html              # DOM evidence panel used for the screenshot
└── images/
    ├── house-initial.png
    ├── house-final.png
    ├── house-annotated.png
    ├── svg-dom.png
    ├── chart-final.png
    ├── week5-page.png
    ├── week5-bar.png
    ├── week5-bar-mobile.png
    ├── week5-line.png
    ├── week5-donut.png
    ├── week5-knime.png
    ├── week5-knime-size.png
    ├── week6-histogram.png
    ├── week6-histogram-mobile.png
    └── week6-page.png
```

## Data

### `data/tvBrandCount.csv`

A two-column summary of the 2026 TV registration data used by the Week 4 dashboard bar chart:

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

### `data/tvScreenSizeCount.csv`

The chart-ready summary for Exercise 5.3:

```csv
Screensize_Category,Count
large,1352
medium,2386
small,770
```

- **4,508 models** from the exercise dataset (Australia + Available) grouped into three size
  bands.
- **Small:** up to 42 inches — 770 models (17.1%).
- **Medium:** 42–65 inches — 2,386 models (52.9%).
- **Large:** over 65 inches — 1,352 models (30.0%).
- The rules are applied to `screensize / 2.54` in KNIME; the CSV keeps the
  alphabetical GroupBy order so the donut starts with the large slice.
- The Week 4 cleaned table has 4,240 rows after brand cleaning, so 5.3 uses its own
  exercise-dataset summary rather than the cleaned table.

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
- Contains the columns needed for both Week 5 KNIME recipes, including `screensize`,
  `Screen_Tech` and `Labelled energy consumption (kWh/year)`.
- Exercise 5.3 uses the raw exercise dataset filtered to Australia + Available (4,508 rows),
  not this 4,240-row cleaned table, so its donut total is intentionally different.
- The raw registration export and the class workflow (`2026 TV Data.knwf`) are not committed; the
  cleaned table is included so the charts and the KNIME recipes can be reproduced.

### `data/Ex6_TVdata_withStar.csv`

The exercise table used by the Week 6 histogram:

- **4,233 rows × 6 columns**: `brand`, `model`, `screenSize`, `screenTech`, `star` and
  `energyConsumption`.
- `energyConsumption` ranges from **56 to 2,652 kWh/year**.
- The 14 equal-width bins run from **0 to 2,800 kWh/year**; the tallest bin is **200–400
  kWh/year** with **1,387 models**.
- One model sits in the final **2,600–2,800 kWh/year** bin; the chart keeps it and explains the
  long tail.
- Created with the Week 6 KNIME workflow (`data/W6_TVdata.knwf`) from the January 2026
  registration data.
- Source:
  [Energy Rating Data for household appliances — Televisions](https://data.gov.au/data/dataset/energy-rating-for-household-appliances),
  downloaded January 2026.

## Screenshots

The `images/` folder contains the visual evidence used across the site:

- `house-initial.png` — the simple starting sketch.
- `house-final.png` — the customised house with tree, sun and winding path.
- `house-annotated.png` — the coordinate annotation overlay, captured from
  `exercise-4.1.html?annotate=1`.
- `svg-dom.png` — a DOM evidence panel showing the SVG hierarchy.
- `chart-final.png` — the finished Week 4 D3 bar chart.
- `week5-page.png` — the full Week 5 multi-chart page.
- `week5-bar.png` — the Exercise 5.1 vertical bar chart.
- `week5-bar-mobile.png` — the same chart at a 390 px viewport, showing the responsive layout.
- `week5-line.png` — the Exercise 5.2 scatter + line chart.
- `week5-donut.png` — the Exercise 5.3 size-mix donut chart and legend.
- `week5-knime.png` — the step-by-step 55-inch KNIME section.
- `week5-knime-size.png` — the step-by-step TV-size KNIME section.
- `week6-histogram.png` — the Exercise 6.1 histogram chart card.
- `week6-histogram-mobile.png` — the same chart at a 390 px viewport.
- `week6-page.png` — the full Week 6 histogram page.

## AI acknowledgement

AI was used as a drafting, coding and debugging assistant for this submission. The SVG house
sketch, page scaffolding, chart JavaScript, CSS layout and parts of the documentation were drafted
with AI help. The data processing decisions, the KNIME recipes, the chart values and the explanatory
text were reviewed and customised for this project. The student can explain the purpose of each SVG
element, the group/transform behaviour, the D3 data join, the scales, the axes, the line generator,
the pie/arc geometry, the histogram bins and each KNIME node.

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
   - **5.3** — show `d3.pie()`, `d3.arc()`, the inner radius, the small/medium/large rules and
     the HTML legend. Open `js/donut-chart.js`.
   - **KNIME size recipe** — show the Math Formula conversion, the Rule Engine thresholds and the
     three-row `tvScreenSizeCount.csv`.
6. Open `exercises/exercise-6.html`:
   - show the 14 bars and explain that each bar is a count of models in an energy interval;
   - open `js/shared-constants.js` and point to `d3.bin().thresholds(14)`, `xScale` and `yScale`;
   - open `js/histogram.js` and explain how `x0`, `x1` and `length` become the rectangle geometry;
   - show the console logs for the loaded rows and the 14 bins;
   - explain why `js/interactions.js` is separate and how Exercise 6.2 will reuse the bin generator.
7. Resize the browser on each chart to show the `viewBox` behaviour.
8. Open the browser console and confirm that there are no errors.
