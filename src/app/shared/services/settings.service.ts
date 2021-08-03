import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedClass } from '../Shared';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(public http: HttpClient) {
    console.log('Hello LocationProvider Provider');
  }
  getAllCountry() {
    let URL = `${SharedClass.BASE_URL}/location/countries`;
    return this.http.get(URL);
  }
  getAllcities() {
    let URL = `${SharedClass.BASE_URL}/location/cities`;
    return this.http.get(URL);
  }
  filtercitiesAccourdingToCountryID(countryID) {
    let URL = `${SharedClass.BASE_URL}/location/filtercities/${countryID}`;
    return this.http.get(URL);
  }
  createShipping(shippingData) {
    let URL = `${SharedClass.BASE_URL}/shipping`;
    return this.http.post(URL, shippingData);
  }
  updateShipping(shippingData) {
    let URL = `${SharedClass.BASE_URL}/shipping/update`;
    return this.http.post(URL, shippingData);
  }
  createAddress(addressData) {
    let URL = `${SharedClass.BASE_URL}/seller/address`;
    return this.http.post(URL, addressData);
  }
  getMYAddres(user_id) {
    let URL = `${SharedClass.BASE_URL}/seller/my_addresses?user_id=${user_id}`;
    return this.http.get(URL);
  }
  getMYShipping() {
    let URL = `${SharedClass.BASE_URL}/shipping`;
    return this.http.get(URL);
  }
  get_shipping(market_id, offset = false) {
    let URL = `${SharedClass.BASE_URL}/shipping?user_id=${market_id}`;
    if (offset) {
      URL = URL + `&offset=${offset}`;
    }
    return this.http.get(URL);
  }
  get_shipping_company(offset = false) {
    let URL = `${SharedClass.BASE_URL}/shipping_company`;
    if (offset) {
      URL = URL + `?offset=${offset}`;
    }
    return this.http.get(URL);
  }
  removeItem(id: any) {
    let URL = `${SharedClass.BASE_URL}/seller/address/remove`;
    return this.http.post(URL, { id: id });
  }
}
