import { Component, OnInit } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { OrderService } from '../shared/services/order.service';
@Component({
  selector: 'app-new-customer2',
  templateUrl: './new-customer2.page.html',
  styleUrls: ['./new-customer2.page.scss'],
})
export class NewCustomer2Page implements OnInit {
  contactsfound = [];
  x;
  contact_list = [];

  MarketData = {} as any;

  constructor(
    private contacts: Contacts,
    public toastController: ToastController,
    private router: Router,
    private helperTools: HelperToolsService,
    private authController: AuthService,
    private orderController: OrderService,

  ) { }

  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];

  }
  getContactList() {
    console.log(4433);
    this.contacts.find(['displayName', 'name', 'phoneNumbers'], { multiple: true })
      .then(data => {
        this.contactsfound = data
        this.x = JSON.stringify(this.contactsfound[0]);
      });

  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: "secondary"
    });
    toast.present();
  }
  createMany() {

    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      let data = {
        market_id: this.MarketData.id,
        contact_list: this.contact_list
      };
      this.authController.create_many_new_customer(data).subscribe(data => {
        this.helperTools.ShowAlertWithOkButton('عمیل جدید', 'تم إضافة عميل جديد الى قائمة عملائك بنجاح');
        this.helperTools.DismissLoading();
        this.orderController.OfferData.user_id = null;
        this.orderController.OfferData.customer_id = data['data'].id;
        this.orderController.OfferData.client = data['data'];
        this.router.navigate(['/request-message']);


      })
    })

  }
  back() {
    this.orderController.back = "users-products";
    this.router.navigate(['/myorders']);
  }
}
