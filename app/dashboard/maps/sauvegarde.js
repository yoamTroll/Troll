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
var forms_1 = require("@angular/forms");
var core_2 = require('angular2-google-maps/core');
require('rxjs/add/observable/forkJoin');
var Observable_1 = require('rxjs/Observable');
var sensors_service_1 = require('./sensors.service');
require('rxjs/add/operator/catch');
var MapsComponent = (function () {
    function MapsComponent(mapsAPILoader, ngZone, sensorsService) {
        this.mapsAPILoader = mapsAPILoader;
        this.ngZone = ngZone;
        this.sensorsService = sensorsService;
    }
    /**
    * getSensors retrieves sensors data
    * and add markers on the map for each sensor
    * @param map
    * @returns void
    */
    MapsComponent.prototype.getSensors = function (map) {
        var _this = this;
        this.sensorsService.getSensors().then(function (sensors) {
            // now sensors data is avalaible
            _this.sensors = sensors;
            // window's creation
            var infoWindow = new google.maps.InfoWindow();
            for (var sensor in _this.sensors) {
                infoWindow = _this.setMarker(_this.sensors[sensor].id, _this.sensors[sensor].latitude, _this.sensors[sensor].longitude, map, infoWindow);
            }
            //
        }, function (error) {
            // FAILURE
            console.log("ERROR : getSensors() in maps.component.ts, unable to\n          reach sensors data" + error);
        });
    };
    MapsComponent.prototype.removeElements = function (arrayOrigin, elements) {
        var array = arrayOrigin.filter(function (item) {
            return elements.indexOf(item) === -1;
        });
        return array;
    };
    /**
    * getDataObjenious retrieves sensors data
    * @returns void
    */
    MapsComponent.prototype.getDataObjenious2 = function (map, infoWindow) {
        var _this = this;
        var identifiers = [];
        //no data available
        var sensors_off = ['23362423066984449'];
        var markers = [];
        this.sensorsService.getDataObjenious().map(function (data) { return data.json(); }).subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var device = data_1[_i];
                //remove doublons
                if (identifiers.indexOf(device.id) == -1) {
                    identifiers.push(device.id);
                }
            }
            identifiers = _this.removeElements(identifiers, sensors_off);
            var ids = [];
            for (var i = 0; i <= Math.trunc(identifiers.length / 100); i++) {
                ids.push(identifiers.slice(i * 100, (i + 1) * 100));
            }
            var url = "http://localhost:8080/objenious/devices/states/" + ids[0].toString() + "?format=jsonp&jsonp=JSONP_CALLBACK";
            console.log(url);
            _this.sensorsService.requestUrl(url).map(function (data) { return data.json(); }).subscribe(function (data) {
                _this.devices = data.states;
                for (var sensor in _this.devices) {
                    var marker = _this.setMarker(_this.devices[sensor].id, _this.devices[sensor].lat, _this.devices[sensor].lng, map, infoWindow);
                    markers.push(marker);
                }
                console.log("first", markers.length);
                var url_bis = "http://localhost:8080/objenious/devices/states/" + ids[1].toString() + "?format=jsonp&jsonp=JSONP_CALLBACK";
                _this.addMarker(url_bis, map, infoWindow, markers);
                //console.log(markers);         
                //Array.prototype.push.apply(markers,others);
            });
        });
    };
    MapsComponent.prototype.addMarker = function (url, map, infoWindow, markers) {
        var _this = this;
        console.log(url);
        this.sensorsService.requestUrl(url).map(function (data) { return data.json(); }).subscribe(function (data) {
            var devices = data.states;
            for (var sensor in devices) {
                var marker = _this.setMarker(devices[sensor].id, devices[sensor].lat, devices[sensor].lng, map, infoWindow);
                markers.push(marker);
            }
            //console.log(markers_bis.length);
            var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        });
    };
    /**
    * setMarker add markers with some information on the
    * google map
    * @param id sensor's identifier
    * @param latitude sensor's latitude
    * @param longitude sensor's longitude
    * @param map google maps
    * @param infoWindow
    * @returns InfoWindow
    */
    MapsComponent.prototype.setMarker = function (id, latitude, longitude, map, infoWindow) {
        var latLng = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'sensor_' + id
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
        // window's options
        var contentString = "<h3>" + marker.title + "</h3>";
        // display window on the user's click
        google.maps.event.addListener(marker, 'mouseover', function () {
            //close infoWindow when another marker is clicked
            //infoWindow.close();
            //update the info window
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
        });
        return marker;
    };
    /**
    * getDataObjenious get all information about
    * the sensors (temperature, GPS location, shocks)
    * @param map
    * @param infoWindow
    */
    MapsComponent.prototype.getDataObjenious = function (map, infoWindow) {
        var _this = this;
        // list of ids of sensors
        var identifiers = [];
        //no data available
        var sensors_off = ['23362423066984449'];
        var markers = [];
        var urls = [];
        var ids = [];
        var tmp = [];
        this.sensorsService.getDataObjenious().map(function (devices) { return devices.json(); }).subscribe(function (devices) {
            for (var _i = 0, devices_1 = devices; _i < devices_1.length; _i++) {
                var device = devices_1[_i];
                //remove doublons
                if (identifiers.indexOf(device.id) == -1) {
                    identifiers.push(device.id);
                }
            }
            //remove sensors where no data is avalaible
            identifiers = _this.removeElements(identifiers, sensors_off);
            for (var i = 0; i <= Math.trunc(identifiers.length / 100); i++) {
                // API Objenious can not support a request with more than 100 parameters 
                ids.push(identifiers.slice(i * 100, (i + 1) * 100));
                var url = "http://localhost:8080/objenious/devices/states/" + ids[i].toString() + "?format=jsonp&jsonp=JSONP_CALLBACK";
                // store urls to call
                urls.push(url);
            }
            var observableBatch = [];
            for (var _a = 0, urls_1 = urls; _a < urls_1.length; _a++) {
                var url = urls_1[_a];
                // get data for each sensor
                observableBatch.push(_this.sensorsService.requestUrl(url).map(function (data) { return data.json(); }));
            }
            Observable_1.Observable.forkJoin(observableBatch).subscribe(function (data) {
                //for each url to call
                for (var i = 0; i < observableBatch.length; i++) {
                    var sensors = data[i].states;
                    for (var sensor in sensors) {
                        // add the sensor
                        tmp.push(sensors[sensor]);
                        // create a  marker on the map
                        var marker = _this.setMarker(sensors[sensor].id, sensors[sensor].lat, sensors[sensor].lng, map, infoWindow);
                        markers.push(marker);
                    }
                }
                //to bind with the html
                _this.devices = tmp;
                // create clusters of markers on the map
                var markerCluster = new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
                /**google.maps.event.addListener(this.markerCluster, 'clusterclick', function(cluster) {
                if (this.map.getZoom() < this.map.maxZoom ){
                    this.map.setCenter(cluster.center_);
                    this.map.setZoom(this.map.getZoom() + 2);
                } else {
                    var content = '';
                    var info = new google.maps.MVCObject;
                    info.set('position', cluster.center_);
                    var marks_in_cluster = cluster.getMarkers();
                    console.log(marks_in_cluster);
                    for (var z = 0; z < marks_in_cluster.length; z++) {
                        content += marks_in_cluster[z].title;
                    }
                    var infowindow = new google.maps.InfoWindow();
                    infowindow.setContent(content);
                    infowindow.open(map, info);
                    
                    }
                });**/
            });
        });
    };
    MapsComponent.prototype.onEnterSscc = function (value) {
        if (!value) {
            //reinitialize phenix_data
            this.phenix_data = "";
            this.map.setCenter({ lat: this.latitude, lng: this.longitude });
            this.map.setZoom(6);
        }
        else {
            //call pĥenix WS
            this.callTest();
            //this.phenix_data="successfull";
            //zoom on research
            var devices = this.devices.filter(function (device) { return device.id.toLocaleLowerCase().indexOf(value) > -1; });
            //var marker = this.markers.filter(marker => marker.title.toLocaleLowerCase().indexOf("sensor_"+value) > -1);
            this.map.setCenter({ lat: parseFloat(devices[0].lat), lng: parseFloat(devices[0].lng) });
            this.map.setZoom(12);
        }
    };
    MapsComponent.prototype.callTest = function () {
        var url = "http://localhost:8080/phenix/exposition/332701977477480366?format=jsonp&jsonp=JSONP_CALLBACK";
        this.sensorsService.requestUrl(url).map(function (data) { return data.json(); }).subscribe(function (data) {
            console.log(data);
        });
    };
    MapsComponent.prototype.getStores = function () {
        return [
            new google.maps.LatLng(48.629828, 2.441782),
            new google.maps.LatLng(48.949258, 3.130639),
            new google.maps.LatLng(48.798335, 2.400489),
            new google.maps.LatLng(48.840566, 2.369215),
            new google.maps.LatLng(47.695622, 3.995664),
            new google.maps.LatLng(48.815628, 2.423646),
            new google.maps.LatLng(48.859768, 2.328079),
            new google.maps.LatLng(48.849832, 2.323296),
            new google.maps.LatLng(48.895411, 2.275763),
            new google.maps.LatLng(48.869773, 2.408961),
            new google.maps.LatLng(48.758295, 1.924324),
            new google.maps.LatLng(49.264077, 2.475928),
            new google.maps.LatLng(48.839029, 2.292606),
            new google.maps.LatLng(48.899075, 2.873725),
            new google.maps.LatLng(48.783783, 2.171021),
            new google.maps.LatLng(48.792526, 2.396195),
            new google.maps.LatLng(49.000613, 2.090111),
            new google.maps.LatLng(48.87192, 2.37154),
            new google.maps.LatLng(48.914653, 2.383254),
            new google.maps.LatLng(48.88808, 2.28607),
            new google.maps.LatLng(48.845735, 2.393421),
            new google.maps.LatLng(48.682617, 1.64524),
            new google.maps.LatLng(48.566372, 2.485543),
            new google.maps.LatLng(48.867886, 2.335233),
            new google.maps.LatLng(48.845468, 2.237496),
            new google.maps.LatLng(48.904638, 2.338522),
            new google.maps.LatLng(48.846243, 2.343036),
            new google.maps.LatLng(48.88497, 2.291055),
            new google.maps.LatLng(48.805722, 2.496607),
            new google.maps.LatLng(48.888182, 2.2395477),
            new google.maps.LatLng(48.855615, 2.274975),
            new google.maps.LatLng(48.33555, 2.744334),
            new google.maps.LatLng(48.86621, 2.288644),
            new google.maps.LatLng(49.073912, 2.675071),
            new google.maps.LatLng(48.870669, 2.2814),
            new google.maps.LatLng(48.884936, 2.379666),
            new google.maps.LatLng(48.914962, 2.300754),
            new google.maps.LatLng(48.882223, 2.304495),
            new google.maps.LatLng(48.762982, 2.281446),
            new google.maps.LatLng(48.83201, 2.79951),
            new google.maps.LatLng(48.874927, 2.745977),
            new google.maps.LatLng(49.036808, 2.694564),
            new google.maps.LatLng(49.018168, 2.24342),
            new google.maps.LatLng(48.614923, 2.027305),
            new google.maps.LatLng(48.466931, 2.606784),
            new google.maps.LatLng(48.872019, 2.343104),
            new google.maps.LatLng(48.888483, 2.459414),
            new google.maps.LatLng(48.797221, 2.285499),
            new google.maps.LatLng(48.886983, 2.314456),
            new google.maps.LatLng(48.877309, 2.338675),
            new google.maps.LatLng(48.883426, 2.131649),
            new google.maps.LatLng(48.876063, 2.381339),
            new google.maps.LatLng(48.834604, 2.327292),
            new google.maps.LatLng(49.3825115, 3.3278503),
            new google.maps.LatLng(48.935199, 2.367939),
            new google.maps.LatLng(48.848192, 2.330996),
            new google.maps.LatLng(48.896155, 2.28683),
            new google.maps.LatLng(48.880331, 2.301984),
            new google.maps.LatLng(48.898144, 2.829552),
            new google.maps.LatLng(48.887452, 2.261265),
            new google.maps.LatLng(48.514965, 1.838311),
            new google.maps.LatLng(48.914556, 2.283465),
            new google.maps.LatLng(48.833593, 2.285825),
            new google.maps.LatLng(48.862444, 2.378293),
            new google.maps.LatLng(48.842901, 2.213083),
            new google.maps.LatLng(48.851711, 2.406232),
            new google.maps.LatLng(48.955022, 2.590061),
            new google.maps.LatLng(48.899882, 2.441276),
            new google.maps.LatLng(48.645287, 1.820458),
            new google.maps.LatLng(48.692409, 2.431438),
            new google.maps.LatLng(49.164938, 2.235825),
            new google.maps.LatLng(49.164938, 2.235825),
            new google.maps.LatLng(48.866098, 2.286235),
            new google.maps.LatLng(48.837133, 2.520782),
            new google.maps.LatLng(49.291331, 2.4994916),
            new google.maps.LatLng(48.408041, 2.687955),
            new google.maps.LatLng(48.592622, 2.189511),
            new google.maps.LatLng(48.844539, 2.319332),
            new google.maps.LatLng(48.853442, 1.983801),
            new google.maps.LatLng(48.885512, 2.504629),
            new google.maps.LatLng(48.847812, 2.286508),
            new google.maps.LatLng(49.216859, 2.419274),
            new google.maps.LatLng(48.841005, 2.317035),
            new google.maps.LatLng(48.794191, 3.274376),
            new google.maps.LatLng(48.890867, 2.325271),
            new google.maps.LatLng(48.701225, 2.486347),
            new google.maps.LatLng(48.800528, 2.153299),
            new google.maps.LatLng(48.702075, 1.884829),
            new google.maps.LatLng(49.021938, 2.02264),
            new google.maps.LatLng(48.630091, 2.486512),
            new google.maps.LatLng(48.630569, 2.485785),
            new google.maps.LatLng(48.399983, 2.797355),
            new google.maps.LatLng(48.89222, 1.678821),
            new google.maps.LatLng(48.860373, 2.364558),
            new google.maps.LatLng(48.922702, 2.543958),
            new google.maps.LatLng(49.387628, 3.315376),
            new google.maps.LatLng(48.286123, 3.204477),
            new google.maps.LatLng(48.833278, 2.546588),
            new google.maps.LatLng(48.555813, 3.01241),
            new google.maps.LatLng(48.85339, 2.336984),
            new google.maps.LatLng(48.849667, 2.350085),
            new google.maps.LatLng(48.851696, 2.313306),
            new google.maps.LatLng(48.804093, 2.486319),
            new google.maps.LatLng(48.857094, 2.27341),
            new google.maps.LatLng(48.804926, 2.457648),
            new google.maps.LatLng(48.888063, 2.286169),
            new google.maps.LatLng(48.879163, 2.592207),
            new google.maps.LatLng(48.83717, 2.39182),
            new google.maps.LatLng(48.742225, 1.964234),
            new google.maps.LatLng(48.848655, 2.321022),
            new google.maps.LatLng(49.04456, 3.403437),
            new google.maps.LatLng(48.789137, 2.467179),
            new google.maps.LatLng(48.872985, 2.403584),
            new google.maps.LatLng(48.832014, 2.347374),
            new google.maps.LatLng(48.845264, 2.614716),
            new google.maps.LatLng(48.739874, 1.950244),
            new google.maps.LatLng(48.876315, 2.251796),
            new google.maps.LatLng(48.725552, 2.661452),
            new google.maps.LatLng(48.768813, 2.053485),
            new google.maps.LatLng(48.876885, 2.249999),
            new google.maps.LatLng(48.89267, 2.316377),
            new google.maps.LatLng(47.789798, 3.67173),
            new google.maps.LatLng(48.868912, 2.371721),
            new google.maps.LatLng(48.538321, 2.659139),
            new google.maps.LatLng(48.598146, 2.465089),
            new google.maps.LatLng(48.83673, 2.359614),
            new google.maps.LatLng(48.596652, 2.492851),
            new google.maps.LatLng(48.895659, 2.526254),
            new google.maps.LatLng(49.309464, 2.731984),
            new google.maps.LatLng(48.898181, 2.093659),
            new google.maps.LatLng(48.864643, 2.180541),
            new google.maps.LatLng(48.859247, 2.32374),
            new google.maps.LatLng(49.237264, 2.887812),
            new google.maps.LatLng(48.608824, 1.676475),
            new google.maps.LatLng(48.890776, 2.34537),
            new google.maps.LatLng(48.490028, 2.416541),
            new google.maps.LatLng(48.834979, 2.255099),
            new google.maps.LatLng(48.961792, 3.210532),
            new google.maps.LatLng(48.84894, 2.29421),
            new google.maps.LatLng(48.899424, 2.246085),
            new google.maps.LatLng(48.842812, 2.277577),
            new google.maps.LatLng(48.638548, 2.270897),
            new google.maps.LatLng(48.780673, 2.279938),
            new google.maps.LatLng(47.511852, 4.09001),
            new google.maps.LatLng(48.908904, 2.286599),
            new google.maps.LatLng(48.860186, 2.022394),
            new google.maps.LatLng(48.849624, 2.387405),
            new google.maps.LatLng(48.341081, 2.718556),
            new google.maps.LatLng(48.847604, 2.299409),
            new google.maps.LatLng(48.8616236, 2.1847869),
            new google.maps.LatLng(48.880463, 2.45216),
            new google.maps.LatLng(48.96405, 3.052667),
            new google.maps.LatLng(48.801288, 2.331703),
            new google.maps.LatLng(48.857998, 2.329306),
            new google.maps.LatLng(48.885326, 2.336506),
            new google.maps.LatLng(48.793917, 2.399154),
            new google.maps.LatLng(48.942942, 2.496121),
            new google.maps.LatLng(48.856081, 2.376075),
            new google.maps.LatLng(48.977442, 2.291555),
            new google.maps.LatLng(48.178972, 3.095103),
            new google.maps.LatLng(48.901432, 2.278015),
            new google.maps.LatLng(48.868774, 2.448166),
            new google.maps.LatLng(48.659314, 2.366603),
            new google.maps.LatLng(48.836136, 2.300595),
            new google.maps.LatLng(48.682311, 2.173422),
            new google.maps.LatLng(49.405422, 3.115467),
            new google.maps.LatLng(48.76779, 2.018222),
            new google.maps.LatLng(48.789849, 1.60187),
            new google.maps.LatLng(48.822312, 2.341238),
            new google.maps.LatLng(48.847166, 2.385279),
            new google.maps.LatLng(48.844933, 2.210103),
            new google.maps.LatLng(49.0798729, 2.5022779),
            new google.maps.LatLng(48.874784, 2.353628),
            new google.maps.LatLng(48.897183, 2.256445),
            new google.maps.LatLng(48.756893, 1.882101),
            new google.maps.LatLng(48.12942, 3.307326),
            new google.maps.LatLng(48.945794, 2.686666),
            new google.maps.LatLng(48.888648, 2.346324),
            new google.maps.LatLng(49.030733, 2.069601),
            new google.maps.LatLng(48.846924, 2.310227),
            new google.maps.LatLng(48.842322, 2.281737),
            new google.maps.LatLng(48.814893, 2.234355),
            new google.maps.LatLng(48.802415, 2.161767),
            new google.maps.LatLng(48.361159, 2.126524),
            new google.maps.LatLng(48.879079, 2.356224),
            new google.maps.LatLng(48.8238, 2.128167),
            new google.maps.LatLng(48.898305, 2.094429),
            new google.maps.LatLng(48.843462, 2.409834),
            new google.maps.LatLng(48.840542, 2.417517),
            new google.maps.LatLng(48.706079, 2.071717),
            new google.maps.LatLng(48.950347, 2.358066),
            new google.maps.LatLng(48.841945, 2.259308),
            new google.maps.LatLng(48.846052, 2.470456),
            new google.maps.LatLng(48.82612, 2.280148),
            new google.maps.LatLng(49.5919484, 5.2561604),
            new google.maps.LatLng(47.64014, 3.071197),
            new google.maps.LatLng(48.905444, 2.644155),
            new google.maps.LatLng(48.630788, 2.485782),
            new google.maps.LatLng(48.845038, 2.345573),
            new google.maps.LatLng(48.873146, 2.303417),
            new google.maps.LatLng(48.806875, 2.285607),
            new google.maps.LatLng(48.61704, 3.194612),
            new google.maps.LatLng(48.865601, 2.355812),
            new google.maps.LatLng(48.871697, 2.318454),
            new google.maps.LatLng(48.630788, 2.485782),
            new google.maps.LatLng(48.881487, 2.331525),
            new google.maps.LatLng(48.845177, 2.354355),
            new google.maps.LatLng(48.840415, 2.22966),
            new google.maps.LatLng(48.862295, 2.384536),
            new google.maps.LatLng(48.932494, 2.297568),
            new google.maps.LatLng(49.153895, 1.78819),
            new google.maps.LatLng(48.839252, 2.257577),
            new google.maps.LatLng(48.873169, 2.362058),
            new google.maps.LatLng(48.837888, 2.280505),
            new google.maps.LatLng(49.070446, 2.174281),
            new google.maps.LatLng(48.923778, 2.257813),
            new google.maps.LatLng(48.911492, 2.520665),
            new google.maps.LatLng(48.846446, 2.284277),
            new google.maps.LatLng(48.888087, 2.299686),
            new google.maps.LatLng(48.859332, 2.353852),
            new google.maps.LatLng(48.848528, 2.431949),
            new google.maps.LatLng(48.846385, 2.375895),
            new google.maps.LatLng(48.788933, 2.503828),
            new google.maps.LatLng(47.895038, 3.758104),
            new google.maps.LatLng(48.854477, 2.305778),
            new google.maps.LatLng(49.294906, 2.815245),
            new google.maps.LatLng(48.796359, 2.154358),
            new google.maps.LatLng(48.87631, 2.300392),
            new google.maps.LatLng(48.54164, 2.331822),
            new google.maps.LatLng(48.808702, 2.154521),
            new google.maps.LatLng(48.842143, 2.337605),
            new google.maps.LatLng(47.624377, 3.862274),
            new google.maps.LatLng(48.877521, 2.286951),
            new google.maps.LatLng(48.8596739, 2.3682614),
            new google.maps.LatLng(48.873373, 2.312606),
            new google.maps.LatLng(48.553934, 2.430953),
            new google.maps.LatLng(48.813865, 2.136006),
            new google.maps.LatLng(48.8996975, 2.3290805),
            new google.maps.LatLng(49.251031, 2.469937),
            new google.maps.LatLng(48.821884, 2.285457),
            new google.maps.LatLng(48.964674, 3.322501),
            new google.maps.LatLng(48.834874, 2.25478),
            new google.maps.LatLng(49.005536, 3.556372),
            new google.maps.LatLng(48.82904, 2.247448),
            new google.maps.LatLng(48.854857, 2.378266),
            new google.maps.LatLng(48.890913, 2.331941),
            new google.maps.LatLng(49.286766, 2.460498),
            new google.maps.LatLng(48.403447, 2.720876),
            new google.maps.LatLng(48.859655, 2.306798),
            new google.maps.LatLng(48.856177, 2.745064),
            new google.maps.LatLng(48.836153, 2.290916),
            new google.maps.LatLng(48.820396, 2.305026),
            new google.maps.LatLng(48.836002, 2.395665),
            new google.maps.LatLng(48.876688, 2.315611),
            new google.maps.LatLng(49.154981, 2.441046),
            new google.maps.LatLng(48.868385, 2.19316),
            new google.maps.LatLng(48.827094, 2.242335),
            new google.maps.LatLng(48.551694, 2.119818),
            new google.maps.LatLng(49.046621, 2.024504),
            new google.maps.LatLng(48.844417, 2.402139),
            new google.maps.LatLng(48.708087, 2.388191),
            new google.maps.LatLng(48.851733, 2.318074),
            new google.maps.LatLng(48.928767, 2.542021),
            new google.maps.LatLng(48.911376, 2.272224),
            new google.maps.LatLng(49.026553, 2.224601),
            new google.maps.LatLng(48.82783241, 2.329227493),
            new google.maps.LatLng(48.84989, 2.295932),
            new google.maps.LatLng(48.707582, 2.040044),
            new google.maps.LatLng(49.004937, 1.908173),
            new google.maps.LatLng(49.265215, 1.88445),
            new google.maps.LatLng(48.758861, 3.218906),
            new google.maps.LatLng(48.872795, 2.331087),
            new google.maps.LatLng(48.80817, 2.992751),
            new google.maps.LatLng(48.829048, 2.282768),
            new google.maps.LatLng(48.987143, 2.257365),
            new google.maps.LatLng(48.84392, 2.307153),
            new google.maps.LatLng(48.90482, 2.308638),
            new google.maps.LatLng(48.746057, 2.283049),
            new google.maps.LatLng(48.882395, 2.370622),
            new google.maps.LatLng(48.842998, 2.302506),
            new google.maps.LatLng(48.881843, 2.286245),
            new google.maps.LatLng(48.867899, 2.386555),
            new google.maps.LatLng(48.854096, 2.410618),
            new google.maps.LatLng(49.053248, 2.685082),
            new google.maps.LatLng(48.835495, 2.249037),
            new google.maps.LatLng(48.873151, 2.329709),
            new google.maps.LatLng(48.8136637, 2.3459892),
            new google.maps.LatLng(48.945216, 2.143254),
            new google.maps.LatLng(48.827479, 2.273818),
            new google.maps.LatLng(48.872848, 2.484223),
            new google.maps.LatLng(48.89103111, 2.288669394),
            new google.maps.LatLng(47.886238, 3.095086),
            new google.maps.LatLng(48.728757, 2.309214),
            new google.maps.LatLng(48.885914, 2.246115),
            new google.maps.LatLng(48.882581, 2.247688),
            new google.maps.LatLng(48.835717, 2.396554),
            new google.maps.LatLng(48.543532, 2.640623),
            new google.maps.LatLng(48.639793, 2.349642),
            new google.maps.LatLng(48.890093, 2.063159),
            new google.maps.LatLng(48.385863, 2.89997),
            new google.maps.LatLng(48.845871, 2.319627),
            new google.maps.LatLng(48.848232, 2.323952),
            new google.maps.LatLng(48.852973, 2.3930953),
            new google.maps.LatLng(49.0602781, 2.3473694),
            new google.maps.LatLng(48.798335, 2.127114),
            new google.maps.LatLng(48.885356, 2.310435),
            new google.maps.LatLng(48.889424, 2.33354),
            new google.maps.LatLng(48.833142, 2.354508),
            new google.maps.LatLng(48.904554, 2.041553),
            new google.maps.LatLng(48.8668, 2.30242),
            new google.maps.LatLng(48.814774, 2.286476),
            new google.maps.LatLng(48.8709557, 2.0740522),
            new google.maps.LatLng(48.565184, 2.610793),
            new google.maps.LatLng(48.650441, 3.4074),
            new google.maps.LatLng(48.864704, 2.378279),
            new google.maps.LatLng(48.88854, 2.323759),
            new google.maps.LatLng(48.798504, 2.13485),
            new google.maps.LatLng(48.679005, 2.318582),
            new google.maps.LatLng(48.91453227, 2.325159267),
            new google.maps.LatLng(48.807784, 2.376491),
            new google.maps.LatLng(48.8935542, 2.3382014),
            new google.maps.LatLng(48.82006966, 2.478774005),
            new google.maps.LatLng(48.8145128, 2.1507604),
            new google.maps.LatLng(48.906584, 2.247305),
            new google.maps.LatLng(48.9050695, 2.301984),
            new google.maps.LatLng(48.843037, 2.243776),
            new google.maps.LatLng(48.8341875, 2.3665062),
            new google.maps.LatLng(48.785954, 2.431121),
            new google.maps.LatLng(48.891188, 2.551853),
            new google.maps.LatLng(49.089987, 3.535028),
            new google.maps.LatLng(48.84404, 2.351135),
            new google.maps.LatLng(48.887715, 2.092828),
            new google.maps.LatLng(48.973669, 2.382212),
            new google.maps.LatLng(47.982894, 3.396278),
            new google.maps.LatLng(48.82723, 2.368112),
            new google.maps.LatLng(48.861847, 2.123343),
            new google.maps.LatLng(48.652163, 1.818549),
            new google.maps.LatLng(48.765728, 2.488413),
            new google.maps.LatLng(48.7282605, 2.3686142),
            new google.maps.LatLng(48.828615, 2.303601),
            new google.maps.LatLng(49.301161, 2.605078),
            new google.maps.LatLng(48.825667, 1.987278),
            new google.maps.LatLng(48.859612, 2.378692),
            new google.maps.LatLng(49.0043944, 2.5159004),
            new google.maps.LatLng(48.919913, 2.459035),
            new google.maps.LatLng(48.84079546, 2.32331637),
            new google.maps.LatLng(49.31287482, 2.325300647),
            new google.maps.LatLng(48.5498385, 2.6502335),
            new google.maps.LatLng(48.9840028, 2.3668685),
            new google.maps.LatLng(48.98368038, 2.459783497),
            new google.maps.LatLng(48.97160945, 2.404975129),
            new google.maps.LatLng(48.87616649, 2.686587501),
            new google.maps.LatLng(49.00144, 2.235405),
            new google.maps.LatLng(48.89358, 2.380237),
            new google.maps.LatLng(48.870344, 2.353009),
            new google.maps.LatLng(48.857492, 2.907229),
            new google.maps.LatLng(48.836338, 2.310418),
            new google.maps.LatLng(48.81917459, 2.360041256),
            new google.maps.LatLng(48.866966, 2.396982),
            new google.maps.LatLng(48.82659888, 2.368945548),
            new google.maps.LatLng(48.86954401, 2.405309864),
            new google.maps.LatLng(48.84025448, 2.303715855),
            new google.maps.LatLng(48.9315562, 2.493632292),
            new google.maps.LatLng(48.89832847, 2.307618659),
            new google.maps.LatLng(48.87544, 2.341882),
            new google.maps.LatLng(48.96077802, 2.326117441),
            new google.maps.LatLng(48.915542, 2.275444),
            new google.maps.LatLng(48.929444, 2.268473),
            new google.maps.LatLng(48.893283, 2.512917),
            new google.maps.LatLng(48.81409, 2.425188),
            new google.maps.LatLng(48.854975, 2.386039),
            new google.maps.LatLng(48.896413, 2.338143),
            new google.maps.LatLng(48.88706, 2.372757),
            new google.maps.LatLng(48.833907, 2.30772),
            new google.maps.LatLng(48.84788316, 2.310977909),
            new google.maps.LatLng(48.761521, 2.443463),
            new google.maps.LatLng(48.8053146, 2.5509063),
            new google.maps.LatLng(48.816793, 2.306397),
            new google.maps.LatLng(49.38152644, 3.314986799),
            new google.maps.LatLng(48.8537885, 2.520787488),
            new google.maps.LatLng(48.737162, 2.327777),
            new google.maps.LatLng(48.802321, 2.420843),
            new google.maps.LatLng(48.69067, 2.293641),
            new google.maps.LatLng(48.848409, 2.43639),
            new google.maps.LatLng(47.96443573, 2.341043159),
            new google.maps.LatLng(48.87377952, 2.385002408),
            new google.maps.LatLng(48.796749, 2.058042),
            new google.maps.LatLng(48.94532, 2.207667),
            new google.maps.LatLng(48.741368, 2.736517),
            new google.maps.LatLng(48.998313, 2.151774),
            new google.maps.LatLng(48.870248, 2.349762),
            new google.maps.LatLng(48.525497, 2.644382),
            new google.maps.LatLng(48.865028, 2.33165),
            new google.maps.LatLng(47.367883, 3.996889),
            new google.maps.LatLng(48.829217, 2.317529),
            new google.maps.LatLng(48.862496, 2.376482),
            new google.maps.LatLng(48.851177, 2.376474),
            new google.maps.LatLng(49.234423, 2.126631),
            new google.maps.LatLng(48.8986305, 2.516832),
            new google.maps.LatLng(48.85458999, 2.269329458),
            new google.maps.LatLng(48.84581091, 2.298554067),
            new google.maps.LatLng(48.88942873, 2.344265055),
            new google.maps.LatLng(48.976065, 2.041085),
            new google.maps.LatLng(48.722605, 2.499213),
            new google.maps.LatLng(48.909633, 2.241426),
            new google.maps.LatLng(48.75085503, 2.454335951),
            new google.maps.LatLng(48.83948, 2.351024),
            new google.maps.LatLng(48.9109819, 2.2208836),
            new google.maps.LatLng(48.852014, 2.34119),
            new google.maps.LatLng(48.666085, 2.546355),
            new google.maps.LatLng(48.77888, 2.400438),
            new google.maps.LatLng(49.121251, 2.532619),
            new google.maps.LatLng(48.831624, 2.359272),
            new google.maps.LatLng(48.871122, 2.352756),
            new google.maps.LatLng(48.826931, 2.247256),
            new google.maps.LatLng(48.874576, 2.354689),
            new google.maps.LatLng(48.880748, 2.373853),
            new google.maps.LatLng(48.922563, 2.252501),
            new google.maps.LatLng(48.876555, 2.369034),
            new google.maps.LatLng(48.894536, 2.320892),
            new google.maps.LatLng(48.704656, 2.31837),
            new google.maps.LatLng(48.82111, 2.302544),
            new google.maps.LatLng(48.857365, 2.432584),
            new google.maps.LatLng(48.845787, 2.490561),
            new google.maps.LatLng(48.84599, 2.421458),
            new google.maps.LatLng(48.812033, 2.510081),
            new google.maps.LatLng(48.991761, 2.258134),
            new google.maps.LatLng(48.848866, 2.4592911),
            new google.maps.LatLng(48.873148, 2.344127),
            new google.maps.LatLng(48.821736, 2.419931),
            new google.maps.LatLng(48.041363, 3.064504),
            new google.maps.LatLng(48.876445, 2.368652),
            new google.maps.LatLng(48.881586, 2.366108),
            new google.maps.LatLng(48.887856, 2.510855),
            new google.maps.LatLng(48.832258, 2.234106),
            new google.maps.LatLng(48.909628, 2.55026),
            new google.maps.LatLng(49.286462, 1.800259),
            new google.maps.LatLng(48.872639, 2.404925),
            new google.maps.LatLng(48.84571, 2.287333),
            new google.maps.LatLng(48.843618, 2.294423),
            new google.maps.LatLng(48.92656, 2.213818),
            new google.maps.LatLng(48.726904, 2.536778),
            new google.maps.LatLng(48.7586619, 2.317454),
            new google.maps.LatLng(48.885408, 2.404054),
            new google.maps.LatLng(48.8298358, 2.3292963),
            new google.maps.LatLng(48.829672, 2.3293483),
            new google.maps.LatLng(48.888201, 2.392162),
            new google.maps.LatLng(48.891587, 2.378338),
            new google.maps.LatLng(48.891196, 2.195278),
            new google.maps.LatLng(48.8806417, 2.2979331),
            new google.maps.LatLng(48.979886, 1.711359),
            new google.maps.LatLng(48.805657, 2.135894),
            new google.maps.LatLng(48.826741, 2.357383),
            new google.maps.LatLng(48.841654, 2.288973),
            new google.maps.LatLng(48.843763, 2.464346),
            new google.maps.LatLng(48.99006, 2.057708),
            new google.maps.LatLng(48.873715, 2.387948),
            new google.maps.LatLng(48.838087, 2.32295),
            new google.maps.LatLng(48.846328, 2.378968),
            new google.maps.LatLng(48.882959, 2.303549),
            new google.maps.LatLng(48.868785, 2.381523),
            new google.maps.LatLng(48.827571, 2.345604),
            new google.maps.LatLng(48.828828, 2.370167),
            new google.maps.LatLng(48.920253, 1.975474),
            new google.maps.LatLng(48.8224079, 2.358187),
            new google.maps.LatLng(48.834704, 2.567241),
            new google.maps.LatLng(48.769966, 2.391695),
            new google.maps.LatLng(48.796997, 2.456771),
            new google.maps.LatLng(48.707979, 2.466489),
            new google.maps.LatLng(48.862209, 2.505381),
            new google.maps.LatLng(48.87224, 2.37791),
            new google.maps.LatLng(48.870659, 2.32795),
            new google.maps.LatLng(48.876433, 2.182042),
            new google.maps.LatLng(48.648438, 2.302979),
            new google.maps.LatLng(48.934876, 2.332504),
            new google.maps.LatLng(48.406297, 2.701769),
            new google.maps.LatLng(48.885465, 2.326378),
            new google.maps.LatLng(48.604458, 1.677592),
            new google.maps.LatLng(48.875993, 2.394119),
            new google.maps.LatLng(48.835464, 2.360182),
            new google.maps.LatLng(48.938914, 1.998485),
            new google.maps.LatLng(48.832648, 2.386027),
            new google.maps.LatLng(48.897807, 2.292606),
            new google.maps.LatLng(48.8755322, 2.284227),
            new google.maps.LatLng(48.847067, 2.353565),
            new google.maps.LatLng(48.722493, 2.533529),
            new google.maps.LatLng(48.904162, 2.392328),
            new google.maps.LatLng(48.859299, 2.349239),
            new google.maps.LatLng(48.84538, 2.29715),
            new google.maps.LatLng(48.990906, 2.162895),
            new google.maps.LatLng(48.92027, 2.409386),
            new google.maps.LatLng(48.887856, 2.22285),
            new google.maps.LatLng(48.639778, 2.435223),
            new google.maps.LatLng(48.891547, 2.41435),
            new google.maps.LatLng(48.893199, 2.338876),
            new google.maps.LatLng(48.603323, 2.467647),
            new google.maps.LatLng(48.770497, 1.970752),
            new google.maps.LatLng(48.864111, 2.399478),
            new google.maps.LatLng(48.8467846, 2.3756155),
            new google.maps.LatLng(48.836331, 2.2953198),
            new google.maps.LatLng(48.822867, 2.358835),
            new google.maps.LatLng(49.106056, 2.205303),
            new google.maps.LatLng(48.790263, 2.658649),
            new google.maps.LatLng(48.905499, 2.343609),
            new google.maps.LatLng(48.876368, 2.404175),
            new google.maps.LatLng(48.839946, 2.239106),
            new google.maps.LatLng(48.732097, 2.287325),
            new google.maps.LatLng(48.853924, 2.764069),
            new google.maps.LatLng(48.889985, 2.36145),
            new google.maps.LatLng(48.877575, 2.326371),
            new google.maps.LatLng(45.754106, 4.847132),
            new google.maps.LatLng(48.71151, 2.2442821),
            new google.maps.LatLng(48.780578, 3.305015),
            new google.maps.LatLng(48.863931, 2.345555),
            new google.maps.LatLng(48.855357, 2.388273),
            new google.maps.LatLng(48.824945, 2.319935),
            new google.maps.LatLng(48.795804, 2.135882),
            new google.maps.LatLng(48.873899, 2.581203),
            new google.maps.LatLng(49.159863, 1.853382),
            new google.maps.LatLng(48.850618, 2.2739301),
            new google.maps.LatLng(48.845209, 2.404475),
            new google.maps.LatLng(48.575537, 2.192082),
            new google.maps.LatLng(48.823231, 2.493985),
            new google.maps.LatLng(50.630871, 3.058294),
            new google.maps.LatLng(48.88636473, 2.382308812),
            new google.maps.LatLng(48.776959, 2.257383),
            new google.maps.LatLng(48.90275721, 2.273915391),
            new google.maps.LatLng(48.9265377, 2.2533642),
            new google.maps.LatLng(48.85187, 2.401666),
            new google.maps.LatLng(48.267834, 2.69122),
            new google.maps.LatLng(48.829041, 2.353662),
            new google.maps.LatLng(48.800103, 2.184911),
            new google.maps.LatLng(48.4394083, 2.7547413),
            new google.maps.LatLng(48.09572, 2.773994),
            new google.maps.LatLng(48.8830836, 2.3938516),
            new google.maps.LatLng(48.8839528, 2.3801038),
            new google.maps.LatLng(48.8510857, 2.3310343),
            new google.maps.LatLng(48.829486, 2.333669),
            new google.maps.LatLng(48.838701, 2.495397),
            new google.maps.LatLng(48.899868, 2.123536),
            new google.maps.LatLng(49.163943, 2.294827),
            new google.maps.LatLng(48.865335, 2.510005),
            new google.maps.LatLng(48.861169, 2.279677),
            new google.maps.LatLng(48.8562471, 2.3831971),
            new google.maps.LatLng(48.8611188, 2.3741351),
            new google.maps.LatLng(48.8817944, 2.3280212),
            new google.maps.LatLng(48.9155841, 2.2829252),
            new google.maps.LatLng(48.840787, 2.341051),
            new google.maps.LatLng(48.8944472, 2.2928756),
            new google.maps.LatLng(48.7983402, 2.4810509),
            new google.maps.LatLng(48.8533943, 2.2757498),
            new google.maps.LatLng(48.823565, 2.209045),
            new google.maps.LatLng(48.857831, 2.350641),
            new google.maps.LatLng(48.8974227, 2.1940596),
            new google.maps.LatLng(48.8990657, 2.2939167),
            new google.maps.LatLng(48.73323, 2.2218056),
            new google.maps.LatLng(48.8137894, 2.3168695),
            new google.maps.LatLng(48.864432, 2.2101799),
            new google.maps.LatLng(48.8634265, 2.2116183),
            new google.maps.LatLng(48.927934, 2.043403),
            new google.maps.LatLng(48.8850475, 2.3211294),
            new google.maps.LatLng(48.869477, 2.35583),
            new google.maps.LatLng(48.171822, 2.255511),
            new google.maps.LatLng(48.880536, 2.237558),
            new google.maps.LatLng(48.866084, 2.33698),
            new google.maps.LatLng(48.8287893, 2.3655909),
            new google.maps.LatLng(48.9338818, 2.3288319),
            new google.maps.LatLng(48.8023142, 2.2633556),
            new google.maps.LatLng(48.6399094, 2.3498129),
            new google.maps.LatLng(49.1377824, 3.0778396),
            new google.maps.LatLng(48.8501404, 2.3852611),
            new google.maps.LatLng(49.346965, 2.680853),
            new google.maps.LatLng(48.8508967, 2.348112),
            new google.maps.LatLng(48.8838812, 2.29355),
            new google.maps.LatLng(48.895327, 2.0818378),
            new google.maps.LatLng(48.8416342, 2.3322536),
            new google.maps.LatLng(48.8476233, 2.2145583),
            new google.maps.LatLng(48.8358247, 2.4019136),
            new google.maps.LatLng(48.8509249, 2.2042806),
            new google.maps.LatLng(48.8309588, 2.3280287),
            new google.maps.LatLng(48.8203074, 2.4788373),
            new google.maps.LatLng(48.8489122, 2.2914352),
            new google.maps.LatLng(48.8740812, 2.3846462),
            new google.maps.LatLng(48.8234884, 2.2717349),
            new google.maps.LatLng(48.7285368, 2.3590116),
            new google.maps.LatLng(48.8400527, 2.2391036),
            new google.maps.LatLng(48.6521587, 2.3154041),
            new google.maps.LatLng(48.92711095, 2.37860272),
            new google.maps.LatLng(49.0715643, 2.1786731),
            new google.maps.LatLng(48.8276474, 2.3293026),
            new google.maps.LatLng(48.8120459, 2.5098424),
            new google.maps.LatLng(47.8063726, 3.6369024),
            new google.maps.LatLng(48.86508887, 2.3728032),
            new google.maps.LatLng(48.848982, 2.339882),
            new google.maps.LatLng(49.16778, 3.265367),
            new google.maps.LatLng(49.206122, 2.565945),
            new google.maps.LatLng(48.79669296, 2.485796034),
            new google.maps.LatLng(48.71527352, 2.236727744),
            new google.maps.LatLng(47.992838, 3.616993),
            new google.maps.LatLng(48.80575484, 3.077394589),
            new google.maps.LatLng(48.77683267, 1.989123735),
            new google.maps.LatLng(49.2207873, 2.1305365),
            new google.maps.LatLng(48.9998885, 2.3603186),
            new google.maps.LatLng(48.8309, 2.312828),
            new google.maps.LatLng(48.832348, 2.335529761),
            new google.maps.LatLng(48.86858886, 2.368912932),
            new google.maps.LatLng(48.88513464, 2.359414033),
            new google.maps.LatLng(48.83458731, 2.318653862),
            new google.maps.LatLng(48.89005484, 2.326477243),
            new google.maps.LatLng(48.860757, 2.353381),
            new google.maps.LatLng(48.88218294, 2.321395038),
            new google.maps.LatLng(48.86885819, 2.343294159),
            new google.maps.LatLng(48.87106875, 2.359980233),
            new google.maps.LatLng(48.7897854, 2.3130631),
            new google.maps.LatLng(48.849832, 2.323296),
            new google.maps.LatLng(48.8043294, 1.7787926),
            new google.maps.LatLng(48.295496, 2.401888),
            new google.maps.LatLng(48.9975505, 1.8806795),
            new google.maps.LatLng(47.9626861, 3.5151149),
            new google.maps.LatLng(48.895278, 2.346369),
            new google.maps.LatLng(48.613477, 2.375874),
            new google.maps.LatLng(48.970809, 2.32093),
            new google.maps.LatLng(48.846278, 2.343139),
            new google.maps.LatLng(48.852423, 2.354475),
            new google.maps.LatLng(48.882291, 2.277293),
            new google.maps.LatLng(48.838816, 2.300483),
            new google.maps.LatLng(48.848081, 2.272822),
            new google.maps.LatLng(48.822054, 2.206872),
            new google.maps.LatLng(48.841481, 2.238965),
            new google.maps.LatLng(48.877455, 2.179046),
            new google.maps.LatLng(48.856451, 2.373581),
            new google.maps.LatLng(48.881253, 2.336299),
            new google.maps.LatLng(48.890973, 2.290012),
            new google.maps.LatLng(48.827607, 2.00085),
            new google.maps.LatLng(48.883529, 2.342135),
            new google.maps.LatLng(48.88504, 2.334353),
            new google.maps.LatLng(48.795719, 2.155035),
            new google.maps.LatLng(48.858191, 2.328397),
            new google.maps.LatLng(48.843518, 2.338329),
            new google.maps.LatLng(48.7287839, 2.4472834),
            new google.maps.LatLng(48.7286353, 2.4477975),
            new google.maps.LatLng(48.880869, 2.484634),
            new google.maps.LatLng(48.696335, 2.606779),
            new google.maps.LatLng(49.043384, 3.383081),
            new google.maps.LatLng(48.9104207, 2.5089398),
            new google.maps.LatLng(49.057797, 2.089092),
            new google.maps.LatLng(48.678173, 2.357175),
            new google.maps.LatLng(49.259624, 2.165566),
            new google.maps.LatLng(48.19799, 3.282217),
            new google.maps.LatLng(48.736913, 2.553779),
            new google.maps.LatLng(48.858889, 2.383375)
        ];
    };
    MapsComponent.prototype.toggleHeatmap = function () {
        this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
    };
    MapsComponent.prototype.toggleWarehouseMap = function () {
        this.warehouseMap.setMap(this.warehouseMap.getMap() ? null : this.map);
    };
    MapsComponent.prototype.getWarehouse = function () {
        return [
            new google.maps.LatLng(48.93186360000001, 2.41341639999996),
            new google.maps.LatLng(48.5928255, 2.280147599999964),
            new google.maps.LatLng(49.0643459, 2.323409999999967),
            new google.maps.LatLng(48.699547, 2.623426),
        ];
    };
    MapsComponent.prototype.ngOnInit = function () {
        var _this = this;
        //set google maps defaults
        this.zoom = 6;
        this.latitude = 46.52863469527167;
        this.longitude = 2.43896484375;
        //create search FormControl
        this.searchControl = new forms_1.FormControl();
        var myLatlng = new google.maps.LatLng(this.latitude, this.longitude);
        var mapOptions = {
            zoom: this.zoom,
            scaleControl: true,
            center: myLatlng,
            scrollwheel: true,
            styles: [{ "featureType": "water", "stylers": [{ "saturation": 43 }, { "lightness": -11 }, { "hue": "#0088ff" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "hue": "#ff0000" }, { "saturation": -100 }, { "lightness": 99 }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#808080" }, { "lightness": 54 }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ece2d9" }] }, { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#ccdca1" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#767676" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#b8cb93" }] }, { "featureType": "poi.park", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.sports_complex", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.medical", "stylers": [{ "visibility": "on" }] }, { "featureType": "poi.business", "stylers": [{ "visibility": "simplified" }] }]
        };
        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        this.heatmap = new google.maps.visualization.HeatmapLayer({
            data: this.getStores(),
            map: this.map
        });
        this.warehouseMap = new google.maps.visualization.HeatmapLayer({
            data: this.getWarehouse(),
            map: this.map,
            gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ]
        });
        var infoWindow = new google.maps.InfoWindow();
        // Event that closes the InfoWindow with a click on the map
        google.maps.event.addListener(this.map, 'click', function () {
            infoWindow.close();
        });
        this.getDataObjenious(this.map, infoWindow);
        //To add autocomplete to the search box
        var input = (document.getElementById('adress'));
        google.maps.event.addDomListener(input, 'keydown', function (e) {
            if (e.keyCode == 13) {
                console.log('hello');
            }
        });
        var search_options = {
            types: ['(cities)'],
            componentRestrictions: { country: 'fr' }
        };
        var autocomplete = new google.maps.places.Autocomplete(input, search_options);
        autocomplete.addListener("place_changed", function () {
            _this.ngZone.run(function () {
                //get the place result
                var place = autocomplete.getPlace();
                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                    return;
                }
                if (place.geometry.viewport) {
                    _this.map.fitBounds(place.geometry.viewport);
                }
                else {
                    //set latitude, longitude and zoom
                    _this.latitude = place.geometry.location.lat();
                    _this.longitude = place.geometry.location.lng();
                    _this.zoom = 12;
                    _this.map.setCenter(place.geometry.location);
                }
            });
        });
    };
    __decorate([
        core_1.ViewChild("adress"), 
        __metadata('design:type', core_1.ElementRef)
    ], MapsComponent.prototype, "searchElementRef", void 0);
    MapsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'maps-cmp',
            templateUrl: 'maps.component.html',
            styles: ["\n    .mappy {\n      margin-top:90px; \n      margin-left: 35px;\n    }"],
            providers: [core_2.MapsAPILoader, sensors_service_1.SensorsService],
            import: [
                core_2.AgmCoreModule.forRoot({
                    libraries: ["places"]
                })
            ]
        }), 
        __metadata('design:paramtypes', [core_2.MapsAPILoader, core_1.NgZone, sensors_service_1.SensorsService])
    ], MapsComponent);
    return MapsComponent;
}());
exports.MapsComponent = MapsComponent;
//# sourceMappingURL=sauvegarde.js.map