import { Injectable } from '@angular/core';

import { SharedClass } from '../Shared';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PriceRequestService {

  constructor(private http: HttpClient) { }
  index(offset, market_id, user_id, category_id, country_id) {
    let URL = `${SharedClass.BASE_URL}/offer/price`;
    return this.http.get(URL, {
      params: { offset, market_id, user_id, category_id, country_id }
    });
  }
  getOfferPriceId(id){
    let URL = `${SharedClass.BASE_URL}/offer/price/${id}`;
    return this.http.get(URL);
  }
  getOfferReplies(offer_price_id){
    let URL = `${SharedClass.BASE_URL}/offer/price/replay`;
    return this.http.get(URL, {
      params: { offer_price_id }
    });
  }
  addreplay(replayData) {
    let URL = `${SharedClass.BASE_URL}/offer/price/replay/create`;
    return this.http.post(URL, replayData);
  }
  changeSellerReadofferPrices(user_id) {
    const URL = `${SharedClass.BASE_URL}/offer/price/changeSellerReadofferPrices`;
    return this.http.post(URL, { user_id: user_id });
  }

}
