/*-------------------- Initialization and Data Loading -------------------*/

var data;
var selectAnnee, selectRegion, tbody, svg, xScale, yScale, colorScale, checkboxFlop, formSampleSize, tooltipDiv;

function initialize() {
    setupSelectors();
    setupTableau();
    setupNuagedePoints();
    setupTooltip();
    updateVisualizations();
}

function setupSelectors() {
    // Define sample sizes here
    var sampleSizes = [5, 10, 20, 50];
    formSampleSize = d3.select("#top").append("form").attr("class", "sample-size");
    formSampleSize.selectAll("label")
        .data(sampleSizes)
        .enter()
        .append("label")
        .text(d => `${d} Countries`)
        .append("input")
        .attr("type", "radio")
        .attr("name", "sampleSize")
        .attr("value", d => d)
        .property("checked", (d, i) => i === 0) // default check the first option
        .on("change", updateVisualizations);
    
    // Year Selector
    selectAnnee = d3.select("#top").append("select")
        .attr("id", "choix_annee")
        .on("change", updateVisualizations);
    selectAnnee.selectAll("option")
        .data(["All"].concat(Array.from(new Set(data.map(d => d.Year)))))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d === "All" ? "All Years" : d);

    // Region Selector
    selectRegion = d3.select("#top").append("select")
        .attr("id", "choix_region")
        .on("change", updateVisualizations);
    selectRegion.selectAll("option")
        .data(["All"].concat(Array.from(new Set(data.map(d => d.Region)))))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Table body
    tbody = d3.select("#top").append("table").append("tbody");

    // FLOP Checkbox
    var form = d3.select("#top").append("form").attr("class", "choix");
    var fieldset = form.append("fieldset");
    fieldset.append("legend").text("Choisir si vous souhaitez un FLOP");
    checkboxFlop = fieldset.append("label")
        .text("FLOP")
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "flop")
        .property("checked", false) // Set to true for TOP by default
        .on("change", updateVisualizations);
}

function setupTableau() {
    // Create table headers
    var table = d3.select("#top").append("table");
    table.append("thead")
        .append("tr")
        .selectAll("th")
        .data(["Pays", "Région", "Rang", "Documents", "Citations", "H-index"])
        .enter()
        .append("th")
        .text(d => d);

    tbody = table.append("tbody");
}

function setupNuagedePoints() {
    // Set up color scale and SVG dimensions
    colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([1, 100]);
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = window.innerWidth * 0.90 - margin.left - margin.right, 
    height = window.innerHeight * 0.90 - margin.top - margin.bottom;

    // Create SVG element
    svg = d3.select("#nuage").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    xScale = d3.scaleLog().domain([1, 100000]).range([0, width]);
    yScale = d3.scaleLog().domain([0.1, 100]).range([height, 0]);

    // Add axes to the SVG
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    // Add axes labels
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Nombre de Documents");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Nombre Moyen de Citations par Document");
}

function setupTooltip() {
    // Set up a tooltip div
    tooltipDiv = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("text-align", "left")
        .style("padding", "8px")
        .style("background", "rgba(255, 255, 255, 0.85)")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");
}

function updateTableau() {
    var selectedYear = selectAnnee.node().value;
    var selectedRegion = selectRegion.node().value;
    var isFlop = checkboxFlop.node().checked;
    var selectedSize = parseInt(d3.select('input[name="sampleSize"]:checked').node().value);

    // Filter and aggregate data based on selections
    var filteredData = aggregateAndFilterData(selectedYear, selectedRegion, isFlop);

    // Slice data to respect the selected sample size
    filteredData = filteredData.slice(0, selectedSize);

    // Update table rows
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
    var isFlop = checkboxFlop.node().checked;
    var selectedSize = parseInt(d3.select('input[name="sampleSize"]:checked').node().value);

    // Filter and aggregate data based on selections
    var filteredData = aggregateAndFilterData(selectedYear, selectedRegion, isFlop);

    // Slice data to respect the selected sample size
    filteredData = filteredData.slice(0, selectedSize);

    // Update domains for the scales
    xScale.domain([d3.min(filteredData, d => d.Documents) || 1, d3.max(filteredData, d => d.Documents) || 100]);
    yScale.domain([d3.min(filteredData, d => d.Citations) || 0.1, d3.max(filteredData, d => d.Citations) || 100]);

    // Update the circles in the scatter plot
    var circles = svg.selectAll("circle").data(filteredData);
    circles.enter()
        .append("circle")
        .merge(circles)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
            
            // Update tooltip content
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

function aggregateAndFilterData(selectedYear, selectedRegion, isFlop) {
    // Filter data based on the selected region
    var filteredData = data.filter(d => selectedRegion === "All" || d.Region === selectedRegion);

    if (selectedYear !== "All") {
        // Filter data based on the selected year
        filteredData = filteredData.filter(d => d.Year.toString() === selectedYear);
    } else {
        // Aggregate data if "All" years are selected
        filteredData = aggregateDataAcrossYears(filteredData);
    }

    // Sort the filtered data based on H-index for top/flop functionality
    filteredData.sort(isFlop ? (a, b) => a.Hindex - b.Hindex : (a, b) => b.Hindex - a.Hindex); // Reversing the flop condition
    return filteredData;
}

function aggregateDataAcrossYears(data) {
    // Aggregate data across all years
    let aggregatedData = d3.rollup(data, 
        (v) => ({
            Documents: d3.sum(v, d => d.Documents),
            Citations: d3.sum(v, d => d.Citations),
            Hindex: d3.max(v, d => d.Hindex),
            Rank: d3.mean(v, d => d.Rank) // Assuming rank needs to be averaged
        }), 
        d => d.Country); // Group by Country

    // Convert the Map returned by d3.rollup to a structure similar to the original data
    return Array.from(aggregatedData, ([Country, values]) => ({
        Country: Country,
        Documents: values.Documents,
        Citations: values.Citations,
        Hindex: values.Hindex,
        Rank: values.Rank,
        // If Region is important and consistent for a country, derive it from the original data (assumes first match is representative)
        Region: data.find(d => d.Country === Country)?.Region || "Unknown"
    }));
}

function updateVisualizations() {
    updateTableau();
    updateNuagedePoints();
}

d3.csv("./data/scimagojr.csv", function(d) {
    return {
        Year: parseInt(d.Year),
        Rank: parseInt(d.Rank),
        Country: d.Country,
        Documents: parseInt(d.Documents),
        Citations: parseInt(d.Citations),
        Region: d.Region,
        Hindex: parseInt(d["H index"]),
        AverageCitations: parseFloat(d["Citations per document"])
    };
}).then(function(loadedData) {
    d3.select("head").append("title").text("Base travail d3js");
    d3.select("#top").append("h2").text("TOP de l'année choisie");

    data = loadedData;
    initialize();
});
