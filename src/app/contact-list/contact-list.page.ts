import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/services/auth.service';
import { OrderService } from '../shared/services/order.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  clients = [];
  followers = [];
  contacts = [];
  users = [];

  filterData = { offset: 0, category_id: '', subctegory_id: '', subsubcategory_id: '', market_id: '', status: 'all', country_id: '' }
  MarketData = {} as any;
  loadMessages = false;

  constructor(private orderService: OrderService,
    private authController: AuthService,
    private helperTools: HelperToolsService,
  ) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.MarketData = this.authController['MarketsData'][0];
    console.log(this.MarketData);
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
      this.clients = [];
      this.users = [];
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
      this.helperTools.DismissLoading();
    })
    // });
  }

}
