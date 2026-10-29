/* ============================================================
   COS30045 Data Visualisation — Demo 2
   Exercise 5.3: donut chart for the TV size mix

   Data: data/tvScreenSizeCount.csv
   Columns: Screensize_Category, Count
   ============================================================ */

const DONUT = {
  width: 560,
  height: 560,
  margin: 28,
  innerRadiusRatio: 0.6
};

const donutRadius = Math.min(
  DONUT.width,
  DONUT.height
) / 2 - DONUT.margin;

const donutInnerRadius = donutRadius * DONUT.innerRadiusRatio;

const DONUT_CATEGORY_LABELS = {
  large: "Large",
  medium: "Medium",
  small: "Small"
};

const DONUT_CATEGORY_RANGES = {
  large: "over 65 in",
  medium: "42.5–65 in",
  small: "up to 42.5 in"
};

const displayDonutCategory = category =>
  DONUT_CATEGORY_LABELS[category] ||
  category.replace(/\b\w/g, letter => letter.toUpperCase());

const donutNumber = d3.format(",");
const donutPercent = d3.format(".1%");

const donutSvg = d3.select("#donut-chart")
  .append("svg")
  .attr("id", "size-donut-chart")
  .attr("viewBox", `0 0 ${DONUT.width} ${DONUT.height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("role", "img")
  .attr("aria-labelledby", "donut-title donut-desc");

donutSvg.append("title")
  .attr("id", "donut-title")
  .text("Share of 2026 television models by screen-size group");

donutSvg.append("desc")
  .attr("id", "donut-desc")
  .text("A donut chart of the 2026 TV models grouped into small, medium and large screen sizes.");

d3.csv("../data/tvScreenSizeCount.csv", row => ({
  Screensize_Category: row.Screensize_Category,
  Count: +row.Count
}))
  .then(data => {
    /* Keep the CSV order: large, medium, small. This preserves the
       clockwise order used in the exercise and keeps the colours stable. */
    drawSizeDonut(data);
  })
  .catch(error => {
    console.error("Could not load ../data/tvScreenSizeCount.csv", error);
    d3.select("#donut-chart")
      .html(`<div class="chart-error"><strong>Data could not be loaded.</strong><br>
        Open the site through Live Server or another local web server so the browser can read
        <code>data/tvScreenSizeCount.csv</code>.</div>`);
  });

function drawSizeDonut(data) {
  const total = d3.sum(data, d => d.Count);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Screensize_Category))
    .range(d3.schemeSet2);

  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null)
    .padAngle(0.012);

  const arcs = pie(data);

  const arcGenerator = d3.arc()
    .innerRadius(donutInnerRadius)
    .outerRadius(donutRadius)
    .cornerRadius(3);

  const labelArc = d3.arc()
    .innerRadius(donutInnerRadius + 34)
    .outerRadius(donutRadius - 34);

  const chart = donutSvg.append("g")
    .attr("class", "donut-center")
    .attr("transform", `translate(${DONUT.width / 2}, ${DONUT.height / 2})`);

  const slices = chart.append("g")
    .attr("class", "donut-slices")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("class", "donut-slice")
    .attr("d", arcGenerator)
    .attr("fill", d => color(d.data.Screensize_Category))
    .attr("stroke", "rgba(255,255,255,0.92)")
    .attr("stroke-width", 2);

  slices.append("title")
    .text(d =>
      `${displayDonutCategory(d.data.Screensize_Category)}: ` +
      `${donutNumber(d.data.Count)} models (${donutPercent(d.data.Count / total)})`
    );

  /* Put the category name and share inside each slice. */
  const labels = chart.append("g")
    .attr("class", "donut-slice-labels")
    .selectAll("g")
    .data(arcs)
    .join("g")
    .attr("transform", d => `translate(${labelArc.centroid(d)})`);

  labels.append("text")
    .attr("class", "donut-slice-name")
    .attr("text-anchor", "middle")
    .attr("y", -3)
    .text(d => displayDonutCategory(d.data.Screensize_Category));

  labels.append("text")
    .attr("class", "donut-slice-share")
    .attr("text-anchor", "middle")
    .attr("y", 13)
    .text(d => donutPercent(d.data.Count / total));

  /* Centre summary. */
  chart.append("text")
    .attr("class", "donut-center-value")
    .attr("text-anchor", "middle")
    .attr("y", -8)
    .text(donutNumber(total));

  chart.append("text")
    .attr("class", "donut-center-label")
    .attr("text-anchor", "middle")
    .attr("y", 16)
    .text("TV models");

  chart.append("text")
    .attr("class", "donut-center-sub")
    .attr("text-anchor", "middle")
    .attr("y", 38)
    .text("3 size groups");

  const legend = d3.select("#donut-legend");
  legend.selectAll("*").remove();

  const legendItems = legend.selectAll("div.donut-legend-item")
    .data(data)
    .join("div")
    .attr("class", "donut-legend-item");

  legendItems.append("span")
    .attr("class", "donut-swatch")
    .style("background", d => color(d.Screensize_Category));

  legendItems.append("span")
    .attr("class", "donut-legend-name")
    .text(d =>
      `${displayDonutCategory(d.Screensize_Category)} · ${DONUT_CATEGORY_RANGES[d.Screensize_Category]}`
    );

  legendItems.append("span")
    .attr("class", "donut-legend-count")
    .text(d => donutNumber(d.Count));

  legendItems.append("span")
    .attr("class", "donut-legend-share")
    .text(d => donutPercent(d.Count / total));

  legend.append("p")
    .attr("class", "donut-legend-note")
    .text("The CSV order is kept: large starts at 12 o'clock, then medium and small clockwise.");

  donutSvg.select("#donut-desc")
    .text(
      `A donut chart of ${donutNumber(total)} 2026 TV models grouped into three screen-size bands. ` +
      data
        .map(d =>
          `${displayDonutCategory(d.Screensize_Category)} ${donutNumber(d.Count)} ` +
          `(${donutPercent(d.Count / total)})`
        )
        .join(", ") +
      "."
    );
}
