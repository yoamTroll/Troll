export class Device {
	id: string;
	status: string;
	uplink_count: number;
	last_uplink: string;
	downlink_count: number;
	//data: Data;
	lat: number;
	lng: number;
	geolocation_type: string;
	zone: string;

}


export class Phenix {
	whsEan: string;
	delSiteEan: string;
	delSiteDesc: string;
	tourOpCode: string;
	shippingDatetime: string;
	delDatetime: string;
	sscc: string;
}

export class Map {
	sscc: string;
}

export class Store {
	id:string;
	whsEan: string;
	delSiteEan: string;
	delSiteDesc: string;
	tourOpCode: string;
	shippingDatetime: string;
	delDatetime: string;
	sscc: string;
}