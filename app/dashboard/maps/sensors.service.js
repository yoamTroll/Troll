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
var sensors_1 = require('./sensors');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
require('rxjs/add/operator/toPromise');
var SensorsService = (function () {
    function SensorsService(_http, _jsonp) {
        this._http = _http;
        this._jsonp = _jsonp;
        //private _url:string = "http://localhost:8080/objenious/devices/all?format=jsonp&jsonp=JSONP_CALLBACK";
        //private _url:string = "http://ip.jsontest.com?callback=JSONP_CALLBACK";
        //private _url:string  = "https://api.objenious.com/v1/devices?jsonp=JSONP_CALLBACK";
        this._url = "http://localhost:8080/objenious/devices/all?format=jsonp&jsonp=JSONP_CALLBACK";
    }
    SensorsService.prototype.getSensors = function () {
        return Promise.resolve(sensors_1.SENSORS);
    };
    SensorsService.prototype.getPhenix = function () {
        var headers = new http_1.Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        //headers.append('Authorization', 'http://yoam_hazot:Ordinateur21@10.49.64.5:8080');
        headers.append('auth-token', '7c1adefb-972b-4c5d-b9d0-f9ae4f2f8a4b');
        headers.append('accept', 'application/json');
        return this._jsonp.get("https://phenix-api-pilot.fr.carrefour.com/deliveries/v1.0/shipping_containers/332701977477461655?format=jsonp&jsonp=JSONP_CALLBACK", { headers: headers }).map(function (res) { return res.json(); }).subscribe(function (res) { return console.log("attention résultat" + res); }, function (error) { return console.log("Erreur " + error); });
    };
    /**getDataObjenious(){
        return this._jsonp.request(this._url).subscribe(
            (data) => {
                this.devices = data._body;
                //console.log(this.devices[0]);
            },
            error => console.log(error));
        //subscribe(res => {console.log(res)});
    }**/
    SensorsService.prototype.getDataObjenious = function () {
        return this._jsonp.request(this._url);
    };
    /***getDataObjeniousByIds(){
        let liste: number[] = [23362423066984452,23362423066984455,23362423066984638];
        let ids  = liste.toString(); // listIds
        let url = "http://localhost:8080/objenious/devices/states/"+ids+"?format=jsonp&jsonp=JSONP_CALLBACK";
        console.log(url);
        return this._jsonp.request(url).subscribe(res => console.log(res));
    }**/
    SensorsService.prototype.requestUrl = function (url) {
        return this._jsonp.request(url);
    };
    SensorsService.prototype.access = function (url) {
        return this._jsonp.get(url);
    };
    SensorsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_1.Jsonp])
    ], SensorsService);
    return SensorsService;
}());
exports.SensorsService = SensorsService;
//# sourceMappingURL=sensors.service.js.map