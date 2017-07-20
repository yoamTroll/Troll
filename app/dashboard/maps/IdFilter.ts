import {Pipe, PipeTransform} from '@angular/core';
/**
* filter for SSCC 
*/
@Pipe({
    name: 'myfilter',
    pure: false
})
export class IdFilter implements PipeTransform {
	
	/**
	* filter the results on SSCC 
	* @param value : list of devices
	* @param args : string written to search for
	* @returns any
	*/
  transform(value: any, args: any[]): any {
    if (!value || !args) {
    	//display all results by default
    	return value;
    }
  	if (args) {
  		// when someone types something
    	let filter = args.toString().toLocaleLowerCase();
    	return value.filter(device => {return device.status.toString().toLocaleLowerCase().indexOf(filter) > -1;});
  	}
  }
}

/**
* filter for Store 
*/
@Pipe({
    name: 'storeFilter',
    pure: false
})

export class StoreFilter implements PipeTransform {
	
	/**
	* filter the results on Store 
	* @param value : list of devices
	* @param args : string written to search for
	* @returns any
	*/
  transform(value: any, args: any[]): any {
    if (!value || !args) {
    	//display all results by default
    	return value;
    }
  	if (args) {
  		// when someone types something
    	let filter = args.toString().toLocaleLowerCase();
    	return value.filter(device => {return device.geolocation_type.toString().toLocaleLowerCase().indexOf(filter) > -1;});
  	}
  }
}

/**
* filter for tour 
*/
@Pipe({
    name: 'tourFilter',
    pure: false
})

export class TourFilter implements PipeTransform {
	
	/**
	* filter the results on Store 
	* @param value : list of devices
	* @param args : string written to search for
	* @returns any
	*/
  transform(value: any, args: any[]): any {
    if (!value || !args) {
    	//display all results by default
    	return value;
    }
  	if (args) {
  		// when someone types something
    	let filter = args.toString();
    	return value.filter(device => { return device.uplink_count.toString().indexOf(filter) > -1;});
  	}
  }
}