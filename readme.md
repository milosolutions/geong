# Google maps and geolocation modules for angular



Before each , call 'npm install'

## package usage ::
	* display example by calling 'npm test' or 'node testserver.js 8010 test.html'
	* compile code with 'gulp compile' or 'npm start'


## geolocation

Geolocation module use angular $q service to provide proper handling for async operation.


## usage ::

	// implement module ::
	var app = angular.module('GeoTest',['geong','gmaps']);
	// use it controller ::
	app.controller('GeoTestCtrl',function($scope,geolocation){

            geolocation.getLocation(timeout).then(function(result){
                $scope.result = result;
            },function(error){
                $scope.error = error;
            })

	    });



### Google maps plugin

in progress ...