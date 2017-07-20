import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';



@Injectable()
export class servicePhenix{

  constructor(private _http: Http, private _jsonp: Jsonp){ }

  getPhenixData(value) {
    let url = "http://localhost:8080/phenix/exposition/"+value+"?format=jsonp&jsonp=JSONP_CALLBACK";
    return this._jsonp.get(url);
  }

  getPhenixDataByStore(value) {
    let url = "http://localhost:8080/phenix/exposition/db/store/"+value+"?format=jsonp&jsonp=JSONP_CALLBACK";
    return this._jsonp.get(url);
  }

  getPhenixDataByTour(value) {
    let url = "http://localhost:8080/phenix/exposition/db/tour/"+value+"?format=jsonp&jsonp=JSONP_CALLBACK";
    return this._jsonp.get(url);
  }
}