/*--------------------Initialisation-------------------*/
d3.select("head").append("title").html("Base travail d3js");

/*--------------------Top-------------------*/
d3.select("#top").append("h2").html("TOP de l'année choisie");

/*---------------Form radios--------------*/
var choix_taille = d3.select("#top").append("form")
                     .attr("class", "choix")
                     .append("fieldset");

choix_taille.append("legend").html("Choisir une taille");

choix_taille.selectAll("input")
            .data([3, 5, 10, 20])
            .enter()
            .append("label")
            .text(function(d) { return d; })
            .insert("input")
            .attr("type", "radio")
            .attr("name", "taille")
            .attr("value", function(d) { return d; })
            .property("checked", function(d) { return d == 5; })
            .on("change", updateDisplay);

/*---------------FLOP--------------*/
var champs1_bis = d3.select("#top").select("form.choix")
                    .append("fieldset");

champs1_bis.append("legend").html("Choisir si vous souhaitez un FLOP");

var checkboxFlop = champs1_bis.append("label")
                             .text("FLOP")
                             .insert("input")
                             .attr("type", "checkbox")
                             .attr("name", "flop")
                             .property("checked", false)
                             .on("change", updateDisplay);

/*---------------Select de l'année--------------*/
var choix_annee = d3.select("#top").append("form")
                    .attr("class", "choix")
                    .append("fieldset");

choix_annee.append("legend").html("Choisir une année");
var selectAnnee = choix_annee.append("select")
                             .attr("name", "annee")
                             .attr("id", "choix_annee")
                             .on("change", updateDisplay);

/*---------------Select choix de la région--------------*/
var choix_region = d3.select("#top").append("form")
                     .attr("class", "choix")
                     .append("fieldset");

choix_region.append("legend").html("Choisir une région");
var selectRegion = choix_region.append("select")
                               .attr("name", "region")
                               .attr("id", "choix_region")
                               .on("change", updateDisplay);

/*--------------------Tableau-------------------*/
d3.select("#top").append("table")
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(["Pays", "Région", "Rang", "Documents", "Citations", "H-index"])
    .enter()
    .append("th")
    .html(function(d) { return d; });

var tbody = d3.select("#top").select("table").append("tbody").attr("id", "table_top");

/*--------------------Cellule du tableau-------------------*/
function generateCell(d) {
    return "<td class='" + (isNaN(parseInt(d)) ? "texte" : "nombre") + "'>" + d + "</td>";
}

/*--------------------Ligne du tableau-------------------*/
function generateRow(d) {
    return generateCell(d.Country) 
           + generateCell(d.Region)   
           + generateCell(d.Rank) 
           + generateCell(d.Documents) 
           + generateCell(d.Citations)
           + generateCell(d.Hindex);  
}

/*---------------Récupération des données--------------*/
var data; 

d3.csv("./data/scimagojr.csv", function(d) {
    return {
        Year: parseInt(d.Year),
        Rank: parseInt(d.Rank),
        Country: d.Country,
        Documents: parseInt(d.Documents),
        Citations: parseInt(d.Citations),
        Region: d.Region,  
        Hindex: parseInt(d["H index"]) 
    };
}).then(function(loadedData) {
    data = loadedData; 

    /*--------------- Mise à jour du choix des années ----- */
    selectAnnee.selectAll("option")
              .data(Array.from(new Set(data.map(function(d) { return d.Year; }))))
              .enter()
              .append("option")
              .attr("value", function(d) { return d; })
              .html(function(d) { return d; });

    /*--------------- Mise à jour du choix des régions ----- */
    selectRegion.selectAll("option")
                .data(["Toutes"].concat(Array.from(new Set(data.map(function(d) { return d.Region; })))))
                .enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .html(function(d) { return d; });

    updateDisplay(); 
});

function updateDisplay() {
    var selectedYear = selectAnnee.node().value;
    var selectedRegion = selectRegion.node().value;
    var isFlop = checkboxFlop.node().checked;
    var selectedSize = parseInt(d3.select('input[name="taille"]:checked').node().value);

    var filteredData = data.filter(function(d) {
        return (selectedYear === "Toutes" || d.Year == selectedYear) &&
               (selectedRegion === "Toutes" || d.Region === selectedRegion);
    });

    if (isFlop) {
        filteredData.sort((a, b) => b.Rank - a.Rank);
    } else {
        filteredData.sort((a, b) => a.Rank - b.Rank);
    }

    var rows = tbody.selectAll("tr").data(filteredData.slice(0, selectedSize));
    rows.exit().remove();
    rows.enter()
        .append("tr")
        .merge(rows)
        .html(function(d) { return generateRow(d); });
    
        
}

/*------------------------Rendu-------------------------*/
var filteredData = data.filter(d => d.Year === d3.max(data, d => d.Year));

/*--------------- couleurs ----- */
var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
                   .domain([1, filteredData.length]);

/*---------------  Échelles logarithmiques des axes ----- */
var xScale = d3.scaleLog()
               .domain(d3.extent(filteredData, d => d.Documents))
               .range([0, width]);
var yScale = d3.scaleLog()
               .domain(d3.extent(filteredData, d => d.AverageCitations))
               .range([height, 0]);


