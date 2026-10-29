# Data

This folder contains the small, chart-ready CSV files used by the Energy Lens pages. The raw
registration export and the class KNIME workflow are not committed, so the site is self-contained
and every chart can be reproduced from the files below.

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
large,1326
medium,2193
small,721
```

- 4,240 models in three groups.
- Small: up to 42.5 inches (721 models, 17.0%).
- Medium: 42.5–65 inches (2,193 models, 51.7%).
- Large: over 65 inches (1,326 models, 31.3%).
- The order is the alphabetical GroupBy order: large, medium, small. The donut uses
  `d3.pie().sort(null)` so that order is preserved.

### KNIME recipe

1. `CSV Reader` — read `data/tv_2026_cleaned.csv`.
2. `Math Formula` — create `screensize_inch` with `$screensize$ / 2.54`.
3. `Rule Engine` — create `Screensize_Category`:
   ```text
   $screensize_inch$ <= 42.5 => "small"
   $screensize_inch$ <= 65 => "medium"
   TRUE => "large"
   ```
4. `GroupBy` — group by `Screensize_Category`; count `Submit_ID` into `Count`.
5. `Column Filter` + `Column Renamer` — keep `Screensize_Category` and `Count`.
6. `CSV Writer` — comma delimiter, header row, quote values **Never** (or **Only when needed**),
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
