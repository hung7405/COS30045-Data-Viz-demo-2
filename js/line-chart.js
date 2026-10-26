/* ============================================================
   COS30045 Data Visualisation — Demo 2
   Exercise 5.2: scatter plot and line chart with labelled axes

   Data: data/ARE_Spot_Prices.csv
   Columns used: Year, Average Price (notTas-Snowy)
   ============================================================ */

const SPOT_LINE = {
  width: 1120,
  height: 520,
  margin: { top: 42, right: 170, bottom: 78, left: 92 }
};

const spotInnerWidth =
  SPOT_LINE.width - SPOT_LINE.margin.left - SPOT_LINE.margin.right;
const spotInnerHeight =
  SPOT_LINE.height - SPOT_LINE.margin.top - SPOT_LINE.margin.bottom;

const spotNumber = d3.format(",.0f");
const spotOneDecimal = d3.format(",.1f");
const spotYear = d3.format("d");

const spotSvg = d3.select("#line-chart")
  .append("svg")
  .attr("id", "spot-line-chart")
  .attr("viewBox", `0 0 ${SPOT_LINE.width} ${SPOT_LINE.height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("role", "img")
  .attr("aria-labelledby", "spot-line-title spot-line-desc");

spotSvg.append("title")
  .attr("id", "spot-line-title")
  .text("Average annual electricity spot price in Australia, 1998 to 2024");

spotSvg.append("desc")
  .attr("id", "spot-line-desc")
  .text("A line chart with a circle at every year. Prices stay below 60 dollars per megawatt hour until 2006, rise to a peak of 144.5 dollars in 2022, and end at 132.5 dollars in 2024.");

d3.csv("../data/ARE_Spot_Prices.csv", row => ({
  year: +row.Year,
  averagePrice: +row["Average Price (notTas-Snowy)"]
}))
  .then(data => {
    const clean = data
      .filter(d => Number.isFinite(d.year) && Number.isFinite(d.averagePrice))
      .sort((a, b) => a.year - b.year);
    drawSpotLineChart(clean);
  })
  .catch(error => {
    console.error("Could not load ../data/ARE_Spot_Prices.csv", error);
    d3.select("#line-chart")
      .html(`<div class="chart-error"><strong>Data could not be loaded.</strong><br>
        Open the site through Live Server or another local web server so the browser can read
        <code>data/ARE_Spot_Prices.csv</code>.</div>`);
  });

function drawSpotLineChart(data) {
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, spotInnerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice) * 1.12])
    .nice()
    .range([spotInnerHeight, 0]);

  const innerChart = spotSvg.append("g")
    .attr("class", "spot-line-inner")
    .attr(
      "transform",
      `translate(${SPOT_LINE.margin.left}, ${SPOT_LINE.margin.top})`
    );

  /* Horizontal grid lines. */
  innerChart.append("g")
    .attr("class", "grid")
    .call(
      d3.axisLeft(yScale)
        .ticks(6)
        .tickSize(-spotInnerWidth)
        .tickFormat("")
    );

  /* X axis: years as integers, not decimals. */
  innerChart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${spotInnerHeight})`)
    .call(
      d3.axisBottom(xScale)
        .ticks(7)
        .tickFormat(spotYear)
        .tickSizeOuter(0)
    );

  /* Y axis: dollars per megawatt hour. */
  innerChart.append("g")
    .attr("class", "axis axis-y")
    .call(
      d3.axisLeft(yScale)
        .ticks(6)
        .tickFormat(spotNumber)
        .tickSizeOuter(0)
    );

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -spotInnerHeight / 2)
    .attr("y", -64)
    .attr("text-anchor", "middle")
    .text("Average price ($/MWh)");

  innerChart.append("text")
    .attr("class", "axis-label")
    .attr("x", spotInnerWidth / 2)
    .attr("y", spotInnerHeight + 56)
    .attr("text-anchor", "middle")
    .text("Year");

  const areaGenerator = d3.area()
    .x(d => xScale(d.year))
    .y0(spotInnerHeight)
    .y1(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  innerChart.append("path")
    .datum(data)
    .attr("class", "line-area")
    .attr("d", areaGenerator);

  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice))
    .curve(d3.curveMonotoneX);

  innerChart.append("path")
    .datum(data)
    .attr("class", "line-path")
    .attr("d", lineGenerator);

  /* The circles are the scatter plot; they also mark each data point. */
  const points = innerChart.append("g")
    .attr("class", "line-points")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("class", "line-point")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.averagePrice))
    .attr("r", 3.6);

  points.append("title")
    .text(d => `${d.year}: $${spotOneDecimal(d.averagePrice)} per MWh`);

  /* Label the final point so the latest value is readable without hovering. */
  const last = data[data.length - 1];
  innerChart.append("text")
    .attr("class", "line-end-label")
    .attr("x", xScale(last.year) + 12)
    .attr("y", yScale(last.averagePrice) + 4)
    .text(`${last.year}: $${spotOneDecimal(last.averagePrice)}`);

  /* Mark the highest year with a small annotation. */
  const peak = data.reduce(
    (best, row) => (row.averagePrice > best.averagePrice ? row : best),
    data[0]
  );

  innerChart.append("circle")
    .attr("class", "line-peak-dot")
    .attr("cx", xScale(peak.year))
    .attr("cy", yScale(peak.averagePrice))
    .attr("r", 6);

  innerChart.append("text")
    .attr("class", "line-peak-label")
    .attr("x", xScale(peak.year) - 12)
    .attr("y", yScale(peak.averagePrice) - 16)
    .attr("text-anchor", "end")
    .text(`Peak ${peak.year}: $${spotOneDecimal(peak.averagePrice)}`);
}
