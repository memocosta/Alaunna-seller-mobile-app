import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MarketService } from '../shared/services/market.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AuthService } from '../shared/services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { EventEmitterService } from '../shared/services/event-emitter.service';
import { ActiveComponent } from '../active/active.component';
import { Facebook } from '@ionic-native/facebook/ngx';
import { RegisterSocialComponent } from '../register-social/register-social.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  RegisterForm: FormGroup;
  MarketCategoies = [];
  RegisterationData = {} as any;

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
  LoginData = {} as any;
  ////////////
  constructor(private marketController: MarketService,
    private helperTools: HelperToolsService,
    private oneSignal: OneSignal,
    private authController: AuthService,
    private storage: Storage,
    private modalController: ModalController,
    private router: Router,
    private fb: Facebook,
    private menuController: MenuController, private eventEmiiter: EventEmitterService) {
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
    this.menuController.enable(false);
  }

  ngOnInit() {
    this.initForm();
    this.LoadAllCategories();
  }
  initForm() {
    this.RegisterForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null),
      phone: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required]),
      category_market: new FormControl(null, [Validators.required])
    }, { updateOn: 'change' })
  }

  // ahmed face
  fbLogin() {
    this.fb.login(['public_profile', 'email'])
      .then(res => {
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
    console.log(11111111111111);
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      console.log(2222222222)
      this.authController.sellerLoginSocial(this.LoginData).subscribe(
        data => {
          console.log(data);
          this.helperTools.DismissLoading();
          if (
            data["status"] == "success"
          ) {
            console.log(data);
            this.authController.SellerData = data["data"];
            this.authController.MarketsData = data["data"]["markets"];
            // if (this.LoginData["remeber_me"]) {
            this.storage.set("token", data["data"]["token"]).then(__ => {
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
                user_id: this.authController.SellerData.id,
                market_id: this.authController.MarketsData[0].id,
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

  async showRegisterSocialModal() {
    let modal = await this.modalController.create({ component: RegisterSocialComponent, componentProps: { LoginData: this.LoginData } });
    modal.present();
  }

  LoadAllCategories() {
    this.marketController.loadAllMarketCategory().subscribe(
      data => {
        if (data["status"] == "success") {
          this.MarketCategoies = data["data"]["rows"];
        }
      },
      err => {
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  onRegisterPressed() {
    if (!this.RegisterForm.valid) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء كتابه كل البيانات المطلوبه');
      this.RegisterForm.updateValueAndValidity();
      return;
    }
    if (
      this.RegisterationData.password != this.RegisterationData.passwordConfirm ||
      this.RegisterationData.password == undefined
    ) {
      this.helperTools.ShowToast('برجاء التأكد من ان كلمه المرور تطابق التأكيد0', 3000, 'top');
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      // this.loginUsingAccountKit(this.RegisterationData.phone).then(__ => {
        this.RegisterationData["category"] = "seller";
        this.RegisterationData['status'] = 'not_active';
        this.RegisterationData['ssn'] = 131324654654654978;
        this.authController.register(this.RegisterationData).subscribe(
          data => {
            this.helperTools.DismissLoading();
            if (data["status"] == "success") {
              // this.loginUsingAccountKit(data['data']['phone'], data['data']);
              this.helperTools.ShowAlertWithOkButton(
                "تم",
                "لقد تم تسجيل الدخول بنجاح"
              );
              this.authController.SellerData = data["data"];
              console.log(data);
              this.storage.set("token", data["data"]["token"]);
              this.storage.set(
                "category_market",
                this.RegisterationData["category_market"]
              );
              
              // if(data["data"]["status"] == 'not_active'){
              //   this.router.navigate(['/add-store']);
              //   this.showActiveModal(data);
                
              // }else{
              //   this.router.navigate(['/add-store']);
              // }
              this.router.navigate(['/add-store']);
              
            } else {
              console.log(data);
              if (data['message'] == 'old phone') {
                this.helperTools.ShowAlertWithOkButton('خطأ', 'رقم الهاتف موجود مسبقا برجاء التأكد من عدم تكرار الرقم او الذهاب الي صفحه تسجيل الدخول');
              }else{
                this.helperTools.ShowAlertWithOkButton('خطأ', 'حدث خطا ما وبرجاء التواصل مع الدعم الفني');
              }
            }
          },
          err => {
            this.helperTools.DismissLoading();
            this.helperTools.showBadRequestAlert();
          }
        );
      // }).catch(err => { })
    });
  }

  async showActiveModal(data) {
    let modal = await this.modalController.create({ component: ActiveComponent, componentProps: { data: data , type: 'register' } });
    modal.present();
  }

  /*loginUsingAccountKit(phonenumber) {
    return new Promise((resolve, reject) => {
      let AccountKit = (<any>window).AccountKitPlugin;
      let options = {
        defaultCountryCode: "EG",
        facebookNotificationsEnabled: true,
        initialPhoneNumber: ['2', phonenumber]
      }
      AccountKit.loginWithPhoneNumber(options, (accountKitData) => {
        // this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
        resolve(accountKitData);
        // });
      }, (err) => {
        reject(err);
        console.log(err);
      })
    })
  }*/

}
