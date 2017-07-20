import { Component } from '@angular/core';

import { Filters } from './filterAlerts';

import { serviceAlerts } from './serviceAlerts';

@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    templateUrl: 'notifications.component.html',
    providers: [serviceAlerts]
})

export class NotificationsComponent implements OnInit{
	public alerts: any;

    constructor(
      private service: serviceAlerts
    ) {}

    convertDateUtc(phenix_date, hour){
        console.log(phenix_date);
        var year = phenix_date.substring(0,4);
        var month = phenix_date.substring(5,7);
        var day = phenix_date.substring(8,10);
        if (hour) {
            var hour = phenix_date.substring(11,13);
            var minute = phenix_date.substring(14,16);
            var sec = phenix_date.substring(17,19);
            return day+"/"+month+"/"+year+" "+hour+":"+minute+":"+sec;
        }else{
            return day+"/"+month+"/"+year;
        }
    }


    convertArrayIntoObject(array){
      var obj = array.reduce(function(acc, cur, i) {
        acc[i] = cur;
        return acc;
      }, {});
      return obj;   
    }

    ngOnInit(){
	    this.service.getAlerts().map((res) => res.json()).subscribe(data =>{
            var alerts = [];
            for(let alert of data) {
                var obj = this.convertArrayIntoObject(alert);
                obj[1] = this.convertDateUtc(obj[1], true);
                alerts.push(obj);
            }
            this.alerts = alerts;
	    });    	
    }

    clicked(value){
    	console.log(value);
    }
}