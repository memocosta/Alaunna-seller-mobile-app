import { Injectable } from '@angular/core';

import { SharedClass } from '../Shared';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  OfferData = {} as any;
  back = {} as any;

  constructor(private http: HttpClient,
    public loadingController: LoadingController
  ) { }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  public static orderdetails;
  public static coupondetails;
  getMarketOrders(market_id, offset) {
    let URL = `${SharedClass.BASE_URL}/orderindexForApp`;
    return this.http.post(URL, { market_id: market_id, offset: offset })
  }
  getMarket_Orders(market_id, offset) {
    let URL = `${SharedClass.BASE_URL}/market/cart`;
    return this.http.post(URL, { market_id: market_id, offset: offset })
  }
  getOrderById(market_id, order_id) {
    let URL = `${SharedClass.BASE_URL}/order/${order_id}`;
    return this.http.post(URL, { market_id: market_id })
  }
  coupondetails(id) {
    let URL = `${SharedClass.BASE_URL}/coupon/single`;
    return this.http.post(URL, { id: id })
  }
  getOrder2ById(market_cart_id) {
    let URL = `${SharedClass.BASE_URL}/market/cart/${market_cart_id}`;
    return this.http.get(URL)
  }
  getUnreadOrders(market_id, offset) {
    let URL = `${SharedClass.BASE_URL}/order/unread`;
    return this.http.post(URL, { market_id: market_id, offset: offset })
  }
  changeReadOrders(market_id, offset) {
    let URL = `${SharedClass.BASE_URL}/order/notification`;
    return this.http.post(URL, { market_id: market_id, offset: offset })
  }
  changeOrderStatus(order_d, status) {
    let URL = `${SharedClass.BASE_URL}/order/status`;
    return this.http.post(URL, { order_id: order_d, status: status });
  }
  changeProductInOrderStatus(producId, orderId, status) {
    const URL = `${SharedClass.BASE_URL}/order/product/status`;
    return this.http.post(URL, { OrderId: orderId, ProductId: producId, status: status });
  }
  changeStatusByMarket(orderId, market_id, status, fast, total_price, canceld_reason) {
    const URL = `${SharedClass.BASE_URL}/order/statusByMarket`;
    return this.http.post(URL, { OrderId: orderId, market_id: market_id, status: status, fast: fast, total_price: total_price, canceld_reason: canceld_reason });
  }
  RemoveOrder(order_id) {
    const URL = `${SharedClass.BASE_URL}/order/remove`;
    return this.http.post(URL, { id: order_id });
  }
  changeReadOrdersNotifications(user_id) {
    const URL = `${SharedClass.BASE_URL}/order/changeReadOrdersNotifications`;
    return this.http.post(URL, { user_id: user_id });
  }
  userOrders(market_id) {
    const URL = `${SharedClass.BASE_URL}/userOrder`;
    return this.http.post(URL, { market_id: market_id });
  }
  singleUserOrder(market_id, user_id) {
    console.log(market_id, user_id, 'maaaaaaaaa');

    const URL = `${SharedClass.BASE_URL}/singleUserOrder`;
    return this.http.post(URL, { market_id: market_id, user_id: user_id });
  }
}
