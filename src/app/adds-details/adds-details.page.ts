import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { SharedClass } from '../shared/Shared';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketService } from '../shared/services/market.service';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-adds-details',
  templateUrl: './adds-details.page.html',
  styleUrls: ['./adds-details.page.scss'],
})
export class AddsDetailsPage implements OnInit {
  AdsData = {} as any;
  AdsForm: FormGroup;
  ImageBase = SharedClass.BASE_IMAGE_URL;

  countNotification = 0;

  constructor(private helperTools: HelperToolsService,
    private route: ActivatedRoute, 
    private notiController: NotificationsPage,
    private marketService: MarketService , private router : Router) { }

  ngOnInit() {
    this.AdsForm = new FormGroup({
      title: new FormControl(null, [])
    })
    this.route.params.subscribe(data => {
      if (data['id']) {
        this.getBannerById(data['id']);
      }
    });
    this.getAllNotification();
  }
  getBannerById(id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.marketService.getMarketBannerById(id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.AdsData = data['data'];
          console.log(data);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
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
  onEditClicked() {
    if (!this.AdsData.image && !this.AdsData.title ){
      this.helperTools.ShowAlertWithOkButton('خطا' , 'برجاء اختيار الصوره او كتابه الوصف للاعلان');
      return;
    }
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.marketService.EditMarketBanner(this.AdsData).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل العنصر بنجاح');
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
