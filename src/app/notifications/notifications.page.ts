import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ChatService } from '../shared/services/chat.service';
import { PriceRequestService } from '../shared/services/price-request.service';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  notifications;
  offset = 0;
  UserData = {} as any;

  Rooms = [] as any;
  ImageLink;
  search_word = '';

  Orders = [] as any;
  ProductStatus = { 'pending': 'لم يتم تجهيزه', 'prepared': 'تم تجهيزه', 'no_exist': 'غير متوفر لدي المتجر' }
  MarketData = {} as any;
  OrderStatus = { 'accepted': 'تم قبوله', 'canceld': 'تم الغاءه', 'pending': 'يتم المراجعه' };

  filterData = {
    offset: 0,
    market_id: "",
    category_id: "",
    country_id: "",
    user_id: ""
  };
  prices = [];
  newPrices = 0;
  unreadMessages = 0;
  OrdersCount = 0;
  allNotiCount = 0;
  PriceRequestShowedBefore = [];

  constructor(private authController: AuthService,
              private helperTools: HelperToolsService, 
              private orderController: OrderService,
              private chatCntroller: ChatService,
              private priceoffer: PriceRequestService) {
    this.UserData = this.authController.SellerData;
  }

  ngOnInit() {}
  
  ionViewDidEnter() {
    console.log('ionViewDidLoad NotificationPage');
    this.getAllNotificationsCounts();
    this.getAllNotifications();
    //this.getUnreadMessages(0);
    this.getAllPriceOffers();
    this.LoadAllMyOrders();
  }
  getAllNotificationsCounts() {
    console.log(this.authController.SellerData['id']);
    this.authController.getAllNotificationsCounts(this.authController.SellerData['id']).subscribe(data => {
      if (data['status'] == 'success') {
        console.log(data)
        this.unreadMessages = data['data']['messagesCount'];
        this.OrdersCount = data['data']['ordersCount'];
        this.newPrices = data['data']['offersPriceCount'];
        this.allNotiCount = data['data']['allCount'];
      }
    }, err => {
    })
  }
  getAllNotifications() {
    this.authController.getNotifications(this.offset, this.authController.SellerData['id']).subscribe(data => {
      if (data['status'] == 'success') {
        this.notifications = data['data'];
      }
    }, err => {
    })
  }
  
  onRemoveAll() {
    this.authController.removeAllNotification(this.authController.SellerData['id']).subscribe(data => {
      if (data['status'] == 'success') {
        this.helperTools.ShowAlertWithOkButton('تم', 'تم مسح كل الاشعارات بنجاح');
      }
    })
  }
  // getUnreadMessages(OFFset){
  //   let DataRoom = {
  //     market_id: this.authController.MarketsData[0]["id"],
  //     search_word: this.search_word,
  //     offset: false
  //   }
  //   this.chatCntroller.getUnreadMessages(DataRoom).subscribe(Data => {
  //     if(Data['status'] == 'success'){
  //       this.unreadMessages = Data['data'];
  //     } else {
  //       this.helperTools.showBadRequestAlert();
  //     }
  //   }, err => {
  //     this.helperTools.showBadRequestAlert();
  //   })
  // }
  
  getAllPriceOffers() {
    this.filterData.category_id = this.authController.MarketsData[0].marketcategory_id;
    this.priceoffer.index(
        0,
        this.filterData.market_id,
        this.filterData.user_id,
        this.filterData.category_id,
        this.filterData.country_id
    ).subscribe(
      data => {
        if (data["status"] == "success") {
          this.prices = data["data"]["rows"];
          let countPrices = [];
          // for (let i = 0;i<this.prices.length;i++){
          //   if (this.prices[i].offer_price_replay.length <= 0) {
          //     countPrices.push(this.prices[i].id);
          //   }
          // }
          // this.newPrices = countPrices.length;
        } else {
          this.helperTools.showBadRequestAlert();
        }
      },
      err => {
        this.helperTools.showBadRequestAlert();
      }
    );
  }
  LoadAllMyOrders() {
    this.orderController.getUnreadOrders(this.authController.MarketsData[0]['id'], this.offset).subscribe(data => {
      if (data['status'] == 'success') {
        if (this.offset == 0) {
          this.Orders = data['data']['rows'];
        } else {
          this.Orders = this.Orders.concat(data['data']['rows']);
        }
      } else {
        this.helperTools.showBadRequestAlert();
      }
    }, err => {
      this.helperTools.showBadRequestAlert();
    })
  }
}
