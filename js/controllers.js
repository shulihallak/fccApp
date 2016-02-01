

var fccappControllers = angular.module('fccappControllers', []);



///////////////////////////////////////
// spectrumbands
///////////////////////////////////////
fccappControllers.controller('rangeCtrl', ['$http',
function ($http){
  var ctrl = this;

  this.getSpec = function () {

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
///////////////////////////////////////
//Get all license info
///////////////////////////////////////
fccappControllers.controller('licenseCtrl', ['$http', 'dataService', function($http, dataService){
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
  dataService.getData().then(function(res){
    ctrl.graphData = res.data;
  });
}]);

fccappControllers.service('dataService', ['$http', function($http){
  return {
    getData: function(){
      return   $http.get('http://data.fcc.gov/api/license-view/licenses/getCommonNames?&format=json');
    }
  };
}]);

fccappControllers.controller('licDescCtrl', ['$http', '$routeParams', function($http, $routeParams){
  var ctrl = this;
  ctrl.licDesc = $routeParams.licDesc;
var url = 'http://data.fcc.gov/api/license-view/basicSearch/getLicenses?searchValue=' + $routeParams.licDesc + '&format=json';

  $http.get(url)
  .success(function(data){
    console.log(data);
    ctrl.data = data;
    ctrl.license = data.Licenses.License;
    console.log(ctrl.license);
    ctrl.box = true;
  });
}]);
///////////////////////////////////////
// Get info by common carrier
///////////////////////////////////////
fccappControllers.controller('CommonNameCtrl', ['$http', function($http){
  var ctrl = this;
  this.getCommonName = function(){
    $http.get('http://data.fcc.gov/api/license-view/licenses/getCommonNames?commonName='+ this.name + '&limit=10&format=jsonp&jsonCallback=?')
    .success(
      function(data) {
        console.log(data);
        ctrl.data = data;
        ctrl.orderByField = '-statCount';

      }
    ).error(
      function(error){
        console.log(error);
      }
    );
  };


}]);

///////////////////////////////////////
//FCC content controller //
///////////////////////////////////////
fccappControllers.controller('documentsCtrl', ['$http', function($http){
  var ctrl = this;
  ctrl.main = {
    page: 0,
    limit: 10
  };
  //search results based user input terms
  this.getDocument = function(){
    $http.get('http://fcc.gov/api/content.json?search_string=' + this.search + '&limit=10&page=' + ctrl.main.page)
    .success(function(data){
      ctrl.data = data;
      console.log(data);

      ctrl.pages = data[0].pages;
      ctrl.count = data[0].count;
      ctrl.box = true;

      // advance to next page of search results
      ctrl.nextPage = function(){
        if (ctrl.main.page < ctrl.pages){
          ctrl.main.page++;
          ctrl.getDocument();
        }
      }
      // previous page of search results
      ctrl.previousPage = function(){
        if (ctrl.main.page > 0){
          ctrl.main.page--;
          ctrl.getDocument();
        }
      }
    })
  }
  // search by fcc terms
  this.getTerms = function(){
    var ctrl = this;
    ctrl.data = {
      options: [
        {id:'81', name: 'Advisory' },

      ]
    }
    $http.get('https://www.fcc.gov/api/content.json?terms[]=' + this.value)
    .success(function(data){
      console.log(data);
    })
  }
}]);
////////////////////////////////////////////////////
// Facility Search //
///////////////////////////////////////
fccappControllers.controller('facilitiesCtrl', ['$http', function($http){
  var ctrl = this;
  ctrl.getFacility = function(){

    $http.get('https://data.fcc.gov/mediabureau/v01/tv/facility/search/' +this.type + '.json')
    .success(function(data){
      console.log(data);
      ctrl.data = data;

      var fac = [];
      for (var i = 0; i < data.results.searchList.length; i++){
        fac.push(data.results.searchList[i].facilityList);
      }
      var allStates = fac[2];
      ctrl.allStates = allStates;
      console.log(allStates);
      ctrl.box = true;
    });
  };
}]);

fccappControllers.controller('facDetailCtrl', ['$http', '$routeParams', function ($http, $routeParams){
  var ctrl = this;
  ctrl.facilityId = $routeParams.facilityId;
  $http.get('http://data.fcc.gov/mediabureau/v01/tv/facility/id/' + $routeParams.facilityId + '.json')
  .success(function(data){
    console.log(data);
    ctrl.data = data;
    ctrl.station = data.results.facility.callSign;
    ctrl.facility = data.results.facility;
    console.log(data.results.facility);
  })
}])

////////////////////////////////////////////////////
// broadband api //
///////////////////////////////////////
fccappControllers.controller('providersCtrl', ['$http',
function($http){
  var ctrl = this;
  ctrl.getProviders = function(){
    $http.get('http://www.broadbandmap.gov/broadbandmap/provider?format=json')
    .success(function(data){
      console.log(data);
    });
  }
}
]);


////////////////////////////////////////////////////
// broadband map //
///////////////////////////////////////
fccappControllers.controller('MapCtrl', ['$http',
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
    );
  };
}
]);

fccappControllers.controller('VisCtrl', ['$http',
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
