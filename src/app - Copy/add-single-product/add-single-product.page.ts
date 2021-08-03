import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ModalController } from '@ionic/angular';
import { CategoryComponent } from '../shared/components/category/category.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';
import { SelectOptionsComponent } from '../shared/components/select-options/select-options.component';
import { Router } from '@angular/router';
import { NotificationsPage } from '../notifications/notifications.page';
import { PhotoComponent } from '../photo/photo.component';


@Component({
  selector: 'app-add-single-product',
  templateUrl: './add-single-product.page.html',
  styleUrls: ['./add-single-product.page.scss'],
})
export class AddSingleProductPage implements OnInit {

  ProductData = {} as any;
  selectImages = true;
  SelectedCat = {} as any;
  cat_sub_title = '';
  ProductForm: FormGroup;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 4,
    spaceBetween: 5,
    centeredSlides: true
  };
  categories = [];
  ProductInputs = [];
  countNotification = 0;
  progress = 0;
  showProgress = false;

  constructor(
    private helperTools: HelperToolsService,
    private imagePicker: ImagePicker,
    private modalController: ModalController,
    private productController: ProductService,
    private notiController: NotificationsPage,
    private auth: AuthService, private router: Router
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.ProductData['category_id'] = this.auth.MarketsData[0]['marketcategory_id'];
    this.ProductData['product_type'] = 'new_product';
    this.ProductData['market_id'] = this.auth.MarketsData[0]['id'];
    this.ProductData['images'] = [];
    this.categories = this.auth.MarketsData[0]["categories"];
    this.LoadAllCategories();
    this.getAllNotification();

    // this.showProgress = true;
    // this.move();

  }
  initForm() {
    this.ProductForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      selling_price: new FormControl(null, [Validators.required]),
      price_after: new FormControl(null, []),
      description: new FormControl(null, [Validators.required]),
      cat_sub_title: new FormControl(null, [Validators.required]),
      category_id: new FormControl(null, [Validators.required])
    }, { updateOn: 'change' })
  }
  catChange(cat_id){
    console.log(cat_id);
    this.SelectedCat['category'] = this.categories.find(x => x.id == cat_id);
    console.log(this.SelectedCat['category']);
  }
  onImageNeeded() {
    if (this.ProductData['images'] && this.ProductData['images'].length >= 8) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'لا يمكن اضافه اكتر من 8 صور');
    }

    this.helperTools.OpenImageProduct().then(data => {
      this.ProductData.images.push({ base64: data, alt: 'alaunna image', description: 'alaunna image' });
    });
  }
  onImageClicked(img) {
    this.helperTools.OpenImageProduct().then(dataURI => {
      img.base64 = dataURI;
      if (img.base64 != 'new') {
        img.action = 'edited';
      }
    })
  }
  onDeleteImage(img) {
    const index = this.ProductData.images.indexOf(img, 0);
    if (index > -1) {
      this.ProductData.images.splice(index, 1);
    }
  }

  async onShowImage(img) {
    let modal = await this.modalController.create({
      component: PhotoComponent, componentProps: {
        img: img
      }
    });
    modal.present();
  }

  async onCategoryClicked() {

    let modal = await this.modalController.create({
      component: CategoryComponent, componentProps: {
        category_id: this.ProductData['category_id']
      }
    });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);
      if (data && data['data']) {
        this.SelectedCat['subCategory'] = data['data']['selectedOBJ']['subcategory']['name'] ? data['data']['selectedOBJ']['subcategory'] : this.ProductData['subCategory'];
        this.SelectedCat['subSubCategory'] = data['data']['selectedOBJ']['subsubcategory']['name'] ? data['data']['selectedOBJ']['subsubcategory'] : this.ProductData['subSubCategory'];

        this.ProductInputs = [];
        if (this.SelectedCat['category'] && this.SelectedCat['category']['inputs']) {
          console.log(this.SelectedCat['category']);
          let inputs = JSON.parse(this.SelectedCat['category']['inputs']);
          this.ProductInputs = this.ProductInputs.concat(inputs);
        }
        if (this.SelectedCat['subCategory'] && this.SelectedCat['subCategory']['inputs']) {
          console.log(this.SelectedCat['subCategory']);
          let inputs = JSON.parse(this.SelectedCat['subCategory']['inputs']);
          this.ProductInputs = this.ProductInputs.concat(inputs);
        }
        if (this.SelectedCat['subSubCategory'] && this.SelectedCat['subSubCategory']['inputs']) {
          console.log(this.SelectedCat['subSubCategory']);
          let inputs = JSON.parse(this.SelectedCat['subSubCategory']['inputs']);
          this.ProductInputs = this.ProductInputs.concat(inputs);
        }

        console.log(this.SelectedCat);

        this.cat_sub_title = (this.SelectedCat['category'] ? this.SelectedCat['category'].name : '')
          + ',' + (this.SelectedCat['subCategory'] ? this.SelectedCat['subCategory'].name : '')
          + ',' + (this.SelectedCat['subSubCategory'] && this.SelectedCat['subSubCategory'] ? this.SelectedCat['subSubCategory'].name : '');
        console.log(this.cat_sub_title);
        this.ProductData['category_id'] = data['data']['ids']['category_id'] ? data['data']['ids']['category_id'] : this.ProductData['category_id'];
        this.ProductData['subCategory_id'] = data['data']['ids']['subcategory_id'] ? data['data']['ids']['subcategory_id'] : this.ProductData['subCategort_id'];
        this.ProductData['subSubCategory_id'] = data['data']['ids']['subsubcategory_id'] ? data['data']['ids']['subsubcategory_id'] : this.ProductData['subSubCategory_id'];
      }
    })
  }
  LoadAllCategories() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.getProductCategory().subscribe(
        data => {
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            //this.categories = data["data"]["rows"];
            //this.categories = this.auth.MarketsData[0]["categories"];
            console.log(this.categories);

            this.SelectedCat['category'] = this.categories.find(x => x.id == this.ProductData['category_id']);
            console.log(this.SelectedCat);
            if (this.SelectedCat['category'] && this.SelectedCat['category']['inputs']) {
              let inputs = JSON.parse(this.SelectedCat['category']['inputs']);
              this.ProductInputs = this.ProductInputs.concat(inputs);
            }
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    })
  }
  async OnCustomizeClicked() {
    let modal = await this.modalController.create({ component: SelectOptionsComponent, componentProps: { inputs: this.ProductInputs } });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);
      if (data['data']) {
        this.ProductData['extra_input'] = data['data'];
      }
    })
  }
  onNextPressed() {
    // if (!this.ProductData['images'] || !this.ProductData['images'].length) {
    //   this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اختيار صوره واحده علي الأقل للمنتج ');
    //   return
    // }
    this.selectImages = !this.selectImages;
  }
  move() {
    if(this.progress <= 80){
      setTimeout(()=>{
        this.progress += 5;
        this.move();
      }, 500);
    }
  }
  onCreatePressed() {
    if (!this.ProductForm.valid) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'قم بكتابه كل البيانات المطلوبه لاضافه منتجكك بنجاح');
      this.ProductForm.updateValueAndValidity();
      return;
    }
    if (this.ProductData.price_after && this.ProductData.price_after > this.ProductData.selling_price) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء كتابه السعر بعد الخصم اقل من السعر الأصلي');
      this.ProductForm.updateValueAndValidity();
      return;
    }
    this.ProductData['national_qr'] = 'DEFUALT ONE';
    this.ProductData['status'] = 'active';
    this.ProductData['quantity'] = 100;
    //this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.showProgress = true;
      this.move();
      this.productController.createProduct(this.ProductData).subscribe(data => {
        this.progress = 100;
        setTimeout(() => {
          this.showProgress = false;
        }, 2000);
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه المنتج بنجاح');
          // this.navCtrl.pop();
          this.router.navigateByUrl('myproducts');
        } else {
          console.log(data);
          this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء التأكد من إتصالك بالأنترنت');
        }
      }, err => {
        this.showProgress = false;
        this.progress = 0;
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء التأكد من إتصالك بالأنترنت');
        //this.helperTools.showBadRequestAlert();
      })
    //})
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
