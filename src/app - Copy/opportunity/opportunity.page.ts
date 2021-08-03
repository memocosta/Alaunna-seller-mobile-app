import { Component, OnInit } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { PriceRequestService } from '../shared/services/price-request.service';
import { Storage } from '@ionic/storage';
import { PopoverController } from '@ionic/angular';
import { PriceRequestReplayComponent } from '../shared/components/price-request-replay/price-request-replay.component';
import { AuthService } from '../shared/services/auth.service';
import { NotificationsPage } from '../notifications/notifications.page';
import { EventEmitterService } from '../shared/services/event-emitter.service';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.page.html',
  styleUrls: ['./opportunity.page.scss'],
})
export class OpportunityPage implements OnInit {

  filterData = {
    offset: 0,
    market_id: "",
    category_id: "",
    country_id: "",
    user_id: ""
  };
  prices = [];

  ImageBase = SharedClass.BASE_IMAGE_URL;
  PriceRequestShowedBefore = [];
  countNotification = 0;

  constructor(private helpertools : HelperToolsService ,
    private priceoffer: PriceRequestService,
    private storage : Storage, 
    private eventEmiiter: EventEmitterService,
    private notiController: NotificationsPage,
    private popOverControlelr : PopoverController  , private authController : AuthService) { 
      console.log(this.ImageBase);
    }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.getAllPriceOffers();
    this.changeReadOrdersNotifications();
    this.storage.get('prices').then(prices => {
      this.PriceRequestShowedBefore = prices;
    });
    this.getAllNotification();

  }
  changeReadOrdersNotifications() {
    this.priceoffer.changeSellerReadofferPrices(this.authController.SellerData['id']).subscribe(data => {
      console.log(data);
      this.eventEmiiter.emitChange({ notification: 'changed' });
      this.getAllNotification();
    });
  }
  getAllPriceOffers() {
    this.filterData.category_id = this.authController.MarketsData[0].marketcategory_id;
    this.helpertools.ShowLoadingSpinnerOnly().then(__ => {
      this.priceoffer
        .index(
          this.filterData.offset,
          this.filterData.market_id,
          this.filterData.user_id,
          this.filterData.category_id,
          this.filterData.country_id
        )
        .subscribe(
          data => {
            console.log(data);
            this.helpertools.DismissLoading();
            if (data["status"] == "success") {
              this.prices = data["data"]["rows"];
              let TempPrices = [];
              for (let i = 0;i<this.prices.length;i++){
                TempPrices.push(this.prices[i].id);
              }
              this.storage.set('prices' , TempPrices);
              console.log(TempPrices);
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
  onGoToChat(price){
    //TODO: fill this function
  }
  async onGoToReplay(price){
    let pop = await this.popOverControlelr.create({component : PriceRequestReplayComponent , componentProps : {price : price} , cssClass : 'price-replay-pop'});
    pop.present();
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
