import { Component, OnInit } from '@angular/core';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { AuthService } from '../shared/services/auth.service';
import { MarketService } from '../shared/services/market.service';
import { SharedClass } from '../shared/Shared';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-my-adds',
  templateUrl: './my-adds.page.html',
  styleUrls: ['./my-adds.page.scss'],
})
export class MyAddsPage implements OnInit {

  fitlerOBJ = {offset : 0 , market_id : ''};
  BannersData = [];
  ImageBaseURL = SharedClass.BASE_IMAGE_URL;
  countNotification = 0;

  constructor(private helperTools: HelperToolsService, 
    private authController: AuthService,
    private notiController: NotificationsPage,
    private marketController: MarketService) { }

  ngOnInit() {
    this.fitlerOBJ.market_id = this.authController.MarketsData[0]['id'];
    this.getAllbanners();
    this.getAllNotification();
  }
  getAllbanners() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.marketController.getAllMarketBanners(this.fitlerOBJ.offset , this.fitlerOBJ.market_id ).subscribe(data => {
        this.helperTools.DismissLoading();
        console.log(data);
        if (data['status'] == 'success') {
          this.BannersData = data['data']['rows'];
        } else {

          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }  
  onDeleteBannerCliked(banner) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.marketController.deleteBanner(banner.id).subscribe(data => {
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم مسح العنصر بنجاح');
          this.BannersData = [] as any;
          this.fitlerOBJ.offset = 0;
          this.getAllbanners();
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }
  loadData(event) {
    this.fitlerOBJ.offset++;
    this.getAllbanners();
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 500);
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
