
import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { AuthService } from '../shared/services/auth.service';
import { SharedClass } from '../shared/Shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsPage } from '../notifications/notifications.page';
import { MarketService } from '../shared/services/market.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit  {
  settingData = {} as any;
  // countNotification = 0;
  
  UserData = {} as any;
  ImageBase = SharedClass.BASE_IMAGE_URL;
  userWantToEdit = true;
  RegisterationData = { } as any;
  RegisterForm : FormGroup;
  countNotification = 0;
  MarketData: any;
  block1: boolean = true;
  block2: boolean = true;
  block3: boolean = true;
  block4: boolean = true;

  openning_hours = {"Sunday":{},"Monday":{},"Tuesday":{},"Wednesday":{},"Thursday":{},"Friday":{},"Saturday":{}};

  constructor(private helperTools: HelperToolsService,
    private notiController: NotificationsPage, 
    private marketController: MarketService,
    private authControlelr: AuthService,
    private diagnostic: Diagnostic,
    ) { }

  ngOnInit() {
    this.checkIfUserAllowCamera();
    this.checkIfUserAllowLocation();
    this.checkIfUserEnableNotification();
    this.getAllNotification();

    this.UserData = this.authControlelr.SellerData;
    this.UserData.password = null;
    this.MarketData =  this.authControlelr.MarketsData[0];
    this.MarketData.oppning_hours = JSON.parse(this.MarketData.oppning_hours);
    if(typeof this.MarketData.oppning_hours !== 'object' || !('Sunday' in this.MarketData.oppning_hours)){
      this.MarketData.oppning_hours = this.openning_hours;
    }
    
    console.log(this.UserData);
    console.log(this.MarketData);
    this.initForm();
    this.getAllNotification();
  }

  checkIfUserEnableNotification() {
    this.diagnostic.isRemoteNotificationsEnabled().then(data => {
      if (data) {
        this.settingData['recive_notification'] = true;
      } else {
        this.settingData['recive_notification'] = true;
      }
    })
  }
  checkIfUserAllowLocation() {
    this.diagnostic.isLocationAvailable().then(data => {
      if (data) {
        this.settingData['location'] = true;
      } else {
        this.settingData['location'] = false;
      }
    })
  }
  checkIfUserAllowCamera() {
    this.diagnostic.isCameraAuthorized().then(data => {
      if (data) {
        this.settingData['camera'] = true;
      } else {
        this.settingData['camera'] = false;
      }
    })
  }
  RequestCameraAuthriezed() {
    this.diagnostic.requestCameraAuthorization().then(__ => {

    })
  }
  RequestLocationAuth() {
    this.diagnostic.requestLocationAuthorization().then(__ => {

    })
  }
  RequestNotificationAuth() {
    this.diagnostic.requestLocationAuthorization().then(__ => {

    })
  }
  initForm (){
    this.RegisterForm = new FormGroup({
      name : new FormControl(null , [Validators.required]),
      email : new FormControl(null ),
      phone : new FormControl(null , [Validators.required , Validators.minLength(11) , Validators.maxLength(11)]),
      password : new FormControl(null , [Validators.required]),
      new_password : new FormControl(null , []),
    } , {updateOn : 'change'})
  }
  onUserEditClicked(){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.authControlelr.EditUserProfile(this.UserData).subscribe(
        data => {
          console.log(data)
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            this.helperTools.ShowAlertWithOkButton(
              "تم",
              "تم التعديل بنجاح"
            );
            this.block1 = true;
          } else {
            this.helperTools.ShowAlertWithOkButton(
              "خطأ",
              data['message']
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

  onMarketEditClicked(){
    this.MarketData.oppning_hours = JSON.stringify(this.MarketData.oppning_hours);
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      console.log(this.MarketData);
      this.marketController.editMarket(this.MarketData).subscribe(
        data => {
          console.log(data)
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            this.helperTools.ShowAlertWithOkButton(
              "تم",
              "تم التعديل بنجاح"
            );
            this.block1 = true;
            this.block2 = true;
            this.block3 = true;
            this.block4 = true;
            this.MarketData.oppning_hours = JSON.parse(this.MarketData.oppning_hours);
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
