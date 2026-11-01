# Data

This folder contains the small, chart-ready CSV files used by the Energy Lens pages. The raw
registration exports are not committed, but the Week 6 KNIME workflow is included for reference.
Every chart can be reproduced from the files below.

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

1. Start with the 2026 TV registration export used in the unit's KNIME workflow.
2. Clean the brand names with the String Cleaner and String Replacer nodes.
3. Filter to the relevant product rows: `Availability Status = Available` and the four Australian
   `SoldIn` combinations.
4. Merge `samsung electronics` into `samsung` and convert the brand names to lower-case.
5. Group by brand and count the models.
6. Export the grouped table as CSV with quote values set to **Never**.

The chart sorts the rows from largest to smallest in `js/main.js`; the CSV itself is in the
alphabetical order produced by the export.

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

1. `CSV Reader` — read `data/tv_2026_cleaned.csv`.
2. `Row Filter` — keep `screensize` between 138.7 and 138.8.
3. `Rule Engine` — map `LCD (LED)` → `LED`, `OLED` → `OLED`, `LCD` → `LCD`.
4. `GroupBy` — group by the screen type; mean of `Labelled energy consumption (kWh/year)`;
   count the rows.
5. `Column Filter` + `Column Renamer` — keep and rename the three output columns.
6. `CSV Writer` — comma delimiter, header row, quote values **Never** (or **Only when needed**),
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

1. `CSV Reader` — read the exercise dataset (`2026 TV Data.csv` / `tv_2026_02_15.csv`).
2. `Row Filter` — keep `SoldIn` containing `Australia` and
   `Availability Status = Available` (4,508 rows). Skip this if the file is already filtered.
3. `Math Formula` — create `screensize_inch` with `$screensize$ / 2.54`.
4. `Rule Engine` — create `Screensize_Category`:
   ```text
   $screensize_inch$ <= 42 => "small"
   $screensize_inch$ <= 65 => "medium"
   TRUE => "large"
   ```
5. `GroupBy` — group by `Screensize_Category`; count `Submit_ID` into `Count`.
6. `Column Filter` + `Column Renamer` — keep `Screensize_Category` and `Count`.
7. `CSV Writer` — comma delimiter, header row, quote values **Never** (or **Only when needed**),
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

The raw registration export and the class workflow (`2026 TV Data.knwf`) are not committed. The
cleaned table is included so the charts and the KNIME recipe can be reproduced without running the
original workflow.

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
