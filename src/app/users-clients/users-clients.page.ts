import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { MenuController, IonItemSliding, ModalController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OrderService } from '../shared/services/order.service';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { NotificationsPage } from '../notifications/notifications.page';
@Component({
  selector: 'app-users-clients',
  templateUrl: './users-clients.page.html',
  styleUrls: ['./users-clients.page.scss'],
})
export class UsersClientsPage implements OnInit {

  MarketData = {} as any;
  ImgeBase = SharedClass.BASE_IMAGE_URL;
  clients = [];
  contacts = [];
  followers = [];
  users = [];
  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: '', country_id: '' };
  subcategories = [];
  elementRef: ElementRef;
  countNotification = 0;
  selectedclients;
  type: any;
  OfferData: any;

  constructor(private menuController: MenuController,
    private authController: AuthService,
    private helperTools: HelperToolsService,
    private notiController: NotificationsPage,
    private modalController: ModalController,
    private orderService: OrderService,
    // public navParams: NavParams,
    private router: Router,
    private productController: ProductService,
    @Inject(ElementRef) elementRef: ElementRef) {
    this.menuController.enable(true);
    this.elementRef = elementRef;
    // marketcategory_id
  }

  ngOnInit() {
    // if add coupon
    // this.type = this.navParams.get('type');
    // ////////
    // if(this.navParams.get('offer')){
    //   this.OfferData = this.navParams.get('offer');
    // }
    this.MarketData = this.authController['MarketsData'][0];
    this.filterData.market_id = this.MarketData.id;
    this.userOrders(this.MarketData.id);
    this.getFavourites(this.MarketData.id);
  }
  getFavourites(marketId) {
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      this.authController.getFollowers(marketId).subscribe(res => {
        // console.log(res['data'], ' my orders');
        this.contacts = res['data']['SelectedCustomers']['rows'];
        let data = res['data']['SelectedFav']['rows'];
        for (let i = 0; i < data.length; i++) {
          if (!this.users.includes(data[i].user_id)) {
            let user = {
              id: data[i]['user'].id,
              name: data[i]['user'].name,
              phone: data[i]['user'].phone,
              country: data[i]['user'].Country,
              city: data[i]['user'].City,
              count: 0,
            }
            this.clients.push(user);
            this.users.push(user.id);
          }
        }
        console.log(this.clients);
        this.helperTools.DismissLoading();
      })
    });
  }
  userOrders(marketId) {
    // this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
    this.orderService.userOrders(marketId).subscribe(res => {
      // console.log(res['data'], ' my orders');
      let data = res['data'];
      for (let i = 0; i < data.length; i++) {
        if (this.users.includes(data[i].user_id)) {
          let user = this.clients.filter(item => item.id == data[i].user_id)[0];
          user['count']++;
        } else {
          let user = {
            id: data[i]['owner'].id,
            name: data[i]['owner'].name,
            phone: data[i]['owner'].phone,
            country: data[i]['owner'].Country,
            city: data[i]['owner'].City,
            count: 1,
          }
          this.clients.push(user);
          this.users.push(user.id);
        }

      }
      console.log(this.clients);
      // this.helperTools.DismissLoading();
    })
    // });
  }
  new_customer() {
    this.modalController.dismiss("new-customer");
  }

  onSelectClientChange(client) {
    console.log(client);
    // if (event.detail.checked) {
    //   this.selectedclients.push(id);
    // } else {
    //   this.selectedclients = this.selectedclients.filter(obj => obj !== id);
    // }
    this.selectedclients = {
      user_id: client.id,
      customer_id: null,
      client: client
    };

    console.log(this.selectedclients);
  }
  onSelectContactChange(client) {
    console.log(client);
    this.selectedclients = {
      user_id: null,
      customer_id: client.id,
      client: client
    };
  }
  onDonePreseed() {
    let clients = this.selectedclients;
    if (clients)
      this.modalController.dismiss(this.selectedclients);
  }

  dismissModal() {
    this.modalController.dismiss("users-products");
  }




}
