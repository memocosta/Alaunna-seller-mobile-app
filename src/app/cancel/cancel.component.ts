import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { MenuController, IonItemSliding, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { Router } from '@angular/router';
import { ProductService } from '../shared/services/product.service';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss'],
})
export class CancelComponent implements OnInit {

  elementRef: ElementRef;
  canceld_reason: any;

  constructor(private menuController: MenuController,
    private modalController: ModalController,
    @Inject(ElementRef) elementRef: ElementRef) {
    this.menuController.enable(true);
    this.elementRef = elementRef;
  }

  ngOnInit() {

  }


  onSubmitedPressed() {
    let canceld_reason = this.canceld_reason;
    this.modalController.dismiss(canceld_reason);
  }

  dismissModal(){
    this.modalController.dismiss();
  }

}
