import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { AuthService } from '../shared/services/auth.service';
import { MarketService } from '../shared/services/market.service';
import { ProductService } from '../shared/services/product.service';
import { SharedClass } from '../shared/Shared';
import { NotificationsPage } from '../notifications/notifications.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-my-coupons',
  templateUrl: './my-coupons.page.html',
  styleUrls: ['./my-coupons.page.scss'],
})
export class MyCouponsPage implements OnInit {

  ImageBaseURL = SharedClass.BASE_IMAGE_URL;
  countNotification = 0;
  market_id: any;
  coupons: any;
  market_name: any;
  constructor(
    private helperTools: HelperToolsService,
    private authController: AuthService,
    private notiController: NotificationsPage,
    private socialSharing: SocialSharing,
    private productController: ProductService
  ) { }

  ngOnInit() {
    this.market_id = this.authController.MarketsData[0]['id'];
    this.market_name = this.authController.MarketsData[0]['name'];
    this.getcouponsForMarket();
    this.getAllNotification();
  }
  ionViewDidLoad() {
    this.productController.marketCoupons(this.market_id).subscribe(data => {
      console.log(data);
      if (data['status'] == 'success') {
        this.coupons = data['data']['rows'];
        console.log(this.coupons);
      }
    })
  }
  ionViewDidEnter() {
    this.productController.marketCoupons(this.market_id).subscribe(data => {
      console.log(data);
      if (data['status'] == 'success') {
        this.coupons = data['data']['rows'];
        console.log(this.coupons);
      }
    })
  }
  getcouponsForMarket() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      console.log(this.market_id)
      this.productController.marketCoupons(this.market_id).subscribe(data => {
        this.helperTools.DismissLoading();
        console.log(data);
        if (data['status'] == 'success') {
          this.coupons = data['data']['rows'];
          console.log(this.coupons);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }

  share(coupon_code) {
    let msg = 'استخدم الكوبون '+coupon_code+' علي منتجات متجري '+this.market_name;
    let link = "https://alaunna.com/markets/details/"+this.market_id;
    this.socialSharing.share(msg, 'تطبيق ألاونا', null, link);
  }

}
