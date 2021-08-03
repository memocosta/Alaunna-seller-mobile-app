import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { SharedClass } from '../shared/Shared';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {
  market_id: any;
  followers: any;
  ImageBaseURL = SharedClass.BASE_IMAGE_URL;
  constructor(private AuthControlelr: AuthService,
    private helperTools: HelperToolsService
    ) {
    this.market_id = this.AuthControlelr.MarketsData[0].id;
    this.getFollowers();
   }

   getFollowers(){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.AuthControlelr.getFollowers(
        this.market_id
      ).subscribe(data => {
          console.log(data);
          this.helperTools.DismissLoading();
          if (data['status'] == 'success') {
              this.followers = data['data']['rows'];
              console.log(this.followers);
          } else {
            this.helperTools.showBadRequestAlert();
          }
        }, err => {
          console.log(err);
          this.helperTools.DismissLoading();
          this.helperTools.showBadRequestAlert();
        })
    })
   }
  ngOnInit() {
  }

}
