"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var serviceTrajets_1 = require('./serviceTrajets');
var warehouses_1 = require('./warehouses');
var TypographyComponent = (function () {
    function TypographyComponent(service) {
        this.service = service;
    }
    TypographyComponent.prototype.setMapOnAll = function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    };
    TypographyComponent.prototype.onEnterDate = function (date) {
        if (!date) {
        }
        else {
            console.log(date);
        }
    };
    TypographyComponent.prototype.onEnterSscc = function (value) {
        var _this = this;
        if (!value) {
            //reinitialize phenix_data
            this.trajet = null;
        }
        else {
            //remove all previous markers
            if (typeof this.markers != 'undefined') {
                this.setMapOnAll(null);
            }
            var image_location = '../../assets/img/dot-inside-a-circle.png';
            var image_whs = '../../assets/img/factory-stock-house.png';
            var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
            this.markers = [];
            // Each marker is labeled with a single alphabetical character.
            var labels = '123456789';
            var labelIndex = 0;
            this.service.getItinerary(value).map(function (res) { return res.json(); }).subscribe(function (data) {
                _this.trajet = data;
                var flightPlanCoordinates = [];
                for (var i = 0; i < _this.trajet.length; i++) {
                    flightPlanCoordinates.push({ lat: parseFloat(_this.trajet[i][8]), lng: parseFloat(_this.trajet[i][9]) });
                    // Add a new marker at the new plotted point on the polyline.
                    var marker = new google.maps.Marker({
                        position: { lat: parseFloat(_this.trajet[i][8]), lng: parseFloat(_this.trajet[i][9]) },
                        label: i.toString(),
                        title: 'ID:' + _this.trajet[i][0] + "\n" +
                            _this.convertDateUtc(_this.trajet[i][1], true),
                        map: _this.map,
                        icon: image_location
                    });
                    _this.markers.push(marker);
                }
                /*this.markerCluster = new MarkerClusterer(this.map, this.markers,
                    {maxZoom:9, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});*/
                //add the warehouse
                /*var lat_whs = parseFloat(this.getWarehouseByEan(this.trajet[0][3])[0].latitude);
                var lng_whs = parseFloat(this.getWarehouseByEan(this.trajet[0][3])[0].longitude);
                flightPlanCoordinates.push({lat: lat_whs,lng: lng_whs });
                this.addMarker(lat_whs, lng_whs, this.getWarehouseByEan(this.trajet[0][3])[0].name, image_whs);*/
                /*var flightPlanCoordinates = [
                    {lat: parseFloat(this.trajet[8]), lng: parseFloat(this.trajet[9])},
                    {lat: 21.291, lng: -157.821}

                ];*/
                console.log(flightPlanCoordinates);
                var flightPath = new google.maps.Polyline({
                    path: flightPlanCoordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                flightPath.setMap(_this.map);
                _this.map.setCenter({ lat: parseFloat(_this.trajet[0][8]), lng: parseFloat(_this.trajet[0][9]) });
                _this.map.setZoom(12);
            });
        }
    };
    TypographyComponent.prototype.convertDateUtc = function (phenix_date, hour) {
        console.log(phenix_date);
        var year = phenix_date.substring(0, 4);
        var month = phenix_date.substring(5, 7);
        var day = phenix_date.substring(8, 10);
        if (hour) {
            var hour = phenix_date.substring(11, 13);
            var minute = phenix_date.substring(14, 16);
            var sec = phenix_date.substring(17, 19);
            return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + sec;
        }
        else {
            return day + "/" + month + "/" + year;
        }
    };
    TypographyComponent.prototype.addMarker = function (latitude, longitude, name, icon) {
        var marker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            title: 'ID:' + name,
            map: this.map,
            icon: icon
        });
    };
    TypographyComponent.prototype.getWarehouseByEan = function (ean) {
        return warehouses_1.WHS.filter(function (whs) { return whs.ean.toString().indexOf(ean) > -1; });
    };
    TypographyComponent.prototype.ngOnInit = function () {
        //set google maps defaults
        var zoom = 3;
        var latitude = 0;
        var longitude = -180;
        //this.markers = [];
        var myLatlng = new google.maps.LatLng(latitude, longitude);
        var mapOptions = {
            zoom: zoom,
            center: myLatlng,
            scrollwheel: false,
            styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }]
        };
        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    };
    TypographyComponent = __decorate([
        core_1.Component({
            selector: 'typography-cmp',
            moduleId: module.id,
            templateUrl: 'typography.component.html',
            providers: [serviceTrajets_1.serviceTrajets],
            styles: ["\n    .mappy {\n      margin-top:90px; \n      margin-left: 35px;\n    }"],
        }), 
        __metadata('design:paramtypes', [serviceTrajets_1.serviceTrajets])
    ], TypographyComponent);
    return TypographyComponent;
}());
exports.TypographyComponent = TypographyComponent;
//# sourceMappingURL=typography.component.js.map