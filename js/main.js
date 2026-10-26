/* ============================================================
   COS30045 Data Visualisation — Demo 2
   Exercise 4.3–4.7: responsive D3 horizontal bar chart

   Data flow:
   CSV -> row conversion -> sort -> bind -> scale -> draw -> label
   ============================================================ */

const CHART = {
  width: 1120,
  height: 840,
  margin: { top: 38, right: 132, bottom: 68, left: 158 }
};

const innerWidth = CHART.width - CHART.margin.left - CHART.margin.right;
const innerHeight = CHART.height - CHART.margin.top - CHART.margin.bottom;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const numberFormat = d3.format(",");
const percentFormat = d3.format(".1%");

/* Brand names in the source file are lower-case. Keep the display names
   consistent with how each brand is normally written. */
const BRAND_NAMES = {
  aiwa: "Aiwa",
  akai: "Akai",
  bauhn: "Bauhn",
  blaupunkt: "Blaupunkt",
  caixun: "Caixun",
  chiq: "CHiQ",
  eko: "EKO",
  emete: "Emete",
  englaon: "Englaon",
  ffalcon: "FFalcon",
  hisense: "Hisense",
  jvc: "JVC",
  kogan: "Kogan",
  lg: "LG",
  linsar: "Linsar",
  loewe: "Loewe",
  philips: "Philips",
  samsung: "Samsung",
  skyworth: "Skyworth",
  sony: "Sony",
  "spark electronics": "Spark Electronics",
  sylvox: "Sylvox",
  tcl: "TCL",
  toshiba: "Toshiba",
  walton: "Walton"
};

const displayBrand = brand => BRAND_NAMES[brand] || brand.replace(/\b\w/g, letter => letter.toUpperCase());

