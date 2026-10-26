/* ============================================================
   COS30045 Data Visualisation — Demo 2
   Exercise 4.2: manipulate and add elements with D3

   This file is intentionally separate from main.js. Exercise 4.3
   starts the bar chart with a clean D3 file.
   ============================================================ */

// Step 2 — select an HTML element and apply a style.
d3.select("#demo-heading")
  .style("color", "green");

// Step 3 — append a paragraph and some text to the container.
d3.select("#demo-container")
  .append("p")
  .text("Purchasing a low energy consumption TV will help with your energy bills!");

// Step 4 — append an SVG rectangle and make it visible with attributes.
d3.select("#demo-svg")
  .append("rect")
  .attr("x", 50)
  .attr("y", 50)
  .attr("width", 100)
  .attr("height", 30)
  .attr("rx", 5)
  .style("fill", "green");

// A small label makes the rectangle easier to see in the demo.
d3.select("#demo-svg")
  .append("text")
  .attr("x", 50)
  .attr("y", 115)
  .attr("fill", "#3f5751")
  .attr("font-family", "Segoe UI, Arial, sans-serif")
  .attr("font-size", 13)
  .text("A rectangle appended with D3");
