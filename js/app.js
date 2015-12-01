var app = angular.module('fccApp', []);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.headers.common = 'Content-Type: application/json';
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller('FccCtrl', ['$http',
function ($http){
    var ctrl = this;

    this.getSpec = function () {
    // var query = 'http://data.fcc.gov/api/spectrum-view/services/advancedSearch/getSpectrumBands?&format=json';
    //spectrum dashboard

    $http.get('http://data.fcc.gov/api/spectrum-view/services/advancedSearch/getSpectrumBands?&format=json&frequencyFrom=' + this.lower + '&frequencyTo=' + this.upper ).success(
      function(data) {
        ctrl.SpectrumBands = data.SpectrumBands.SpectrumBand;
        console.log(data);
      },
        function (error) {
        console.log(error);
      }
    );
  };
}]);


app.controller('LicenseCtrl', ['$http', function($http){
  this.sortType   = 'name';

  this.sortReverse = 'false';
  this.searchName = '';

  var ctrl = this;
  this.getLicenses = function(){
    $http.get('http://data.fcc.gov/api/license-view/licenses/getCommonNames?&format=json')
    .success(
      function(data){
        ctrl.Stats = data.Stats.Stat;
        console.log(data);

      }
    );
  };
}]);

app.controller('CommonNameCtrl', ['$http', function($http){
  var ctrl = this;
  this.getCommonName = function(){
    $http.get('http://data.fcc.gov/api/license-view/licenses/getCommonNames?commonName='+ this.name + '&limit=10&format=jsonp&jsonCallback=?')
    .success(
      function(data) {
        console.log(data);
        ctrl.data = data;

      }
    );
  };
  ctrl.orderByField = 'commonName';
  ctrl.reverseSort = false;

}]);

app.controller('MapCtrl', ['$http',
  function($http) {
    function initMap() {
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: {lat: 40.713, lng: -74.006},
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControle: false
      });
      var geocoder = new google.maps.Geocoder();

      document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
      });
    }
  },
  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        console.log(results[0]['geometry']['location'].lat());
        console.log(results[0]['geometry']['location'].lng());


          var lat = (results[0]['geometry']['location'].lat()).toFixed(1);
          var lng = (results[0]['geometry']['location'].lng()).toFixed(1);

        console.log(lat);
        console.log(lng);


        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    this.getCoords = function(){
      $http.get('http://data.fcc.gov/api/speedtest/find?format=jsonp&latitude=' + lat +'&longitude=' +lng)
      .success(
        function(data) {
          console.log(data);
        }
      )
    }
  }
]);


app.controller('VisCtrl', ['$http',
  function($http) {
    var ctrl = this;
      $http.get('spectrumData.json')
      .success(
        function(data) {
          // ctrl.data = data;

          console.log(data);
          console.log(ctrl.data);
        }
      );
  }
]);


app.directive('barChart', function(){
  return {
    restrict: 'E',
    replace: true,

  };
});
