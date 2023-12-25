function aggregateAndFilterData(selectedYear, selectedRegion, isFlop) {
    var filteredData = data.filter(d => selectedRegion === "All" || d.Region === selectedRegion);

    if (selectedYear !== "All") {
        filteredData = filteredData.filter(d => d.Year.toString() === selectedYear);
    } else {
        filteredData = aggregateDataAcrossYears(filteredData);
    }

    filteredData.sort(isFlop ? (a, b) => a.Hindex - b.Hindex : (a, b) => b.Hindex - a.Hindex); // Reversing the flop condition
    return filteredData;
}