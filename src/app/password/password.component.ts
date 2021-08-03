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
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {

  RegisterForm: FormGroup;
  MarketCategoies = [];
  RegisterationData = {} as any;
  data: any;
  type: any;
  phone: any;
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
    this.initForm();
    this.data = this.navParams.get('phone');
  }
  initForm() {
    this.RegisterForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      passwordConfirm: new FormControl(null, [Validators.required])
    }, { updateOn: 'change' })
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
      this.helperTools.ShowToast('برجاء التأكد من ان كلمه المرور تطابق التأكيد', 3000, 'top');
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      let passwordData = {};
      passwordData['password'] = this.RegisterationData.password;
      passwordData['phone'] = this.phone;
      this.authController.forgetPassword(passwordData).subscribe(
        data => {
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            // this.helperTools.ShowAlertWithOkButton(
            //   "تم",
            //   "لقد تم تغيير كلمة السر بنجاح ... برجاء التوجه لتسجيل الدخول"
            // );
            this.helperTools.ShowAlertWithOkButton('تم', 'تم تغيير كلمة المرور بنجاح برجاء التوجه الان لتسجيل الدخول');
            this.dismissModal();
          } else {
            console.log(data);
            this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء التأكد من أدخال البيانات بشكل صحيح');
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    });
  }

  dismissModal() {
    this.modalController.dismiss();
    this.router.navigate(['login']);
  }

}
