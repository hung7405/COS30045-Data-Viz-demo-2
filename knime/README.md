# KNIME workflows

Three self-contained KNIME Analytics Platform workflows for the KNIME parts of the Demo 2
exercises. Each `.knwf` bundles its own copy of the input CSV in the workflow data area, so the
readers resolve to `<workflow>/data/*.csv` with no path fixing, and each one writes the CSV that the
web pages load from `../data/`.

| Workflow | Exercise | Reads (from its own `data/` folder) | Writes | Rows out |
| --- | --- | --- | --- | --- |
| `W4_Ex4.4_TV_Brand_Count.knwf` | 4.4 | `tv_2026_02_15.csv` (4,724 raw registrations) | `tvBrandCount.csv` | 25 brands / 4,240 models |
| `W5_Ex5.1_TV_55inch_Energy.knwf` | 5.1 | `tv_2026_cleaned.csv` (4,240 cleaned models) | `tvScreenEnergy55.csv` | 3 screen types (led, oled, lcd) |
| `W5_Ex5.3_TV_Size_Mix.knwf` | 5.3 | `tv_2026_02_15.csv` (4,724 raw registrations) | `tvScreenSizeCount.csv` | 3 size groups |

Built and tested with **KNIME Analytics Platform 5.12** (node bundles `org.knime.base`, versions
`5.12.0`).

## Exercises that need KNIME

| Exercise | KNIME work |
| --- | --- |
| 4.4 Brand count | `W4_Ex4.4_TV_Brand_Count.knwf` (this folder) |
| 5.1 55-inch energy summary | `W5_Ex5.1_TV_55inch_Energy.knwf` (this folder) |
| 5.3 Size mix summary | `W5_Ex5.3_TV_Size_Mix.knwf` (this folder) |
| 6.1–6.4 Week 6 | the course workflow supplied with the exercise, `../data/W6_TVdata.knwf` |
| 4.3, 4.5, 4.6, 5.2 | none — these are pure HTML/D3 exercises |

## How to open and run a workflow

1. KNIME Analytics Platform → **File → Import KNIME Workflow…** → *From file* → pick the `.knwf` →
   **Finish**. (Or double-click the file and confirm the import dialog.)
2. The workflow opens with every node already configured. Select all nodes (`Ctrl+A`) and press
   `Shift+F7` (**Execute all executable nodes**), or click the green *Execute all* arrow in the
   toolbar.
3. The last node, **CSV Writer**, writes the result into the workflow's own `data/` folder, e.g.
   `C:\Users\<you>\knime-workspace\W4-Ex4.4 TV brand count\data\tvBrandCount.csv`.
4. **Ctrl+S** saves the workflow with the executed state and the result tables, so the saved
   `.knwf` reopens green/executed.

The workflows ship **configured but not executed** (nodes are IDLE/CONFIGURED) because the results
were produced in a clean workspace and re-imported here. Running step 2 takes a few seconds per
workflow and is all that is needed before a demonstration.

`CSV Writer` is set to **overwrite** an existing file and to **Never** quote fields, which is what
the submitted `../data/*.csv` files look like (`brand,count` with no `"` characters).

## Workflow 1 — `W4_Ex4.4_TV_Brand_Count.knwf` (Exercise 4.4)

Goal: count how many models each brand sells in Australia, keeping brands with at least 20 models
for the Week 4 bar chart.

| # | Node | Settings |
| --- | --- | --- |
| 1 | CSV Reader | `data/tv_2026_02_15.csv`, comma separated, first row = header, 32 columns auto-detected |
| 4 | Column Filter | includes only `Brand_Reg`, `SoldIn`, `Availability Status` (the other 29 columns are excluded) |
| 5 | String Cleaner | `Brand_Reg` only: remove punctuation, leading/trailing and duplicate whitespace |
| 6 | String Replacer | `samsung electronics` → `samsung` (case sensitive) so the brand is not split in two |
| 7 | Nominal Value Row Filter | `Availability Status` **include** `Available` (exclude `Unavailable`) |
| 9 | Nominal Value Row Filter | `SoldIn` **include** `Australia`, `Australia,Fiji`, `Australia,New Zealand`, `Australia,Fiji,New Zealand` (exclude `New Zealand`, `Fiji,New Zealand`) |
| 10 | GroupBy | group by `Brand_Reg`; aggregation **Count** on `SoldIn` |
| 17 | Column Renamer | `Brand_Reg` → `brand`, `SoldIn` → `count` |
| 16 | Row Filter | `count` **>= 20** (default *include* mode) |
| 18 | CSV Writer | `data/tvBrandCount.csv`, quote mode **Never**, overwrite existing file |

Result: 25 brands / 4,240 models, e.g. `aiwa,44` … identical to `../data/tvBrandCount.csv`.

## Workflow 2 — `W5_Ex5.1_TV_55inch_Energy.knwf` (Exercise 5.1)

