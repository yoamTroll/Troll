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
var serviceAlerts_1 = require('./serviceAlerts');
var NotificationsComponent = (function () {
    function NotificationsComponent(service) {
        this.service = service;
    }
    NotificationsComponent.prototype.convertDateUtc = function (phenix_date, hour) {
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
    NotificationsComponent.prototype.convertArrayIntoObject = function (array) {
        var obj = array.reduce(function (acc, cur, i) {
            acc[i] = cur;
            return acc;
        }, {});
        return obj;
    };
    NotificationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.getAlerts().map(function (res) { return res.json(); }).subscribe(function (data) {
            var alerts = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var alert_1 = data_1[_i];
                var obj = _this.convertArrayIntoObject(alert_1);
                obj[1] = _this.convertDateUtc(obj[1], true);
                alerts.push(obj);
            }
            _this.alerts = alerts;
        });
    };
    NotificationsComponent.prototype.clicked = function (value) {
        console.log(value);
    };
    NotificationsComponent = __decorate([
        core_1.Component({
            selector: 'notifications-cmp',
            moduleId: module.id,
            templateUrl: 'notifications.component.html',
            providers: [serviceAlerts_1.serviceAlerts]
        }), 
        __metadata('design:paramtypes', [serviceAlerts_1.serviceAlerts])
    ], NotificationsComponent);
    return NotificationsComponent;
}());
exports.NotificationsComponent = NotificationsComponent;
//# sourceMappingURL=notifications.component.js.map