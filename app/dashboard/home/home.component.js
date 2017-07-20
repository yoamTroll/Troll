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
var initDemo = require('../../../assets/js/charts.js');
var service_inventaire_1 = require('./service_inventaire');
var HomeComponent = (function () {
    function HomeComponent(service) {
        this.service = service;
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getImmoStore().map(function (res) { return res.json(); }).subscribe(function (data) {
            _this.info_store = data;
            _this.cpt = 0;
            _this.info_store.filter(function (store) {
                var last_uplink = new Date(store[3]);
                var today = new Date();
                var timeDiff = Math.abs(today.getTime() - last_uplink.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (diffDays > 3)
                    _this.cpt = _this.cpt + 1;
            });
            _this.number_store = data.length;
        });
        this.service.getImmoWhs().map(function (res) { return res.json(); }).subscribe(function (data) {
            _this.info_whs = data;
            _this.cpt_whs = 0;
            _this.info_whs.filter(function (whs) {
                var last_uplink = new Date(whs[3]);
                var today = new Date();
                var timeDiff = Math.abs(today.getTime() - last_uplink.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (diffDays > 3)
                    _this.cpt_whs = _this.cpt_whs + 1;
            });
            _this.number_whs = data.length;
        });
        initDemo();
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home-cmp',
            moduleId: module.id,
            templateUrl: 'home.component.html',
            providers: [service_inventaire_1.serviceInventaire]
        }), 
        __metadata('design:paramtypes', [service_inventaire_1.serviceInventaire])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map