Goal: average labelled energy consumption (kWh/year) for 55-inch TVs, per screen technology.
The registration table stores `screensize` in **centimetres** and records 55-inch models as
**138.7–138.8 cm**, so that band is the 55-inch filter (668 models).

| # | Node | Settings |
| --- | --- | --- |
| 1 | CSV Reader | `data/tv_2026_cleaned.csv` (the Week 4 cleaned table, 4,240 rows, 33 columns) |
| 2 | Nominal Value Row Filter | `Availability Status` **include** `Available` |
| 3 | Nominal Value Row Filter | `SoldIn` **include** the four strings that contain `Australia` |
| 4 | Rule-based Row Filter | `$screensize$ >= 138.7 AND $screensize$ <= 138.8 => TRUE` then `TRUE => FALSE` → 668 models |
| 5 | Rule Engine | `$Screen_Tech$ = "LCD (LED)" => "led"`, `= "OLED" => "oled"`, `= "LCD" => "lcd"`, `TRUE => "other"` (lower-case labels for the chart) |
| 6 | GroupBy | group by `Screen_Type`; **Mean** of `Labelled energy consumption (kWh/year)` and **Count** of `Model_No` |
| 7 | Column Renamer | `Screen_Type` → `screen_tech`, `Labelled energy consumption (kWh/year)` → `avg_energy_kwh`, `Model_No` → `count` |
| 8 | CSV Writer | `data/tvScreenEnergy55.csv`, quote mode **Never**, overwrite |

Result (matches `../data/tvScreenEnergy55.csv`):

| screen_tech | avg_energy_kwh | count |
| --- | --- | --- |
| led | 372.05 | 536 |
| oled | 361.69 | 61 |
| lcd | 329.45 | 71 |

Notes
- `Row Filter` (range) also works: column `screensize`, *is between* 138.7 and 138.8. The
  Rule-based Row Filter is used because it is unambiguous about inclusive bounds.
- Reading the **cleaned** table is what makes the numbers match the Week 5 chart; the raw CSV has
  duplicates and unmapped brands.

## Workflow 3 — `W5_Ex5.3_TV_Size_Mix.knwf` (Exercise 5.3)

Goal: split the Australian/available models into small / medium / large by screen size (inches).

| # | Node | Settings |
| --- | --- | --- |
| 1 | CSV Reader | `data/tv_2026_02_15.csv` |
| 2 | Nominal Value Row Filter | `Availability Status` **include** `Available` |
| 3 | Nominal Value Row Filter | `SoldIn` **include** the four strings that contain `Australia` → 4,508 models |
| 4 | Math Formula | `screensize_inch` = `$screensize$ / 2.54` |
| 5 | Rule Engine | `$screensize_inch$ <= 42 => "small"`, `<= 65 => "medium"`, `TRUE => "large"` |
| 6 | GroupBy | group by `Screensize_Category`; **Count** of `Submit_ID` |
| 7 | Column Renamer | `Submit_ID` → `Count` |
| 8 | CSV Writer | `data/tvScreenSizeCount.csv`, quote mode **Never**, overwrite |

Result (matches `../data/tvScreenSizeCount.csv`, and the 4,508 total printed in the donut centre):

| Screensize_Category | Count |
| --- | --- |
| large | 1,352 |
| medium | 2,386 |
| small | 770 |

Notes
- The rules are `<= 42` and `<= 65`. Using `< 43` instead would move 43-inch models into *medium*
  and give 1,107 / 2,049 / 1,352 — do not "tidy" the thresholds.
- GroupBy returns groups in alphabetical order (large, medium, small); the donut uses
  `d3.pie().sort(null)` so it keeps that order.

## Verification

| Check | Expected |
| --- | --- |
| Raw registrations read by 4.4 and 5.3 | 4,724 rows |
| Australia + Available after the two nominal filters | 4,508 rows |
| 55-inch band (138.7–138.8 cm) | 668 rows |
| Brand count output | 25 rows, 4,240 models summed |
| `tvScreenEnergy55.csv` | `led,372.05,536` / `oled,361.69,61` / `lcd,329.45,71` |
| `tvScreenSizeCount.csv` | `large,1352` / `medium,2386` / `small,770` |

Every workflow also has a banner annotation plus a short annotation on each node, so the marking
screen shows the reasoning without opening the configuration dialogs.

## Troubleshooting

- **"Errors during load … Unable to read settings file"** — the workflow was unzipped by hand and
  the node folders lost their `(#id)` suffix. Import the `.knwf` file itself instead of a copy of
  the extracted folder.
- **Reader shows the red X / "no such file"** — the reader path is relative to the workflow
  (`knime.workflow.data`); keep the bundled `data/` folder inside the workflow.
- **Numbers have quotes in Excel** — `CSV Writer → Options → Quote values` must stay on **Never**.
- **55-inch result is empty** — the filter column is centimetres, not inches (use the
  138.7–138.8 band, or divide `screensize` by 2.54 first and filter 55).
