/*
    TODO :
    markers
    position utils
    documentation

 */


var GoogleMapView = (function(){

    /*
        map instance ctor
     */
    function GMapView(element , initParams){
        this.container = element;
        this.autoInit = true;
        for(var name in initParams){
            this[name] = initParams[name];
        }

        if(GMapView.isReady()){
            this._loaded();
        } else {
            GMapView.loadWaiters.push(this);
            GMapView.loadGoogleMaps();
        }
    }

    GMapView.prototype._loaded = function(){console.log('loaded',this)
        if(this.autoInit){
            this.init();
        }
    }

    GMapView.prototype.init = function(){console.log('init')
        this.lastPosition = this.lastPosition || new google.maps.LatLng(0,0);

        var mapOptions = {
            center: this.lastPosition,
            zoom: this.zoom || 1,
            disableDefaultUI: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.container, mapOptions);
    }

    GMapView.prototype.resize = function(){
        google.maps.event.trigger(this.map, 'resize');
    }

    /*
        update map position and zoom ::
        function ({lat:number , lng:number},zoom:int):void;
        function (lat:number , lng:number , zoom:int):void;
     */
    GMapView.prototype.setPosition = function(p1 , p2){
        var pos;
        if(isNaN(p1)){
            pos = p1;
        } else {
            pos = {lat:p1 , lng:p2};
        }
        this.lastPosition = {lat:pos.lat,lng:pos.lng};
        if(this.map){
            this.map.setCenter(this.lastPosition);
        }

    }
    GMapView.prototype.setZoom = function(zoom){
        this.zoom = zoom;
        if(this.map) {
            this.map.setZoom(zoom);
        }
    }

    GMapView.prototype.dispose = function(){

    };


    /*
            static functions ::
     */
    GMapView.loadWaiters = [];
    GMapView.state = 0;// initial state

    GMapView.loadGoogleMaps = function (urlExtension){

        GMapView.updateState();
        if(GMapView.state > 0){return};//already loading or finished

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false' +
        '&callback=GoogleMapView.mapLoaded' + (urlExtension ? urlExtension:"");
        document.body.appendChild(script);
        GMapView.state = 1;// to loading
    }


    GMapView.mapLoaded = function(){
        GMapView.state = 2;
        GMapView.loadWaiters.forEach(function(item){
            item._loaded();
        })
        GMapView.loadWaiters = [];
    }
    /*
     verify API load state ::
     */
    GMapView.updateState = function(){
        if(window.google && window.google.maps){
            GMapView.state = 2;
            return;
        }
        var scripts = document.querySelectorAll('script');
        for(var i = 0 ; i<scripts.length; i++){
            if(scripts[i].src.indexOf('maps.googleapis.com/maps/api/js') != -1){
                GMapView.state = 1;
            };
        }
    }

    /*
        returns true if api is ready
     */
    GMapView.isReady = function(){
        GMapView.updateState();
        return GMapView.state == 2;
    };

    return GMapView;
})();






var gmaps = angular.module('gmaps',[]);

gmaps.directive('mapview',function(){
    return {
        link:function(scope , element , attrs){
            var mapname = attrs.mapview || 'mapview';
            var map = scope[mapname] = new GoogleMapView(element[0]);
            for(var name in attrs){
                if(name.indexOf('map') == 0){
                    var type = name.substr(3);
                    switch (type){
                        case 'zoom':
                            map.setZoom(parseInt(attrs[name]));
                            break;
                        case 'autoinit':
                            map.autoInit = attrs[name] == 'true' ? true:false;
                            break;
                    }
                }
            }

            scope.$on('$destroy',function(){
                scope[mapname].dispose();
            })
        },
        restrict:'A'
    }
});