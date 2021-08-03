import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { SharedClass } from '../shared/Shared';
import { AuthService } from '../shared/services/auth.service';
import { PopoverController } from '@ionic/angular';
import { OrderService } from '../shared/services/order.service';
// import { NotificationsPage } from '../notifications/notifications.page';
import { EventEmitterService } from '../shared/services/event-emitter.service';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersProductsPage } from '../users-products/users-products.page';
import { UsersClientsPage } from '../users-clients/users-clients.page';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {
  Orders = [] as any;
  market_carts = [] as any;
  market_carts_temp = [] as any;
  OrdersTemp = [] as any;
  ProductStatus = { 'pending': 'لم يتم تجهيزه', 'prepared': 'تم تجهيزه', 'no_exist': 'غير متوفر لدي المتجر' }
  ImgeBase = SharedClass.BASE_IMAGE_URL
  offset = 0;
  MarketData = {} as any;
  OrderStatus = { 'accepted': 'مكتمل', 'canceld': 'طلب ملغي', 'pending': 'جديد', 'shipping': 'طلب جارى التوصيل', 'user_canceld': 'العميل ألغي' ,'ready':'جاهز','seller_accepted_return': 'مسترجع' };

  countNotification = 0;
  OfferData = {} as any;
  owner = {};

  constructor(
    private helperTools: HelperToolsService,
    // private notiController: NotificationsPage,
    private orderController: OrderService,
    private AuthControlelr: AuthService,
    private eventEmiiter: EventEmitterService,
    public popoverCtrl: PopoverController,
    private productController: ProductService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private router: Router) {
  }

  ngOnInit() {
    this.LoadAllMyOrders();
    this.getMarketCart();
    // this.getAllNotification();
    this.changeReadOrdersNotifications();
    this.changeReadOrders();
    this.MarketData = this.AuthControlelr.MarketsData[0];
  }

  ionViewWillEnter() {
    if (this.orderController.back == "users-clients") {
      this.showClientsModal();
    } else if (this.orderController.back == "users-products") {
      this.showProductsModal();
    }
  }
  orderdetails(id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.orderController.getOrderById(this.AuthControlelr.MarketsData[0]['id'], id).subscribe(data => {
        if (data['status'] == 'success') {
          let order = data['data'][0];
          order.sumOrder = 0;
          if (order.orderproducts && order.orderproducts.length > 0) {
            for (let j = 0; j < order.orderproducts.length; j++) {
              order.sumOrder += order.orderproducts[j].Final_Price;
            }
          } else {
            order.sumOrder = order.total_price;
          }

          this.helperTools.DismissLoading();
          console.log(order);
          OrderService.orderdetails = order;
          this.router.navigate(['/orderdetails', order.id]);

        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }
  //get order details for market_cart orders
  orderdetails2(id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.orderController.getOrder2ById(id).subscribe(data => {
        console.log(data['data'])
        if (data['status'] == 'success') {
          let order = data['data'][0];
      

          this.helperTools.DismissLoading();
          console.log(order);
          OrderService.orderdetails = order;
          this.router.navigate(['/orderdetails2', order.id]);

        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }
  getMarketCart() {
    this.orderController.getMarket_Orders(this.AuthControlelr.MarketsData[0]['id'], this.offset).subscribe(data => {
      if (data['status'] == 'success') {
        this.market_carts = data['data'];
        this.market_carts_temp = data['data'];
        this.helperTools.DismissLoading();
        for (let i = 0; i < this.market_carts.length; i++) {
          this.market_carts[i].status_status = 'prepared'
          this.market_carts[i].sumOrder = 0;
        }        
      } else {
        this.helperTools.showBadRequestAlert();
      }
    }, err => {
      console.log(err);
      this.helperTools.DismissLoading();
      this.helperTools.showBadRequestAlert();
    })
    // })
  }
  LoadAllMyOrders() {
   console.log('test data')
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.orderController.getMarketOrders(this.AuthControlelr.MarketsData[0]['id'], this.offset).subscribe(data => {
        if (data['status'] == 'success') {
          if (this.offset == 0) {
            this.Orders = data['data'];
            this.OrdersTemp = data['data'];
            this.offset++;
          } else {
            this.Orders = this.Orders.concat(data['data']);
          }
          this.helperTools.DismissLoading();
          for (let i = 0; i < this.Orders.length; i++) {
            if (this.Orders[i].fast) {
              this.Orders[i].status_status = this.Orders[i].fast.status
            } else {
              this.Orders[i].status_status = this.Orders[i].orderproducts[0].status
            }
            this.Orders[i].sumOrder = 0;
            if (this.Orders[i].orderproducts) {
              for (let j = 0; j < this.Orders[i].orderproducts.length; j++) {
                this.Orders[i].sumOrder += this.Orders[i].orderproducts[j].Final_Price;
              }
            } else {
              this.Orders[i].sumOrder = this.Orders[i].total_price;
            }
          }
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

  changeReadOrders() {
    this.orderController.changeReadOrders(this.AuthControlelr.MarketsData[0]['id'], this.offset).subscribe(data => {
      this.eventEmiiter.emitChange({ notification: 'changed' });
      // this.getAllNotification();
    }, err => {
      this.helperTools.DismissLoading();
      this.helperTools.showBadRequestAlert();
    })
  }

  changeReadOrdersNotifications() {
    this.orderController.changeReadOrdersNotifications(this.AuthControlelr.SellerData['id']).subscribe(data => {
      this.eventEmiiter.emitChange({ notification: 'changed' });
      // this.getAllNotification();
    }, err => {
      this.helperTools.DismissLoading();
      this.helperTools.showBadRequestAlert();
    })
  }

  getAllNotification() {
    // this.notiController.getAllNotificationsCounts();
    // setTimeout(() => {
    //   this.countNotification = this.notiController.allNotiCount;
    // }, 5000);
  }

  filterData(status) {
    if (status.target.value == 'allOrders') {
      this.Orders = this.OrdersTemp;
      this.market_carts = this.market_carts_temp
      return;
    }
    this.Orders = this.OrdersTemp.filter((item) => {
      return item.status_status == status.target.value
    })

    this.market_carts = this.market_carts_temp.filter((item) => {
      return item.status_status == status.target.value
    })
  }
  onCreatePressed() {
    this.showProductsModal();
  }

  async showProductsModal() {
    let modal = await this.modalController.create({ component: UsersProductsPage, componentProps: { offer: this.OfferData } });
    modal.present();
    modal.onDidDismiss().then(data => {
      this.OfferData.products = data.data.selectedproducts_id;
      this.OfferData.products_data = data.data.selectedproducts;
      console.log(this.OfferData.products);
      if (this.OfferData.products && this.OfferData.products.length > 0)
        this.showClientsModal();
    })
  }

  async showClientsModal() {
    let modal = await this.modalController.create({ component: UsersClientsPage, componentProps: { offer: this.OfferData } });
    modal.present();
    modal.onDidDismiss().then(data => {
      if (data.data == 'new-customer') {
        this.orderController.OfferData = this.OfferData;
        this.router.navigateByUrl('new-customer2');
      } else if (data.data == "users-products") {
        this.showProductsModal();
      } else {
        this.OfferData.user_id = data.data.user_id;
        this.OfferData.customer_id = data.data.customer_id;
        this.OfferData.client = data.data.client;
        if (this.OfferData.user_id || this.OfferData.customer_id) {
          this.orderController.OfferData = this.OfferData;
          this.router.navigateByUrl('request-message');
        }
      }

    })
  }

  createWithProducts() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.OfferData.market_id = this.MarketData.id;
      this.productController.createMarketCartproducts(this.OfferData).subscribe(data => {
        if (data['status'] == 'success') {
          this.helperTools.DismissLoading();

          this.helperTools.ShowAlertWithOkButton('تم', 'تم الاضافة للسلة بنجاح');
          // this.navCtrl.pop();
          this.router.navigateByUrl('request-message');
        } else {
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
