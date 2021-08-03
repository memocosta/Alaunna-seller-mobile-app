import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ViewController } from '@ionic/core';
import { ModalController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-map-model',
  templateUrl: './map-model.component.html',
  styleUrls: ['./map-model.component.scss'],
})
export class MapModelComponent implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  lat;
  lng;
  constructor(private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private modalController: ModalController) { }

  ngOnInit() {
    //this.loadMap();
    this.openMap();
  }
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      //this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map);
        //this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
      defaultLocale: 'ar'
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = " العنوان غير متاح ";
      });

  }
  openMap() {
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
        this.lat = event.latLng.lat();
        this.lng = event.latLng.lng();
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
      });
    });
  }
  onSaveClicked() {
    this.modalController.dismiss({ lat: this.lat, lng: this.lng, address: this.address });
  }
  onCancel() {
    this.modalController.dismiss();
  }

}
