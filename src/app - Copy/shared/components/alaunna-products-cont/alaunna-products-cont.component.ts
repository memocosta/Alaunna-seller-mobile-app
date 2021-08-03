import { Component, OnInit, ViewChild } from '@angular/core';
import { HelperToolsService } from '../../services/helper-tools.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { IonSlides, NavParams, ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alaunna-products-cont',
  templateUrl: './alaunna-products-cont.component.html',
  styleUrls: ['./alaunna-products-cont.component.scss'],
})
export class AlaunnaProductsContComponent implements OnInit {


  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  SelectedProducts = [];
  market_id = ''
  @ViewChild('mySlider', { static: false }) slides: IonSlides;

  constructor(private helperTools: HelperToolsService,
    private productsController: ProductService,
    private router: Router,
    private navParams: NavParams,
    private authController: AuthService, private modalController: ModalController) {
    this.SelectedProducts = this.navParams.get('products');
    this.market_id = this.authController.MarketsData[0]['id'];
    for (let i = 0; i < this.SelectedProducts.length; i++) {
      this.SelectedProducts[i]['id'] = '';
      this.SelectedProducts[i]['market_product'] = { product_id: this.SelectedProducts[i]['id'], market_id: this.market_id }
      // this.Products.push({ product_id: this.SelectedProducts[i]['id'], market_id: this.market_id });
    }
  }

  ngOnInit() {

  }
  onNextClicked(myslider) {
    myslider.slideNext();
  }
  onAddClicked() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productsController.addAwshnPrducts({ products: this.SelectedProducts }).subscribe(res => {
        this.helperTools.DismissLoading();
        console.log(res);
        if (res['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه منتجات الي منتجاتك من خلال منتجات الأونا');
          // this.navCtrl.popToRoot();
          this.modalController.dismiss({ status: 'success' })
        } else if (res['error']['name'] == 'SequelizeUniqueConstraintError') {
          this.helperTools.ShowAlertWithOkButton('خطأ', 'انت تمتلك هذا المنتج بالفعل')
        } else {
          this.helperTools.ShowAlertWithOkButton('خطأ', 'حدث خطأ اثناء اضافه المنتجات برجاء التأكد من كتابه كل البيانات بشكل صحيح')
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();;
      })
    })
  }

}
