import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { MenuController, IonItemSliding, AlertController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-myproducts',
  templateUrl: './myproducts.page.html',
  styleUrls: ['./myproducts.page.scss'],
})
export class MyproductsPage implements OnInit {

  MarketData = {} as any;
  ImgeBase = SharedClass.BASE_IMAGE_URL;
  Products = [];
  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: 'all', country_id: '' };
  subcategories = [];
  elementRef: ElementRef;
  countNotification = 0;

  constructor(private menuController: MenuController,
    private authController: AuthService,
    private helperTools: HelperToolsService,
    private notiController: NotificationsPage,
    private router: Router,
    private alertController: AlertController,
    private productController: ProductService, 
    @Inject(ElementRef) elementRef: ElementRef) {
    this.menuController.enable(true);
    this.elementRef = elementRef;
    // marketcategory_id
  }

  async presentAlert() {
    const alert = await this.alertController.create({
    message: 'Low battery',
    subHeader: '10% of battery remaining',
    buttons: ['Dismiss']
   });
   await alert.present(); 
}

  async presentConfirm() {
    let alert = await this.alertController.create({
      message: 'Do you want to buy this book?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Buy',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    await alert.present();
  }
  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];
    this.filterData.market_id = this.MarketData.id;
    //this.filterData.category_id = this.MarketData['marketcategory_id'];
    this.LoadSubCategories();
    this.loadMyroducts();
    this.getAllNotification();
  }
  LoadSubCategories() {
    this.productController.getProductSubCateogry(this.filterData.category_id).subscribe(data => {
      console.log(data);
      if (data['status'] == 'success') {
        this.subcategories = data['data']['rows'];
      } else {
        this.helperTools.showBadRequestAlert();
      }
    }, err => {
      this.helperTools.showBadRequestAlert();
    });
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
          console.log(data);
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
  async onDelete(product) {
    let alert = await this.alertController.create({
      message: 'هل أنت متاكد من مسح المنتج؟',
      buttons: [
        {
          text: 'ألغاء',
          role: 'cancel'
        },
        {
          text: 'تأكيد',
          handler: () => {
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
        }
      ]
    });
    await alert.present();
    
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
  openSliding(id , item_id) {
    let slideingElement = document.getElementById(id);
    let ItemElement = document.getElementById(item_id);
    console.log(slideingElement);
    // slideingElement['open']('end').then(__ => {
    //   console.log(__);
    // });
    slideingElement.classList.add('item-sliding-active-slide');
    slideingElement.classList.add('item-sliding-active-options-start');
    ItemElement.style.transitionDuration = '.2s';
    ItemElement.style.transform = 'translate3d(200px,0,0)';
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
