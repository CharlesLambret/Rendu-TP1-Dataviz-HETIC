

function getFilteredData(){
    var selectedYear = selectAnnee.node().value;
    var selectedRegion = selectRegion.node().value;
    var isFlop = d3.select('input[name="topflop"]:checked').node().value === "flop"; 
    var selectedSize = d3.select('input[name="sampleSize"]:checked').node().value;

    selectedSize = selectedSize === "All" ? Infinity : parseInt(selectedSize);

    var searchTerm = d3.select("#searchInput").node().value.trim().toLowerCase();

    var data = aggregateAndFilterData(selectedYear, selectedRegion, isFlop);
    data = data.filter(d => d.Country.toLowerCase().includes(searchTerm));
    data = data.slice(0, selectedSize);


    return(data)
} 

function updateTableau() {
    var data = getFilteredData();
    data.sort((a, b) => a.Rank - b.Rank);
    var rows = tbody.selectAll("tr").data(data);
    rows.exit().remove();
    rows.enter()
        .append("tr")
        .merge(rows)
        .html(d => `<td>${d.Country}</td>
                    <td>${d.Region}</td>
                    <td>${d.Rank}</td>
                    <td>${d.Documents}</td>
                    <td>${d.Citations}</td>
                    <td>${d.Hindex}</td>`);
}


function updateNuagedePoints() {
    var data = getFilteredData();
    xScale.domain([d3.min(data, d => d.Documents) || 1, d3.max(data, d => d.Documents) || 100]);
    yScale.domain([d3.min(data, d => d.Citations) || 0.1, d3.max(data, d => d.Citations) || 100]);

    var circles = svg.selectAll("circle").data(data);
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
        .attr("fill-opacity", 0.7)
        .style("fill", d => colorScale(d.Hindex));

    circles.exit().remove();
}

function updateVisualizations() {
    updateTableau();
    updateNuagedePoints();
    
}
