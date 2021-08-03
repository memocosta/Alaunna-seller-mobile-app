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
import { PasswordComponent } from '../password/password.component';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
})
export class ActiveComponent implements OnInit {

  RegisterForm: FormGroup;
  MarketCategoies = [];
  RegisterationData = {} as any;
  data: any;
  type: any;
  c1: any;
  c2: any;
  c3: any;
  c4: any;
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

    this.helperTools.ShowAlertWithOkButton(
      "تنويه",
      "يجب عليك تفعيل رقم الهاتف أولا"
    );
    this.data = this.navParams.get('data');
    this.phone = this.data['phone'];
    this.type = this.navParams.get('type');
    this.sendCode();

  }

  sendCode() {
    let activateData = {
      phone: Number(this.phone)
    };
    this.authController.sendPhoneCode(activateData).subscribe(
      data => {
        if (data["status"] == "success") {
          console.log(data);
        } else {
          console.log(1111111111);
        }
      }
    );
  }


  onActivatePressed() {

    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      let activateData = {};
      activateData['phone'] = this.phone;
      activateData['activate_code'] = "" + this.c1 + this.c2 + this.c3 + this.c4;
      this.authController.verifyPhoneCode(activateData).subscribe(
        data => {
          this.helperTools.DismissLoading();
          if (data["status"] == "success") {
            
            if (this.type == 'forget') {
              console.log('go to forget page');
              this.showActiveModalForget(this.phone);
              this.modalController.dismiss();
            } else {
              this.helperTools.ShowAlertWithOkButton(
              "تم",
              "لقد تم التفعيل بنجاح"
            );
              this.authController.SellerData['status'] = "active";
              console.log(data);
              this.storage.set("token", data["data"]["token"]);
              this.storage.set(
                "category_market",
                this.RegisterationData["category_market"]
              );
              this.modalController.dismiss();
            }
            //this.router.navigate(['/add-store']);
          } else {
            console.log(data);
            this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء التأكد من أدخال الكود بشكل صحيح');
          }
        },
        err => {
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      );
    });
  }

  async showActiveModalForget(phone) {
    let modal = await this.modalController.create({ component: PasswordComponent, componentProps: { phone: phone } });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(232323);
      this.modalController.dismiss();
    })
  }

  dismissModal() {
    this.modalController.dismiss();
  }

}
