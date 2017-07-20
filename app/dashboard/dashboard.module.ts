import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapsComponent } from './maps/maps.component';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule, GoogleMapsAPIWrapper, MapsAPILoader } from 'angular2-google-maps/core';
import { HttpModule, JsonpModule } from '@angular/http';

import { MODULE_COMPONENTS, MODULE_ROUTES } from './dashboard.routes';
import { IdFilter, StoreFilter, TourFilter } from './maps/IdFilter';
import {Ng2PaginationModule} from 'ng2-pagination';
import { Filters } from './notifications/filterAlerts';
import { InventaireStoreFilter, InventaireWhsFilter } from './home/filters';


@NgModule({
    imports: [
        JsonpModule,
    	BrowserModule, 							//to use directives in angular 2
    	HttpModule,
        Ng2PaginationModule,
        RouterModule.forChild(MODULE_ROUTES),
      	AgmCoreModule.forRoot({
	    	libraries: ["places"]
	  	})
    ],
    declarations: [ MODULE_COMPONENTS, MapsComponent, IdFilter, StoreFilter, TourFilter, Filters, InventaireStoreFilter, InventaireWhsFilter],
    providers: [GoogleMapsAPIWrapper]
})

export class DashboardModule{}
