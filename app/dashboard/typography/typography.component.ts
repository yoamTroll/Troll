import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from 'angular2-google-maps/core';
import { BrowserModule } from "@angular/platform-browser";

import { serviceTrajets } from './serviceTrajets';
import { WHS } from './warehouses';



declare var google, MarkerClusterer: any;

@Component({
    selector: 'typography-cmp',
    moduleId: module.id,
    templateUrl: 'typography.component.html',
    providers: [serviceTrajets],
    styles: [`
    .mappy {
      margin-top:90px; 
      margin-left: 35px;
    }`],

})

export class TypographyComponent implements OnInit{

	public trajet: any;
	private map: any;
	public markers:any;
	public markerCluster:any;


    constructor(
      private service: serviceTrajets
    ) {}


	setMapOnAll(map) {
		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(map);
		}
	}

	onEnterDate(date){
		if (!date){
			//do nothing

		}else{
			console.log(date);
		}
	}
	
	onEnterSscc(value){
		if (!value){
			//reinitialize phenix_data
			this.trajet=null;

		}
		else{
			//remove all previous markers
			if (typeof this.markers != 'undefined'){
				this.setMapOnAll(null);
			}
			var image_location = '../../assets/img/dot-inside-a-circle.png';
			var image_whs = '../../assets/img/factory-stock-house.png';
		    var im = 'http://www.robotwoods.com/dev/misc/bluecircle.png';
		    this.markers=[];
	      	// Each marker is labeled with a single alphabetical character.
      		var labels = '123456789';
      		var labelIndex = 0;
			this.service.getItinerary(value).map((res) => res.json()).subscribe(data =>{
		    	this.trajet = data;
		    	var flightPlanCoordinates = [];
		    	for (var i=0; i < this.trajet.length ; i++){
		    		flightPlanCoordinates.push({lat: parseFloat(this.trajet[i][8]), lng: parseFloat(this.trajet[i][9])});
					// Add a new marker at the new plotted point on the polyline.
	        		var marker = new google.maps.Marker({
	          			position: {lat: parseFloat(this.trajet[i][8]), lng: parseFloat(this.trajet[i][9])},
						label: i.toString(),
	          			title: 'ID:' + this.trajet[i][0] +"\n"+
	          			this.convertDateUtc(this.trajet[i][1], true),
	          			map: this.map,
	          			icon: image_location
	    			});
	    			this.markers.push(marker);
		    	}
    	        /*this.markerCluster = new MarkerClusterer(this.map, this.markers,
          			{maxZoom:9, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});*/

		    	//add the warehouse
		    	/*var lat_whs = parseFloat(this.getWarehouseByEan(this.trajet[0][3])[0].latitude);
		    	var lng_whs = parseFloat(this.getWarehouseByEan(this.trajet[0][3])[0].longitude); 
		    	flightPlanCoordinates.push({lat: lat_whs,lng: lng_whs });
		    	this.addMarker(lat_whs, lng_whs, this.getWarehouseByEan(this.trajet[0][3])[0].name, image_whs);*/

				/*var flightPlanCoordinates = [
					{lat: parseFloat(this.trajet[8]), lng: parseFloat(this.trajet[9])},
			        {lat: 21.291, lng: -157.821}

				];*/
				

				console.log(flightPlanCoordinates);
				var flightPath = new google.maps.Polyline({
					path: flightPlanCoordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});

				flightPath.setMap(this.map);
		        this.map.setCenter({lat: parseFloat(this.trajet[0][8]), lng: parseFloat(this.trajet[0][9])});
        		this.map.setZoom(12);
			});  
		}
	}

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

	addMarker(latitude, longitude, name, icon){
		var marker = new google.maps.Marker({
			position: {lat: latitude, lng: longitude},
			title: 'ID:' + name,
			map: this.map,
			icon: icon
		});

	}

	getWarehouseByEan(ean){
		return WHS.filter(whs => { return whs.ean.toString().indexOf(ean) >-1;});
	}

    ngOnInit() {
      //set google maps defaults
      var zoom = 3;
      var latitude = 0;
      var longitude = -180;
      //this.markers = [];

      var myLatlng = new google.maps.LatLng(latitude, longitude);
      var mapOptions = {
        zoom: zoom,
        center: myLatlng,
        scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        styles: [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}]
      }

      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    }
}
  