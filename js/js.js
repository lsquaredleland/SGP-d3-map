var width = 1050;
var height = 750;

var projection = d3.geo.albers()
    .center([105.15, 1.3])
    .rotate([1.3, 0])
    .parallels([0, 5])
    .scale(1200 * 100)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#mapArea").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("maps/MP14_SUBZONE_reduced.json", function(error, SGP) {
  console.log(SGP)

  //Note can draw individual subzones by SGP.objects.MP14_SUBZONE_WEB_PL.geometries[]
  svg.append("path")
      .datum(topojson.feature(SGP, SGP.objects.MP14_SUBZONE_WEB_PL))
      .attr("d", path)
      .style('fill', 'none')
      .style('stroke', 'maroon');
});

function deleteOldLines() {
  d3.select('#mapArea line').remove();
  d3.selectAll('.originLines').remove();
  d3.selectAll('.originLines').remove();
  d3.selectAll('.originCircle').remove();
}

function drawCentres(fileName, fill, data) {
  d3.json('location_data/' + fileName + '.json', function(error, ewaste) {
    var coordinates = _.map(ewaste, function(loc) {
      var lat = loc.geometry.coordinates[0];
      var lon = loc.geometry.coordinates[1];
      return {
        coordinates: [lat, lon],
        properties: loc.properties
      }
    })

    svg.selectAll("circle." + fileName)
      .data(coordinates).enter()
      .append("circle")
      .attr("cx", function (d) { return projection(d.coordinates)[0]; })
      .attr("cy", function (d) { return projection(d.coordinates)[1]; })
      .attr("r", 2)
      .attr("fill", fill)

    data.data = coordinates;
    generateVoronoi(coordinates)
  });
}

//When clicking on the chart SVG
svg.on('click', function() {
  deleteRose();
  deleteOldLines();
  var coords = d3.mouse(this);
  generateRose(projection.invert(coords))
  generateHistogram(projection.invert(coords))
})

var recycling_bins = {data: null}
var ewaste = {data: null}
var secondhandcollection = {data: null}
//drawCentres("recycling_bins", 'teal', recycling_bins);
drawCentres("ewaste", 'orange', ewaste);
//drawCentres("secondhandcollection", 'black', secondhandcollection);

//Issues here...
function generateVoronoi(data) {
  function polygon(d) {
    if (d) {
      return "M" + d.join("L") + "Z";
    }
  }
  var voronoi = d3.geom.voronoi()
    .x(function(d) { return d.coordinates[0]; })
    .y(function(d) { return d.coordinates[1]; })
    .clipExtent([[0, 0], [width, height]]);

    console.log(voronoi(data))
    console.log(_.cloneDeep(data,true))

    var voronoiGroup = svg.append("g")
      .attr("class", "voronoi");
    voronoiGroup.data(voronoi(data))
      .enter().append("path")
        .attr("fill", 'none')
        .attr("stroke", "red")
        .attr("d", polygon)
        .on('mouseover', function() {
          console.log('over')
        })
        .on('mouseout', function() {
          d3.selectAll('.voronoi').style('stroke-width', 1)
        })

  d3.select("#show-voronoi")
    .property("disabled", false)
    .on("change", function() { voronoiGroup.classed("voronoi--show", this.checked); });
}
