import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { HelperToolsService } from '../shared/services/helper-tools.service';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.page.html',
  styleUrls: ['./add-new-customer.page.scss'],
})
export class AddNewCustomerPage implements OnInit {
  customer = <any>{};
  MarketData = {} as any;

  constructor(
    private router: Router,
    private authController: AuthService,
    private helperTools: HelperToolsService,

  ) { }

  ngOnInit() {
    this.MarketData = this.authController['MarketsData'][0];

  }
  onNewCustomer() {
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {

      this.customer.market_id = this.MarketData.id
      this.authController.create_new_customer(this.customer).subscribe(data => {
        this.helperTools.ShowAlertWithOkButton('عمیل جدید', 'تم إضافة عميل جديد الى قائمة عملائك بنجاح');
        this.helperTools.DismissLoading();
        this.router.navigate(['/contact-list']);

      })
    })
  }


}
