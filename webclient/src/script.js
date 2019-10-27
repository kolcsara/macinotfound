let dan, center0, map;
let objectsOnMap = [];
let keys = [];
function contiuousCall(){
  $.ajax({
    url: "http://192.168.0.75:5500/api/getLast24",
    success: function(result) {
      result.forEach(element => {
          if(keys.indexOf(element._id) == -1 && element.warningLevel) {
            keys.push(element._id);
            let opacity = 0.40;
            let picture = '../resources/else1.png';
            let animalName = element.animalObserved;
            if(animalName!=null)animalName = animalName.toLowerCase();
            switch(animalName){
              case 'medve': { picture = '../resources/bear1.png'; break; }
              case 'vad':   { picture = '../resources/boar1.png'; break; }
              case 'diszno':   { picture = '../resources/boar1.png'; break; }
              case 'vadallat':   { picture = '../resources/else1.png'; break; }
              case 'farkas':   { picture = '../resources/wolf2.png'; break; }
              case 'kutya':   { picture = '../resources/dog1.png'; break; }
              case 'pasztorkutya':   { picture = '../resources/dog1.png'; break; }
              case 'roka':   { picture = '../resources/fox11.png'; break; }
            }
            let color = "#0000cc";
            switch(element.warningLevel){
              case 1: { color = "#6699ff"; break;}
              case 2: { color = "#cc99ff"; break;}
              case 3: { color = "#ff99cc"; break;}
              case 4: { color = "#ff9999"; break;}
              case 5: { color = "#ff6666"; break;}
              case 6: { color = "#ff0066"; break;}
              case 7: { color = "#ff6600"; break;}
              case 8: { color = "#ff0000"; break;}
              case 9: { color = "#ff3300"; break;}
              case 10: { color = "#ff0000"; break;}

            }
            const center0 = {lat: element.coordinates.Latitude, lng: element.coordinates.Longitude};
      
            const marker = new google.maps.Marker({
              position:center0,
              title: element.animalObserved,
              icon: picture,
              size: new google.maps.Size(20,20),
              origin: new google.maps.Point(0,0),
            });
            objectsOnMap.push(marker);
            const dan = new google.maps.Circle({
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: opacity,
              center: center0,
              radius: 1000
            });
            objectsOnMap.push(dan);
          }
        });
    }
  });

  objectsOnMap.forEach((e) => {
    e.setMap(map);
  })
  setTimeout(contiuousCall,20000);
}

function setup(){
  $('#current').click(() =>{
    let animal = $('#jajj').val();
    let warning = 0;

    switch($('#jajj').val()){
      case 'medve': { warning = 10; break; }
      case 'vad':   { warning = 6; break; }
      case 'diszno':   { warning = 7; break; }
      case 'vadallat':   {  warning = 6; break; }
      case 'farkas':   { warning = 9; break; }
      case 'kutya':   {  warning = 4;break; }
      case 'pasztorkutya':   { warning = 5; break; }
      case 'roka':   { warning = 2; break; }
      default: animal = 'vadallat'; warning = 0;
    }
    let dataField 
    navigator.geolocation.getCurrentPosition((position) => {
      dataField = {
        warningLevel: warning,
        coordinates:{
          Longitude:position.coords.longitude,
          Latitude: position.coords.latitude,
        },
        animalObserved:animal
      };
      console.log(JSON.stringify(dataField))
      $.ajax({
        type : 'POST',
        url : 'http://192.168.0.75:5500/api/mobileDanger',
        dataType : 'json',
        data : JSON.stringify(dataField)
      })

/*
      fetch('http://192.168.0.75:5500/api/mobileDanger',{ 
        method:'POST', 
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify(dataField),
      })
      .then(response => response.json())
      */

      
      // .then((message) => {
      //     console.log(message);
      // })
      // $.post({
      //    url: "http://192.168.0.75:5500/api/mobileDanger",
      //    contentType: 'application/json',
      //    body : JSON.stringify(dataField),
      //    succes: function()  {console.log("jee");},
      //    error: function(err){console.log(err);}
      // });

   });
  });
}

async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(46.301184, 25.285427199999997),
    mapTypeId: 'terrain'
  });
  contiuousCall();
  let script = document.createElement('script');
  //script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}