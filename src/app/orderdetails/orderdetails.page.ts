import { AuthService } from './../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationsPage } from '../notifications/notifications.page';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OrderService } from '../shared/services/order.service';
import { SharedClass } from '../shared/Shared';
import { ModalController } from '@ionic/angular';
import { CancelComponent } from '../cancel/cancel.component';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.page.html',
  styleUrls: ['./orderdetails.page.scss'],
})
export class OrderdetailsPage implements OnInit {
  market_id: any;
  order_id: any;
  countNotification = 0;
  order: any;
  ImgeBase = SharedClass.BASE_IMAGE_URL
  OrderStatus = { 'accepted': 'طلب مقبول', 'user_canceld': 'طلب ملغي', 'pending': 'في أنتظار الاستلام' };
  canceld_reason: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authController: AuthService,
    private notiController: NotificationsPage,
    private helperTools: HelperToolsService,
    private orderController: OrderService,
    private modalController: ModalController,
    private AuthControlelr: AuthService,
  ) { }

  ngOnInit() {
    this.market_id = this.authController.MarketsData[0]['id'];
    this.order = OrderService.orderdetails;
    this.order.sumOrder = 0;
    for (let j = 0; j < this.order.orderproducts.length; j++) {
      this.order.sumOrder += this.order.orderproducts[j].Final_Price;
    }
    this.order.sumallOrder = 0;
    this.order.sumallCoupons = 0;
    for (let index = 0; index < this.order.products.length; index++) {
      this.order.sumallOrder += this.order.products[index]['market'][0]['Market_Products']['Selling_price'] * this.order.products[index].OrderProducts.Quantity;
      this.order.sumallCoupons += this.order.orderproducts[index]['coupon_value'];
      console.log(typeof(this.order.products[index].OrderProducts.extra_options));
      if (typeof(this.order.products[index].OrderProducts.extra_options) == "string") {
        this.order.products[index].OrderProducts.extra_options = JSON.parse(this.order.products[index].OrderProducts.extra_options);
      }      
    }
  }

  getAllNotification() {
    setTimeout(() => {
      this.countNotification = this.notiController.Orders.length + this.notiController.unreadMessages + this.notiController.newPrices;
      console.log('Count of Notification = ' + this.countNotification)
    }, 6000);
  }

  changeStatusByMarket(status , fast) {
    if (fast && (!this.order.total_price || this.order.total_price == 0) && status != 'canceld') {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء أدخال مبلغ الطلب أولا');
      return;
    }
    if(status == 'canceld' && !this.canceld_reason){
      this.showCanceldModal(status , fast);
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      this.orderController.changeStatusByMarket(this.order.id,this.market_id, status, fast,this.order.total_price,this.canceld_reason).subscribe(res => {
        console.log(res);
        this.helperTools.DismissLoading();
        if (res['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل حالة الطلب');
          this.router.navigate(['/myorders']);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      });
    })
  }

  async showCanceldModal(status , fast) {
    let modal = await this.modalController.create({ component: CancelComponent, componentProps: {} });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);
      this.canceld_reason = data['data'];
      if(this.canceld_reason){
        this.changeStatusByMarket(status , fast);
      }
    })
  }
}
