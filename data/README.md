# TV brand registration summary

`tvBrandCount.csv` is the summary table used by the Week 4 D3 bar chart.

## Fields

| Field | Type | Description |
| --- | --- | --- |
| `brand` | text | Brand name, lower-case as exported from KNIME |
| `count` | integer | Number of registered television models for that brand |

## How it was produced

1. Start with the 2026 TV registration export (`tv_2026_02_15.csv`) used in the unit's KNIME
   workflow.
2. Clean the brand names with the String Cleaner and String Replacer nodes.
3. Filter to the relevant product rows.
4. Group by brand and count the models.
5. Export the grouped table as CSV, with quote values set to **Never**.

The workflow used in class is `2026 TV Data.knwf`. The grouped output is kept in this repository
so the website is self-contained and the chart can be reproduced without running KNIME.

## Summary

- 25 brands
- 4,240 registered models
- Minimum: 24 models (Skyworth, Walton)
- Maximum: 1,096 models (Samsung)

The chart sorts the rows from largest to smallest in `js/main.js`; the CSV itself is in the
alphabetical order produced by the export.
