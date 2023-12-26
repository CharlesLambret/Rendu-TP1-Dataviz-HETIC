function setupSelectors() {
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
        .property("checked", (d, i) => i === 0) 
        .on("change", updateVisualizations);
    
    selectAnnee = d3.select("#top").append("select")
        .attr("id", "choix_annee")
        .on("change", updateVisualizations);
    selectAnnee.selectAll("option")
        .data(["All"].concat(Array.from(new Set(data.map(d => d.Year)))))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d === "All" ? "All Years" : d);

    selectRegion = d3.select("#top").append("select")
        .attr("id", "choix_region")
        .on("change", updateVisualizations);
    selectRegion.selectAll("option")
        .data(["All"].concat(Array.from(new Set(data.map(d => d.Region)))))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    tbody = d3.select("#top")
        .append("table")
        .append("tbody");

    var form = d3.select("#top").append("form").attr("class", "choix");
    var fieldset = form.append("fieldset");

    fieldset.append("legend").text("Choisir si vous souhaitez un FLOP");
    checkboxFlop = fieldset.append("label")
        .text("FLOP")
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "flop")
        .property("checked", false) 
        .on("change", updateVisualizations);
}

function setupTableau() {
    var table = d3.select("#table").append("table").attr("class", "table");
    table.append("thead")
        .append("tr").attr("scope", "row")
        .selectAll("th").attr("scope", "col")
        .data(["Pays", "Région", "Rang", "Documents", "Citations", "H-index"])
        .enter()
        .append("th")
        .text(d => d);

    tbody = table.append("tbody");
}

function setupNuagedePoints() {
    colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([1, 100]);
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = window.innerWidth * 0.90 - margin.left - margin.right, 
    height = window.innerHeight * 0.90 - margin.top - margin.bottom;

    svg = d3.select("#nuage").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleLog().domain([1, 100000]).range([0, width]);
    yScale = d3.scaleLog().domain([0.1, 100]).range([height, 0]);

    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

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
