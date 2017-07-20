import { Injectable } from '@angular/core';

import { Sensor } from './sensor';
import { SENSORS } from './sensors';
import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import { Device } from './device';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SensorsService {
	//private _url:string = "http://localhost:8080/objenious/devices/all?format=jsonp&jsonp=JSONP_CALLBACK";
	//private _url:string = "http://ip.jsontest.com?callback=JSONP_CALLBACK";
	//private _url:string  = "https://api.objenious.com/v1/devices?jsonp=JSONP_CALLBACK";
	private _url:string = "http://localhost:8080/objenious/devices/all?format=jsonp&jsonp=JSONP_CALLBACK";
	public devices:Device[];

	constructor(private _http: Http, private _jsonp: Jsonp){ }

	getSensors(): Promise<Sensor[]> {
		return Promise.resolve(SENSORS);
	}

	getPhenix() {
        const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
		headers.append('Access-Control-Allow-Methods', 'GET');
        //headers.append('Authorization', 'http://yoam_hazot:Ordinateur21@10.49.64.5:8080');
        headers.append('auth-token','7c1adefb-972b-4c5d-b9d0-f9ae4f2f8a4b');
        headers.append('accept','application/json');
		return this._jsonp.get("https://phenix-api-pilot.fr.carrefour.com/deliveries/v1.0/shipping_containers/332701977477461655?format=jsonp&jsonp=JSONP_CALLBACK", {headers: headers}).map(res => res.json()).subscribe(res => console.log("attention résultat"+res), 
			error => console.log("Erreur "+error));
	}


	/**getDataObjenious(){
		return this._jsonp.request(this._url).subscribe(
			(data) => {
				this.devices = data._body;
				//console.log(this.devices[0]);
			}, 
			error => console.log(error));
		//subscribe(res => {console.log(res)});
	}**/

	getDataObjenious(){
		return this._jsonp.request(this._url);
	}

	/***getDataObjeniousByIds(){
		let liste: number[] = [23362423066984452,23362423066984455,23362423066984638];
		let ids  = liste.toString(); // listIds
		let url = "http://localhost:8080/objenious/devices/states/"+ids+"?format=jsonp&jsonp=JSONP_CALLBACK";
		console.log(url);
		return this._jsonp.request(url).subscribe(res => console.log(res));
	}**/

	requestUrl(url) {
		return this._jsonp.request(url);
	}

	access(url){
	    return this._jsonp.get(url);		
	}

}