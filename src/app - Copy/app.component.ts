import { Component, NgZone, ViewChildren, QueryList } from '@angular/core';

import { Platform, NavController, IonRouterOutlet, ActionSheetController, PopoverController, ModalController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import { HelperToolsService } from './shared/services/helper-tools.service';
import { NotificationsPage } from './notifications/notifications.page';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { EventEmitterService } from './shared/services/event-emitter.service';
import { SharedClass } from './shared/Shared';
import * as socketIOClient from "socket.io-client";
import * as sailsIOClient from "sails.io.js";
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { Push, PushObject, PushOptions} from '@ionic-native/push/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  UserData;
  HaveAccounting = false;
  pages = [
    { url: '/', title: 'الرئيسية', icon: 'home' },
    // { url: '/login', title: 'تسجيل دخول', icon: 'home' },
    // { url: '/profile', title: ' الصفحه الشخصيه', icon: 'person' },
    { url: '/contact-list', title: ' العملاء', icon: 'people' },
    { url: '/request-message', title: ' رساله الطلب', icon: 'people' },
    { url: '/my-orders-two', title: ' الطلب الثاني', icon: 'people' },
    { url: '/add-new-customer', title: ' اضافه عميل جديد', icon: 'people' },



    { url: '/settings', title: 'الاعدادات', icon: 'options' },

    // { url: '/register', title: ' تسجيل حساب', icon: 'key' },
    // { url: '/alauuna-products', title: 'منتجات الااونا', icon: 'radio-button-on' },
    { url: '/myorders', title: 'طلباتي', icon: 'cart' },
    { url: '/myproducts', title: 'منتجاتي', icon: 'cube' },
    { url: '/addproduct', title: 'أضف منتج', icon: 'add-circle' },
    // { url: '/my-adds', title: 'اعلاناتي', icon: 'unlock' },
    // { url: '/myoffers', title: 'عروضي', icon: 'home' },
    { url: '/my-offers2', title: 'عروضي', icon: 'unlock' },
    // { url: '/add-offer', title: 'اضف عرض', icon: 'add-circle-outline' },
    { url: '/my-coupons', title: 'كوبوناتي', icon: 'md-pricetags' },
    // { url: '/add-coupon', title: 'اضف كوبون', icon: 'add-circle-outline' },
    // { url: '/no-adds', title: 'اعلاناتى 2', icon: 'add-circle' },
    // { url: '/add-single-product', title: 'اضافة منتج جديد', icon: 'home' },
    // { url: '/add-ads', title: 'اضف اعلان', icon: 'add-circle-outline' },
    // { url: '/single-product', title: ' الإعلان الواحد', icon: 'add-circle-outline' },
    { url: '/statistics', title: '  الإحصائيات', icon: 'cellular' },
    { url: 'https://api.whatsapp.com/send?phone=201010039331', title: 'تواصل معنا', icon: 'send' },
    // { url: '/about-us', title: 'عن التطبيق', icon: 'information' },
    // { url: '/add-offer', title: 'اضف عرض', icon: 'home' },
    // { url: '/add-store', title: 'اضف متجر', icon: 'home' },
    // { url: '/opportunity', title: 'فرص بيع', icon: 'home' },
    // { url: '/category', title: 'تصنيفات', icon: 'home' },
    // { url: '/chatboxes', title: 'الرسائل', icon: 'home' },
    { url: 'logout', type: 'custom-function', function: this.logout, title: 'تسجيل الخروج', icon: 'exit' }
  ]
  ImageBase = SharedClass.BASE_IMAGE_URL;
  BaseUrl = SharedClass.BASE_URL;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  countNotiOrders = 0;
  countNotiMessages = 0;
  countNotiOffers = 0;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private authController: AuthService,
    public router: Router,
    private helperTools: HelperToolsService,
    private oneSignal: OneSignal,
    private ngzone: NgZone,
    private nativeToast : Toast,
    private push: Push,
    private eventEmitter: EventEmitterService,
    private localNotifications: LocalNotifications,
    private NacController : NavController,
    private actionsheetCtrl : ActionSheetController,
    private popoverCtrl : PopoverController,
    private modalCtrl : ModalController,
    private notiController: NotificationsPage,
    private menu : MenuController

  ) {
    this.initializeApp();
    this.push_setup();
    this.backButtonEvent();
    this.intializeUserData();
    this.notificationEvent();
  }

  intializeUserData() {
    this.eventEmitter.changeEmitted$.subscribe(data => {
      if (data['event_name'] == 'userLogin') {
        this.UserData = this.authController.SellerData;
        this.getAllNotification()
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authController.io = sailsIOClient(socketIOClient);
      this.authController.io.sails.url = this.BaseUrl;
      this.authController.io.socket.on("connect", data => {
        console.log(data);
        this.authController.io.socket.on("newMessage", message => {
          this.ngzone.run(() => {
            if (
              this.router.url != "chatboxes" &&
              this.router.url != "chatroom"
            ) {
              this.localNotifications.schedule({
                title: "رساله جديده",
                text: message["text"],
                foreground: true
              });
            }
          });
        });
        this.authController.io.socket.on('disconnect' , data => {
          this.authController.io.socket.reconnect();
        })
      });

    });
  }
  logout() {
    this.helperTools.ShowExitAlert().then(__ => {
        this.storage.remove("token");
        this.authController.SellerData = "";
        this.authController.MarketsData = "";
        // this.nav.setRoot("LoginPage");
        // this.router.(['/login'] , {});
        this.NacController.navigateRoot('/login');
    }).catch(err => { });
  }
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(601, async () => {
      if (this.router.url === '/home') {
        this.helperTools.ShowExitAlert().then(__ => {
          navigator['app'].exitApp();
        }).catch(err => { });
      } else{
        this.NacController.pop();
      }
    });
  }
  push_setup(){
    const options1: PushOptions = {
      android: {
        senderID:'357041582252',
        sound: true,
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

    pushObject.on('notification').subscribe((notification: any) => {
      this.NacController.navigateRoot('/statistics');
      this.nativeToast.show(
        `notification.message`,
        '3000',
        'center').subscribe(toast => {
          //console.log(JSON.stringify(toast));
      });
    });

    pushObject.on('registration').subscribe((registration: any) => {
      //console.log(registration.registrationId);
    });
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout( () => { 

      this.countNotiOrders = this.notiController.OrdersCount;
      this.countNotiMessages = this.notiController.unreadMessages;
      this.countNotiOffers = this.notiController.newPrices;
    }, 8000 );
  }
  notificationEvent() {
    this.eventEmitter.changeEmitted$.subscribe(data => {
      if (data['notification'] == 'changed') {
        this.getAllNotification()
      }
    })
  }
}
