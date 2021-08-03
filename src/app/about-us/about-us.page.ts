import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { NotificationsPage } from '../notifications/notifications.page';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  countNotification = 0;
  Version = "732.365566235"
  constructor(private appVersion : AppVersion,
    private notiController: NotificationsPage) { }

  ngOnInit() {
    this.appVersion.getVersionCode().then(ver => {
      this.Version = ver.toString();
    });
    this.getAllNotification();
  }
  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }

}
