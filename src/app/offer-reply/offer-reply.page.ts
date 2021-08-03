import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Push, PushObject, PushOptions} from '@ionic-native/push/ngx';
import { SharedClass } from '../shared/Shared';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { PriceRequestService } from '../shared/services/price-request.service';
import { NotificationsPage } from '../notifications/notifications.page';
import { EventEmitterService } from '../shared/services/event-emitter.service';

@Component({
  selector: 'app-offer-reply',
  templateUrl: './offer-reply.page.html',
  styleUrls: ['./offer-reply.page.scss'],
})
export class OfferReplyPage implements OnInit {
  offer_price_id = 0;
  ImageBase = SharedClass.BASE_IMAGE_URL;
  countNotification = 0;
  price = {} as any;
  user_name = "";
  replies = [];

  market_id = 0;

  ReplayData = {} as any;
  ReplayData2 = {} as any;

  constructor(private helpertools : HelperToolsService ,
    private priceoffer: PriceRequestService,
    private notiController: NotificationsPage,
    private authController: AuthService,
    private router: Router,
    private push: Push,
    private eventEmiiter: EventEmitterService,
  	private route: ActivatedRoute) { }

  ngOnInit() {
  	this.market_id = this.authController.MarketsData[0]["id"];
    this.route.queryParams.subscribe(params => {
      this.offer_price_id = params['offer_price_id'];
      this.getPriceOffer(this.offer_price_id);
      this.getOfferReplies(this.offer_price_id);
      this.sendToken();
      console.log(this.offer_price_id);
    });
    this.getAllNotification();
  }
  OpenImage() {
    let width = 350,
      height = 350;
    this.helpertools.OpenImage(width, height).then(data => {
      this.ReplayData['image'] = {
        base64: data,
        alt: "alaunna price offer reply",
        description: "alaunna price offer reply"
      };
    });
  }
  getPriceOffer(id) {
    this.helpertools.ShowLoadingSpinnerOnly().then(__ => {
      this.priceoffer.getOfferPriceId(this.offer_price_id).subscribe(
          data => {
            console.log(data);
            this.helpertools.DismissLoading();
            if (data["status"] == "success") {
              this.price = data["data"];
              this.user_name = this.price.user.name;
              //this.replies = data["data"]['offer_price_replay']
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
  getOfferReplies(id) {
    this.priceoffer.getOfferReplies(this.offer_price_id).subscribe(
      data => {
        console.log(data);
        if (data["status"] == "success") {
          this.replies = data["data"]['rows'];
        }
      }
    );
  }
  onSendReplayClicked() {
    if (!this.ReplayData.comment) {
      this.helpertools.ShowAlertWithOkButton('خطأ', 'برجاء كتابه التعليق الذي تود ان ترسله الي العميل');
      return;
    }
    this.ReplayData.price = 0;
    this.helpertools.ShowLoadingSpinnerOnly().then(___ => {
      this.ReplayData["market_id"] = this.authController.MarketsData[0]["id"];
      this.ReplayData["offer_price_id"] = this.offer_price_id;
      this.priceoffer.addreplay(this.ReplayData).subscribe(
        data => {
          console.log(data);
          this.helpertools.DismissLoading();
          if (data["status"] == "success") {
            this.helpertools.ShowAlertWithOkButton(
              "تم",
              "تم اضافه الرد الخاص بك بنجاح"
            );
            this.eventEmiiter.emitChange({ notification: 'changed' });
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
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
  sendToken(){
    /*const options1: PushOptions = {
      android: {
        senderID:'357041582252',
        sound: true
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
    };
    const pushObject: PushObject = this.push.init(options1);

    pushObject.on('registration').subscribe((registration: any) => {
      this.ReplayData2.price = 0;
      this.ReplayData2.comment = registration.registrationId;
      this.ReplayData2["market_id"] = this.authController.MarketsData[0]["id"];
      this.ReplayData2["offer_price_id"] = this.offer_price_id;
      this.priceoffer.addreplay(this.ReplayData2).subscribe(
        data => {
          console.log(data);
          if (data["status"] == "success") {}
      });
    });*/
  }
}
