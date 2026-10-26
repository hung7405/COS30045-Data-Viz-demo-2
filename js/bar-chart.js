/* ============================================================
   COS30045 Data Visualisation — Demo 2
   Exercise 5.1: vertical bar chart with labelled x and y axes

   Data: data/tvScreenEnergy55.csv
   Columns: screen_tech, avg_energy_kwh, count
   ============================================================ */

const SCREEN_BAR = {
  width: 1120,
  height: 520,
  margin: { top: 42, right: 170, bottom: 78, left: 92 }
};

const screenBarInnerWidth =
  SCREEN_BAR.width - SCREEN_BAR.margin.left - SCREEN_BAR.margin.right;
const screenBarInnerHeight =
  SCREEN_BAR.height - SCREEN_BAR.margin.top - SCREEN_BAR.margin.bottom;

const screenBarNumber = d3.format(",.0f");
const screenBarOneDecimal = d3.format(",.1f");

const screenBarSvg = d3.select("#bar-chart")
  .append("svg")
  .attr("id", "screen-bar-chart")
  .attr("viewBox", `0 0 ${SCREEN_BAR.width} ${SCREEN_BAR.height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("role", "img")
  .attr("aria-labelledby", "screen-bar-title screen-bar-desc");

screenBarSvg.append("title")
  .attr("id", "screen-bar-title")
  .text("Average energy consumption of 55-inch televisions by screen technology");

screenBarSvg.append("desc")
  .attr("id", "screen-bar-desc")
  .text("A vertical bar chart. LED televisions average 372 kilowatt hours per year, OLED 362, and LCD 329. The LED and OLED bars are close; LCD is lower.");

/* A vertical gradient gives the bars a little depth without changing the value. */
const screenBarDefs = screenBarSvg.append("defs");
const screenBarGradient = screenBarDefs.append("linearGradient")
  .attr("id", "screenBarGradient")
  .attr("x1", "0%")
  .attr("x2", "0%")
  .attr("y1", "0%")
  .attr("y2", "100%");

screenBarGradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#2dd4bf");
screenBarGradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#0f766e");

d3.csv("../data/tvScreenEnergy55.csv", row => ({
  screenTech: row.screen_tech,
  avgEnergy: +row.avg_energy_kwh,
  count: +row.count
}))
  .then(data => {
    data.sort((a, b) => b.avgEnergy - a.avgEnergy);
    drawScreenBarChart(data);
  })
  .catch(error => {
    console.error("Could not load ../data/tvScreenEnergy55.csv", error);
    d3.select("#bar-chart")
      .html(`<div class="chart-error"><strong>Data could not be loaded.</strong><br>
        Open the site through Live Server or another local web server so the browser can read
        <code>data/tvScreenEnergy55.csv</code>.</div>`);
  });

function drawScreenBarChart(data) {
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screenTech))
    .range([0, screenBarInnerWidth])
    .padding(0.32);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.avgEnergy) * 1.16])
    .nice()
    .range([screenBarInnerHeight, 0]);

  const innerChart = screenBarSvg.append("g")
    .attr("class", "screen-bar-inner")
    .attr(
      "transform",
      `translate(${SCREEN_BAR.margin.left}, ${SCREEN_BAR.margin.top})`
    );

  /* Horizontal grid lines sit behind the bars. */
  innerChart.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-screenBarInnerWidth)
        .tickFormat("")
    );

  /* X axis: screen technology. */
  innerChart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${screenBarInnerHeight})`)
    .call(
      d3.axisBottom(xScale)
        .tickSizeOuter(0)
        .tickFormat(d => d.toUpperCase())
    );

  /* Y axis: average energy consumption. */
  innerChart.append("g")
    .attr("class", "axis axis-y")
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(screenBarNumber)
        .tickSizeOuter(0)
    );

  /* Y axis label, rotated so it reads bottom-to-top. */
  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -screenBarInnerHeight / 2)
    .attr("y", -64)
    .attr("text-anchor", "middle")
    .text("Energy consumption (kWh/year)");

  /* X axis label. */
  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("x", screenBarInnerWidth / 2)
    .attr("y", screenBarInnerHeight + 56)
    .attr("text-anchor", "middle")
    .text("Screen technology");

  const bars = innerChart.append("g")
    .attr("class", "vbar-layer")
    .selectAll("g.vbar-row")
    .data(data)
    .join("g")
    .attr("class", "vbar-row")
    .attr("transform", d => `translate(${xScale(d.screenTech)}, 0)`);

  bars.append("rect")
    .attr("class", "vbar")
    .attr("x", 0)
    .attr("y", d => yScale(d.avgEnergy))
    .attr("width", xScale.bandwidth())
    .attr("height", d => screenBarInnerHeight - yScale(d.avgEnergy))
    .attr("rx", 6)
    .attr("fill", "url(#screenBarGradient)");

  bars.append("title")
    .text(d => `${d.screenTech.toUpperCase()}: ${screenBarOneDecimal(d.avgEnergy)} kWh/year (${d.count} models)`);

  /* Value labels above each bar. */
  bars.append("text")
    .attr("class", "vbar-value")
    .attr("x", xScale.bandwidth() / 2)
    .attr("y", d => yScale(d.avgEnergy) - 13)
    .attr("text-anchor", "middle")
    .text(d => `${screenBarNumber(d.avgEnergy)} kWh`);

  /* Small count label under each category. */
  bars.append("text")
    .attr("class", "vbar-count")
    .attr("x", xScale.bandwidth() / 2)
    .attr("y", screenBarInnerHeight + 36)
    .attr("text-anchor", "middle")
    .text(d => `${d.count} models`);
}
