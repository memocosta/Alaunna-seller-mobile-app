import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { SharedClass } from '../shared/Shared';
import { AuthService } from '../shared/services/auth.service';
import { PopoverController } from '@ionic/angular';
import { OrderService } from '../shared/services/order.service';
import { NotificationsPage } from '../notifications/notifications.page';
import { EventEmitterService } from '../shared/services/event-emitter.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {

  Orders = [] as any;
  ProductStatus = { 'pending': 'لم يتم تجهيزه', 'prepared': 'تم تجهيزه', 'no_exist': 'غير متوفر لدي المتجر' }
  ImgeBase = SharedClass.BASE_IMAGE_URL
  offset = 0;
  MarketData = {} as any;
  OrderStatus = { 'accepted': 'تم تأكيد الطلب', 'canceld': 'طلب ملغي', 'pending': 'قيد التنفيذ', 'shipping': 'تم الشحن' , 'user_canceld': 'العميل ألغي' };
  countNotification = 0;
  constructor(
    private helperTools: HelperToolsService,
    private notiController: NotificationsPage,
    private orderController: OrderService,
    private AuthControlelr: AuthService,
    private eventEmiiter: EventEmitterService,
    public popoverCtrl: PopoverController,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    console.log('ionViewDidLoad MyOrdersPage');
    this.LoadAllMyOrders();
    this.getAllNotification();
    this.changeReadOrdersNotifications();
    this.changeReadOrders();
    this.MarketData = this.AuthControlelr.MarketsData[0];
  }
  
  orderdetails(id){
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
          this.router.navigate(['/orderdetails',order.id]);

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

  LoadAllMyOrders() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.orderController.getMarketOrders(this.AuthControlelr.MarketsData[0]['id'], this.offset).subscribe(data => {
        if (data['status'] == 'success') {
      
          if (this.offset == 0) {
            this.Orders = data['data'];
            this.offset++;
          } else {
            this.Orders = this.Orders.concat(data['data']);
          }
          this.helperTools.DismissLoading();
          for (let i = 0; i < this.Orders.length; i++) {
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
      console.log(data);
      this.eventEmiiter.emitChange({ notification: 'changed' });
      this.getAllNotification();
    }, err => {
      this.helperTools.DismissLoading();
      this.helperTools.showBadRequestAlert();
    })
  }

  changeReadOrdersNotifications() {
    this.orderController.changeReadOrdersNotifications(this.AuthControlelr.SellerData['id']).subscribe(data => {
      console.log(data);
      this.eventEmiiter.emitChange({ notification: 'changed' });
      this.getAllNotification();
    }, err => {
      this.helperTools.DismissLoading();
      this.helperTools.showBadRequestAlert();
    })
  }
  
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
