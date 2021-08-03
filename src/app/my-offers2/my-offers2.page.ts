import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { AuthService } from '../shared/services/auth.service';
import { MarketService } from '../shared/services/market.service';
import { ProductService } from '../shared/services/product.service';
import { SharedClass } from '../shared/Shared';
import { NotificationsPage } from '../notifications/notifications.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-my-offers2',
  templateUrl: './my-offers2.page.html',
  styleUrls: ['./my-offers2.page.scss'],
})
export class MyOffers2Page implements OnInit {
  ImageBaseURL = SharedClass.BASE_IMAGE_URL;
  countNotification = 0;
  market_id: any;
  offers: any;
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
    this.getOffersForMarket();
    this.getAllNotification();
  }
  ionViewDidLoad() {
    this.productController.getOffersForMarket(this.market_id).subscribe(data => {
      this.helperTools.DismissLoading();
      console.log(data);
      if (data['status'] == 'success') {
        this.offers = data['data']['rows'];
        console.log(this.offers);
      }
    })
  }
  ionViewDidEnter() {
    this.productController.getOffersForMarket(this.market_id).subscribe(data => {
      this.helperTools.DismissLoading();
      console.log(data);
      if (data['status'] == 'success') {
        this.offers = data['data']['rows'];
        console.log(this.offers);
      }
    })
  }
  getOffersForMarket() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      console.log(this.market_id)
      this.productController.getOffersForMarket(this.market_id).subscribe(data => {
        this.helperTools.DismissLoading();
        console.log(data);
        if (data['status'] == 'success') {
          this.offers = data['data']['rows'];
          console.log(this.offers);
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

  share(offer) {
    let msg = 'أستمتع بالعرض الجديد '+offer.title+' علي منتجات متجري '+this.market_name;
    let link = "https://alaunna.com/markets/details/"+this.market_id;
    this.socialSharing.share(msg, 'تطبيق ألاونا', null, link);
  }

}
