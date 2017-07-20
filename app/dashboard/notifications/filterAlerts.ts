import {Pipe, PipeTransform} from '@angular/core';
/**
* filter for SSCC 
*/
@Pipe({
    name: 'alertFilter',
    pure: false
})
export class Filters implements PipeTransform {
	
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
      return value.filter(alert => {return alert[2].toString().toLocaleLowerCase().indexOf(filter) > -1;});
  	}
  }
}