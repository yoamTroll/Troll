import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';



@Injectable()
export class serviceAlerts{

  constructor(private _http: Http, private _jsonp: Jsonp){ }

  // Uses http.get() to load a single JSON file
  getAlerts() {
    let url = "http://localhost:8080/alerts/temperature?format=jsonp&jsonp=JSONP_CALLBACK";
    return this._jsonp.get(url);
  }

}