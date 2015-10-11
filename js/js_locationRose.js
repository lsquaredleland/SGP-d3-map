/* Functionality to add
 * Histogram of closest location? Make it look cool?
 * Give a specific coordinate find the closest one?
 * Windrose of closest ones? 

*/
var w = 400;
var h = 400;

function deleteRose() {
	d3.select("#locationRose svg").remove();
}
function generateRose(origin) {
	origin = origin || [103.8332347, 1.3356521]
  var lat = origin[0];
  var lon = origin[1];

  console.log(ewaste.data)
  var directionQuantity = _.map(ewaste.data, function(data) {
  	return findSegment(12, data.coordinates, origin)
  })
 	var count = _.countBy(directionQuantity);

 	var data = _.fill(Array(12), {val:0});
 	_.forEach(count, function(d,i) {
 		data[i] = {val:d};
 	})
 	generateDonut(data)

 	//Center of Rose
  svg.append("circle")
  	.classed('originCircle', true)
    .attr("cx", projection(origin)[0])
    .attr("cy", projection(origin)[1])
    .attr("r", 10)
    .style('fill-opacity', 0)
    .style('stroke-width', 2)
    .style("stroke", "orange")
}

//Method below should just mutate the main data object 
//Adding a tag of which segment the item is in
function findSegment(numSegments, coordinate, origin) {
	var lat = coordinate[0];
  var lon = coordinate[1];

  var lat_o = origin[0];
  var lon_o = origin[1];

  var p_o = projection(origin);
  var p_c = projection(coordinate);

  var angle = Math.atan((p_c[0]-p_o[0]) / (p_c[1]-p_o[1]))

  //Angle correction
  if(p_c[0]-p_o[0] > 0 && p_c[1]-p_o[1] > 0) { angle = Math.PI - angle;}
  if(p_c[0]-p_o[0] > 0 && p_c[1]-p_o[1] < 0) { angle = Math.abs(angle);}
  if(p_c[0]-p_o[0] < 0 && p_c[1]-p_o[1] > 0) { angle = Math.PI + Math.abs(angle);}
  if(p_c[0]-p_o[0] < 0 && p_c[1]-p_o[1] < 0) { angle = 2*Math.PI - angle;}

  var dist = haversineDistance(coordinate, origin)
  svg.append("line")
  	.classed('originLines', true)
  	.attr("x1", p_o[0])
  	.attr("y1", p_o[1])
  	.attr("x2", p_c[0])
  	.attr("y2", p_c[1])
  	.style("stroke", "black")
  	.on("mouseover", function() {
  		console.log(angle*180/Math.PI, dist)
  	})

  return Math.floor(angle / (2*Math.PI / numSegments))
}

function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lon1 = coords1[0];
  var lat1 = coords1[1];
  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles) d /= 1.60934;

  return d;
}

function generateDonut(data){
	var smallestDim = h < w ? h : w;

	var outerRadius = smallestDim / 4.5,
	    innerRadius = outerRadius / 2;

	var len = _.size(data);

	var pie = d3.layout.pie()
		.value(function(d){ return 1; })
	  .padAngle(.010);
	var arc = d3.svg.arc()
			.startAngle(function(d, i) { return Math.PI*2/len*i; })
      .endAngle(function(d,i) { return Math.PI*2/len*i + Math.PI/2/(len/4); })
	    .padRadius(outerRadius)
	    .innerRadius(innerRadius);

	var lines = [];
	var valueline = d3.svg.line()
		.interpolate("cardinal-closed")  //step-after looks cool
	  .x(function(d) { return d[0]; })
	  .y(function(d) { return d[1]; });

	var rose = d3.select("#locationRose").append("svg")
	    .attr("width", w)
	    .attr("height", h)
	  .append("g")
	    .attr("transform", "translate(" + w / 2 + "," + (h) / 2 + ")");

	rose.selectAll("path")
	    .data(pie(data))
	  .enter().append("path")
	    .each(function(d, i) { 
	    	d.outerRadius = innerRadius + d.data.val*5;

	    	//for the lines
	    	var alpha = (d.startAngle + d.endAngle)/2;
	    	//lines.push([alpha, d.outerRadius])
	    })
	    .attr("d", arc)
	    .style('fill', 'rgba(128,0,0,.2') //change this value to see where the bars should be
	    .style('stroke', 'none')
	    .on("mouseover", function(d) {
	    	console.log(d, d.data)
	    })

	  var rectWidth = 10;
	  var barHeight = 50;
  	rose.selectAll("rect")
    		.data(data)
    	.enter().append("rect")
    		.each(function(d,i) {
    			d.outerRadius = d.val*6;
    			d.innerRadius = 40;
    			d.alpha = (360/data.length * i + 180 + 15);

    			var alpha = (d.alpha - 180)/180*Math.PI;
    			var l = d.outerRadius + d.innerRadius + 5 || d.innerRadius
	    		lines.push([alpha,l])
    		})
    		.attr("width", rectWidth)
    		.attr("height", function(d) {
    			return d.outerRadius;
    		})
    		.attr("x", 0)
    		.attr("y", function(d) {return d.innerRadius; })
    		.style("fill", 'rgba(128,0,0,.2')
    		.style("stroke-width", "1px")
    		.style("stroke", "black")
    		.attr("transform", function(d, i) {
    			return 'rotate(' + d.alpha + ') translate('+ (-rectWidth/2) + ', 0)'
    		})
    		.on('mouseover', function(d,i) {
    			console.log(d,i)
    		})

	drawLines(lines);
	//drawCircles...

	function drawLines(points){
		points = points.sort(function(a, b){
			return a[0] - b[0];
		})
		
		for(i in points){
			var alpha = points[i][0];
			var l = points[i][1];
			var x = l * Math.sin(alpha)
			var y = l * Math.cos(alpha)
			points[i] = [x,-y]
		}
		rose.append("path")
	    .attr("class", "line")
	    .style("fill", "none")
	    .style("stroke-width", "2.5px")
	    .style("stroke", "black")
	    .attr("d", valueline(points));
	}
}
