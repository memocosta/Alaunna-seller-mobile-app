import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { MarketService } from '../shared/services/market.service';
import { AuthService } from '../shared/services/auth.service';
import { LocationService } from '../shared/services/location.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MapModelComponent } from '../map-model/map-model.component';
import { ActiveComponent } from '../active/active.component';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.page.html',
  styleUrls: ['./add-store.page.scss'],
})
export class AddStorePage implements OnInit {

  MarketForm: FormGroup;
  MarketData = {} as any;
  MarketCategoies = [];
  Countries = [];
  Cities = [];
  FilterdCities = [];
  constructor(private helperTools: HelperToolsService,
    private marketService: MarketService,
    private marketController: MarketService,
    private AuthController: AuthService,
    private locationController: LocationService,
    private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    //new activate status check//
    let data = this.AuthController['SellerData'];
    console.log(data);
    if(data["status"] == 'not_active'){
      console.log(1111111111111);
      this.showActiveModalLogin(data);
    }
    ////////////
    this.MarketForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [Validators.required]),
      marketcategory_id: new FormControl(null, [Validators.required]),
      Country_id: new FormControl(null, [Validators.required]),
      City_id: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      delivery_type: new FormControl(null, [Validators.required]),
      delivery_terms: new FormControl(null, []),
      delivery_cost: new FormControl(null, [])
    }, { updateOn: 'change' })
    this.LoadAllCategories();
    this.loadAllCities();
    this.loadAllCountry();
  }
  async showActiveModalLogin(data) {
    let modal = await this.modalController.create({ component: ActiveComponent, componentProps: { data: data , type: 'login' } });
    modal.present();
  }
  OpenImage(ImageKey) {
    let width = 350,
      height = 350;
    if (ImageKey == "cover") {
      width = 1024;
      height = 512;
    }
    this.helperTools.OpenImage(width, height).then(data => {
      this.MarketData[ImageKey] = {
        base64: data,
        alt: "alaunna market",
        description: "alaunna market"
      };
    });
  }
  LoadAllCategories() {
    this.marketController.loadAllMarketCategory().subscribe(
      data => {
        console.log(data);
        if (data["status"] == "success") {
          this.MarketCategoies = data["data"]["rows"];
          console.log(this.AuthController.SellerData);
          this.MarketData["marketcategory_id"] = [];
          this.MarketData["marketcategory_id"].push(this.AuthController.SellerData["Seller"].category_market);
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
        } else {
          this.helperTools.showBadRequestAlert();
        }
      },
      err => {
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  onCountryChange() {
    this.FilterdCities = this.Cities.filter(x => {
      return x.countryId == this.MarketData.Country_id;
    });
  }
  async onMapClicked() {
    let modal = await this.modalController.create({ component: MapModelComponent });
    modal.present();
    modal.onDidDismiss().then(data => {
      if (data['data']) {
        //this.MarketData['address'] = data['data']['address'];
        this.MarketData['lat'] = data['data']['lat'];
        this.MarketData['lng'] = data['data']['lng'];
      }
    })
  }
  onMarketCreate() {
    console.log(this.MarketData);
    if (!this.MarketForm.valid) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اكمال البياناات المطلوبه');
      this.MarketForm.updateValueAndValidity();
      return;
    }
    if (!this.MarketData['cover']) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اختيار صوره الكفر الخاص بالمتجر');
      return;
    }
    if (!this.MarketData['lat']||!this.MarketData['lng']) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء تحديد الموقع الجغرافي الخاص بالمتجر');
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.MarketData["Owner_id"] = this.AuthController.SellerData["id"];
      this.MarketData['status'] = 'active';
      // this.MarketData['lat'] = 30.3000
      // this.MarketData['lng'] = 31.32222;
      // if (!this.MarketData['Country_id'] || !this.MarketData['City_id']){
      //   this.helperTools.showToast('top', 'برجاء اختيار المحافظه والمدينه', 3000, 'none');
      //   return;
      // }
      this.MarketData['Image'] = this.MarketData['cover'];
      console.log(this.MarketData);
      this.marketController.createMarket(this.MarketData).subscribe(
        data => {
          this.helperTools.DismissLoading();
          console.log(data);
          if (data["status"] == "success") {
            this.helperTools.ShowAlertWithOkButton(
              "تم",
              "تم اضافه المتجر بنجاح"
            );
            //this.AuthController.SellerData['Seller']['NumberOfMarkets']++;
            //this.AuthController.MarketsData = [data['data']];
            // this.navCtrl.setRoot("LoginPage");
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
}
