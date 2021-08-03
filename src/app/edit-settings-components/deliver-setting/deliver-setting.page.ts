import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HelperToolsService } from 'src/app/shared/services/helper-tools.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { AuthService } from '../../shared/services/auth.service';
import { SharedClass } from '../../shared/Shared';

@Component({
  selector: 'app-deliver-setting',
  templateUrl: './deliver-setting.page.html',
  styleUrls: ['./deliver-setting.page.scss'],
})
export class DeliverSettingPage implements OnInit {
  showShipping = true;
  myShipping: any
  ImageBase = SharedClass.BASE_IMAGE_URL;

  MarketData = {} as any;
  shippings = [];
  shippings_companies = [];
  constructor(public alertController: AlertController,
    private authController: AuthService,
    private settingService: SettingsService,
    private helperTools: HelperToolsService,

  ) { }

  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];
    console.log(this.MarketData);
    this.getShipping(this.MarketData.Owner_id)
    this.getShippingCompany()
  }
  ionViewWillEnter() {
    this.MarketData = this.authController['MarketsData'][0];
    console.log(this.MarketData);
    this.getShipping(this.MarketData.Owner_id)
    this.getShippingCompany()
  }
  edit_shipping(shipping) {

  }
  getShipping(id) {
    // this.helperTools.ShowLoadingSpinnerOnly().then(__ => {

    this.settingService.get_shipping(id).subscribe(res => {
      console.log(res, 'get_shipping');
      this.shippings = res['data']['rows'];
      if (this.shippings.length > 0) {
        this.showShipping = false;
      }
      this.helperTools.DismissLoading();

    })

    // })
  }
  getShippingCompany() {

    this.settingService.get_shipping_company().subscribe(res => {
      console.log(res, 'get_shipping_company');
      this.helperTools.DismissLoading();

      this.shippings_companies = res['data']['rows'];

    })
  }

  async presentAlert(val) {
    console.log(val);
    var col = "alaunna_shipping";
    this.change_col(col, val);
    this.MarketData.alaunna_shipping = val;
  }

  change_col(col, val) {
    if (val == 1)
      this.presentAlertConfirm();
    let data = {
      market_id: this.MarketData.id
    }
    data[col] = val;
    console.log(data);

    this.authController.change_col_market(data).subscribe(data => {
      if (data['status'] == 'success') {
        console.log('success');
      }
    })
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'خيارات الشحن',
      // subHeader: 'Subtitle',
      message: 'هذه الخدمه متوفره في باقه الااونا بلس',
      buttons: ['اختر باقة'],
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
