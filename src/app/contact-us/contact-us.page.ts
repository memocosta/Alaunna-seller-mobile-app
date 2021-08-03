import { Component, OnInit } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { NavController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  price: any = '';

  constructor(private NacController: NavController,
    private push: Push,
    private nativeToast: Toast,
    private route: ActivatedRoute
  ) {
    this.price = this.route.snapshot.params['price'];

  }

  deviceID;
  ngOnInit() {
    this.push_setup()
  }
  push_setup() {
    const options1: PushOptions = {
      android: {
        senderID: '357041582252',
        sound: true,
      },
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };
    const pushObject: PushObject = this.push.init(options1);

    pushObject.on('notification').subscribe((notification: any) => {
      this.NacController.navigateRoot('/statistics');
      this.nativeToast.show(
        `notification.message`,
        '3000',
        'center').subscribe(toast => {
          console.log(JSON.stringify(toast));
        });
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log(registration.registrationId);
      this.deviceID = registration.registrationId;
    });
  }
}
