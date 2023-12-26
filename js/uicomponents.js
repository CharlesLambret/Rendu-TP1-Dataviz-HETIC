function setupSelectors() {
    var sampleSizes = [5, 10, 20, 50, "All"];
    formSampleSize = d3.select("#btnsradio")
                        .append("form")
                        .attr("class", "sample-size d-flex flex-wrap");

    formSampleSize.selectAll("label")
        .data(sampleSizes)
        .enter()
        .append("label")
        .attr("class", "form-check-label")
        .text(d => d === "All" ? "Tous les pays" : `${d} Pays`)
        .append("input")
        .attr("type", "radio")
        .attr("class", "form-check-input m-2")
        .attr("name", "sampleSize")
        .attr("value", d => d)
        .property("checked", (d, i) => i === 0) 
        .on("change", updateVisualizations);
    
    selectAnnee = d3.select("#filtres").append("select")
        .attr("id", "choix_annee")
        .attr("class", "m-2")
        .on("change", updateVisualizations);
    selectAnnee.selectAll("option")
        .data(["All"].concat(Array.from(new Set(data.map(d => d.Year)))))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d === "All" ? "Toutes les années" : d);

    selectRegion = d3.select("#filtres").append("select")
        .attr("id", "choix_region")
        .attr("class", "m-2")
        .on("change", updateVisualizations);
        
    selectRegion.selectAll("option")
        .data(["All"].concat(Array.from(new Set(data.map(d => d.Region)))))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d === "All" ? "Toutes les régions du monde" : d);

    tbody = d3.select("#top-flop")
        .append("table")
        .append("tbody");

    var form = d3.select("#top-flop").append("form").attr("class", "choix d-flex flex-row");
    var fieldset = form.append("fieldset").attr("class", "d-flex flex-row");
    

    var labelTop = fieldset.append("label").attr("class", "d-flex flex-row align-items-center").text("TOP");
    labelTop.append("input")
        .attr("type", "radio")
        .attr("name", "topflop")
        .attr("class","form-check-input m-2")
        .attr("value", "top")
        .property("checked", true)  
        .on("change", updateVisualizations);
        
    var labelFlop = fieldset.append("label").attr("class", "d-flex flex-row align-items-center").text("FLOP");
    labelFlop.append("input")
            .attr("type", "radio")
            .attr("name", "topflop")
            .attr("class","form-check-input m-2")
            .attr("value", "flop")
            .on("change", updateVisualizations);
}

function setupRecherche() {
    var controls = d3.select("#top");

    controls.append("input")
        .attr("id", "searchInput")
        .attr("type", "text")
        .attr("class", "col-md-6 align-self-center")
        .attr("placeholder", "Recherchez le nom d'un pays...")
        .on("input", function() {
            updateVisualizations();
        });
}

function setupTableau() {
    var table = d3.select("#table").append("table").attr("class", "table table-hover");
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
    var margin = {top: 10, right: 30, bottom: 30, left: 40};
    var nuageContainer = document.getElementById('nuageContainer');
    var width = nuageContainer.clientWidth - margin.left - margin.right;
    var height = width ;

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
        .style("fill", "white")
        .text("Nombre de Documents");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
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
        .style("color", "black")
        .style("pointer-events", "none");
        
}
