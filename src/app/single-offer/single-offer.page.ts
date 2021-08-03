import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedClass } from '../shared/Shared';
import { ModalController } from '@ionic/angular';
import { NotificationsPage } from '../notifications/notifications.page';
import { EditOfferModalComponent } from '../edit-offer-modal/edit-offer-modal.component';

@Component({
  selector: 'app-single-offer',
  templateUrl: './single-offer.page.html',
  styleUrls: ['./single-offer.page.scss'],
})
export class SingleOfferPage implements OnInit {
  OfferData: any;
  countNotification = 0;
  ImageBase = SharedClass.BASE_IMAGE_URL;

  constructor(
    private productControlelr: ProductService,
    private helperTools: HelperToolsService,
    private route: ActivatedRoute,
    private notiController: NotificationsPage,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      if (data['id']) {
        this.getOffer(data['id']);
      }
    });
    this.getAllNotification();
  }
  async editOffer() {
    let modal = await this.modalController.create({ component: EditOfferModalComponent, componentProps: { inputs: this.OfferData } });
    modal.present();
    modal.onDidDismiss().then(data => {
      console.log(data);

    })
  }

  getOffer(id) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.getOffer(id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.OfferData = data['data'];
          console.log(this.OfferData);
        } else {
          this.helperTools.showBadRequestAlert();
        }
      }, err => {

      })
    })
  }

  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
  changeOfferStatus(status) {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.changeStatusOffer(this.OfferData.id, status).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم تعديل حالة العرض بنجاح');
          // this.navCtrl.pop();
          this.modalController.dismiss();
          this.router.navigateByUrl('my-offers2');
        } else {
          console.log(data);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

  deleteOffer() {
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.productControlelr.deleteOffer(this.OfferData.id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم إلغاء العرض بنجاح');
          // this.navCtrl.pop();
          this.modalController.dismiss();
          this.router.navigateByUrl('my-offers2');
        } else {
          console.log(data);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        }
      }, err => {
        console.log(err);
        this.helperTools.DismissLoading();
        this.helperTools.showBadRequestAlert();
      })
    })
  }

}
