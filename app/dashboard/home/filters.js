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
/**
* filter for SSCC
*/
var InventaireStoreFilter = (function () {
    function InventaireStoreFilter() {
    }
    /**
    * filter the results on SSCC
    * @param value : list of devices
    * @param args : string written to search for
    * @returns any
    */
    InventaireStoreFilter.prototype.transform = function (value, args) {
        if (!value || !args) {
            //display all results by default
            return value;
        }
        if (args) {
            // when someone types something
            var filter_1 = args.toString().toLocaleLowerCase();
            return value.filter(function (store) { return store[0].toString().toLocaleLowerCase().indexOf(filter_1) > -1; });
        }
    };
    InventaireStoreFilter = __decorate([
        core_1.Pipe({
            name: 'storeFilter',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], InventaireStoreFilter);
    return InventaireStoreFilter;
}());
exports.InventaireStoreFilter = InventaireStoreFilter;
var InventaireWhsFilter = (function () {
    function InventaireWhsFilter() {
    }
    /**
    * filter the results on SSCC
    * @param value : list of devices
    * @param args : string written to search for
    * @returns any
    */
    InventaireWhsFilter.prototype.transform = function (value, args) {
        if (!value || !args) {
            //display all results by default
            return value;
        }
        if (args) {
            // when someone types something
            var filter_2 = args.toString().toLocaleLowerCase();
            return value.filter(function (whs) { return whs[0].toString().toLocaleLowerCase().indexOf(filter_2) > -1; });
        }
    };
    InventaireWhsFilter = __decorate([
        core_1.Pipe({
            name: 'whsFilter',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], InventaireWhsFilter);
    return InventaireWhsFilter;
}());
exports.InventaireWhsFilter = InventaireWhsFilter;
//# sourceMappingURL=filters.js.map