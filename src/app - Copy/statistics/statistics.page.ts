import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { PriceRequestService } from '../shared/services/price-request.service';
import { AuthService } from '../shared/services/auth.service';
import { ProductService } from '../shared/services/product.service';
import { Router } from '@angular/router';
import { ChatService } from '../shared/services/chat.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  MarketData: any;
  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: '', country_id: '' };
  Products: any;
  Products_count= 0;
  readPercentage= 0;
  followersCount= 0;
  offerPercent = 0;
  prices = [];

  constructor(
    private AuthControlelr: AuthService,
    private productController: ProductService,
    private chatController: ChatService,
    private priceoffer: PriceRequestService,
    private router: Router,
    private helperTools: HelperToolsService
  ) { }

  ngOnInit() {
    this.MarketData = this.AuthControlelr.MarketsData[0];
    this.filterData.market_id = this.MarketData.id;
    this.filterData.category_id = this.MarketData['marketcategory_id'];
    console.log(this.MarketData);
    this.loadMyroducts();
    this.getmessagescount();
    this.getFollowersCount();
    this.getAllPriceOffers();
  }
  getmessagescount(){
    let DataRoom = {
      market_id: this.MarketData.id,
      search_word: "",
      offset: 0
    }
    this.chatController.LoadAllRooms(DataRoom).subscribe(Data => {
      console.log(Data);
      if(Data['status'] == 'success'){
        let Rooms = Data['data']['rows'];
        let TempRooms = [];
        for (let i = 0;i<Rooms.length;i++){
          if (Rooms[i].messages[0] && Rooms[i].messages[0].from_market_id == this.MarketData.id) {
            TempRooms.push(this.prices[i]);
          }
        }
        this.readPercentage = Math.ceil((TempRooms.length / Rooms.length) * 100);
      } else {
        this.helperTools.showBadRequestAlert();
      }
    }, err => {
      console.log(err);
      this.helperTools.showBadRequestAlert();
    })
  }
  getAllPriceOffers() {
    this.priceoffer.index(
      0,
      "",
      "",
      this.filterData.category_id,
      ""
    )
    .subscribe(
      data => {
        console.log(data);
        if (data["status"] == "success") {
          this.prices = data["data"]["rows"];
          let TempPrices = [];
          console.log(this.MarketData.id);
          for (let i = 0;i<this.prices.length;i++){
            if (this.prices[i].offer_price_replay && this.prices[i].offer_price_replay[0]) {
              let offerReplies = this.prices[i].offer_price_replay;
              for (let j = 0; j<offerReplies.length;j++){
                if (offerReplies[j].market_id == this.MarketData.id) {
                  TempPrices.push(this.prices[i]);
                  break;
                }
              }
            }
          }
          this.offerPercent = Math.ceil((TempPrices.length / this.prices.length) * 100);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      },
      err => {
        console.log(err);
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  getFollowersCount(){
    this.AuthControlelr.getFollowers(
      this.AuthControlelr.MarketsData[0]["id"]
    ).subscribe(data => {
        console.log(data);
        if (data['status'] == 'success') {
            this.followersCount = data['data']['rows'].length;
        }
      }, err => {
        console.log(err);
        // this.helperTools.showBadRequestAlert();
      })
  }
  loadMyroducts() {
    if (!this.AuthControlelr.MarketsData) {
      this.helperTools.ShowAlertWithOkButton('خطأ', 'برجاء اضافه متجر');
      // this.navCtrl.setRoot('MarketCreatePage')
      this.router.navigate(['/add-store']);
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productController.getMarketroduct(
        this.filterData.market_id,
        false
      ).subscribe(data => {
          console.log(data);
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
              this.Products = data['data']['rows'];
              this.Products_count = data['data'].length;
              console.log(this.Products_count);
          } else {
            this.helperTools.showBadRequestAlert();
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          //this.helperTools.showBadRequestAlert();
        })
    })
  }

}
