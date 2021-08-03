import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MarketService } from '../shared/services/market.service';
import { Router } from '@angular/router';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-add-ads',
  templateUrl: './add-ads.page.html',
  styleUrls: ['./add-ads.page.scss'],
})
export class AddAdsPage implements OnInit {

  AdsData = {} as any;
  AdsForm: FormGroup;
  countNotification = 0;

  constructor(private helperTools: HelperToolsService,
    private AuthController: AuthService,
    private marketService: MarketService,
    private notiController: NotificationsPage,
    private router: Router) { }

  ngOnInit() {
    this.AdsForm = new FormGroup({
      title: new FormControl(null, [])
    })
    this.AdsData['market_id'] = this.AuthController.MarketsData[0].id;
    this.getAllNotification();
  }
  OpenImage() {
    let width = 1024, height = 512;
    this.helperTools.OpenImage(width, height).then(data => {
      if (!this.AdsData['image']) {
        this.AdsData['image'] = {
          base64: data,
          alt: "alaunna banner",
          description: "alaunna banner",
          action: 'new'
        };
      } else {
        this.AdsData['image']['base64'] = data;
        this.AdsData['image']['action'] = 'edited';
      }
    });
  }
  onCreatePressed() {
    if (!this.AdsData.image && !this.AdsData.title ){
      this.helperTools.ShowAlertWithOkButton('خطا' , 'برجاء اختيار الصوره او كتابه الوصف للاعلان');
      return;
    }
    
    this.AdsData['status'] = 'active';
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.marketService.createMarketBanner(this.AdsData).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم اضافه العنصر بشكل صحيح');
          this.router.navigate(['/my-adds']);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
