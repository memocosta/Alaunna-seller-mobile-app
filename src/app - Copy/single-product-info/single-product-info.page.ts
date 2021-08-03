import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClass } from '../shared/Shared';
import { ModalController } from '@ionic/angular';
import { CategoryComponent } from '../shared/components/category/category.component';
import { SelectOptionsComponent } from '../shared/components/select-options/select-options.component';
import { NotificationsPage } from '../notifications/notifications.page';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-single-product-info',
  templateUrl: './single-product-info.page.html',
  styleUrls: ['./single-product-info.page.scss'],
})
export class SingleProductInfoPage implements OnInit {
  ProductData = { market: [{ Market_Products: {} }] } as any;
  ProductForm: FormGroup;
  ImageBase = SharedClass.BASE_IMAGE_URL;
  SelectedCat = {};
  cat_sub_title = '';
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    slidesPerView: 4,
    spaceBetween: 5,
    centeredSlides: true
  };
  ProductInputs = [];
  countNotification = 0;
  categories: any;

  constructor(private productControlelr: ProductService,
    private helperTools: HelperToolsService,
    private route: ActivatedRoute,
    private notiController: NotificationsPage,
    private modalController: ModalController,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(data => {
      if (data['id']) {
        this.getProductById(data['id']);
      }
    });

    this.categories = this.auth.MarketsData[0]["categories"];

    this.getAllNotification();
  }
  initForm() {
    this.ProductForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      Selling_price: new FormControl(null, [Validators.required]),
      Price_after: new FormControl(null, []),
      description: new FormControl(null, []),
      category_id: new FormControl(null, [Validators.required]),
      cat_sub_title: new FormControl(null, [Validators.required])
    })
  }
  catChange(cat_id) {
    console.log(cat_id);
    this.SelectedCat['category'] = this.categories.find(x => x.id == cat_id);
    console.log(this.SelectedCat['category']);
  }
  getProductById(id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.getProductById(id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.ProductData = data['data'];
          console.log(this.ProductData);
          this.fillSelectedCatOBJ();

        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {

      })
    })
  }
  fillSelectedCatOBJ() {
    //this.SelectedCat['category'] = this.ProductData['category'] ? this.ProductData.category : {};
    console.log(this.categories);
    console.log(this.ProductData);
    this.SelectedCat['category'] = this.categories.find(x => x.id == this.ProductData['category_id']);
    if(!this.SelectedCat['category']){
      this.SelectedCat['category'] = this.ProductData['category'] ? this.ProductData.category : {};
      this.categories.push(this.SelectedCat['category']);
    }
    console.log(this.SelectedCat['category']);
    this.SelectedCat['subCategory'] = this.ProductData['subCategory'] ? this.ProductData['subCategory'] : {};
    this.SelectedCat['subSubCategory'] = this.ProductData['subSubCategory'] ? this.ProductData['subSubCategory'] : {};

    if (this.SelectedCat['category'] && this.SelectedCat['category']['inputs']) {
      let inputs = JSON.parse(this.SelectedCat['category']['inputs']);
      this.ProductInputs = this.ProductInputs.concat(inputs);
    }
    if (this.SelectedCat['subCategory'] && this.SelectedCat['subCategory']['inputs']) {
      let inputs = JSON.parse(this.SelectedCat['subCategory']['inputs']);
      this.ProductInputs = this.ProductInputs.concat(inputs);
    }
    if (this.SelectedCat['subSubCategory'] && this.SelectedCat['subSubCategory']['inputs']) {
      let inputs = JSON.parse(this.SelectedCat['subSubCategory']['inputs']);
      this.ProductInputs = this.ProductInputs.concat(inputs);
    }

    this.buildIntialInputs();
    console.log(this.SelectedCat);
    this.cat_sub_title = (this.SelectedCat['category'].name + ', ') +
      (this.SelectedCat['subCategory'].name ? this.SelectedCat['subCategory'].name : '')
      + ','
      + (this.SelectedCat['subSubCategory'] && this.SelectedCat['subSubCategory'].name ? this.SelectedCat['subSubCategory'].name : '')
  }
  onImageClicked(img) {
    this.helperTools.OpenImageProduct().then(dataURI => {
      if (!img) {
        if (!this.ProductData.images) {
          this.ProductData['images'] = [];
        }
        this.ProductData.images.push({
          base64: dataURI,
          alt: "product image",
          description: "product image",
          action: "new"
        })
        return;
      }
      img.base64 = dataURI;
      if (img.base64 != 'new') {
        img.action = 'edited';
      }
    })
  }
  async onCategoryClicked() {
    let modal = await this.modalController.create({
      component: CategoryComponent, componentProps: {
        category_id: this.SelectedCat['category'].id
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
          let inputs = JSON.parse(this.SelectedCat['category']['inputs']);
          this.ProductInputs = this.ProductInputs.concat(inputs);
        }
        if (this.SelectedCat['subCategory'] && this.SelectedCat['subCategory']['inputs']) {
          let inputs = JSON.parse(this.SelectedCat['subCategory']['inputs']);
          this.ProductInputs = this.ProductInputs.concat(inputs);
        }
        if (this.SelectedCat['subSubCategory'] && this.SelectedCat['subSubCategory']['inputs']) {
          console.log(this.SelectedCat['subSubCategory']);
          let inputs = JSON.parse(this.SelectedCat['subSubCategory']['inputs']);
          this.ProductInputs = this.ProductInputs.concat(inputs);
        }

        this.buildIntialInputs();
        this.cat_sub_title = (this.SelectedCat['category'].name + ', ') +
      (this.SelectedCat['subCategory'].name ? this.SelectedCat['subCategory'].name : '')
      + ','
      + (this.SelectedCat['subSubCategory'] && this.SelectedCat['subSubCategory'].name ? this.SelectedCat['subSubCategory'].name : '')
        this.ProductData['category_id'] = data['data']['ids']['category_id'] ? data['data']['ids']['category_id'] : this.ProductData['category_id'];
        this.ProductData['subCategory_id'] = data['data']['ids']['subcategory_id'] ? data['data']['ids']['subcategory_id'] : this.ProductData['subCategort_id'];
        this.ProductData['subSubCategory_id'] = data['data']['ids']['subsubcategory_id'] ? data['data']['ids']['subsubcategory_id'] : this.ProductData['subSubCategory_id'];
      }
    })
  }
  async OnCustomizeClicked() {
    let modal = await this.modalController.create({ component: SelectOptionsComponent, componentProps: { inputs: this.ProductInputs } });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);
      if (data['data']) {
        this.ProductData['extraInput'] = data['data'];
      }
    })
  }
  buildIntialInputs() {
    if (this.ProductData.extraInput) {
      let productInputs = JSON.parse(this.ProductData.extraInput);
      console.log(this.ProductInputs);
      for (let i = 0; i < productInputs.length; i++) {
        for (let j = 0; j < this.ProductInputs.length; j++) {
          if (productInputs[i]['name'] == this.ProductInputs[j]['name']) {
            productInputs[i]['value'] = productInputs[i]['value'].map((el) => {
              el = el.replace(/\s/g, '');
              console.log(el);
              return el;
            })
            this.ProductInputs[j]['value'] = productInputs[i]['value'];
          }
        }
      }
    }
    // this.ProductData['extraInput'] = this.ProductData.extraInput.replace(/\s/g, '');
    

  }
  onEditClicked() {
    if (!this.ProductData['images'] || !this.ProductData['images'].length) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اضافه صوره واحده علي الاقل للمنتج');
      this.ProductForm.updateValueAndValidity();
      return;
    }
    if (this.ProductData['market'][0]['Market_Products'].Price_after && this.ProductData['market'][0]['Market_Products'].Price_after > this.ProductData['market'][0]['Market_Products'].Selling_price) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء كتابه السعر بعد الخصم اقل من السعر الأصلي');
      this.ProductForm.updateValueAndValidity();
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.editProduct(this.ProductData).subscribe(data => {
        console.log(data);
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          // this.helperTools.ShowAlertWithTranslation('Done', 'ProductEditedSuccessfully');
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل العنصر بنجاح');
          // this.navCtrl.setRoot('MyProductsPagde');
          this.router.navigateByUrl('/myproducts');
        } else {
          this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء التأكد من إتصالك بالأنترنت');
          this.ProductForm.updateValueAndValidity();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء التأكد من إتصالك بالأنترنت');
        //this.helperTools.showBadRequestAlert();
      })
    })
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
