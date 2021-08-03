import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PriceRequestService } from '../../services/price-request.service';
import { HelperToolsService } from '../../services/helper-tools.service';

@Component({
  selector: 'app-price-request-replay',
  templateUrl: './price-request-replay.component.html',
  styleUrls: ['./price-request-replay.component.scss'],
})
export class PriceRequestReplayComponent implements OnInit {
  PriceData = {} as any;
  ReplayData = {} as any;
  constructor(
    public navParams: NavParams,
    private helpertools: HelperToolsService,
    private priceController: PriceRequestService,
    private authController: AuthService,
    private router: Router,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    console.log("ionViewDidLoad OfferPriceReplayCreatePage");
    console.log(this.navParams.data)
    this.PriceData = this.navParams.get("price");

  }
  OpenImage() {
    let width = 350,
      height = 350;
    this.helpertools.OpenImage(width, height).then(data => {
      this.PriceData['image'] = {
        base64: data,
        alt: "alaunna price offer",
        description: "alaunna price offer"
      };
    });
  }
  onSendReplayClicked() {
    if (!this.ReplayData.comment) {
      this.helpertools.ShowAlertWithOkButton('خطأ', 'برجاء كتابه التعليق الذي تود ان ترسله الي العميل');
      return;
    }
    this.ReplayData.price = 0;
    this.helpertools.ShowLoadingSpinnerOnly().then(___ => {
      this.ReplayData["market_id"] = this.authController.MarketsData[0]["id"];
      this.ReplayData["offer_price_id"] = this.PriceData.id;
      this.priceController.addreplay(this.ReplayData).subscribe(
        data => {
          console.log(data);
          this.helpertools.DismissLoading();
          if (data["status"] == "success") {
            this.helpertools.ShowAlertWithOkButton(
              "تم",
              "تم اضافه الرد الخاص بك بنجاح"
            );
            this.popoverController.dismiss();
            this.router.navigate(['/opportunity']);
          } else {
            this.helpertools.showBadRequestAlert();
          }
        },
        err => {
          this.helpertools.DismissLoading();
          this.helpertools.showBadRequestAlert();
        }
      );
    });
  }
}
