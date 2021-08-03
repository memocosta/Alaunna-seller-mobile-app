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
  selector: 'app-orderdetails2',
  templateUrl: './orderdetails2.page.html',
  styleUrls: ['./orderdetails2.page.scss'],
})
export class Orderdetails2Page implements OnInit {
  market_id: any;
  order_id: any;
  countNotification = 0;
  order: any;
  ImgeBase = SharedClass.BASE_IMAGE_URL
  OrderStatus = { 'accepted': 'طلب مقبول', 'canceld': 'طلب ملغي', 'pending': 'في أنتظار الاستلام' };
  canceld_reason: any;
  coupon:any;
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
    this.coupon = OrderService.coupondetails;
    console.log(  this.order)
      this.order.sumOrder = 0;
    this.order.sumallCoupons = 0;
      if (this.order.MarketCartProduct) {

        for (let u = 0; u < this.order.MarketCartProduct.length; u++) {
          this.order.sumOrder += this.order.MarketCartProduct[u].product['market'][0]['Market_Products']['Selling_price']
          if(this.order.MarketCartProduct[0].product.coupon_id){
            let coupon_id=this.order.MarketCartProduct[0].product.coupon_id;
            this.orderController.coupondetails(coupon_id).subscribe(res => {
             this.coupon=res["data"];
             this.order.couponVal=this.coupon.value;
             this.order.couponCode=this.coupon.code;
             console.log(this.coupon.value)
             if(this.coupon.type=="percent"){
               console.log('offer')
               console.log(this.order.sumOrder)
               this.order.sumallOrder= this.order.sumOrder - (this.order.sumOrder * this.coupon.value / 100);
              
            }
            else{
              this.order.sumallOrder= this.order.sumOrder - (this.order.sumOrder * this.coupon.value);

            }
           }    
            , err => {
             console.log(err);
             this.helperTools.DismissLoading();
             this.helperTools.showBadRequestAlert();
           });
        }
        else {
          this.order.sumOrder = this.order.MarketCartProduct[u].product['market'][0]['Market_Products']['Selling_price']
        }
      }
        
      }
    //for (let j = 0; j < this.order.MarketCartProduct.length; j++) {
    //  this.order.sumOrder += this.order.MarketCartProduct[j].Final_Price;
   // }
  this.order.sumallOrder = 0;
   for (let index = 0; index < this.order.MarketCartProduct.length; index++) {
   this.order.sumallOrder += this.order.MarketCartProduct[index]['product']['market'][0]['Market_Products']['Selling_price'] * this.order.MarketCartProduct[index]['product'].Quantity;
    
     console.log(typeof(this.order.MarketCartProduct[index]['product'].extra_options));
     if (typeof(this.order.MarketCartProduct[index].product.extra_options) == "string") {
       this.order.MarketCartProduct[index]['product'].extra_options = JSON.parse(this.order.MarketCartProduct[index]['product'].extra_options);
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
