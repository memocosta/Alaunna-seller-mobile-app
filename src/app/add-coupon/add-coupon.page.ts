import { Component, OnInit } from '@angular/core';
import { NotificationsPage } from '../notifications/notifications.page';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MyProductsSelectComponent } from '../my-products-select/my-products-select.component';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.page.html',
  styleUrls: ['./add-coupon.page.scss'],
})
export class AddCouponPage implements OnInit {

  countNotification = 0;
  offer_type: any;
  all = true;
  specific = false;
  CouponData = {} as any;
  selectedproducts: any;
  constructor(
    private notiController: NotificationsPage,
    private helperTools: HelperToolsService,
    private productController: ProductService,
    private modalController: ModalController,
    private imagePicker: ImagePicker,
    private auth: AuthService, private router: Router
  ) {

  }

  ngOnInit() {
    this.CouponData['market_id'] = this.auth.MarketsData[0]['id'];
    this.CouponData.type = 'percent';
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
    console.log(this.CouponData);
    if (this.all) {
      this.CouponData.all = 1;
      this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
        this.productController.createCoupon(this.CouponData).subscribe(data => {
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
            this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه الكوبون بنجاح');
            // this.navCtrl.pop();
            this.router.navigateByUrl('my-coupons');
          } else {
            console.log(data);
            this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لاضافه الكوبون بنجاح');
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        })
      })
    } else {
      this.showProductsModal();
    }
  }

  createWithProducts(){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.createCoupon(this.CouponData).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه الكوبون بنجاح');
          // this.navCtrl.pop();
          this.router.navigateByUrl('my-coupons');
        } else {
          console.log(data);
          this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لاضافه الكوبون بنجاح');
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

  async showProductsModal() {
    let modal = await this.modalController.create({ component: MyProductsSelectComponent, componentProps: { inputs: '111',type: 'coupon' } });
    modal.present();
    modal.onDidDismiss().then(data => {
      this.CouponData.products = data.data;
      console.log(this.CouponData.products);
      this.createWithProducts();
    })
  }

  CreateCode(){
    this.CouponData.code =  Math.floor(Math.random() * (999999 - 100000)) + 100000;
  }

}
