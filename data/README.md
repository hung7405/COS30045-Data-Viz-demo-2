# Data

This folder contains the small, chart-ready CSV files used by the Energy Lens pages. The raw
registration exports are not committed on their own — each KNIME workflow in `../knime/` bundles
the copy it reads — and the Week 6 KNIME workflow is included for reference. Every chart can be
reproduced from the files below.

## `tvBrandCount.csv`

The summary table used by the Week 4 dashboard bar chart.

| Field | Type | Description |
| --- | --- | --- |
| `brand` | text | Brand name, lower-case as exported from KNIME |
| `count` | integer | Number of registered television models for that brand |

- 25 brands
- 4,240 registered models
- Minimum: 24 models (Skyworth, Walton)
- Maximum: 1,096 models (Samsung)

### How it was produced

Workflow: [`knime/W4_Ex4.4_TV_Brand_Count.knwf`](../knime/W4_Ex4.4_TV_Brand_Count.knwf).

1. `CSV Reader` — read the 2026 TV registration export (`tv_2026_02_15.csv`, 4,724 rows).
2. `Column Filter` — keep `Brand_Reg`, `SoldIn` and `Availability Status`.
3. `String Cleaner` — on `Brand_Reg`: remove punctuation and leading/trailing/duplicate whitespace.
4. `String Replacer` — merge `samsung electronics` into `samsung` (case sensitive).
5. `Nominal Value Row Filter` — `Availability Status` = `Available`, then `SoldIn` = the four
   Australian combinations (4,508 rows).
6. `GroupBy` — group by `Brand_Reg`, count `SoldIn`; `Column Renamer` makes the columns
   `brand` and `count`.
7. `Row Filter` — keep brands with `count >= 20` (25 brands, 4,240 models).
8. `CSV Writer` — comma delimiter, header row, quote values **Never**.

Brand names are already lower-case in the registration export, so no `toLowerCase` step is needed.
The chart sorts the rows from largest to smallest in `js/main.js`; the CSV itself is in the
alphabetical order produced by GroupBy.

## `tvScreenEnergy55.csv`

The chart-ready summary for Exercise 5.1.

| Field | Type | Description |
| --- | --- | --- |
| `screen_tech` | text | Screen technology: `led`, `oled` or `lcd` |
| `avg_energy_kwh` | decimal | Mean labelled energy consumption in kWh/year |
| `count` | integer | Number of 55-inch models in that group |

```csv
screen_tech,avg_energy_kwh,count
led,372.05,536
oled,361.69,61
lcd,329.45,71
```

- 668 models in the 55-inch class.
- The 55-inch class is `screensize` between **138.7 and 138.8 cm**; the median is 138.783 cm.
- The mean uses `Labelled energy consumption (kWh/year)`.
- The values differ slightly from the sample numbers on the slide because this summary is
  calculated from the cleaned 2026 table used in Week 4.

### KNIME recipe

Workflow: [`knime/W5_Ex5.1_TV_55inch_Energy.knwf`](../knime/W5_Ex5.1_TV_55inch_Energy.knwf).

1. `CSV Reader` — read the bundled copy of `tv_2026_cleaned.csv` (4,240 rows, 33 columns, UTF-8).
2. `Nominal Value Row Filter` — `Availability Status`, include `Available`.
3. `Nominal Value Row Filter` — `SoldIn`, include the four values that contain `Australia`.
4. `Rule-based Row Filter` — keep 55-inch models (668):
   ```text
   $screensize$ >= 138.7 AND $screensize$ <= 138.8 => TRUE
   TRUE => FALSE
   ```
   (A range `Row Filter` on `screensize` with 138.7–138.8 gives the same rows.)
5. `Rule Engine` — create `Screen_Type` with lower-case labels for the chart:
   ```text
   $Screen_Tech$ = "LCD (LED)" => "led"
   $Screen_Tech$ = "OLED" => "oled"
   $Screen_Tech$ = "LCD" => "lcd"
   TRUE => "other"
   ```
6. `GroupBy` — group by `Screen_Type`; **Mean** of `Labelled energy consumption (kWh/year)` and
   **Count** of `Model_No`.
7. `Column Renamer` — `Screen_Type` → `screen_tech`,
   `Labelled energy consumption (kWh/year)` → `avg_energy_kwh`, `Model_No` → `count`.
8. `CSV Writer` — comma delimiter, header row, quote values **Never**, overwrite existing file,
   UTF-8.

## `tvScreenSizeCount.csv`

The chart-ready summary for Exercise 5.3.

| Field | Type | Description |
| --- | --- | --- |
| `Screensize_Category` | text | Size band: `small`, `medium` or `large` |
| `Count` | integer | Number of registered models in that band |

```csv
Screensize_Category,Count
large,1352
medium,2386
small,770
```

- 4,508 models from the exercise dataset (Australia + Available) in three groups.
- Small: up to 42 inches (770 models, 17.1%).
- Medium: 42–65 inches (2,386 models, 52.9%).
- Large: over 65 inches (1,352 models, 30.0%).
- The order is the alphabetical GroupBy order: large, medium, small. The donut uses
  `d3.pie().sort(null)` so that order is preserved.
