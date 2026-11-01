/* ============================================================
   Exercise 6.1 — load the TV data
   ============================================================
   The CSV is the exercise file created by the Week 6 KNIME
   workflow. Numeric columns are converted here so the histogram
   code can work with numbers rather than strings.
   ============================================================ */

let week6Data = [];

d3.csv("../data/Ex6_TVdata_withStar.csv", row => ({
  brand: row.brand,
  model: row.model,
  screenSize: +row.screenSize,
  screenTech: row.screenTech,
  star: +row.star,
  energyConsumption: +row.energyConsumption
}))
  .then(data => {
    const cleanData = data.filter(d => Number.isFinite(d.energyConsumption));

    week6Data = cleanData;

    console.log("TV data", cleanData);
    console.log("Rows loaded:", cleanData.length);

    drawHistogram(cleanData);
    populateFilters(cleanData);
    drawScatterplot(cleanData);
    createTooltip();
    handleMouseEvents();
  })
  .catch(error => {
    console.error("Could not load the TV data:", error);

    d3.select("#histogram")
      .append("p")
      .attr("class", "chart-error")
      .text("The TV data could not be loaded. Run the page from a local server, not file://.");
  });
