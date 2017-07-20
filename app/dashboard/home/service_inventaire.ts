import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';



@Injectable()
export class serviceInventaire{

  public info_store:any;

  constructor(private _http: Http, private _jsonp: Jsonp){ }

  // Uses http.get() to load a single JSON file
  getImmoStore() {
    let url = "http://localhost:8080/inventaire/store?format=jsonp&jsonp=JSONP_CALLBACK";
    return this._jsonp.get(url);
  }

  getImmoWhs() {
    let url = "http://localhost:8080/inventaire/whs?format=jsonp&jsonp=JSONP_CALLBACK";
    return this._jsonp.get(url);
  }
}