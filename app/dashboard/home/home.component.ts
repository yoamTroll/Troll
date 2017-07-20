import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import initDemo = require('../../../assets/js/charts.js');

import { serviceInventaire } from './service_inventaire';


declare var $:any;

@Component({
    selector: 'home-cmp',
    moduleId: module.id,
    templateUrl: 'home.component.html',
    providers: [serviceInventaire]
})

export class HomeComponent implements OnInit{
    public number_store:number;
    public number_whs:number;

    public info_store:any;
    public info_whs:any;
    public cpt:number;
    public cpt_whs:number;

    constructor(
      private service: serviceInventaire,
    ) {}

    ngOnInit(){
        this.service.getImmoStore().map((res) => res.json()).subscribe(data =>{
            this.info_store = data;
            this.cpt = 0;
            this.info_store.filter(store => {
                var last_uplink = new Date(store[3]);
                var today = new Date();
                var timeDiff = Math.abs(today.getTime() - last_uplink.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (diffDays >3) this.cpt = this.cpt+1;
            });
            this.number_store = data.length;
        });


        this.service.getImmoWhs().map((res) => res.json()).subscribe(data =>{
            this.info_whs = data;
            this.cpt_whs = 0;
            this.info_whs.filter(whs => {
                var last_uplink = new Date(whs[3]);
                var today = new Date();
                var timeDiff = Math.abs(today.getTime() - last_uplink.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (diffDays >3) this.cpt_whs = this.cpt_whs+1;
            });
            this.number_whs = data.length;
        });
        initDemo();
    }
}