/* Exercise 4.3 — create the responsive SVG canvas. */
const svg = d3.select("#chart-container")
  .append("svg")
  .attr("id", "bar-chart")
  .attr("viewBox", `0 0 ${CHART.width} ${CHART.height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("role", "img")
  .attr("aria-labelledby", "bar-chart-title bar-chart-desc");

svg.append("title")
  .attr("id", "bar-chart-title")
  .text("Registered television models by brand in Australia, 2026");

svg.append("desc")
  .attr("id", "bar-chart-desc")
  .text("A horizontal bar chart sorted from largest to smallest. Samsung has the most registered models at 1,096, followed by Kogan with 788 and LG with 677.");

/* A teal gradient is used for every bar. Length, not colour, carries the value. */
const defs = svg.append("defs");
const barGradient = defs.append("linearGradient")
  .attr("id", "barGradient")
  .attr("x1", "0%")
  .attr("x2", "100%")
  .attr("y1", "0%")
  .attr("y2", "0%");

barGradient.append("stop").attr("offset", "0%").attr("stop-color", "#0f766e");
barGradient.append("stop").attr("offset", "100%").attr("stop-color", "#2dd4bf");

const chart = svg.append("g")
  .attr("class", "chart-inner")
  .attr("transform", `translate(${CHART.margin.left}, ${CHART.margin.top})`);

const tooltip = d3.select("#chart-tooltip");
const chartCard = document.querySelector(".chart-card");

/* Exercise 4.4 — load the CSV and type the count column as a number. */
d3.csv("data/tvBrandCount.csv", row => ({
  brand: row.brand,
  count: +row.count
}))
  .then(data => {
    // Exercise 4.4 — inspect the data and basic statistics in the console.
    console.log("TV brand data", data);
    console.log("Number of brands", data.length);
    console.log("Maximum count", d3.max(data, d => d.count));
    console.log("Minimum count", d3.min(data, d => d.count));
    console.log("Extent", d3.extent(data, d => d.count));

    // Sort largest first so the chart tells the story immediately.
    data.sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand));

    d3.select("#chart-loading").remove();
    drawBarChart(data);
    renderDataTable(data);
    updateSummary(data);
  })
  .catch(error => {
    console.error("Could not load data/tvBrandCount.csv", error);
    d3.select("#chart-container")
      .html(`<div class="chart-error"><strong>Data could not be loaded.</strong><br>
        Open the site through Live Server (or another local web server) so the browser is allowed
        to read <code>data/tvBrandCount.csv</code>.</div>`);
  });

/* Exercise 4.5–4.7 — bind data, scale it, draw bars and attach labels. */
function drawBarChart(data) {
  const maxCount = d3.max(data, d => d.count);

  // Exercise 4.6 — quantitative x scale.
  const xScale = d3.scaleLinear()
    .domain([0, maxCount * 1.08])
    .range([0, innerWidth]);

  // Exercise 4.6 — categorical y scale with padding between the bars.
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.brand))
    .range([0, innerHeight])
    .padding(0.18);

  // Grid lines sit behind the bars and are drawn from the x scale.
  chart.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3.axisBottom(xScale)
        .ticks(6)
        .tickSize(-innerHeight)
        .tickFormat("")
    );

  // The x axis is repeated at the bottom so the value scale is readable.
  chart.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3.axisBottom(xScale)
        .ticks(6)
        .tickFormat(numberFormat)
        .tickSizeOuter(0)
    );

  chart.append("text")
    .attr("class", "axis-label")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 50)
    .attr("text-anchor", "middle")
    .text("Registered television models");

  // Exercise 4.7 — one group per brand keeps the bar and both labels together.
  const barAndLabel = chart.append("g")
    .attr("class", "bar-layer")
    .selectAll("g.bar-row")
    .data(data, d => d.brand)
    .join("g")
    .attr("class", "bar-row")
    .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

  // Exercise 4.5 — the rectangle's width comes from the count, not from pixels.
  barAndLabel.append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 0)
    .attr("height", yScale.bandwidth())
    .attr("rx", Math.min(5, yScale.bandwidth() / 5))
    .attr("tabindex", 0)
    .attr("role", "img")
    .attr("aria-label", d => `${displayBrand(d.brand)}: ${numberFormat(d.count)} registered models`)
    .on("mouseenter", (event, d) => showTooltip(event, d, data))
    .on("mousemove", (event, d) => showTooltip(event, d, data))
    .on("mouseleave", hideTooltip)
    .on("focus", (event, d) => showTooltipAtElement(event.currentTarget, d, data))
    .on("blur", hideTooltip)
    .transition()
    .duration(reduceMotion ? 0 : 850)
    .delay((d, i) => (reduceMotion ? 0 : i * 22))
    .attr("width", d => xScale(d.count));

  // A native title is a fallback for touch devices and screen readers.
  barAndLabel.append("title")
    .text(d => `${displayBrand(d.brand)}: ${numberFormat(d.count)} registered models`);

  // Brand label, right-aligned in the left margin.
  barAndLabel.append("text")
    .attr("class", "bar-label")
    .attr("x", -14)
    .attr("y", yScale.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(d => displayBrand(d.brand));

  // Value label at the end of each bar.
  barAndLabel.append("text")
    .attr("class", "bar-value")
    .attr("x", d => xScale(d.count) + 8)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dominant-baseline", "middle")
    .text(d => numberFormat(d.count));
}

/* Tooltip helpers --------------------------------------------------------- */

function showTooltip(event, d, data) {
  const cardBox = chartCard.getBoundingClientRect();
  const left = Math.min(
    event.clientX - cardBox.left + 16,
    cardBox.width - 240
  );
  const top = event.clientY - cardBox.top - 12;
  paintTooltip(left, top, d, data);
}

function showTooltipAtElement(element, d, data) {
  const cardBox = chartCard.getBoundingClientRect();
  const box = element.getBoundingClientRect();
  const left = Math.min(
    box.right - cardBox.left + 14,
    cardBox.width - 240
  );
  const top = box.top - cardBox.top + box.height / 2 - 20;
  paintTooltip(left, top, d, data);
}

function paintTooltip(left, top, d, data) {
  const total = d3.sum(data, row => row.count);
  tooltip
    .style("left", `${left}px`)
    .style("top", `${top}px`)
    .html(`<strong>${displayBrand(d.brand)}</strong><br>${numberFormat(d.count)} registered models<br>${percentFormat(d.count / total)} of all registrations`)
    .classed("is-visible", true);
}

function hideTooltip() {
  tooltip.classed("is-visible", false);
}

/* Data table -------------------------------------------------------------- */

function renderDataTable(data) {
  const total = d3.sum(data, row => row.count);
  const wrap = d3.select("#data-table-wrap");
  wrap.html("");

  wrap.append("h4").text("Registered models by brand");

  const table = wrap.append("div")
    .attr("class", "table-scroll")
    .append("table")
    .attr("class", "data-table");

  table.append("thead")
    .append("tr")
    .selectAll("th")
    .data(["Rank", "Brand", "Registered models", "Share"])
    .join("th")
    .text(d => d);

  table.append("tbody")
    .selectAll("tr")
    .data(data)
    .join("tr")
    .each(function (d, i) {
      const row = d3.select(this);
      row.append("td").text(i + 1);
      row.append("td").text(displayBrand(d.brand));
      row.append("td").text(numberFormat(d.count));
      row.append("td").text(percentFormat(d.count / total));
    });
}

/* Summary numbers in the hero -------------------------------------------- */

function updateSummary(data) {
  const total = d3.sum(data, row => row.count);
  const top = data[0];
  const topThree = d3.sum(data.slice(0, 3), row => row.count);

  d3.select("#hero-total").text(numberFormat(total));
  d3.select("#hero-brand-count").text(data.length);
  d3.select("#hero-top-count").text(numberFormat(top.count));
  d3.select("#hero-top-share").text(percentFormat(top.count / total));
  d3.select("#hero-top3-share").text(percentFormat(topThree / total));
}

/* Toggle the accessible data table --------------------------------------- */

const tableButton = document.getElementById("toggle-table");
const tableWrap = document.getElementById("data-table-wrap");

tableButton.addEventListener("click", () => {
  const isHidden = tableWrap.hasAttribute("hidden");

  if (isHidden) {
    tableWrap.removeAttribute("hidden");
    tableButton.textContent = "Hide data table";
    tableButton.setAttribute("aria-expanded", "true");
  } else {
    tableWrap.setAttribute("hidden", "");
    tableButton.textContent = "View data table";
    tableButton.setAttribute("aria-expanded", "false");
  }
});
