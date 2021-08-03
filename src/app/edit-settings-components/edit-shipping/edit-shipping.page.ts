import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { HelperToolsService } from '../../shared/services/helper-tools.service';

@Component({
  selector: 'app-edit-shipping',
  templateUrl: './edit-shipping.page.html',
  styleUrls: ['./edit-shipping.page.scss'],
})
export class EditShippingPage implements OnInit {
  isSubmitted = false;
  selected_countries = [];
  selected_cities = [];
  data = {
    activate_delivery_option: 0,
    activate_payment_receipt: 0,
    country_id: [],
    city_id: [],
  };
  id;
  countries: [];
  filterCities = [];
  MarketData = {} as any;
  cities: [];
  constructor(public alertController: AlertController,
    private settingService: SettingsService,
    private router: Router,
    private authController: AuthService,
    private helperTools: HelperToolsService,
    private route: ActivatedRoute

  ) { }
  getCountries() {
    this.settingService.getAllCountry().subscribe(res => {
      let countries = res['data'].rows
      for (let i = 0; i < countries.length; i++) {
        countries[i].selected = this.data['country_id'].includes(countries[i]['id'])
      }
      this.countries = countries
      console.log(this.countries);

    })
  }
  onCountryChange(e) {
    let arr = e.target.value;
    console.log(arr);
    this.data['country_id'] = arr;
    var countries = this.data['country_id'].map(function (x) {
      return parseInt(x, 10);
    });
    console.log(countries);
    this.filterCities = this.cities.filter(x => {
      return countries.includes(x['countryId']);
    });
    console.log(this.filterCities);
  }
  onCityChange(e) {
    this.data['city_id'] = e.target.value;

  }
  getCities() {
    this.settingService.getAllcities().subscribe(res => {
      this.cities = res['data'].rows;
      this.filterCities = res['data'].rows;
      console.log(this.cities);

    })
  }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.MarketData = this.authController['MarketsData'][0];

    // this.data = {
    //   user_id: this.MarketData.Owner_id,
    //   activate_delivery_option: 0,
    //   activate_payment_receipt: 0,

    // };
    this.getCities();

    this.getShipping(this.MarketData.Owner_id, this.id)

  }
  getShipping(user_id, id) {
    // this.helperTools.ShowLoadingSpinnerOnly().then(__ => {

    this.settingService.get_shipping(user_id).subscribe(res => {
      let shippings = res['data']['rows'];
      this.data = shippings.filter(ship => ship.id == id)[0];
      let countries = [];
      let cities = [];
      for (let i = 0; i < this.data['Shipping_Location'].length; i++) {
        if (!this.selected_countries.includes(this.data['Shipping_Location'][i].country_id.toString())) {
          this.selected_countries.push(this.data['Shipping_Location'][i].country_id.toString());
          countries.push(this.data['Shipping_Location'][i].country_id)
        }
        if (!this.selected_cities.includes(this.data['Shipping_Location'][i].city_id.toString())) {
          this.selected_cities.push(this.data['Shipping_Location'][i].city_id.toString());
          cities.push(this.data['Shipping_Location'][i].city_id)
        }
      }
      this.data['country_id'] = countries;
      this.data['city_id'] = cities;
      this.getCountries();
    })

    // })
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
    var cities = this.data['city_id'].map(function (x) {
      return parseInt(x, 10);
    });
    this.data['city_id'] = cities;
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {

      this.settingService.updateShipping(this.data).subscribe(res => {
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