- The Week 4 cleaned table has 4,240 rows after brand cleaning, so 5.3 uses its own
  exercise-dataset summary rather than the cleaned table.

### KNIME recipe

Workflow: [`knime/W5_Ex5.3_TV_Size_Mix.knwf`](../knime/W5_Ex5.3_TV_Size_Mix.knwf).

1. `CSV Reader` — read the bundled copy of the exercise dataset
   (`2026 TV Data.csv` / `tv_2026_02_15.csv`, 4,724 rows).
2. `Nominal Value Row Filter` — `Availability Status`, include `Available`.
3. `Nominal Value Row Filter` — `SoldIn`, include the four values that contain `Australia`
   (4,508 rows after both filters).
4. `Math Formula` — create `screensize_inch` with `$screensize$ / 2.54`.
5. `Rule Engine` — create `Screensize_Category`:
   ```text
   $screensize_inch$ <= 42 => "small"
   $screensize_inch$ <= 65 => "medium"
   TRUE => "large"
   ```
   Keep the boundaries at `<= 42` and `<= 65`; using `< 43` moves 43-inch models into *medium*
   and gives 1,107 / 2,049 / 1,352 instead of the values below.
6. `GroupBy` — group by `Screensize_Category`; **Count** of `Submit_ID`.
7. `Column Renamer` — `Submit_ID` → `Count`.
8. `CSV Writer` — comma delimiter, header row, quote values **Never**, overwrite existing file,
   UTF-8.

## `ARE_Spot_Prices.csv`

The course-provided spot-price series used by Exercise 5.2.

| Field | Type | Description |
| --- | --- | --- |
| `Year` | integer | Calendar year, 1998–2024 |
| `Queensland ($ per megawatt hour)` | decimal | Queensland annual average |
| `New South Wales ($ per megawatt hour)` | decimal | New South Wales annual average |
| `Victoria ($ per megawatt hour)` | decimal | Victoria annual average |
| `South Australia ($ per megawatt hour)` | decimal | South Australia annual average |
| `Tasmania ($ per megawatt hour)` | decimal | Tasmania annual average; blank for early years |
| `Snowy ($ per megawatt hour)` | decimal | Snowy annual average; blank for early years |
| `Average Price (notTas-Snowy)` | decimal | National average excluding Tasmania and Snowy |

- 27 annual rows, 1998–2024.
- The chart uses the `Average Price (notTas-Snowy)` column.
- Tasmania and Snowy are excluded from the average because those series do not cover the full
  period; averaging only the available years would make the national average inconsistent.

## `tv_2026_cleaned.csv`

The cleaned 25-brand television table used as the KNIME input for both Week 5 recipes.

- 4,240 rows × 33 columns.
- Brand names are lower-case; `samsung electronics` is merged into `samsung`.
- Filters: `Availability Status = Available` and `SoldIn` in the four Australian combinations.
- Contains the columns needed for both Week 5 recipes, including `screensize`, `Screen_Tech` and
  `Labelled energy consumption (kWh/year)`.
- The file begins with a UTF-8 byte-order mark before `Submit_ID`; read it as UTF-8 and KNIME
  will treat the first row as the column header.

The class workflow that produced this table (`2026 TV Data.knwf`) is not committed, but the raw
registration export it read is bundled inside the Week 4 and Week 5 workflows in `../knime/`. The
cleaned table is included here so the charts and the KNIME recipes can be reproduced without
running the original workflow.

## `Ex6_TVdata_withStar.csv`

The exercise table used by the Week 6 histogram, filters and scatterplot.

| Field | Type | Description |
| --- | --- | --- |
| `brand` | text | Brand name |
| `model` | text | Model identifier |
| `screenSize` | integer | Screen size in inches |
| `screenTech` | text | `LED`, `LCD` or `OLED` |
| `star` | decimal | Energy star rating |
| `energyConsumption` | integer | Labelled energy consumption in kWh/year |

- 4,233 rows × 6 columns.
- `energyConsumption` ranges from **56 to 2,652 kWh/year**.
- The histogram uses 14 equal-width bins from **0 to 2,800 kWh/year**.
- The tallest bin is **200–400 kWh/year** with **1,387 models**.
- One model sits in the final **2,600–2,800 kWh/year** bin.
- Screen technology: **LED 3,492**, **LCD 455**, **OLED 286** models.
- The optional size filter uses the most frequent sizes: **24, 32, 55, 65 and 98 inches**.
- The scatterplot uses `star` on the x-axis and `energyConsumption` on the y-axis, with
  `screenTech` mapped to colour.
- Created with the Week 6 KNIME workflow (`W6_TVdata.knwf`) from the January 2026 registration
  data.
- Source:
  [Energy Rating Data for household appliances — Televisions](https://data.gov.au/data/dataset/energy-rating-for-household-appliances),
  downloaded January 2026.

### KNIME workflow

The `W6_TVdata.knwf` file is the workflow supplied with the exercise. It reads the January 2026
registration export, cleans and renames the columns, and writes `Ex6_TVdata_withStar.csv`. The
histogram, filters and scatterplot are built in D3; KNIME only prepares the tidy table.
