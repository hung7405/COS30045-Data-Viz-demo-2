/* ============================================================
   Exercise 6.3 — scatterplot
   ============================================================
   Star rating on x, labelled energy consumption on y, and screen
   technology shown with hue. The shared innerChartS, scales and
   colour scale live in shared-constants.js.
   ============================================================ */

function drawScatterplot(data) {
  configureChartDimensions();

  const chartContainer = d3.select("#scatterplot");
  chartContainer.selectAll("*").remove();

  const screenTechs = Array.from(new Set(data.map(d => d.screenTech)));
  colorScale.domain(screenTechs).range(d3.schemeCategory10);

  xScaleS
    .domain([0, d3.max(data, d => d.star)])
    .range([0, innerWidth])
    .nice();

  yScaleS
    .domain([0, d3.max(data, d => d.energyConsumption)])
    .range([innerHeight, 0])
    .nice();

  console.log("Scatterplot data", data);
  console.log("Scatterplot colour domain", colorScale.domain());

  const svg = chartContainer
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img")
    .attr("aria-labelledby", "scatter-title scatter-desc");

  svg
    .append("title")
    .attr("id", "scatter-title")
    .text("Energy consumption by star rating and screen technology");

  svg
    .append("desc")
    .attr("id", "scatter-desc")
    .text(
      "Scatterplot of " +
      data.length +
      " television models. The x-axis is the star rating; the y-axis is labelled energy " +
      "consumption in kilowatt-hours per year. Colour shows LED, LCD or OLED screen technology."
    );

  /* The scatterplot has its own inner chart so interactions.js can
     attach tooltips to it in Exercise 6.4. */
  innerChartS = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  innerChartS
    .append("g")
    .attr("class", "grid")
    .attr("pointer-events", "none")
    .call(
      d3
        .axisLeft(yScaleS)
        .ticks(6)
        .tickSize(-innerWidth)
        .tickFormat(() => "")
    );

  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 3)
    .attr("cx", d => xScaleS(d.star))
    .attr("cy", d => yScaleS(d.energyConsumption))
    .attr("fill", d => colorScale(d.screenTech))
    .attr("opacity", 0.5);

  const xAxisS = d3
    .axisBottom(xScaleS)
    .ticks(8)
    .tickFormat(d3.format("d"));

  const yAxisS = d3
    .axisLeft(yScaleS)
    .ticks(6)
    .tickFormat(d3.format(","));

  innerChartS
    .append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxisS);

  innerChartS
    .append("g")
    .attr("class", "axis axis-y")
    .call(yAxisS);

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 16)
    .attr("text-anchor", "middle")
    .text("Star rating");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(8, ${margin.top + innerHeight / 2}) rotate(-90)`)
    .attr("text-anchor", "middle")
    .text("Labelled energy consumption (kWh/year)");

  /* Legend attached to the SVG, in the top-right corner. */
  const legend = svg
    .append("g")
    .attr("class", "scatter-legend")
    .attr("transform", `translate(${width - 120}, ${margin.top})`);

  colorScale.domain().forEach((screenTech, index) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${index * 20})`);

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", colorScale(screenTech));

    legendRow
      .append("text")
      .attr("x", 16)
      .attr("y", 10)
      .text(screenTech);
  });
}

let scatterResizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(scatterResizeTimer);
  scatterResizeTimer = setTimeout(() => {
    if (week6Data.length > 0) {
      drawScatterplot(week6Data);
    }
  }, 150);
});
