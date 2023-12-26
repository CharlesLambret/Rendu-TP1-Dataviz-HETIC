function updateTableau() {
    var selectedYear = selectAnnee.node().value;
    var selectedRegion = selectRegion.node().value;
    var isFlop = d3.select('input[name="topflop"]:checked').node().value === "flop"; // Updated line
    var selectedSize = parseInt(d3.select('input[name="sampleSize"]:checked').node().value);

    var filteredData = aggregateAndFilterData(selectedYear, selectedRegion, isFlop);

    filteredData = filteredData.slice(0, selectedSize);

    var rows = tbody.selectAll("tr").data(filteredData);
    rows.exit().remove();
    rows.enter()
        .append("tr")
        .merge(rows)
        .html(d => `<td>${d.Country}</td><td>${d.Region}</td><td>${d.Rank}</td><td>${d.Documents}</td><td>${d.Citations}</td><td>${d.Hindex}</td>`);
}


function updateNuagedePoints() {
    var selectedYear = selectAnnee.node().value;
    var selectedRegion = selectRegion.node().value;
    var isFlop = d3.select('input[name="topflop"]:checked').node().value === "flop"; // Updated line
    var selectedSize = parseInt(d3.select('input[name="sampleSize"]:checked').node().value);

    var filteredData = aggregateAndFilterData(selectedYear, selectedRegion, isFlop);

    filteredData = filteredData.slice(0, selectedSize);

    xScale.domain([d3.min(filteredData, d => d.Documents) || 1, d3.max(filteredData, d => d.Documents) || 100]);
    yScale.domain([d3.min(filteredData, d => d.Citations) || 0.1, d3.max(filteredData, d => d.Citations) || 100]);

    var circles = svg.selectAll("circle").data(filteredData);
    circles.enter()
        .append("circle")
        .merge(circles)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
            
            d3.select("#tooltip")
                .html(
                    `<strong>Country:</strong> ${d.Country}<br>` +
                    `<strong>Documents:</strong> ${d.Documents}<br>` +
                    `<strong>Average Citations:</strong> ${d.Citations/d.Documents}<br>` + // Assuming you want the average citations per document
                    `<strong>Total Citations:</strong> ${d.Citations}<br>` +
                    `<strong>H-index:</strong> ${d.Hindex}`
                )
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 28 + "px")
                .style("opacity", 1);
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke", "none");
            d3.select("#tooltip").style("opacity", 0);
        })
        .transition()
        .duration(500)
        .attr("cx", d => xScale(d.Documents))
        .attr("cy", d => yScale(d.Citations))
        .attr("r", d => Math.sqrt(d.Hindex))
        .style("fill", d => colorScale(d.Hindex));

    circles.exit().remove();
}

function updateVisualizations() {
    updateTableau();
    updateNuagedePoints();
}
