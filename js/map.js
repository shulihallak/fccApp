// This example creates circles on the map, representing populations in North
// America.

// First, create an object containing LatLng and population for each city.
// var citymap = {
//   chicago: {
//     center: {lat: 41.878, lng: -87.629},
//     population: 2714856
//   },
//   newyork: {
//     center: {lat: 40.714, lng: -74.005},
//     population: 8405837
//   },
//   losangeles: {
//     center: {lat: 34.052, lng: -118.243},
//     population: 3857799
//   },
//   vancouver: {
//     center: {lat: 49.25, lng: -123.1},
//     population: 603502
//   }
// };
//
// function initMap() {
//   // Create the map.
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 4,
//     center: {lat: 37.090, lng: -95.712},
//     mapTypeId: google.maps.MapTypeId.TERRAIN
//   });
//
//   // Construct the circle for each value in citymap.
//   // Note: We scale the area of the circle based on the population.
//   for (var city in citymap) {
//     // Add the circle for this city to the map.
//     var cityCircle = new google.maps.Circle({
//       strokeColor: '#FF0000',
//       strokeOpacity: 0.8,
//       strokeWeight: 2,
//       fillColor: '#FF0000',
//       fillOpacity: 0.35,
//       map: map,
//       center: citymap[city].center,
//       radius: Math.sqrt(citymap[city].population) * 100
//     });
//   }
// }


      var citymap = {
        city: {
          center: {lat: 40.7127837, lng: -74.00594130000002},
          wirelessDown: 32478.8
        }
      };


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.090, lng: -95.712},
    mapTypeId: google.maps.MapTypeId.TERRAIN
    // zoomControl: true,
    // zoomControlOptions: {
    //   style: google.maps.ZoomControlStyle.LARGE,
    //   position: google.maps.ControlPosition.RIGHT_CENTER
    // },
    // scaleControle: false
  });
  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var that = this;
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      console.log(results[0].geometry.location.lat());
      console.log(results[0].geometry.location.lng());


      var lat = (results[0]['geometry']['location'].lat()).toFixed(1);
      var lng = (results[0]['geometry']['location'].lng()).toFixed(1);

      that.lat = (results[0]['geometry']['location'].lat()).toFixed(1);

      that.lng = (results[0]['geometry']['location'].lng()).toFixed(1);
      console.log(lat);
      console.log(lng);

      //hook up FCC api and pass lat lng as values
      //use .getJSON due to x-browser req (ajax fails)
      var url =  'http://data.fcc.gov/api/speedtest/find?format=json&latitude=' + lat +'&longitude=' +lng;
      var ctrl = this;
      $.getJSON(url, function(data){
        console.log(data);
        ctrl.wirelessDown = (data.SpeedTestCounty.wirelessAvgDownload)*0.001;
        ctrl.wirelessUp = (data.SpeedTestCounty.wirelessAvgUpload)*0.001;
        ctrl.wirelessMaxDown =
        (data.SpeedTestCounty.wirelessMaxDownload)*0.001;
        ctrl.wirelessMaxUp =
        (data.SpeedTestCounty.wirelessMaxUpload)*0.001;
        ctrl.wirelessTests =
        (data.SpeedTestCounty.wirelessTests)*0.001;
        ctrl.AvgDown =
        (data.SpeedTestCounty.wirelineAvgDownload)*0.001;
        ctrl.AvgUp =
        (data.SpeedTestCounty.wirelineAvgUpload)*0.001;
        ctrl.maxDown =
        (data.SpeedTestCounty.wirelineMaxDownload)*0.001;
        ctrl.maxUp =
        (data.SpeedTestCounty.wirelineMaxUpload)*0.001;
        ctrl.tests =
        (data.SpeedTestCounty.wirelineTests)*0.001;

        console.log(ctrl.wirelessDown);

      });

    var marker = new google.maps.Marker({
      map: resultsMap,
      position: results[0].geometry.location,

    });
    for (var city in citymap) {
      var dataCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              map: map,
              center: citymap[city].center,
              radius: Math.sqrt(citymap[city].wirelessDown) * 100
      });
    }

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
