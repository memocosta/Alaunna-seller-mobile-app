import { Component, OnInit } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { ProductService } from '../shared/services/product.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { AuthService } from '../shared/services/auth.service';
import { ModalController } from '@ionic/angular';
import { AlaunnaProductsContComponent } from '../shared/components/alaunna-products-cont/alaunna-products-cont.component';
import { Router } from '@angular/router';
import { CategoryComponent } from '../shared/components/category/category.component';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-alauuna-products',
  templateUrl: './alauuna-products.page.html',
  styleUrls: ['./alauuna-products.page.scss'],
})
export class AlauunaProductsPage implements OnInit {
  SelectedProduct = {} as any;
  SearchData = {subcategory_id : '' , category_id : '' , offset : 0 , name : '' , subsubcategory_id : ''} as any;
  SubCategories;
  SubSubCategories;

  Products;
  filterdroducts;
  FilterdSubSubCategory;

  offset = 0;
  DisplaySelectes = false;
  ImageBase = SharedClass.BASE_IMAGE_URL;
  SelectedSubCategoryIndex;

  cat_sub_title = '';

  countNotification = 0;
  constructor(
    private productController: ProductService,
    private helperTools: HelperToolsService, 
    private notiController: NotificationsPage,
    private auth: AuthService,
    private modalController : ModalController , private router : Router) {
    // this.loadProductCategory();
    console.log(this.auth.MarketsData);
    this.SearchData['category_id'] = this.auth.MarketsData[0]['marketcategory_id'];
    this.loadAwshnProducts();
  }

  ngOnInit() {
    console.log('ionViewDidLoad AwshnProductsPage');
    this.getAllNotification();
  }
  loadAwshnProducts() {
    // this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.getAllAwshnProducts(this.offset, this.SearchData['category_id'],this.SearchData['subcategory_id'] , this.SearchData['subsubcategory_id'] ,this.SearchData['name']).subscribe(res => {
        console.log(res);
        // this.helperTools.DismissLoading();
        if (res['status'] == 'success') {
          if (this.offset == 0) {
            this.Products = res['data'];
          } else {
            this.Products = this.Products.concat(res['data']);;
          }
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        // this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    // })
  }
  onLoadMore() {
    this.offset++;
    this.loadAwshnProducts();
  }
  onSelelctChangeForProduct(index) {
    console.log(this.Products);
    this.Products[index]['selected'] = this.SelectedProduct[this.Products[index].id];
  }
  onProuductPressed(product) {
    if (!this.DisplaySelectes) {
      this.DisplaySelectes = true;
    }
    //this.SelectedProduct['product.id'] = true;
  }
  async onAddClicked() {
    var Selectedroducts = this.Products.filter(x => {
      return x.selected;
    });
    this.productController.SelectedProducts = Selectedroducts;
    let modal = await this.modalController.create({component : AlaunnaProductsContComponent , componentProps : {products : Selectedroducts}})
    modal.present();
    modal.onDidDismiss().then(data => {
      if (data['data']['status'] == 'success'){
        this.router.navigate(['home']);
      }
    })
  }
  loadData(event) {
    this.offset++;
    this.loadAwshnProducts();
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
    }, 500);
  }
  async onCategoryClicked() {
    let modal = await this.modalController.create({
      component: CategoryComponent, componentProps: {
        category_id: this.SearchData.category_id
      }
    });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);
      if (data && data['data']) {
        if (data['data']['selectedOBJ']['subcategory'].name){
          this.cat_sub_title = '';
          this.cat_sub_title += data['data']['selectedOBJ']['subcategory'].name + ', ';
          this.SearchData.subcategory_id = data['data']['ids']['subcategory_id'];
        }
        if (data['data']['selectedOBJ']['subsubcategory'].name){
          this.cat_sub_title += data['data']['selectedOBJ']['subsubcategory'].name + ', ';
          this.SearchData.subsubcategory_id = data['data']['ids']['subsubcategory_id'];
        }
        this.loadAwshnProducts();
      }
    })
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
