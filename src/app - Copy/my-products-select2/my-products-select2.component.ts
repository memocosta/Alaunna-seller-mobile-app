import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { MenuController, IonItemSliding, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { NotificationsPage } from '../notifications/notifications.page';


@Component({
  selector: 'app-my-products-select2',
  templateUrl: './my-products-select2.component.html',
  styleUrls: ['./my-products-select2.component.scss'],
})
export class MyProductsSelect2Component implements OnInit {

  MarketData = {} as any;
  ImgeBase = SharedClass.BASE_IMAGE_URL;
  Products = [];
  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: '', country_id: '' };
  subcategories = [];
  elementRef: ElementRef;
  countNotification = 0;
  selectedproducts = [];
  offer_id: any;
  coupon_id: any;
  type: any;
  OfferData: any;

  constructor(private menuController: MenuController,
    private authController: AuthService,
    private helperTools: HelperToolsService,
    private notiController: NotificationsPage,
    private navParams: NavParams,
    private modalController: ModalController,
    private router: Router,
    private productController: ProductService,
    @Inject(ElementRef) elementRef: ElementRef) {
    this.menuController.enable(true);
    this.elementRef = elementRef;
    // marketcategory_id
  }

  ngOnInit() {
    // if edit offer
    this.offer_id = this.navParams.get('offer_id');
    if(this.navParams.get('offer')){
      this.OfferData = this.navParams.get('offer');
    }
    // if edit coupon
    this.type = this.navParams.get('type');
    this.coupon_id = this.navParams.get('coupon_id');
    ///////
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
      if (this.type == 'coupon') {
        this.productController.CouponProductsUpdateList(
          this.filterData.market_id, this.coupon_id).subscribe(data => {
            console.log(data);
            this.helperTools.DismissLoading();
            if (data['status'] == 'success') {
              this.Products = data['data']['rows'];
              this.selectedproducts = data['data']['selectedproducts'];
            } else {
              this.helperTools.showBadRequestAlert();
            }
          }, err => {
            console.log(err);
            this.helperTools.DismissLoading();
            this.helperTools.showBadRequestAlert();
          });
      } else {
        this.productController.getMarketProductNoOfferWithOffer(
          this.filterData.market_id, this.offer_id).subscribe(data => {
            console.log(data);
            this.helperTools.DismissLoading();
            if (data['status'] == 'success') {
              this.Products = data['data']['rows'];
              this.selectedproducts = data['data']['selectedproducts'];
            } else {
              this.helperTools.showBadRequestAlert();
            }
          }, err => {
            console.log(err);
            this.helperTools.DismissLoading();
            this.helperTools.showBadRequestAlert();
          });
      }

    })
  }

  onSelectProductChange(event, id) {
    console.log(event.detail.checked);
    console.log(id);
    if (event.detail.checked) {
      this.selectedproducts.push(id);
    } else {
      this.selectedproducts = this.selectedproducts.filter(obj => obj !== id);
    }
    console.log(this.selectedproducts);
  }

  onDonePreseed() {
    let products = this.selectedproducts;
    this.modalController.dismiss(products);
  }

  dismissModal(){
    this.modalController.dismiss();
  }

}
