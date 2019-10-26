let dan, center0;

async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(46.301184, 25.285427199999997),
    mapTypeId: 'terrain'
  });
 
  $.ajax({
    url: "http://192.168.0.75:5500/api/getLast24",
    success: function(result) {
      // console.log(result)
      result.forEach(element => {
        // dangerMap.push(element);
        center0 = {lat: element.coordinates.Longitude, lng: element.coordinates.Latitude}
        console.log(center0);
        dan = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: center0,
          radius: 1000
        });
      });
    }
  });

  var script = document.createElement('script');
  // script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}