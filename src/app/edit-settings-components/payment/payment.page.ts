import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  constructor(public alertController: AlertController,
    private authController: AuthService

  ) { }
  MarketData = {} as any;

  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];
    console.log(this.MarketData);
  }
  async presentAlert(val) {
    console.log(val);
    var col = "online_payment";
    this.change_col(col, val, 'قيمة 3,5% + 1 جنية لكل عملية');
    this.MarketData.online_payment = val;
  }
  async presentAlert2(val) {
    console.log(val);

    var col = "cash_on_delivery";
    this.change_col(col, val, 'مبلغ 10 جنيهات للمبالغ الاقل من 1500 جنية وقيمة 1% للمبالغ الاكثر من 1500 جنية');
    this.MarketData.cash_on_delivery = val;
  }

  change_col(col, val, msg) {
    if (val == 1)
      this.presentAlertConfirm(msg);
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

  async presentAlertConfirm(msg) {
    const alert = await this.alertController.create({
      header: 'رسوم تفعيل الخدمة',
      message: msg,
      buttons: [
        {
          text: 'تفعيل',
          cssClass: 'secondary',
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
