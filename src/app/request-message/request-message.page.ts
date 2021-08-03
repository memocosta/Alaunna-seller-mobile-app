import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OrderService } from '../shared/services/order.service';
import { ProductService } from '../shared/services/product.service';
import { SharedClass } from '../shared/Shared';
import { SMS } from '@ionic-native/sms/ngx';

@Component({
  selector: 'app-request-message',
  templateUrl: './request-message.page.html',
  styleUrls: ['./request-message.page.scss'],
})
export class RequestMessagePage implements OnInit {
  MarketData = {} as any;
  OfferData = {} as any;
  ImgeBase = SharedClass.BASE_IMAGE_URL;
  total_sum = 0;
  msg2 = " تواصل معنا فى حال احتجت لمساعدة ";
  last_id;
  url = "https://alaunna.com/market_cart/";
  constructor(
    private orderController: OrderService,
    private router: Router,
    private helperTools: HelperToolsService,
    private AuthControlelr: AuthService,
    private productController: ProductService,
    private sms: SMS
  ) { }

  ngOnInit() {
    this.last_column();
    console.log(this.orderController.OfferData);
    this.OfferData = this.orderController.OfferData;
    console.log(this.OfferData.products_data);
    if (!this.OfferData) {
      this.router.navigateByUrl('my-orders');
    }
    this.MarketData = this.AuthControlelr.MarketsData[0];
    for (let i = 0; i < this.OfferData.products_data.length; i++) {
      let product = this.OfferData.products_data[i];
      if (product.offer) {
        this.total_sum = this.total_sum + (product['market'][0]['Market_Products']['Selling_price'] - (product['market'][0]['Market_Products']['Selling_price'] * product.offer.value / 100));

      } else {
        this.total_sum = this.total_sum + product['market'][0]['Market_Products']['Selling_price'];

      }
    }

  }
  last_column() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {

      this.productController.last_id_MarketCart().subscribe(data => {
        console.log(data);
        if (data['status'] == 'success') {
          this.last_id = parseInt(data['data'].id) + 1
          this.helperTools.DismissLoading();

        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    });

  }
  whatsapp() {
    let msg1 = " شكرا لطلبك من " + this.MarketData.name + " تم تجهيز سلة شراء خاصة بك. لنقوم بتجهيز طلبك نرجو منك إتمام الخطوات في الرابط التالي: ";
    if(this.OfferData.client.phone.charAt(0)!="+"){
        window.location.href = "https://api.whatsapp.com/send?phone=+20" + this.OfferData.client.phone + "&text=" + msg1 + this.url + this.last_id + this.msg2
    }
    else{
          window.location.href = "https://api.whatsapp.com/send?phone=" + this.OfferData.client.phone + "&text=" + msg1 + this.url + this.last_id + this.msg2
    }
  }
  sendSms() {
    let msg1 = " شكرا لطلبك من " + this.MarketData.name + " تم تجهيز سلة شراء خاصة بك. لنقوم بتجهيز طلبك نرجو منك إتمام الخطوات في الرابط التالي: ";

    //CONFIGURATION
    var options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // send SMS with the native android SMS messaging
        //intent: '' // send SMS without opening any other app
      }
    };
    this.sms.send('+2' + this.OfferData.client.phone, msg1 + this.url + this.last_id + this.msg2, options);
  }
  orderDone() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.OfferData.market_id = this.MarketData.id;
      this.productController.createMarketCartproducts(this.OfferData).subscribe(data => {
        if (data['status'] == 'success') {
          this.helperTools.DismissLoading();
          this.helperTools.ShowAlertWithOkButton('تم', 'تم الاضافة للسلة بنجاح');
          // this.navCtrl.pop();
          this.router.navigateByUrl('myorders');
        } else {
          console.log(data);
          if (data['error']['action'] == 'no-products') {
            this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بأختيار منتج واحد علي الأقل لاضافه العرض بنجاح');
          } else {
            this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لاضافه العرض بنجاح');
          }

        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }
  back() {
    this.orderController.back = "users-clients";
    this.router.navigate(['/myorders']);
  }
}
