# Singaporean Location Distances
Goofing around at Calhacks 2.0 with spatial datasets. Insteading of using a traditional mapping API, I wanted to make something lightweight. This is achieved by converted a shapefile of Singapore's Urban Development Region Subzones to topojson and rendered the map in d3. Overlayed with some spatial datasets of rubbish collection points. 
And had a fun windrose that shows where are the given collection points relative to a location.

#### Steps:
1. Converted data [data.gov.sg](http://www.data.gov.sg/Metadata/OneMapMetadata.aspx?id=MP14_SUBZONE_WEB_PL&mid=211915&t=SPATIAL) from a shapefile to topojson with this [tool](https://github.com/mbostock/topojson).
2. Plotted out topojson with d3.geo using an albers() projection.

#### To Consider Doing
 * Centralise data in a single object that is referenced, possibly use immutablejs?
 * Add more chart types
 * Do more analysis
 * Clean code
 * Isotype windrose?
 * Have location slowly move around + animate windrose
 * Have a raster and at each point have a windrose?