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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var servicePhenix = (function () {
    function servicePhenix(_http, _jsonp) {
        this._http = _http;
        this._jsonp = _jsonp;
    }
    servicePhenix.prototype.getPhenixData = function (value) {
        var url = "http://localhost:8080/phenix/exposition/" + value + "?format=jsonp&jsonp=JSONP_CALLBACK";
        return this._jsonp.get(url);
    };
    servicePhenix.prototype.getPhenixDataByStore = function (value) {
        var url = "http://localhost:8080/phenix/exposition/db/store/" + value + "?format=jsonp&jsonp=JSONP_CALLBACK";
        return this._jsonp.get(url);
    };
    servicePhenix.prototype.getPhenixDataByTour = function (value) {
        var url = "http://localhost:8080/phenix/exposition/db/tour/" + value + "?format=jsonp&jsonp=JSONP_CALLBACK";
        return this._jsonp.get(url);
    };
    servicePhenix = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_1.Jsonp])
    ], servicePhenix);
    return servicePhenix;
}());
exports.servicePhenix = servicePhenix;
//# sourceMappingURL=service_phenix.js.map