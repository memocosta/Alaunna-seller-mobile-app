import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { MenuController, IonItemSliding, ModalController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { NotificationsPage } from '../notifications/notifications.page';
@Component({
  selector: 'app-users-products',
  templateUrl: './users-products.page.html',
  styleUrls: ['./users-products.page.scss'],
})
export class UsersProductsPage implements OnInit {

  MarketData = {} as any;
  ImgeBase = SharedClass.BASE_IMAGE_URL;
  Products = [];
  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: '', country_id: '' };
  subcategories = [];
  elementRef: ElementRef;
  countNotification = 0;
  selectedproducts_id = [];
  selectedproducts = [];
  type: any;
  OfferData: any;

  constructor(private menuController: MenuController,
    private authController: AuthService,
    private helperTools: HelperToolsService,
    private notiController: NotificationsPage,
    private modalController: ModalController,
    // public navParams: NavParams,
    private router: Router,
    private productController: ProductService,
    @Inject(ElementRef) elementRef: ElementRef) {
    this.menuController.enable(true);
    this.elementRef = elementRef;
    // marketcategory_id
  }

  ngOnInit() {
    // if add coupon
    // this.type = this.navParams.get('type');
    // ////////
    // if(this.navParams.get('offer')){
    //   this.OfferData = this.navParams.get('offer');
    // }
    this.MarketData = this.authController['MarketsData'][0];
    this.filterData.market_id = this.MarketData.id;
    this.loadMyroducts();
  }

  loadMyroducts() {
    if (!this.authController.MarketsData) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اضافه متجر');
      // this.navCtrl.setRoot('MarketCreatePage')
      this.router.navigate(['/add-store']);
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.getProducts('',
        this.filterData.subctegory_id,
        this.filterData.subsubcategory_id,
        this.filterData.market_id,
        this.filterData.status,
        this.filterData.offset,
        this.filterData.country_id).subscribe(data => {
          console.log(data, 'im prodactsssssssss');
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
            if (this.filterData.offset == 0) {
              this.Products = data['data']['rows'];
              this.productController.Products = data['data']['rows'];
              // this.filterdroducts = data['data']['rows'];
            } else {
              this.Products = this.Products.concat(data['data']['rows']);
              // this.filterdroducts = this.Products.concat(data['data']['rows']);
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

  onDelete(product) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.removeProduct(product.id).subscribe(data => {
        this.helperTools.DismissLoading()
        console.log(data);
        if (data['status'] == 'success') {

          this.helperTools.ShowAlertWithOkButton('تم', 'تم مسح المنتج بنجاح من قائمه المنتجات الخاصه بك');
          this.filterData.offset = 0;
          this.loadMyroducts();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

  onSelectProductChange(event, product) {
    console.log(event.detail.checked);
    console.log(product.id);
    if (event.detail.checked) {
      this.selectedproducts_id.push(product.id);
      this.selectedproducts.push(product);
    } else {
      this.selectedproducts_id = this.selectedproducts_id.filter(obj => obj !== product.id);
      this.selectedproducts = this.selectedproducts.filter(obj => obj.id !== product.id);
    }
    console.log(this.selectedproducts);
  }

  onChangeStatus(product, status) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.changeProductStatus(product.id, status).subscribe(data => {
        this.helperTools.DismissLoading()
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تغير حاله المنتج بنجاح');
          this.filterData.offset = 0;
          this.loadMyroducts();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

  onDonePreseed() {
    let products = {
      selectedproducts: this.selectedproducts,
      selectedproducts_id: this.selectedproducts_id
    };
    if (this.selectedproducts_id.length > 0)
      this.modalController.dismiss(products);
  }

  dismissModal() {
    this.modalController.dismiss();
  }




}
