import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push } from '@ionic-native/push/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//compeonets
import { PriceRequestReplayComponent } from './shared/components/price-request-replay/price-request-replay.component';
import { CategoryComponent } from './shared/components/category/category.component';
import { EmojiPickerComponent } from './shared/components/emoji-picker/emoji-picker';
import { SelectOptionsComponent } from './shared/components/select-options/select-options.component';
import { MapModelComponent } from './map-model/map-model.component';
import { IonicSelectableModule } from 'ionic-selectable';

import { MyProductsSelectComponent } from './my-products-select/my-products-select.component';
import { MyProductsSelect2Component } from './my-products-select2/my-products-select2.component';
import { PhotoComponent } from './photo/photo.component';
import { EditOfferModalComponent } from './edit-offer-modal/edit-offer-modal.component';
import { EditCouponModalComponent } from './edit-coupon-modal/edit-coupon-modal.component';

//native plugins
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { Toast } from '@ionic-native/toast/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { NotificationsPage } from './notifications/notifications.page';

import { RegisterSocialComponent } from './register-social/register-social.component';
import { ActiveComponent } from './active/active.component';
import { PasswordComponent } from './password/password.component';
import { CancelComponent } from './cancel/cancel.component';

@NgModule({
  declarations: [CancelComponent,PasswordComponent,ActiveComponent,RegisterSocialComponent,PhotoComponent,MyProductsSelectComponent,EditCouponModalComponent,MyProductsSelect2Component,EditOfferModalComponent,AppComponent, MapModelComponent, CategoryComponent, EmojiPickerComponent, SelectOptionsComponent, PriceRequestReplayComponent],
  entryComponents: [CancelComponent,PasswordComponent,ActiveComponent,RegisterSocialComponent,PhotoComponent,MyProductsSelectComponent,EditCouponModalComponent,MyProductsSelect2Component,EditOfferModalComponent,MapModelComponent, CategoryComponent, EmojiPickerComponent, SelectOptionsComponent, PriceRequestReplayComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    Camera,
    Facebook,
    GoogleAnalytics,
    Geolocation,
    Push,
    // FCM,
    NativeGeocoder,
    LocalNotifications,
    ImagePicker,
    AppVersion,
    Diagnostic,
    Toast,
    SocialSharing,
    NotificationsPage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
