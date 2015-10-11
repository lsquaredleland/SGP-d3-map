function generateHistogram(origin) {
	var distances = _.map(ewaste.data, function(d) {
    return haversineDistance(d.coordinates, origin)
  })

  console.log(_.min(distances))
  console.log(_.max(distances))
}