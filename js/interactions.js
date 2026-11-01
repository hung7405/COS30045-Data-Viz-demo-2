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

/* ============================================================
   Exercise 6.4 — custom tooltip for the scatterplot
   ============================================================
   The tooltip is an SVG group inside innerChartS, not an HTML div,
   so it scales with the viewBox like the rest of the chart. It has
   three short lines: screen size + screen type (the value the
   exercise asks for), energy consumption, and star rating + brand.

   The calls stay in load-data.js so the data and the circles exist
   before the mouse events are attached.
   ============================================================ */

const tooltipLineHeight = 14;
const tooltipLineCount = 3;
const tooltipLineY = [16, 30, 44];

function createTooltip() {
  if (!innerChartS) {
    return;
  }

  /* Re-created on every resize, so remove the previous group first. */
  innerChartS.select("#scatter-tooltip").remove();

  const boxHeight = Math.max(
    tooltipHeight,
    tooltipLineCount * tooltipLineHeight + 8
  );

  const tooltip = innerChartS
    .append("g")
    .attr("id", "scatter-tooltip")
    .attr("class", "tooltip")
    .attr("pointer-events", "none")
    .attr("opacity", 0);

  tooltip
    .append("rect")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", tooltipWidth)
    .attr("height", boxHeight);

  ["tooltip-headline", "tooltip-detail", "tooltip-context"].forEach(
    (className, index) => {
      tooltip
        .append("text")
        .attr("class", className)
        .attr("x", 10)
        .attr("y", tooltipLineY[index]);
    }
  );
}

function writeTooltipContent(d) {
  const tooltip = innerChartS.select("#scatter-tooltip");

  tooltip.select(".tooltip-headline").text(`${d.screenSize}″ ${d.screenTech}`);
  tooltip
    .select(".tooltip-detail")
    .text(`${d3.format(",")(d.energyConsumption)} kWh/year`);
  tooltip.select(".tooltip-context").text(`${d.star}★ · ${d.brand}`);

  /* Measure the text so long brand names are not clipped. */
  let textWidth = 0;

  tooltip.selectAll("text").each(function () {
    textWidth = Math.max(textWidth, this.getBBox().width);
  });

  tooltip
    .select("rect")
    .attr("width", Math.max(tooltipWidth, textWidth + 20));
}

function positionTooltip(event) {
  const tooltip = innerChartS.select("#scatter-tooltip");
  const boxWidth = +tooltip.select("rect").attr("width");
  const boxHeight = +tooltip.select("rect").attr("height");
  const [pointerX, pointerY] = d3.pointer(event, innerChartS.node());

  let x = pointerX + 12;
  let y = pointerY - boxHeight - 12;

  /* Keep the tooltip inside the inner chart: flip left or below
     when it would run off the edge. */
  if (x + boxWidth > innerWidth) {
    x = pointerX - boxWidth - 12;
  }

  if (y < 0) {
    y = pointerY + 14;
  }

  if (x < 0) {
    x = 0;
  }

  tooltip.attr("transform", `translate(${x}, ${y})`);
}

function handleMouseEvents() {
  if (!innerChartS) {
    return;
  }

  const tooltip = innerChartS.select("#scatter-tooltip");

  innerChartS
    .selectAll("circle.scatter-circle")
    .on("mouseover", function (event, d) {
      d3.select(this).raise().attr("r", 5).attr("opacity", 1);

      writeTooltipContent(d);
      positionTooltip(event);

      /* Keep the tooltip above the circle that was just raised. */
      tooltip.raise().attr("opacity", 1);
    })
    .on("mousemove", function (event) {
      positionTooltip(event);
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 3).attr("opacity", 0.5);
      tooltip.attr("opacity", 0);
    });
}
