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
var serviceInventaire = (function () {
    function serviceInventaire(_http, _jsonp) {
        this._http = _http;
        this._jsonp = _jsonp;
    }
    // Uses http.get() to load a single JSON file
    serviceInventaire.prototype.getImmoStore = function () {
        var url = "http://localhost:8080/inventaire/store?format=jsonp&jsonp=JSONP_CALLBACK";
        return this._jsonp.get(url);
    };
    serviceInventaire.prototype.getImmoWhs = function () {
        var url = "http://localhost:8080/inventaire/whs?format=jsonp&jsonp=JSONP_CALLBACK";
        return this._jsonp.get(url);
    };
    serviceInventaire = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_1.Jsonp])
    ], serviceInventaire);
    return serviceInventaire;
}());
exports.serviceInventaire = serviceInventaire;
//# sourceMappingURL=service_inventaire.js.map