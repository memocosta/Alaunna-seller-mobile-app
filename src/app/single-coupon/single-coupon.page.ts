import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedClass } from '../shared/Shared';
import { ModalController } from '@ionic/angular';
import { NotificationsPage } from '../notifications/notifications.page';
import { EditCouponModalComponent } from '../edit-coupon-modal/edit-coupon-modal.component';

@Component({
  selector: 'app-single-coupon',
  templateUrl: './single-coupon.page.html',
  styleUrls: ['./single-coupon.page.scss'],
})
export class SingleCouponPage implements OnInit {

  CouponData: any;
  countNotification = 0;
  ImageBase = SharedClass.BASE_IMAGE_URL;

  constructor(
    private productControlelr: ProductService,
    private helperTools: HelperToolsService,
    private route: ActivatedRoute,
    private notiController: NotificationsPage,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      if (data['id']) {
        this.getCoupon(data['id']);
      }
    });
    this.getAllNotification();
  }
  async editCoupon(){
    let modal = await this.modalController.create({ component: EditCouponModalComponent, componentProps: { inputs: this.CouponData } });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);
      
    })
  }

  getCoupon(id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.singleCoupon(id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.CouponData = data['data'];
          console.log(this.CouponData);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {

      })
    })
  }

  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
  changeCouponStatus(status){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.changeStatusCoupon(this.CouponData.id,status).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل حالة الكوبون بنجاح');
          // this.navCtrl.pop();
          this.modalController.dismiss();
          this.router.navigateByUrl('my-coupons');
        } else {
          console.log(data);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

  deleteCoupon(){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.deleteCoupon(this.CouponData.id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم ألغاء الكوبون بنجاح');
          // this.navCtrl.pop();
          this.modalController.dismiss();
          this.router.navigateByUrl('my-coupons');
        } else {
          console.log(data);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

}
