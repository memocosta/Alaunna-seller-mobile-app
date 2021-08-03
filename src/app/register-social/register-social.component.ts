import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MarketService } from '../shared/services/market.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AuthService } from '../shared/services/auth.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { MenuController, ModalController, NavParams } from '@ionic/angular';
import { EventEmitterService } from '../shared/services/event-emitter.service';

@Component({
  selector: 'app-register-social',
  templateUrl: './register-social.component.html',
  styleUrls: ['./register-social.component.scss'],
})
export class RegisterSocialComponent implements OnInit {

  RegisterForm: FormGroup;
  MarketCategoies = [];
  RegisterationData = {} as any;
  constructor(private marketController: MarketService,
    private helperTools: HelperToolsService,
    private oneSignal: OneSignal,
    private authController: AuthService,
    private storage: Storage,
    private router: Router,
    private navParams: NavParams,
    private modalController: ModalController,
    private menuController: MenuController, private events: EventEmitterService) {
    this.menuController.enable(false);
  }

  ngOnInit() {
    this.RegisterationData = this.navParams.get('LoginData');
    this.initForm();
    //this.LoadAllCategories();
  }
  initForm() {
    this.RegisterForm = new FormGroup({
      phone: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)])
    }, { updateOn: 'change' })
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
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء رقم الهاتف الخاص بك');
      this.RegisterForm.updateValueAndValidity();
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      // this.loginUsingAccountKit(this.RegisterationData.phone).then(__ => {
        this.RegisterationData["category"] = "seller";
        this.RegisterationData['status'] = 'active';
        this.RegisterationData['ssn'] = 131324654654654978;
        this.authController.sellerRegisterSocial(this.RegisterationData).subscribe(
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
              this.modalController.dismiss();
              this.router.navigate(['/add-store']);
            } else {
              console.log(data);
              if (data['error']['name'] == 'SequelizeUniqueConstraintError') {
                this.helperTools.ShowAlertWithOkButton('خطأ', 'رقم الهاتف موجود مسبقا برجاء التأكد من عدم تكرار الرقم او الذهاب الي صفحه تسجيل الدخول');
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

  onDonePreseed() {
    let products = '';
    this.modalController.dismiss(products);
  }

  dismissModal(){
    this.modalController.dismiss();
  }

}
