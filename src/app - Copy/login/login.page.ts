import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { EventEmitterService } from '../shared/services/event-emitter.service';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook/ngx';
import { RegisterSocialComponent } from '../register-social/register-social.component';
import { ActiveComponent } from '../active/active.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  LoginForm: FormGroup;
  LoginData = {} as any;
  LoginTest = {} as any;
  //ahmed face
  isLoggedIn = false;
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  user_id: any;
  err1 = "err1";
  err2 = "err2";
  err3 = "err3";
  users_str: string;
  user_data: any;
  fb_user_id: any;
  fb_name: any;
  fb_email: any;
  res: any;
  ////////////

  constructor(private helperTools: HelperToolsService,
    private oneSignal: OneSignal,
    private AuthControllelr: AuthService,
    private storag: Storage,
    private router: Router,
    private push: Push,
    private MenuController: MenuController,
    private eventEmiiter: EventEmitterService,
    private fb: Facebook,
    private modalController: ModalController,
    private storage: Storage) {
    //ahmed face
    fb.getLoginStatus()
      .then(res => {
        console.log(res.status);
        if (res.status === 'connect') {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => {
        this.err1 = e;
      });
    /////////////
    this.MenuController.enable(false, 'first');
  }
  forgetPassword() {
    if(typeof(this.LoginData.phone) != undefined && this.LoginData.phone != "" && this.LoginData.phone){
      console.log(this.LoginData.phone);
      let data = {};
      data['phone'] = this.LoginData.phone;
      this.showActiveModalForget(data)
    }else{
      this.helperTools.ShowAlertWithOkButton(
        "خطأ",
        "برجاء أدخال رقم الهاتف الخاص بك أولا"
      );
    }
  }
  async showActiveModalForget(data) {
    let modal = await this.modalController.create({ component: ActiveComponent, componentProps: { data: data , type: 'forget' } });
    modal.present();
  }

  // ahmed face
  fbLogin() {
    console.log(11111111111111);
    this.fb.login(['public_profile', 'email'])
      .then(res => {
        this.res = JSON.stringify(res);
        if (res.status === 'connected') {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
          this.user_id = res.authResponse.userID;
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => {
        this.err2 = JSON.stringify(e);
      });
  }
  getUserDetail(userid: any) {
    this.fb.api('/' + userid + '/?fields=id,email,name', [])
      .then(res => {
        console.log(res);
        this.users = res;
        this.users_str = JSON.stringify(res);
        this.LoginData.facebook_id = this.users.id;
        this.LoginData.name = this.users.name;
        this.LoginData.email = this.users.email;
        this.onLoginFb();
      })
      .catch(e => {
        console.log(e);
        this.err3 = JSON.stringify(e);
      });
  }
  //////////

  onLoginFb() {
    // this.LoginData.facebook_id = 1146618785678438;
    // this.LoginData.name = 'ahmed kamal';
    // this.LoginData.email = 'a7medkamal775@gmail.com';
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.AuthControllelr.sellerLoginSocial(this.LoginData).subscribe(
        data => {
          console.log(data);
          this.helperTools.DismissLoading();
          if (
            data["status"] == "success"
          ) {
            console.log(data);
            this.AuthControllelr.SellerData = data["data"];
            this.AuthControllelr.MarketsData = data["data"]["markets"];
            // if (this.LoginData["remeber_me"]) {
            this.storag.set("token", data["data"]["token"]).then(__ => {
              this.eventEmiiter.emitChange({ event_name: 'uerLogin' });
              // if(data["data"]["status"] == 'not_active'){
              //   this.showActiveModalLogin(data);
              // }
              if (!data["data"]["markets"] || !data["data"]["markets"][0]) {
                this.helperTools.ShowAlertWithOkButton(
                  "خطأ",
                  "يجب عليك اضافه المتجر الخاص بك"
                );
                this.router.navigate(['/add-store']);
                return;
              }
              this.router.navigate(['/home']);
              this.oneSignal.sendTags({
                user_id: this.AuthControllelr.SellerData.id,
                market_id: this.AuthControllelr.MarketsData[0].id,
                category: "seller"
              });
            });
            // }
          } else {
            console.log(data);
            if (data['message'] == 'Not found') {
              //////register New//////
              this.showRegisterSocialModal();
            } else if (data['message'] == 'customer') {
              this.helperTools.ShowAlertWithOkButton(
                "خطأ",
                "لا يحق لك التسجيل بهذا الحساب لانه مسجل سابقا كمستهلك"
              );
            } else {
              this.helperTools.showBadRequestAlert();
            }
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
      // });
    });
  }
  async showActiveModalLogin(data) {
    let modal = await this.modalController.create({ component: ActiveComponent, componentProps: { data: data , type: 'login' } });
    modal.present();
  }
  async showRegisterSocialModal() {
    let modal = await this.modalController.create({ component: RegisterSocialComponent, componentProps: { LoginData: this.LoginData } });
    modal.present();
  }

  ngOnInit() {
    this.initForm();
    this.getDeviceID();
  }
  initForm() {
    this.LoginForm = new FormGroup({
      phone: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      password: new FormControl(null, [Validators.required]),
      remeber_me: new FormControl(null, [])
    }, { updateOn: 'change' })
  }
  onLoginPressed() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      // this.oneSignal.getIds().then(id => {
      //   this.LoginData["device_id"] = id.userId;
      this.LoginData["category"] = "seller";
      this.AuthControllelr.Login(this.LoginData).subscribe(
        data => {
          console.log(data);
          this.helperTools.DismissLoading();
          if (
            data["status"] == "success" &&
            data["data"]["category"] == "seller"
          ) {
            console.log(data);
            this.AuthControllelr.SellerData = data["data"];
            this.AuthControllelr.MarketsData = data["data"]["markets"];
            // if (this.LoginData["remeber_me"]) {
            this.storag.set("token", data["data"]["token"]).then(__ => {
              this.eventEmiiter.emitChange({ event_name: 'uerLogin' });
              
              if (!data["data"]["markets"] || !data["data"]["markets"][0]) {
                this.helperTools.ShowAlertWithOkButton(
                  "خطأ",
                  "يجب عليك اضافه المتجر الخاص بك"
                );
                this.router.navigate(['/add-store']);
                return;
              }
              this.router.navigate(['/home']);
              this.oneSignal.sendTags({
                user_id: this.AuthControllelr.SellerData.id,
                market_id: this.AuthControllelr.MarketsData[0].id,
                category: "seller"
              });
            });
            // }
          } else {
            console.log(data);
            if (data['message'] == 'please provide a correct password') {
              this.helperTools.ShowAlertWithOkButton('خطأ', 'كلمه المرور غير صحيحه , برجاء التأكد منها واعاده المحاوله');
            } else if (data['message'] == 'please provide correct phone number or you are not active') {
              this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء كتابه رقم الهاتف بشكل صحيح');
            } else {
              this.helperTools.showBadRequestAlert();
            }
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
      // });
    });
  }
  onLoginTested() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.LoginData["category"] = "seller";
      let phone = this.LoginData["phone"];
      let password = this.LoginData["password"];
      this.AuthControllelr.LoginTest(phone, password).subscribe(
        response => {
          let data: any = response;
          console.log(data);
          this.helperTools.DismissLoading();
          if (data.code == "0") {
            console.log(data);
            this.helperTools.ShowAlertWithOkButton('نجاح', "نجحت العملية");
          } else {
            this.helperTools.ShowAlertWithOkButton('خطأ', data.msg_ar);
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.ShowAlertWithOkButton('خطأ', "مشاكل مشاكل مشاكل");
          //this.helperTools.showBadRequestAlert();
        }
      );
      // });
    });
  }
  getDeviceID() {
    const options1: PushOptions = {
      android: {
        senderID: '357041582252',
        sound: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };
    const pushObject: PushObject = this.push.init(options1);
    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
    pushObject.on('registration').subscribe((registration: any) => {
      this.LoginData["device_id"] = registration.registrationId;
    });
  }


}
