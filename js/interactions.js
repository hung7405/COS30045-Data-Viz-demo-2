/* ============================================================
   Exercise 6.2 — filter interactions
   ============================================================
   The screen-technology buttons are the required filter. The
   screen-size buttons are the optional extension suggested in the
   exercise. Both reuse the shared binGenerator from Exercise 6.1.
   ============================================================ */

function populateFilters(data) {
  createFilterButtons("#filters_screen", filters_screen, data);
  createFilterButtons("#filters_size", filters_size, data);
  updateHistogram(data);
}

function createFilterButtons(containerId, filters, data) {
  d3.select(containerId)
    .selectAll("button.filter")
    .data(filters)
    .join("button")
    .attr("type", "button")
    .attr("class", d => `filter${d.isActive ? " active" : ""}`)
    .attr("aria-pressed", d => d.isActive)
    .text(d => d.label)
    .on("click", (event, d) => {
      if (d.isActive) {
        return;
      }

      /* Only one button in each group is active at a time. */
      filters.forEach(filter => {
        filter.isActive = filter.id === d.id;
      });

      d3.select(containerId)
        .selectAll("button.filter")
        .classed("active", filter => filter.isActive)
        .attr("aria-pressed", filter => filter.isActive);

      updateHistogram(data);
    });
}

function updateHistogram(data) {
  const activeTech = filters_screen.find(filter => filter.isActive).id;
  const activeSize = filters_size.find(filter => filter.isActive).id;

  let updatedData = data;

  if (activeTech !== "all") {
    updatedData = updatedData.filter(d => d.screenTech === activeTech);
  }

  if (activeSize !== "all") {
    updatedData = updatedData.filter(d => d.screenSize === +activeSize);
  }

  const updatedBins = binGenerator(updatedData);
  const bars = d3.select("#histogram").selectAll("rect.bar").data(updatedBins);

  /* The x positions and bin widths stay fixed, so the y-axis is a
     fair comparison between filters. The optional rescaling
     extension is intentionally not applied here. */
  bars
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr("y", d => yScale(d.length))
    .attr("height", d => innerHeight - yScale(d.length));

  bars.select("title").text(
    d =>
      `${d3.format(",")(d.x0)}–${d3.format(",")(d.x1)} kWh/year: ` +
      `${d3.format(",")(d.length)} models`
  );

  const techLabel = activeTech === "all" ? "All screen types" : activeTech;
  const sizeLabel = activeSize === "all" ? "all sizes" : `${activeSize}-inch`;
  const rowCount = d3.format(",")(updatedData.length);

  d3.select("#histogram-subtitle").text(
    `${techLabel} · ${sizeLabel} · energy consumption in kWh/year`
  );

  d3.select("#filter-status").text(
    `Showing ${rowCount} models · ${techLabel} · ${sizeLabel}`
  );

  console.log("Filtered histogram", {
    activeTech,
    activeSize,
    rows: updatedData.length,
    bins: updatedBins.map(bin => bin.length)
  });
}

/* Exercise 6.4 will fill these in. Keeping the calls in load-data.js
   means the chart and data are ready before the tooltip is attached. */
function createTooltip() {
  // The custom tooltip container will be added in Exercise 6.4.
}

function handleMouseEvents() {
  // Mouse events will be attached to innerChartS in Exercise 6.4.
}
