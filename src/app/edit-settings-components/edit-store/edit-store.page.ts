import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-edit-store',
  templateUrl: './edit-store.page.html',
  styleUrls: ['./edit-store.page.scss'],
})
export class EditStorePage implements OnInit {
  myAddress: any
  myData: any;
  MarketData = {} as any;
  delete: 0;
  constructor(private settingService: SettingsService,
    public toastController: ToastController,
    private authController: AuthService,

  ) { }

  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];
    console.log(this.MarketData);
  }
  ionViewWillEnter() {
    this.getMyAddress()
  }
  getMyAddress() {
    this.settingService.getMYAddres(this.MarketData.Owner_id).subscribe(res => {
      this.myAddress = res['data'].rows
      console.log(this.myAddress);
    })
  }
  removeItems(id: any) {
    this.settingService.removeItem(id).subscribe(res => {
      this.presentToast(res['message']);
      console.log(res, 'delete');
      this.getMyAddress();
    }, err => {
      console.log(err, 'errorr');
    })
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: "secondary"
    });
    toast.present();
  }
}
