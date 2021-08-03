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
  selector: 'app-add-offer',
  templateUrl: './add-offer.page.html',
  styleUrls: ['./add-offer.page.scss'],
})
export class AddOfferPage implements OnInit {
  countNotification = 0;
  offer_type: any;
  all = true;
  specific = false;
  OfferData = {} as any;
  selectedproducts: any;
  start: String = new Date().toISOString();
  valid = false;
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
    this.OfferData['market_id'] = this.auth.MarketsData[0]['id'];
    this.OfferData.percentage = 1;
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
      this.OfferData.image = { base64: data, alt: 'alaunna image', description: 'alaunna image' };
    });
  }

  onCreatePressed() {
    if (this.OfferData.percentage == 1) {
      this.OfferData.title = 'خصم ' + this.OfferData.value + ' % ';
      this.OfferData.discount = this.OfferData.value;
    } else {
      this.OfferData.value = 0;
      this.OfferData.discount = 0;
    }
    if(typeof(this.OfferData.from) == 'undefined' || typeof(this.OfferData.to) == 'undefined' || (typeof(this.OfferData.value) == 'undefined' && this.OfferData.percentage == 1) || (typeof(this.OfferData.title) == 'undefined' && this.OfferData.percentage == 0) ){
      this.valid = true;
      
    }else if(this.OfferData.to <= this.OfferData.from ){
      this.helperTools.ShowAlertWithOkButton('خطأ', 'يجب ان يكون تاريخ نهاية العرض بعد تاريخ البداية');
    }else{
    this.valid = true;
    this.OfferData.offer_type = 0;
    if (this.OfferData.percentage == 1) {
      this.OfferData.title = 'خصم ' + this.OfferData.value + ' % ';
      this.OfferData.discount = this.OfferData.value;
    } else {
      this.OfferData.value = 0;
      this.OfferData.discount = 0;
    }
    console.log(this.OfferData);
    if (this.all) {
      this.OfferData.all = 1;
      this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
        this.productController.createOfferWithproductsAll(this.OfferData).subscribe(data => {
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
            this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه العرض بنجاح');
            // this.navCtrl.pop();
            this.router.navigateByUrl('my-offers2');
          } else {
            console.log(data);
            if(data['error']['action'] == 'no-products'){
              this.helperTools.ShowAlertWithOkButton('خطأ', 'لا يوجد اي منتجات ليس لديها عروض');
            }else{
              this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لاضافه العرض بنجاح');
            }
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        })
      })
    } else {
      this.OfferData.all = 0;
      this.showProductsModal();
    }
    }
    

  }

  createWithProducts(){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.createOfferWithproducts(this.OfferData).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه العرض بنجاح');
          // this.navCtrl.pop();
          this.router.navigateByUrl('my-offers2');
        } else {
          console.log(data);
          if(data['error']['action'] == 'no-products'){
            this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بأختيار منتج واحد علي الأقل لاضافه العرض بنجاح');
          }else{
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

  async showProductsModal() {
    let modal = await this.modalController.create({ component: MyProductsSelectComponent, componentProps: { offer: this.OfferData } });
    modal.present();
    modal.onDidDismiss().then(data => {
      this.OfferData.products = data.data;
      console.log(this.OfferData.products);
      this.createWithProducts();
    })
  }



}
