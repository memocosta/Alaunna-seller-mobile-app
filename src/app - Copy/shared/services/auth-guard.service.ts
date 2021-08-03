import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';
import { HelperToolsService } from './helper-tools.service';
import { EventEmitterService } from './event-emitter.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
    private storage: Storage,
    private helperTools: HelperToolsService,
    private router: Router, 
    private eventEmitter: EventEmitterService, private navController : NavController) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<boolean>((resolve, reject) => {
      // if (!this.authService.SellerData || !this.authService.UserIsLogiend){
      //   this.router.navigate(['/login']);
      //   resolve(false);
      // } else {
      this.storage.get('token').then(token => {
        if (!token) {
          this.router.navigate(['/login']);
          resolve(false);
        }
        this.authService.varifyToken(token).subscribe(data => {
          console.log(data);
          if (data['status'] == 'success') {
            data["data"]["token"] = token;
            this.authService.SellerData = data["data"];
            this.authService.MarketsData = data["data"]["markets"];
            this.eventEmitter.emitChange({ event_name: 'userLogin' });
            if (!data["data"]["markets"] || !data["data"]["markets"][0]) {
              this.helperTools.ShowAlertWithOkButton(
                "خطأ",
                "يجب عليك اضافه المتجر الخاص بك"
              );
              this.router.navigate(['/add-store']);
              resolve(false);
              return;
            }
            resolve(true);
          } else {
            // this.router.navigate(['/login']);
            this.navController.navigateRoot('/login');
            resolve(false);
          }
        }, err => {
          this.navController.navigateRoot('/login');
          resolve(false);
        })
      })
      // }
    })
  }
}
