import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { MarketService } from '../shared/services/market.service';
import { AuthService } from '../shared/services/auth.service';
import { LocationService } from '../shared/services/location.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MapModelComponent } from '../map-model/map-model.component';
import { SharedClass } from '../shared/Shared';
import { NotificationsPage } from '../notifications/notifications.page';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.page.html',
  styleUrls: ['./store-info.page.scss'],
})
export class StoreInfoPage implements OnInit {

  MarketForm: FormGroup;
  MarketData = {} as any;
  MarketCategoies = [];
  Countries = [];
  Cities = [];
  FilterdCities = [];

  ImageBase = SharedClass.BASE_IMAGE_URL;
  countNotification = 0;
  Products: any;
  usedCats= [];

  constructor(private helperTools: HelperToolsService,
    private marketController: MarketService,
    private AuthController: AuthService,
    private notiController: NotificationsPage,
    private locationController: LocationService,
    private productController: ProductService,
    private router: Router,
    private modalController: ModalController, private ngZone: NgZone) {

  }

  ngOnInit() {
    // this.ngZone.run(() => {
    //   this.MarketData =  this.AuthController.MarketsData[0];

    //  })
    this.getUsedCats();
    this.getMarketById();
    this.initForm();
    this.getAllNotification();
  }
  getUsedCats(){
    console.log(this.productController.Products);
    const products = this.productController.Products;
    this.usedCats = [];
    for (let index = 0; index < products.length; index++) {
      let element = products[index];
      if(this.usedCats.indexOf(element.category_id) === -1){
        this.usedCats.push(element.category_id);
      }
    }
    console.log(this.usedCats);
  }
  getMarketById() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.marketController.getMarketById(this.AuthController.MarketsData[0].id).subscribe(data => {
        this.helperTools.DismissLoading();
        console.log(data);
        if (data['status'] == 'success') {
          this.MarketData = data['data'];
          let categories = data['data']['categories'];
          this.MarketData.marketcategory_id = [];
          for (let index = 0; index < categories.length; index++) {
            let element = categories[index];
            this.MarketData.marketcategory_id.push(element.id);
          }
          console.log(this.MarketData);
          this.LoadAllCategories();
          this.loadAllCities();
          this.loadAllCountry();
          this.onCountryChange(this.MarketData['Country_id']);
          if (!this.MarketData['Image']) {
            this.MarketData['Image'] = {}
          }
          if (!this.MarketData['cover']) {
            this.MarketData['cover'] = {};
          }
        } else {

        }
      }, err => {

      })
    })
  }
  initForm() {
    this.MarketForm = new FormGroup({
      name: new FormControl(this.MarketData.name, [Validators.required]),
      phone: new FormControl(this.MarketData.phone, [Validators.required]),
      marketcategory_id: new FormControl({ value: this.MarketData.marketcategory_id }, [Validators.required]),
      Country_id: new FormControl(this.MarketData.Country_id, [Validators.required]),
      City_id: new FormControl(this.MarketData.City_id, []),
      address: new FormControl(this.MarketData.address, []),
      delivery_type: new FormControl(this.MarketData.delivery_type, [Validators.required]),
      delivery_terms: new FormControl(this.MarketData.delivery_terms, []),
      delivery_cost: new FormControl(this.MarketData.delivery_cost, [])
    }, { updateOn: 'change' })

  }
  OpenImage(ImageKey) {
    let width = 350,
      height = 350;
    if (ImageKey == "cover") {
      width = 1024;
      height = 512;
    }
    this.helperTools.OpenImage(width, height).then(data => {
      if (this.MarketData[ImageKey]) {
        if (this.MarketData[ImageKey].action == 'edited') {
          this.MarketData[ImageKey].base64 = data;
        } else {
          this.MarketData[ImageKey].action = 'new';
          this.MarketData[ImageKey].base64 = data;
        }
      } else {
        this.MarketData[ImageKey] = {
          base64: data,
          alt: "alaunna market",
          description: "alaunna market"
        };
      }
    });
  }
  LoadAllCategories() {
    this.marketController.loadAllMarketCategory().subscribe(
      data => {
        if (data["status"] == "success") {
          this.MarketCategoies = data["data"]["rows"];
          // this.MarketData["marketcategory_id"] = this.AuthController.SellerData["Seller"].category_market;
        }
      },
      err => {
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  loadAllCountry() {
    this.locationController.getAllCountry().subscribe(
      data => {
        if (data["status"] == "success") {
          this.Countries = data["data"]["rows"];
          this.MarketForm.updateValueAndValidity();
        } else {
          this.helperTools.showBadRequestAlert();
        }
      },
      err => {
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  loadAllCities() {
    this.locationController.getAllcities().subscribe(
      data => {
        if (data["status"] == "success") {
          this.Cities = data["data"]["rows"];
          this.FilterdCities = data["data"]["rows"];
          this.MarketForm.updateValueAndValidity();
        } else {
          this.helperTools.showBadRequestAlert();
        }
      },
      err => {
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  onCountryChange(ev) {
    this.MarketData.Country_id = ev;
    this.FilterdCities = this.Cities.filter(x => {
      return x.countryId == this.MarketData.Country_id;
    });
    this.MarketForm.updateValueAndValidity();
  }
  async onMapClicked() {
    let modal = await this.modalController.create({ component: MapModelComponent });
    modal.present();
    modal.onDidDismiss().then(body => {
      if (body) {
        let add = body.data;
        console.log(add);
        //this.MarketData['address'] = data['address'];
        this.MarketData.lat = add.lat;
        this.MarketData.lng = add.lng;
        console.log(this.MarketData);
      }
    })
  }
  onMarketCreate() {
    if (!this.MarketForm.valid) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اكمال البياناات المطلوبه');
      this.MarketForm.updateValueAndValidity();
      return;
    }
    if (!this.MarketData['address']) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اختيار مكان المتجر');
      this.MarketForm.updateValueAndValidity();
      return;
    }
    if (!this.MarketData['lat'] || !this.MarketData['lng']) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء تحديد الموقع الجغرافي الخاص بالمتجر');
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      console.log(this.MarketData);
      this.marketController.editMarket(this.MarketData).subscribe(
        data => {
          console.log(data)
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            this.helperTools.ShowAlertWithOkButton(
              "تم",
              "تم تعديل المتجر بنجاح"
            );
            this.router.navigate(['/home']);
          } else {
            this.helperTools.ShowAlertWithOkButton(
              "خطأ",
              "برجاء كتابه كل البيانات المطلوبه"
            );
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    });
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
