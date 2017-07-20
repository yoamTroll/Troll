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
var IdFilter = (function () {
    function IdFilter() {
    }
    /**
    * filter the results on SSCC
    * @param value : list of devices
    * @param args : string written to search for
    * @returns any
    */
    IdFilter.prototype.transform = function (value, args) {
        if (!value || !args) {
            //display all results by default
            return value;
        }
        if (args) {
            // when someone types something
            var filter_1 = args.toLocaleLowerCase();
            return value.filter(function (device) { return device.id.toLocaleLowerCase().indexOf(filter_1) > -1; });
        }
    };
    IdFilter = __decorate([
        core_1.Pipe({
            name: 'myfilter',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], IdFilter);
    return IdFilter;
}());
exports.IdFilter = IdFilter;
//# sourceMappingURL=Filters.js.map