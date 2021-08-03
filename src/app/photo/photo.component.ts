import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {

  img: any;

  constructor(public modalController: ModalController,private platform: Platform, private navParams: NavParams) { 
    this.img = this.navParams.get('img');
    this.backButtonEvent();
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(601, async () => {
      this.modalController.dismiss();
    });
  }

}
