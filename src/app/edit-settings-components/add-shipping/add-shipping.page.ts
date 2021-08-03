import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { HelperToolsService } from '../../shared/services/helper-tools.service';

@Component({
  selector: 'app-add-shipping',
  templateUrl: './add-shipping.page.html',
  styleUrls: ['./add-shipping.page.scss'],
})
export class AddShippingPage implements OnInit {
  isSubmitted = false;
  data: any;
  countries: [];
  filterCities = [];
  MarketData = {} as any;
  cities: [];
  constructor(public alertController: AlertController,
    private settingService: SettingsService,
    private router: Router,
    private authController: AuthService,
    private helperTools: HelperToolsService,

  ) { }
  getCountries() {
    this.settingService.getAllCountry().subscribe(res => {
      this.countries = res['data'].rows
      console.log(this.countries);
    })
  }
  onCountryChange() {
    var countries = this.data.country_id.map(function (x) {
      return parseInt(x, 10);
    });
    if(countries.includes(0)){
      this.filterCities = this.cities;
      this.data.country_id = [];
      for(let i = 0; i<this.countries.length; i++ ){
        this.data.country_id.push(this.countries[i]['id']+"");
      } 
    }else{
      this.filterCities = this.cities.filter(x => {
        return countries.includes(x['countryId']);
      });
    }
    this.data.city_id = [];
  }
  onCityChange(){
    var countries = this.data.country_id.map(function (x) {
      return parseInt(x, 10);
    });
    if(this.data.city_id.includes("0")){
      this.data.city_id = [];
      for(let i = 0; i<this.filterCities.length; i++ ){
        this.data.city_id.push(this.filterCities[i]['id']+"");
      }
    }
  }

  getCities() {
    this.settingService.getAllcities().subscribe(res => {
      this.cities = res['data'].rows
      console.log(this.cities);

    })
  }
  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];

    this.data = {
      user_id: this.MarketData.Owner_id,
      activate_delivery_option: 0,
      activate_payment_receipt: 0,

    };
    this.getCountries();
    this.getCities();
  }
  async presentAlert() {
    if (this.data.activate_delivery_option === 0) {
      this.data.activate_delivery_option = 1;

    } else {
      this.data.activate_delivery_option = 0;
    }
    console.log(this.data.activate_delivery_option)
    // if (this.data.activate_delivery_option === 1) {
    //   const alert = await this.alertController.create({
    //     header: 'خيارات الشحن',
    //     // subHeader: 'Subtitle',
    //     message: 'هذه الخدمه متوفره في باقه الااونا بلس',
    //     buttons: ['اختر باقة'],
    //   });
    //   await alert.present();
    //   let result = await alert.onDidDismiss();
    // }
  }
  async presentAlert2() {
    if (this.data.activate_payment_receipt === 0) {
      this.data.activate_payment_receipt = 1;
    } else {
      this.data.activate_payment_receipt = 0;
    }
    console.log(this.data.activate_payment_receipt)

  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
  onSubmit() {
    this.isSubmitted = true;
    var cities = this.data.city_id.map(function (x) {
      return parseInt(x, 10);
    });
    this.data.city_id = cities;
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {

      this.settingService.createShipping(this.data).subscribe(res => {
        console.log(res, 'im data');
        if (res['status'] == 'success') {
          this.helperTools.DismissLoading();

          this.router.navigate(['../deliver-setting'])

        }

      })
    })
    // console.log('onSubmit');

    // console.log(myForm.value);
  }
  noSubmit(e) {
    e.preventDefault();
  }
}
