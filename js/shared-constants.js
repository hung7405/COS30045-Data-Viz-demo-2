/* ============================================================
   Exercise 6.1 — shared constants
   ============================================================
   Dimensions, colours, scales and the bin generator live here so
   Exercise 6.2 can reuse the same setup when it adds filters.
   ============================================================ */

let width = 1000;
let height = 500;

let margin = {
  top: 24,
  right: 30,
  bottom: 64,
  left: 80
};

let innerWidth = width - margin.left - margin.right;
let innerHeight = height - margin.top - margin.bottom;

const colors = {
  bodyBackgroundColor: "#f6f7f2",
  barColor: "#0f766e",
  barHoverColor: "#134e4a",
  axisColor: "#6b7f79",
  gridColor: "#dfe7e1"
};

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

/* Scatterplot scales and its own inner chart. The histogram keeps
   its local innerChart; innerChartS is shared with interactions.js
   so Exercise 6.4 can attach tooltips to the scatterplot. */
let innerChartS;
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

const tooltipWidth = 65;
const tooltipHeight = 32;

/* Filter options for screen technology (Exercise 6.2) and the
   optional screen-size extension. */
const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false }
];

const filters_size = [
  { id: "all", label: "All Sizes", isActive: true },
  { id: "24", label: "24\"", isActive: false },
  { id: "32", label: "32\"", isActive: false },
  { id: "55", label: "55\"", isActive: false },
  { id: "65", label: "65\"", isActive: false },
  { id: "98", label: "98\"", isActive: false }
];

/* Fourteen equal-width bins give a readable overview of the
   energy distribution without hiding the long tail. The fixed
   domain keeps the bars aligned when a filter changes the data. */
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .domain([0, 2800])
  .thresholds(14);

/* A wider, shorter canvas works on desktop; a taller canvas keeps
   the axis labels legible when the SVG is scaled down on mobile. */
function configureChartDimensions() {
  const isNarrow = window.matchMedia("(max-width: 700px)").matches;

  width = isNarrow ? 640 : 1000;
  height = isNarrow ? 620 : 500;

  margin = isNarrow
    ? { top: 24, right: 24, bottom: 84, left: 68 }
    : { top: 24, right: 30, bottom: 64, left: 80 };

  innerWidth = width - margin.left - margin.right;
  innerHeight = height - margin.top - margin.bottom;
}
