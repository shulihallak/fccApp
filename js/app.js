
//app Module

var fccApp = angular.module('fccApp', [
  'ngRoute',
  'fccappControllers',
  'angular-dimple',

]);

fccApp.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: 'partials/list.html',
      }).
      when('/range', {
        templateUrl: 'partials/range.html',
        controller: 'rangeCtrl'
      }).
      when('/license', {
        templateUrl: 'partials/license.html',
        controller: 'licenseCtrl'
      }).
      when('/license/:licDesc', {
        templateUrl: 'partials/licDesc.html',
        controller: 'licDescCtrl'
      }).
      when('/documents', {
        templateUrl: 'partials/documents.html',
        controller: 'documentsCtrl'
      }).
      when('/facilities', {
        templateUrl: 'partials/facilities.html',
        controller: 'facilitiesCtrl'
      }).
      when('/facilities/:facilityId', {
        templateUrl: 'partials/facility-detail.html',
        controller: 'facDetailCtrl'
      }).
      when('/broadband', {
        templateUrl: 'partials/broadband.html',
        controller: 'providersCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
