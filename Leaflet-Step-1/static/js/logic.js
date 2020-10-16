// Creating map object
var myMap = L.map("map", {
  center: [35, -100],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url,function(data){

  function markerStyle(feature){
    return{
      fillColor: markerColor(feature.properties.mag),
      opacity: 1,
      fillOpacity: 1,
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 1
    };
  };

  function markerColor(mag){
    if (mag > 5) {
        return "red";
    } else if (4< mag & mag <=5) {
        return "orange";
    } else if (3 < mag & mag <= 4) {
        return "yellow";
    } else if (2 < mag & mag <= 3) {
        return "green";
    } else {
        return "blue";
    };
  };

  function markerRadius(mag){
    if (mag === 0){
      return 1;
    } 
      return mag*4;
    
  };

  geojson = L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng);
    },
    style: markerStyle,
    onEachFeature: function(feature, layer){
      layer.bindPopup("<h4>" + "Magnitude: " + feature.properties.mag + "</h4>" + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  var legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(){
    var div = L.DomUtil.create("div", "info legend");
    var magnitude = [0, 2, 3, 4, 5];
    var colors = ["blue", "green", "yellow", "orange", "red"];
   

    for (var i = 0; i<magnitude.length; i++) {
      div.innerHTML +=
      "<li style='background: " + colors[i] + "'></li> " +
      magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");

    };
    return div;
  };

  legend.addTo(myMap)

});