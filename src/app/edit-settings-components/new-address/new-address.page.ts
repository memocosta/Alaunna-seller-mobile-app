import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HelperToolsService } from 'src/app/shared/services/helper-tools.service';

declare var google;

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.page.html',
  styleUrls: ['./new-address.page.scss'],
})
export class NewAddressPage implements OnInit {
  isSubmitted = false;
  countries: [];
  cities: [];
  data: any;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  lat;
  lng;
  MarketData = {} as any;

  constructor(public alertController: AlertController,
    private settingService: SettingsService,
    private router: Router,
    private geolocation: Geolocation,
    public toastController: ToastController,
    private authController: AuthService,
    private helperTools: HelperToolsService,

  ) { }

  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];

    this.data = {
      // name:مصنع عارف للملابس
      // address:ميامي جمال عبد النا أسفل كوبري ٤٥شارع جمال عبد النا برج↵الرحمه عماره١
      latitude: 27.78995,
      longitude: 30.215,
      // country_id:17
      // city_id:173
      user_id: this.MarketData.Owner_id

    };
    this.getCountries();
    this.openMap();
  }
  getCountries() {
    this.settingService.getAllCountry().subscribe(res => {
      this.countries = res['data'].rows
      console.log(this.countries);
    })
  }
  getCities(event) {
    console.log(event.detail.value)
    this.settingService.filtercitiesAccourdingToCountryID(event.detail.value).subscribe(res => {
      this.cities = res['data'].rows
      console.log(this.countries);
    })
  }
  openMap() {
    console.log(3);
    this.geolocation.getCurrentPosition().then((resp) => {
      let latlong = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let options = {
        center: latlong,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "red" }]
          }
        ]
      };
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.map = new google.maps.Map(this.mapElement.nativeElement, options);
      let marker = new google.maps.Marker({
        position: latlong,
        map: this.map,
        draggable: true
      });
      marker.addListener("dragend", event => {
        this.data.latitude = event.latLng.lat();
        this.data.longitude = event.latLng.lng();
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
      });
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {

      this.settingService.createAddress(this.data).subscribe(res => {
        this.presentToast(res['message']);
        console.log(res, 'im data');
        console.log(res['status']);
        if (res['status'] == 'success') {
          this.helperTools.DismissLoading();
          this.helperTools.ShowAlertWithOkButton('استلام الطلبات', 'تم إضافة عنوان جديد بنجاح');

          this.router.navigate(['../edit-store'])
        }
      });
    });
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: "success"
    });
    toast.present();
  }
  noSubmit(e) {
    e.preventDefault();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK'],
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
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
}
