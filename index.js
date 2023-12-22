d3.csv("./scimagojr.csv", function(d) {
    return {
       Year: parseInt(d.Year),
       Rank: parseInt(d.Rank),
       Country: d.Country,
       Documents: parseInt(d.Documents),
       Citations: parseInt(d.Citations),
       Hindex: parseInt(d["H index"]),
       AverageCitations: parseFloat(d["Citations per document"]) 
   };
 }).then(function(data) {
   var filteredData = data.filter(d => d.Year === d3.max(data, d => d.Year));
 
     
     var colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
                    .domain([1, filteredData.length]);
 
 
     
     var margin = {top: 10, right: 30, bottom: 30, left: 40},
     width = window.innerWidth * 0.90 - margin.left - margin.right, 
     height = window.innerHeight * 0.90 - margin.top - margin.bottom;
 
     
     var svg = d3.select("#nuage")
                 .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
     
     var xScale = d3.scaleLog()
                    .domain([1, d3.max(filteredData, d => d.Documents)])
                    .range([0, width]);
       var yScale = d3.scaleLog()
                    .domain([0.1, d3.max(filteredData, d => d.AverageCitations)]) 
                    .range([height, 0]);
     
    
    
    
    
    
    
    
     
 
 
     
     svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));
     svg.append("g")
        .call(d3.axisLeft(yScale));
 
    
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
 
     
     svg.selectAll("circle")
       .data(filteredData)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d.Documents))
       .attr("cy", d => yScale(d.AverageCitations))
       .attr("r", d => Math.sqrt(d.Hindex)) 
       .style("fill", d => colorScale(d.Rank))
       .style("opacity", 0.7)
       .style("stroke", "black")
       .style("stroke-width", 1);
 
     
     var meanDocuments = d3.mean(filteredData, d => d.Documents);
     var meanCitations = d3.mean(filteredData, d => d.AverageCitations);
 
     svg.append("line")
        .attr("x1", xScale(meanDocuments))
        .attr("x2", xScale(meanDocuments))
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "black");
 
     svg.append("line")
        .attr("y1", yScale(meanCitations))
        .attr("y2", yScale(meanCitations))
        .attr("x1", 0)
        .attr("x2", width)
        .style("stroke", "black");
 
     
     var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
 
     svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(d.Country)
                   .style("left", (event.pageX) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
        });
        
        var legend = svg.append("g")
                     .attr("class", "legend")
                     .attr("transform", "translate(" + (width - 100) + ",20)");
 
     legend.selectAll("rect")
           .data([1, filteredData.length / 2, filteredData.length])
           .enter()
           .append("rect")
           .attr("x", 0)
           .attr("y", function(d, i) { return i * 20; })
           .attr("width", 18)
           .attr("height", 18)
           .style("fill", function(d) { return colorScale(d); });
 
     legend.selectAll("text")
           .data([1, filteredData.length / 2, filteredData.length])
           .enter()
           .append("text")
           .attr("x", 24)
           .attr("y", function(d, i) { return i * 20 + 9; })
           .attr("dy", ".35em")
           .text(function(d) { return `Rang: ${Math.round(d)}`; });
 });
 