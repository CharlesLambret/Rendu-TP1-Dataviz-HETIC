function aggregateDataAcrossYears(data) {
    let aggregatedData = d3.rollup(data, 
        (v) => ({
            Documents: d3.sum(v, d => d.Documents),
            Citations: d3.sum(v, d => d.Citations),
            Hindex: d3.max(v, d => d.Hindex),
            Rank: d3.median(v, d => d.Rank)  
        }), 
        d => d.Country); 

    return Array.from(aggregatedData, ([Country, values]) => ({
        Country: Country,
        Documents: values.Documents,
        Citations: values.Citations,
        Hindex: values.Hindex,
        Rank: values.Rank,
        Region: data.find(d => d.Country === Country)?.Region || "Unknown"
    }));
}

function loadData(callback) {
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
    }).then(callback);
}