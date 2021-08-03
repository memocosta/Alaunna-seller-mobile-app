import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../shared/services/auth.service';
import { OrderService } from '../shared/services/order.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ModalController } from '@ionic/angular';
import { UsersProductsPage } from '../users-products/users-products.page';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  orderId: any;
  myOrders = [];
  OrdersTemp = [];
  owner = {};
  MarketData = {} as any;
  OrderStatus = { 'accepted': 'تم تأكيد الطلب', 'canceld': 'طلب ملغي', 'pending': 'قيد التنفيذ', 'shipping': 'تم الشحن', 'user_canceld': 'العميل ألغي' };
  Orders = [] as any;
  loadMessages = false;
  OfferData = {} as any;


  constructor(private orderService: OrderService,
    private route: ActivatedRoute,
    private navController: NavController,

    private modalController: ModalController,
    private storage: Storage,
    private authController: AuthService,
    private router: Router,
    private helperTools: HelperToolsService,
    private productController: ProductService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.owner = params;
    })
    if (this.owner['count'] > 0)
      this.userSingelOrder();
    this.MarketData = this.authController['MarketsData'][0];

  }
  userSingelOrder() {
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {

      this.orderService.singleUserOrder(this.owner['marketId'], this.owner["id"]).subscribe(res => {
        console.log(res, 'singel data');
        this.myOrders = res['data']['rows'];
        this.OrdersTemp = res['data']['rows'];
        this.helperTools.DismissLoading();
      });
    });
  }
  filterData(status) {
    console.log(status.target.value);
    this.myOrders = this.OrdersTemp
    if (status.target.value == 'allOrders') {
      return;
    } else {
      this.myOrders = this.myOrders.filter(item => item.status == status.target.value);
    }
  }
  onCreatePressed() {
    // if (this.OfferData.percentage == 1) {
    //   this.OfferData.title = 'خصم ' + this.OfferData.value + ' % ';
    //   this.OfferData.discount = this.OfferData.value;
    // } else {
    //   this.OfferData.value = 0;
    //   this.OfferData.discount = 0;
    // }
    // if(typeof(this.OfferData.from) == 'undefined' || typeof(this.OfferData.to) == 'undefined' || (typeof(this.OfferData.value) == 'undefined' && this.OfferData.percentage == 1) || (typeof(this.OfferData.title) == 'undefined' && this.OfferData.percentage == 0) ){
    //   this.valid = true;

    // }else if(this.OfferData.to <= this.OfferData.from ){
    //   this.helperTools.ShowAlertWithOkButton('خطأ', 'يجب ان يكون تاريخ نهاية العرض بعد تاريخ البداية');
    // }else{
    // this.valid = true;
    // this.OfferData.offer_type = 0;
    // if (this.OfferData.percentage == 1) {
    //   this.OfferData.title = 'خصم ' + this.OfferData.value + ' % ';
    //   this.OfferData.discount = this.OfferData.value;
    // } else {
    //   this.OfferData.value = 0;
    //   this.OfferData.discount = 0;
    // }
    // console.log(this.OfferData);
    // if (this.all) {
    //   this.OfferData.all = 1;
    //   this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
    //     this.productController.createOfferWithproductsAll(this.OfferData).subscribe(data => {
    //       this.helperTools.DismissLoading();
    //       if (data['status'] == 'success') {
    //         this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه العرض بنجاح');
    //         // this.navCtrl.pop();
    //         this.router.navigateByUrl('my-offers2');
    //       } else {
    //         console.log(data);
    //         if(data['error']['action'] == 'no-products'){
    //           this.helperTools.ShowAlertWithOkButton('خطأ', 'لا يوجد اي منتجات ليس لديها عروض');
    //         }else{
    //           this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لاضافه العرض بنجاح');
    //         }
    //       }
    //     }, err => {
    //       console.log(err);
    //       this.helperTools.DismissLoading();
    //       this.helperTools.showBadRequestAlert();
    //     })
    //   })
    // } else {
    //   this.OfferData.all = 0;

    // }
    // }
    this.showProductsModal();

  }
  async showProductsModal() {
    let modal = await this.modalController.create({ component: UsersProductsPage, componentProps: { offer: this.OfferData } });
    modal.present();
    modal.onDidDismiss().then(data => {
      this.OfferData.products = data.data;
      console.log(this.OfferData.products);
      if (this.OfferData.products && this.OfferData.products.length > 0)
        this.createWithProducts();
    })
  }
  createWithProducts() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.OfferData.user_id = parseInt(this.owner['id']);
      this.OfferData.market_id = this.MarketData.id;
      this.productController.createMarketCartproducts(this.OfferData).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم الاضافه بنجاح');
          // this.navCtrl.pop();
          this.router.navigateByUrl('contact-list');
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
}
