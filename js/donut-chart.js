/* ============================================================
   COS30045 Data Visualisation — Demo 2
   Exercise 5.3: donut chart for the 2026 TV brand mix

   Data: data/tvBrandCount.csv
   Columns: brand, count
   ============================================================ */

const DONUT = {
  width: 560,
  height: 560,
  margin: 28,
  topN: 8
};

const donutRadius = Math.min(
  DONUT.width,
  DONUT.height
) / 2 - DONUT.margin;

const donutInnerRadius = donutRadius * 0.58;

const donutColors = [
  "#0f766e",
  "#14b8a6",
  "#2dd4bf",
  "#5eead4",
  "#99f6e4",
  "#a3e635",
  "#84cc16",
  "#65a30d",
  "#64748b"
];

const DONUT_BRAND_NAMES = {
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

const displayDonutBrand = brand =>
  DONUT_BRAND_NAMES[brand] ||
  brand.replace(/\b\w/g, letter => letter.toUpperCase());

const donutNumber = d3.format(",");
const donutPercent = d3.format(".1%");

const donutSvg = d3.select("#donut-chart")
  .append("svg")
  .attr("id", "brand-donut-chart")
  .attr("viewBox", `0 0 ${DONUT.width} ${DONUT.height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("role", "img")
  .attr("aria-labelledby", "donut-title donut-desc");

donutSvg.append("title")
  .attr("id", "donut-title")
  .text("Share of 2026 television registrations by brand");

donutSvg.append("desc")
  .attr("id", "donut-desc")
  .text("A donut chart showing the top eight TV brands and a combined Other slice. Samsung leads with 1,096 models, followed by Kogan with 788 and LG with 677.");

d3.csv("../data/tvBrandCount.csv", row => ({
  brand: row.brand,
  count: +row.count
}))
  .then(data => {
    data.sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand));
    drawBrandDonut(data);
  })
  .catch(error => {
    console.error("Could not load ../data/tvBrandCount.csv", error);
    d3.select("#donut-chart")
      .html(`<div class="chart-error"><strong>Data could not be loaded.</strong><br>
        Open the site through Live Server or another local web server so the browser can read
        <code>data/tvBrandCount.csv</code>.</div>`);
  });

function drawBrandDonut(data) {
  const total = d3.sum(data, d => d.count);
  const top = data.slice(0, DONUT.topN);
  const rest = data.slice(DONUT.topN);
  const otherCount = d3.sum(rest, d => d.count);

  const chartData = [
    ...top.map(d => ({ ...d, label: displayDonutBrand(d.brand) })),
    ...(otherCount > 0
      ? [{
          brand: "other",
          label: "Other",
          count: otherCount,
          brandCount: rest.length
        }]
      : [])
  ];

  const color = d3.scaleOrdinal()
    .domain(chartData.map(d => d.label))
    .range(donutColors);

  const pie = d3.pie()
    .value(d => d.count)
    .sort(null)
    .padAngle(0.012);

  const arcs = pie(chartData);

  const arc = d3.arc()
    .innerRadius(donutInnerRadius)
    .outerRadius(donutRadius)
    .cornerRadius(2);

  const labelArc = d3.arc()
    .innerRadius(donutInnerRadius + 38)
    .outerRadius(donutRadius - 38);

  const chart = donutSvg.append("g")
    .attr("class", "donut-center")
    .attr("transform", `translate(${DONUT.width / 2}, ${DONUT.height / 2})`);

  const slices = chart.append("g")
    .attr("class", "donut-slices")
    .selectAll("path")
    .data(arcs)
    .join("path")
    .attr("class", "donut-slice")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "rgba(255,255,255,0.9)")
    .attr("stroke-width", 2);

  slices.append("title")
    .text(d => `${d.data.label}: ${donutNumber(d.data.count)} models (${donutPercent(d.data.count / total)})`);

  /* Label the three largest slices inside the ring. */
  const labelThreshold = 0.08;
  const labels = chart.append("g")
    .attr("class", "donut-slice-labels")
    .selectAll("g")
    .data(arcs.filter(d => d.data.count / total >= labelThreshold))
    .join("g")
    .attr("transform", d => `translate(${labelArc.centroid(d)})`);

  labels.append("text")
    .attr("class", "donut-slice-name")
    .attr("text-anchor", "middle")
    .attr("y", -3)
    .text(d => d.data.label);

  labels.append("text")
    .attr("class", "donut-slice-share")
    .attr("text-anchor", "middle")
    .attr("y", 13)
    .text(d => donutPercent(d.data.count / total));

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
    .text(`${data.length} brands`);

  const legend = d3.select("#donut-legend");
  legend.selectAll("*").remove();

  const legendItems = legend.selectAll("div.donut-legend-item")
    .data(chartData)
    .join("div")
    .attr("class", "donut-legend-item");

  legendItems.append("span")
    .attr("class", "donut-swatch")
    .style("background", d => color(d.label));

  legendItems.append("span")
    .attr("class", "donut-legend-name")
    .text(d =>
      d.brand === "other" && d.brandCount
        ? `Other (${d.brandCount} brands)`
        : d.label
    );

  legendItems.append("span")
    .attr("class", "donut-legend-count")
    .text(d => donutNumber(d.count));

  legendItems.append("span")
    .attr("class", "donut-legend-share")
    .text(d => donutPercent(d.count / total));

  legend.append("p")
    .attr("class", "donut-legend-note")
    .text("The top eight brands are shown separately; the remaining brands are combined as Other.");
}
