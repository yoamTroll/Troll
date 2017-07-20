import {Pipe, PipeTransform} from '@angular/core';
/**
* filter for SSCC 
*/
@Pipe({
    name: 'storeFilter',
    pure: false
})
export class InventaireStoreFilter implements PipeTransform {
	
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
    	return value.filter(store => {return store[0].toString().toLocaleLowerCase().indexOf(filter) > -1;});
  	}
  }
}


@Pipe({
    name: 'whsFilter',
    pure: false
})
export class InventaireWhsFilter implements PipeTransform {
  
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
      return value.filter(whs => {return whs[0].toString().toLocaleLowerCase().indexOf(filter) > -1;});
    }
  }
}