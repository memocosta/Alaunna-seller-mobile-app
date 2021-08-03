import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AuthService } from '../shared/services/auth.service';
import { SharedClass } from '../shared/Shared';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ProductService } from '../shared/services/product.service';
import { MarketService } from '../shared/services/market.service';
import { NotificationsPage } from '../notifications/notifications.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActiveComponent } from '../active/active.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  MarketData = {} as any;
  ImgeBase = SharedClass.BASE_IMAGE_URL;
  Products = [];
  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: 'all', country_id: '' }
  countNotification = 0;
  banners = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };


  constructor(private menuController: MenuController,
    private authController: AuthService,
    private notiController: NotificationsPage,
    public helperTools: HelperToolsService,
    private storage: Storage,
    private push: Push,
    private fb: Facebook,
    private ga: GoogleAnalytics,
    private navController: NavController,
    private router: Router,
    private socialSharing: SocialSharing,
    private modalController: ModalController,
    private productController: ProductService,
    private marektController: MarketService) {

    this.menuController.enable(true);
    this.push_setup();
  }


  removeBanner(index) {
    this.banners.splice(index, 1);
  }
  ngOnInit() {
    //new activate status check//
    let data = this.authController['SellerData'];
    if(data["status"] == 'not_active'){
      this.showActiveModalLogin(data);
    }
    //////////////
    this.getSlides();
    this.MarketData = this.authController['MarketsData'][0];
    this.filterData.market_id = this.MarketData.id;
    this.loadMyroducts();
    console.log(this.MarketData);
    this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    this.ga.startTrackerWithId('UA-140401640-1')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('test');
        // Tracker is ready
        // You can now track pages or set additional information such as AppVersion or UserId
      }).catch(e => console.log('Error starting GoogleAnalytics', e));
  }
  ionViewDidEnter() {
    this.getAllNotification();
  }
  async showActiveModalLogin(data) {
    let modal = await this.modalController.create({ component: ActiveComponent, componentProps: { data: data , type: 'login' } });
    modal.present();
  }
  getSlides() {
    this.productController.getAllSlides().subscribe(data => {
      this.helperTools.DismissLoading();
      if (data['status'] == 'success') {
        this.banners = data['data']['rows'];
      }
    })
  }
  loadMyroducts() {
    if (!this.authController.MarketsData) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اضافه متجر');
      // this.navCtrl.setRoot('MarketCreatePage')
      this.router.navigate(['/add-store']);
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.getProducts(this.filterData.category_id,
        this.filterData.subctegory_id,
        this.filterData.subsubcategory_id,
        this.filterData.market_id,
        this.filterData.status,
        this.filterData.offset,
        this.filterData.country_id).subscribe(data => {
          console.log(data)
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
            if (this.filterData.offset == 0) {
              this.Products = data['data']['rows'];
              this.productController.Products = data['data']['rows'];
              // this.filterdroducts = data['data']['rows'];
            } else {
              this.Products = this.Products.concat(data['data']['rows']);
              // this.filterdroducts = this.Products.concat(data['data']['rows']);
            }
            console.log(this.Products);
            console.log('length is ' + this.Products.length);
          } else {
            console.log('showBadRequestAlert 1');
            this.helperTools.showBadRequestAlert();
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          console.log('showBadRequestAlert 2');
          this.helperTools.showBadRequestAlert();
        })
    })
  }
  loadData(event) {
    this.filterData.offset++;
    this.loadMyroducts();
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
    }, 500);
  }
  settingsPopover() {
    //TODO: fill this function
  }
  OpenImage(ImageKey) {
    let width = 350,
      height = 350;
    if (ImageKey == "cover") {
      width = 1024;
      height = 512;
    }
    this.helperTools.OpenImage(width, height).then(data => {
      if (this.MarketData[ImageKey]) {
        if (this.MarketData[ImageKey].action == 'new') {
          this.MarketData[ImageKey].base64 = data;
        } else {
          this.MarketData[ImageKey].action = 'edited';
          this.MarketData[ImageKey].base64 = data;
        }
      } else {
        this.MarketData[ImageKey] = {
          base64: data,
          alt: "alaunna market",
          description: "alaunna market",
          action: 'new'
        };
      }
      this.marektController.editMarket(this.MarketData).subscribe(data => {
        console.log(data);
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل صوره الكفر للمتجر بنجاح');

          this.storage.get('token').then(token => {
            if (!token) {
              this.router.navigate(['/login']);
            }
            this.authController.varifyToken(token).subscribe(data => {
              console.log(data);
              if (data['status'] == 'success') {
                this.authController.MarketsData = data["data"]["markets"];
                this.MarketData = this.authController['MarketsData'][0];
              } else {
                // this.router.navigate(['/login']);
                this.navController.navigateRoot('/login');
              }
            }, err => {
              this.navController.navigateRoot('/login');
            })
          })
        } else {

        }
      }, err => {

      })
    });
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
  push_setup() {
    console.log(this.authController);
    const topic = '/topics/c' + this.authController.SellerData.country_id + 'c' + this.authController.MarketsData[0].marketcategory_id;
    console.log(topic);

    const options1: PushOptions = {
      android: {
        senderID: '357041582252',
        sound: true,
        topics: [topic]
      },
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };
    const pushObject: PushObject = this.push.init(options1);

    pushObject.subscribe(topic).then((res: any) => {
      console.log("subscribed to topic: ", res);
    });

    pushObject.subscribe('/topics/sellers').then((res: any) => {
      console.log("subscribed to topic: ", res);
    });
  }
  share() {
    let msg = 'من خلال تطبيق ألأونا يمكنك الان الأطلاع علي منتجاتي متجري  ' + this.MarketData.name;
    let link = "https://alaunna.com/markets/details/" + this.MarketData.id;
    this.socialSharing.share(msg, 'تطبيق ألاونا', null, link);
  }
}
