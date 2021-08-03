import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedClass } from '../Shared';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(public http: HttpClient) {
    console.log('Hello LocationProvider Provider');
  }
  getAllCountry(){
    let URL = `${SharedClass.BASE_URL}/location/countries`;
    return this.http.get(URL);
  }
  getAllcities(){
    let URL = `${SharedClass.BASE_URL}/location/cities`;
    return this.http.get(URL);
  }
  filtercitiesAccourdingToCountryID(countryID){
    let URL = `${SharedClass.BASE_URL}/location/filtercities/${countryID}`;
    return this.http.get(URL);
  }
}
