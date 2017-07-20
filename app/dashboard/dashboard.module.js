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
var router_1 = require('@angular/router');
var maps_component_1 = require('./maps/maps.component');
var platform_browser_1 = require('@angular/platform-browser');
var core_2 = require('angular2-google-maps/core');
var http_1 = require('@angular/http');
var dashboard_routes_1 = require('./dashboard.routes');
var IdFilter_1 = require('./maps/IdFilter');
var ng2_pagination_1 = require('ng2-pagination');
var filterAlerts_1 = require('./notifications/filterAlerts');
var filters_1 = require('./home/filters');
var DashboardModule = (function () {
    function DashboardModule() {
    }
    DashboardModule = __decorate([
        core_1.NgModule({
            imports: [
                http_1.JsonpModule,
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                ng2_pagination_1.Ng2PaginationModule,
                router_1.RouterModule.forChild(dashboard_routes_1.MODULE_ROUTES),
                core_2.AgmCoreModule.forRoot({
                    libraries: ["places"]
                })
            ],
            declarations: [dashboard_routes_1.MODULE_COMPONENTS, maps_component_1.MapsComponent, IdFilter_1.IdFilter, IdFilter_1.StoreFilter, IdFilter_1.TourFilter, filterAlerts_1.Filters, filters_1.InventaireStoreFilter, filters_1.InventaireWhsFilter],
            providers: [core_2.GoogleMapsAPIWrapper]
        }), 
        __metadata('design:paramtypes', [])
    ], DashboardModule);
    return DashboardModule;
}());
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map