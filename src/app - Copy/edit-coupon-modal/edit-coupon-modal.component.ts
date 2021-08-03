import { Component, OnInit } from '@angular/core';
import { NotificationsPage } from '../notifications/notifications.page';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { SharedClass } from '../shared/Shared';
import { MyProductsSelect2Component } from '../my-products-select2/my-products-select2.component';

@Component({
  selector: 'app-edit-coupon-modal',
  templateUrl: './edit-coupon-modal.component.html',
  styleUrls: ['./edit-coupon-modal.component.scss'],
})
export class EditCouponModalComponent implements OnInit {

  countNotification = 0;
  all = false;
  specific = true;
  CouponData = {} as any;
  selectedproducts: any;
  compareWith : any ;
  ImageBase = SharedClass.BASE_IMAGE_URL;
  constructor(
    private notiController: NotificationsPage,
    private helperTools: HelperToolsService,
    private productController: ProductService,
    private modalController: ModalController,
    private imagePicker: ImagePicker,
    private navParams: NavParams,
    private auth: AuthService, 
    private router: Router
  ) {

  }

  ngOnInit() {
    this.CouponData = this.navParams.get('inputs');
    console.log(this.CouponData);
    this.CouponData['market_id'] = this.auth.MarketsData[0]['id'];
    if(this.CouponData.type == 'percent'){
      this.CouponData.title_type = '%';
    }else{
      this.CouponData.title_type = 'قيمة المبلغ';
    }

    this.getAllNotification();
  }

  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }

  onSelectAllChange(event) {
    if (event.detail.checked) {
      this.specific = false;
    } else {
      this.specific = true;
    }
  }

  onSelectSpecificChange(event) {
    if (event.detail.checked) {
      this.all = false;
    } else {
      this.all = true;
    }
  }

  onCreatePressed() {
    if (this.all) {
      this.CouponData.all = 1;
      this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
        this.productController.updateCoupon(this.CouponData).subscribe(data => {
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
            this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل الكوبون بنجاح');
            // this.navCtrl.pop();
            this.modalController.dismiss();
            this.router.navigateByUrl('my-coupons');
          } else {
            console.log(data);
            this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لتعديل الكوبون بنجاح');
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        })
      })
    } else {
      this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
        this.productController.updateCoupon(this.CouponData).subscribe(data => {
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
            this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل الكوبون بنجاح');
            // this.navCtrl.pop();
            this.modalController.dismiss();
            this.router.navigateByUrl('my-coupons');
          } else {
            console.log(data);
            this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لتعديل الكوبون بنجاح');
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        })
      })
    }

  }

  async showProductsModal() {
    let modal = await this.modalController.create({ component: MyProductsSelect2Component, componentProps: { coupon_id: this.CouponData.id,type: 'coupon' } });
    modal.present();
    modal.onDidDismiss().then(data => {
      this.CouponData.products = data.data;
      console.log(this.CouponData.products);
      // this.createWithProducts();
    })
  }

  dismissModal(){
    this.modalController.dismiss();
  }

}
