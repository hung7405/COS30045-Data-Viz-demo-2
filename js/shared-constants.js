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
  bodyBackgroundColor: "#fffaf0",
  barColor: "#d2691e",
  barHoverColor: "#a64f14",
  axisColor: "#5a3e2b",
  gridColor: "#eadfd2"
};

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

/* Fourteen equal-width bins give a readable overview of the
   energy distribution without hiding the long tail. */
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
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
