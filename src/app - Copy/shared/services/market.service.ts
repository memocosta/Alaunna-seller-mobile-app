import { Injectable } from '@angular/core';
import { SharedClass } from '../Shared';
import { } from 'selenium-webdriver/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  constructor(private http: HttpClient) { }
  loadAllMarketCategory() {
    let URL = `${SharedClass.BASE_URL}/market/category`;
    return this.http.get(URL);
  }
  createMarket(MarketData) {
    let URL = `${SharedClass.BASE_URL}/market/create`;
    return this.http.post(URL, MarketData);
  }
  editMarket(MarketData){
    let URL = `${SharedClass.BASE_URL}/market/edit`;
    return this.http.post(URL, MarketData);
  }
  getUserMarkets(offset, seller_id) {
    let URL = `${SharedClass.BASE_URL}/market?seller_id=${seller_id}&offset=${offset}`;
    return this.http.get(URL);
  }
  getMarketById(id){
    let URL = `${SharedClass.BASE_URL}/market/${id}`;
    return this.http.get(URL);
  }
  // market banners
  createMarketBanner(BannerData) {
    let URL = `${SharedClass.BASE_URL}/market/banner/create`;
    return this.http.post(URL, BannerData);
  }
  getAllMarketBanners(offset, market_id) {
    let URL = `${SharedClass.BASE_URL}/market/banner`;
    return this.http.get(URL, { params: { offset: offset, market_id: market_id } });
  }
  deleteBanner(banner_id) {
    let URL = `${SharedClass.BASE_URL}/market/banner/remove`;
    return this.http.post(URL, { id: banner_id });
  }
  getMarketBannerById(id){
    let URL =  `${SharedClass.BASE_URL}/market/banner/${id}`;
    return this.http.get(URL);
  }
  EditMarketBanner (BannerData){
    let URL = `${SharedClass.BASE_URL}/market/banner/edit`;
    return this.http.post(URL , BannerData);
  }

}
