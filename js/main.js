var data;
var selectAnnee, selectRegion, tbody, svg, xScale, yScale, colorScale, checkboxFlop;

document.addEventListener("DOMContentLoaded", function() {
    loadData(function(loadedData) {
        data = loadedData;
        initialize(); 
    });
});

function initialize() {
    setupSelectors();
    setupTableau();
    setupNuagedePoints();
    setupTooltip();
    updateVisualizations();
}
