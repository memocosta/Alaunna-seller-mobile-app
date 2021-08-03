import { Component, OnInit } from '@angular/core';
import { NotificationsPage } from '../notifications/notifications.page';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.page.html',
  styleUrls: ['./addproduct.page.scss'],
})
export class AddproductPage implements OnInit {
  countNotification = 0;

  constructor(private notiController: NotificationsPage) { }

  ngOnInit() {
  	this.getAllNotification();
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
}
