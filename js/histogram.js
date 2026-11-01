/* ============================================================
   Exercise 6.1 — histogram
   ============================================================
   The data is loaded in load-data.js. This file only draws the
   chart: bins, scales, bars, axes and labels.
   ============================================================ */

function drawHistogram(data) {
  configureChartDimensions();

  const chartContainer = d3.select("#histogram");
  chartContainer.selectAll("*").remove();

  const bins = binGenerator(data);
  const maxCount = d3.max(bins, d => d.length);

  console.log("Histogram bins", bins);
  console.log("Largest bin count", maxCount);

  xScale
    .domain([bins[0].x0, bins[bins.length - 1].x1])
    .range([0, innerWidth])
    .nice();

  yScale
    .domain([0, maxCount])
    .range([innerHeight, 0])
    .nice();

  const svg = chartContainer
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img")
    .attr("aria-labelledby", "histogram-title histogram-desc");

  svg
    .append("title")
    .attr("id", "histogram-title")
    .text("Distribution of TV energy consumption");

  svg
    .append("desc")
    .attr("id", "histogram-desc")
    .text(
      "Histogram of labelled energy consumption for " +
      data.length +
      " television models. The x-axis is energy consumption in kilowatt-hours per year; " +
      "the y-axis is the number of models in each bin."
    );

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  /* Horizontal grid lines sit behind the bars. */
  innerChart
    .append("g")
    .attr("class", "grid")
    .attr("pointer-events", "none")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(6)
        .tickSize(-innerWidth)
        .tickFormat(() => "")
    );

  innerChart
    .selectAll("rect.bar")
    .data(bins)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d.x0) + 1)
    .attr("y", d => yScale(d.length))
    .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
    .attr("height", d => innerHeight - yScale(d.length))
    .attr("rx", 2)
    .attr("fill", colors.barColor)
    .append("title")
    .text(
      d =>
        `${d3.format(",")(d.x0)}–${d3.format(",")(d.x1)} kWh/year: ` +
        `${d3.format(",")(d.length)} models`
    );

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(7)
    .tickFormat(d3.format(","));

  const yAxis = d3
    .axisLeft(yScale)
    .ticks(6)
    .tickFormat(d3.format(","));

  innerChart
    .append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);

  innerChart
    .append("g")
    .attr("class", "axis axis-y")
    .call(yAxis);

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 16)
    .attr("text-anchor", "middle")
    .text("Energy consumption (kWh/year)");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(8, ${margin.top + innerHeight / 2}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .text("Number of TV models");
}

/* Re-render when the viewport crosses the desktop/mobile breakpoint
   or the chart container changes size. */
let histogramResizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(histogramResizeTimer);
  histogramResizeTimer = setTimeout(() => {
    if (week6Data.length > 0) {
      drawHistogram(week6Data);

      /* Keep the active filter after a resize. */
      if (typeof updateHistogram === "function") {
        updateHistogram(week6Data);
      }
    }
  }, 150);
});
