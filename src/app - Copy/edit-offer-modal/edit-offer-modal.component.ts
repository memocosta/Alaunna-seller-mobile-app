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
  selector: 'app-edit-offer-modal',
  templateUrl: './edit-offer-modal.component.html',
  styleUrls: ['./edit-offer-modal.component.scss'],
})
export class EditOfferModalComponent implements OnInit {

  countNotification = 0;
  offer_type: any;
  all = false;
  specific = true;
  OfferData = {} as any;
  selectedproducts: any;
  compareWith: any;
  ImageBase = SharedClass.BASE_IMAGE_URL;
  start: String = new Date().toISOString();
  valid: boolean = false;
  constructor(
    private notiController: NotificationsPage,
    private helperTools: HelperToolsService,
    private productController: ProductService,
    private modalController: ModalController,
    private imagePicker: ImagePicker,
    private navParams: NavParams,
    private auth: AuthService, private router: Router
  ) {

  }

  ngOnInit() {
    this.OfferData = this.navParams.get('inputs');
    console.log(this.OfferData);
    this.OfferData['market_id'] = this.auth.MarketsData[0]['id'];
    if (this.OfferData.percentage == 1) {
      this.OfferData.title_type = '%';
    } else {
      this.OfferData.title_type = 'عرض خاص';
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

  onImageNeeded() {
    this.helperTools.OpenImageProduct().then(data => {
      this.OfferData.image_new = { base64: data, alt: 'alaunna image', description: 'alaunna image' };
    });
  }

  onCreatePressed() {
    this.OfferData.offer_type = 0;
    if (this.OfferData.percentage == 1) {
      this.OfferData.title = 'خصم ' + this.OfferData.value + ' % ';
      this.OfferData.discount = this.OfferData.value;
    } else {
      this.OfferData.value = 0;
      this.OfferData.discount = 0;
    }
    if (typeof (this.OfferData.from) == 'undefined' || typeof (this.OfferData.to) == 'undefined' || (typeof (this.OfferData.value) == 'undefined' && this.OfferData.percentage == 1) || (typeof (this.OfferData.title) == 'undefined' && this.OfferData.percentage == 0)) {
      this.valid = true;

    } else if (this.OfferData.to <= this.OfferData.from) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'يجب ان يكون تاريخ نهاية العرض بعد تاريخ البداية');
    } else {
      console.log(this.OfferData);
      if (this.all) {
        this.OfferData.all = 1;
        this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
          this.productController.editeOfferWithproductsAll(this.OfferData).subscribe(data => {
            this.helperTools.DismissLoading();
            if (data['status'] == 'success') {
              this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل العرض بنجاح');
              // this.navCtrl.pop();
              this.modalController.dismiss();
              this.router.navigateByUrl('my-offers2');
            } else {
              console.log(data);
              this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لتعديل العرض بنجاح');
            }
          }, err => {
            console.log(err);
            this.helperTools.DismissLoading();
            this.helperTools.showBadRequestAlert();
          })
        })
      } else {
        this.OfferData.all = 0;
        this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
          this.productController.editOfferWithproducts(this.OfferData).subscribe(data => {
            this.helperTools.DismissLoading();
            if (data['status'] == 'success') {
              this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل العرض بنجاح');
              // this.navCtrl.pop();
              this.modalController.dismiss();
              this.router.navigateByUrl('my-offers2');
            } else {
              if (data['error']['action'] == 'no-products') {
                this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بأختيار منتج واحد علي الأقل لتعديل العرض بنجاح');
              } else {
                this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لتعديل العرض بنجاح');
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

  }

  async showProductsModal() {
    this.OfferData.offer_type = 0;
    if (this.OfferData.percentage == 1) {
      this.OfferData.title = 'خصم ' + this.OfferData.value + ' % ';
      this.OfferData.discount = this.OfferData.value;
    } else {
      this.OfferData.value = 0;
      this.OfferData.discount = 0;
    }
    let modal = await this.modalController.create({ component: MyProductsSelect2Component, componentProps: { offer_id: this.OfferData.id ,offer: this.OfferData} });
    modal.present();
    modal.onDidDismiss().then(data => {
      this.OfferData.products = data.data;
      console.log(this.OfferData.products);
      // this.createWithProducts();
    })
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
