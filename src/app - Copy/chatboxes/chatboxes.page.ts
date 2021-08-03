import { Component, OnInit, NgZone } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { AuthService } from '../shared/services/auth.service';
import { ChatService } from '../shared/services/chat.service';
import { NotificationsPage } from '../notifications/notifications.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chatboxes',
  templateUrl: './chatboxes.page.html',
  styleUrls: ['./chatboxes.page.scss'],
})
export class ChatboxesPage implements OnInit {

  offset = 0;
  loadMessages = false;
  Rooms = [] as any;
  ImageLink;
  search_word = '';
  userData;
  countNotification = 0;
  
  constructor(private helperTools: HelperToolsService,
    private auth: AuthService, 
    private notiController: NotificationsPage,
    private modalController: ModalController,
    private chatCntroller: ChatService , private ngzone : NgZone) {
      
    }

  ngOnInit() {
    this.userData = this.auth.SellerData;
    this.auth.io.socket.on('newMessage', (data) => {
      this.ngzone.run(() =>{
        this.newMessageCome(data);
      })
    });
  }
  ionViewDidEnter() {
    this.loadMessages = false;
    this.getAllNotification();
    console.log("ionViewDidEnter ChatboxesPage");
    this.offset = 0;
    this.helperTools.ShowLoadingSpinnerOnly().then(_ => {
      this.ImageLink = SharedClass.BASE_IMAGE_URL;
      this.GetAllRooms(this.offset);
    });
  }
  newMessageCome(data){
    for(let i =0;i<this.Rooms.length ;i++){
      if (this.Rooms[i].id == data['room_id']){
        this.Rooms[i].messages[0] = data;
      }
    }
  }
  GoToChatRoom(Temp){
    // this.navCtrl.push("ChatPage", { ChateRoom: Temp })
  }
  GetAllRooms(OFFset){
    let DataRoom = {
      market_id: this.auth.MarketsData[0]["id"],
      search_word: this.search_word,
      offset: OFFset
    }
    this.chatCntroller.LoadAllRooms(DataRoom).subscribe(Data => {
      if(Data['status'] == 'success'){
        console.log(Data['data']);
        if(OFFset == 0){
          this.Rooms = Data['data']['rows'];
          this.Rooms.sort((a,b)=> {
            if (a.messages[0] && b.messages[0]) {
              let dateA = new Date(a.messages[0].createdAt);
              let dateB = new Date(b.messages[0].createdAt);
              if (dateA > dateB){
                return -1;
              } else {
                return 1;
              }
            }
          });
        } else{
          this.Rooms = this.Rooms.concat(Data['data'])
        }
        this.loadMessages = true;
        this.helperTools.DismissLoading();
      } else {
        console.log(Data);
        this.helperTools.showBadRequestAlert();
      }
    }, err => {
      console.log(err);
      this.helperTools.showBadRequestAlert();
    })
  }

  LoadInfiniteData(){
    return new Promise((resolve, reject) => {
      this.offset++;
      this.GetAllRooms(this.offset);
      resolve("Done");
    });
  }
  DoInfinite(event){
    this.LoadInfiniteData().then(_ => {
      event.complete();
    }).catch(err => {
      event.complete();
    });
  }

  getAllNotification() {
    this.notiController.getAllNotificationsCounts();
    setTimeout(() => {
      this.countNotification = this.notiController.allNotiCount;
    }, 5000);
  }
  onDeleteClicked(room_id){
    this.helperTools.ShowLoadingSpinnerOnly().then(__ => {
      this.chatCntroller.removeRoom(room_id).subscribe(data => {
        this.helperTools.DismissLoading();
        if (data['status'] == 'success') {
          this.helperTools.ShowAlertWithOkButton('تم', 'تم حذف المحادثة بنجاح');
          this.GetAllRooms(0);
          this.modalController.dismiss();
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
