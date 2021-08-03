import { Injectable, ViewChildren, QueryList } from '@angular/core';
import {
  AlertController, LoadingController,
  ToastController,
  ActionSheetController,
  Platform,
  PopoverController,
  ModalController,
  MenuController,
  IonRouterOutlet
} from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';

@Injectable({
  providedIn: 'root'
})
export class HelperToolsService {

  loading;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private nativeToast: Toast,
    private actionsheetCtrl: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private router: Router) { }
  async ShowAlertWithOkButton(title, message) {
    // const alert = await this.alertController.create({
    //   header: title,
    //   message: message,
    //   buttons: ['تم']
    // });
    // return alert.present();
    return this.showCustomAlert(title, '', message);
  }
  showBadRequestAlert() {
    return this.ShowAlertWithOkButton('خطأ', 'يرجى التاكد من الاتصال بشبكة الانترنت');
  }
  async showCustomAlert(title, subTitle, message) {
    const customAlert = await this.alertController.create({
      // header: title,
      subHeader: subTitle,
      message: message,
      cssClass: 'custom-alert-class',
      buttons: [
        {
          text: 'موافق',
          role: 'done',
          cssClass: 'cutom-accept-button'
        }
      ]
    })
    return customAlert.present();
  }
  // end alert Part
  // start loading part
  async ShowLoadingSpinnerOnly() {
    this.loading = await this.loadingCtrl.create({
      spinner: null,
      message: `<div class="custom-spinner-container">
      <div class="custom-spinner-box">
        <img src="assets/img/Rolling.gif" style="width : 80px !important;height : 80 !important">
        <p>لحظات من فضلك</p>
      </div>
    </div>`,
      cssClass: 'scale-down-center',
      translucent: true,
      showBackdrop: false,
    });
    return this.loading.present();
  }
  DismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }



  async ShowExitAlert() {
    return new Promise(async (resolve, reject) => {
      let alert = await this.alertController.create({
        header: 'هل انت متاكد',
        message: 'هل انت متأكد من انك تريد الخروج من التطبيق',
        buttons: [
          {
            text: 'الغاء',
            role: 'cancel',
            handler: () => {
              reject('err');
            }
          },
          {
            text: "تأكيد",
            handler: () => {
              resolve('done');
            }
          }]
      })
      alert.present();
    })
  }
  async ShowToast(title, duration, position) {
    let toast = await this.toast.create({ header: title, duration: duration, position: position });
    return toast.present();
  }

  //camera part
  CameraLoadPhoto(targetwidth, targetHeight) {
    const options = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      //maximumImagesCount: 4,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      // targetWidth: targetwidth,
      // targetHeight: targetHeight,
    };
    return this.camera.getPicture(options);
  }
  // Load Photo from Gallery
  GalleryLoadPhoto(targetwidth, targetHeight) {
    const options = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      //maximumImagesCount: 4,
      //sourceType: this.camera.PictureSourceType.CAMERA,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      // targetWidth: targetwidth,
      // targetHeight: targetHeight
    };
    return this.camera.getPicture(options);
  }
  OpenImage(targetwidth, targetHeight) {
    return new Promise(async (resolve, reject) => {
      let actionsheet = await this.actionsheetCtrl.create({
        header: 'تحميل صورة',
        buttons: [
          {
            text: 'الصور',
            icon: 'images',
            handler: () => {
              this.GalleryLoadPhoto(targetwidth, targetHeight).then(DataURI => {
                resolve(DataURI);
              }).catch(err => {
                reject(err)
              });
            }
          },
          {
            text: 'الكاميرا',
            icon: 'camera',
            handler: () => {
              this.CameraLoadPhoto(targetwidth, targetHeight).then(URI => {
                resolve(URI);
              }).catch(err => {
                reject(err);
              })
            }
          },
          {
            text: 'الغاء',
            role: 'cancel',
            handler: () => {
              reject('cancel');
            }
          }
        ]
      });
      actionsheet.present();
    })
  }

  //camera part
  CameraLoadPhotoProduct() {
    const options = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      //maximumImagesCount: 4,
      sourceType: this.camera.PictureSourceType.CAMERA,
      // sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
    };
    return this.camera.getPicture(options);
  }
  // Load Photo from Gallery
  GalleryLoadPhotoProduct() {
    const options = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      //maximumImagesCount: 4,
      //sourceType: this.camera.PictureSourceType.CAMERA,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
    };
    return this.camera.getPicture(options);
  }
  OpenImageProduct() {
    return new Promise(async (resolve, reject) => {
      let actionsheet = await this.actionsheetCtrl.create({
        header: 'تحميل صورة',
        buttons: [
          {
            text: 'الصور',
            icon: 'images',
            handler: () => {
              this.GalleryLoadPhotoProduct().then(DataURI => {
                resolve(DataURI);
              }).catch(err => {
                reject(err)
              });
            }
          },
          {
            text: 'الكاميرا',
            icon: 'camera',
            handler: () => {
              this.CameraLoadPhotoProduct().then(URI => {
                resolve(URI);
              }).catch(err => {
                reject(err);
              })
            }
          },
          {
            text: 'الغاء',
            role: 'cancel',
            handler: () => {
              reject('cancel');
            }
          }
        ]
      });
      actionsheet.present();
    })
  }

}
