import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { SharedClass } from '../shared/Shared';
import { AuthService } from '../shared/services/auth.service';
import { HelperToolsService } from '../shared/services/helper-tools.service';
import { ChatService } from '../shared/services/chat.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { EventEmitterService } from '../shared/services/event-emitter.service';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  Messages = [] as any;
  offset = 0;
  ImageLink;
  showEmojiPicker = false;
  user_id = "";
  market_id = "";
  @ViewChild("chat_input", { static: false }) messageInput;
  // @ViewChild(Content) content: Content;
  Message = "";
  ImageMessage = {} as any;
  connection;

  MarketData = {} as any;
  RoomData;
  order = {} as any;
  constructor(
    private Chatcontrollr: ChatService,
    private helper_tools: HelperToolsService,
    private auth: AuthService,
    private zone: NgZone,
    private eventEmiiter: EventEmitterService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log("ionViewDidLoad ChatPage");

    this.route.queryParams.subscribe(params => {
      this.user_id = params['user_id'];
      if(params['order']){
        this.order = OrderService.orderdetails;
      }
      this.market_id = this.auth.MarketsData[0]["id"];
      this.MarketData = this.auth.MarketsData[0];
      this.offset = 0;
      this.ImageLink = SharedClass.BASE_IMAGE_URL;
      this.LoadAllMessages(this.offset);

    })

    // this.io.sails.path = '/api';
    //this.io.sails.environment = 'production';
    //this.io.sails.transports = [ 'polling' , 'websocket'];
    //this.io.sails.autoConnect = false;
    // this.connection = this.io.sails.connect();
    //this.io.sails.useCORSRouteToGetCookie = false;
    this.auth.io.socket.on("connect", () => {
      console.log("connect");
    });
    // on New Message Come
    this.auth.io.socket.on("newMessage", data => {
      console.log(data);
      this.zone.run(() => {
        this.Messages.push(data);
        // this.scrollto();
      });
    });
  }

  ReturnPage() {
    // this.navCtrl.pop();
  }

  LoadAllMessages(OFFset) {
    let DaataSent = {
      offset: OFFset,
      market_id: this.market_id,
      user_id: this.user_id,
      ID : ''
    };
    console.log(DaataSent)
    this.Chatcontrollr.LoadAllMessages(DaataSent).subscribe(
      Data => {
        console.log(Data);
        if (Data["status"] == "success") {
          if (OFFset == 0) {
            this.Messages = Data["data"]["messages"];
            // no message codition
            // this.Messages.length < 1 && 
            if(this.order && this.order.products){
              for (let index = 0; index < this.order.products.length; index++) {
                const element = this.order.products[index];
                this.Message += 'https://alaunna.com/products/details/'+this.order.products[index].id+' \n';
              }
            }
            this.RoomData = Data["data"]["room"];
          } else {
            this.Messages = this.Messages.concat(Data["data"]);
          }
          for (let index = 0; index < this.Messages.length; index++) {
            const message = this.Messages[index];
            if(message.type == 'message' && this.validURL(message.text)){
              console.log(message.text);
              message.text = '<a href="'+message.text+'">'+message.text+'</a>';
              console.log(message.text);
            }
          }
          this.eventEmiiter.emitChange({ notification: 'changed' });
          // this.scrollto();
        } else {
          this.helper_tools.showBadRequestAlert();
        }
      },
      err => {
        console.log(err);
        this.helper_tools.showBadRequestAlert();
      }
    );
  }

  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  SendMessage() {
    if (this.Message != "") {
      this.auth.io.socket.post(
        "/message/send",
        {
          text: this.Message,
          type: "message",
          from_market_id: this.market_id,
          room_id: this.RoomData['id']
        },
        (body, JWR) => {
          this.zone.run(() => {
            if (body["status"] == "success") {
              this.Message = "";
              // this.scrollto();
              this.Messages.push(body["data"]);
            }
          });
        }
      );
    }
  }

  ongetNewImage() {
    this.helper_tools
      .OpenImage(500, 500)
      .then(CameraData => {
        this.ImageMessage["image"] = {
          base64: CameraData,
          alt: "Brandy",
          description: "Brandy"
        };
        if (this.ImageMessage["image"]) {
          console.log(this.ImageMessage);
          this.auth.io.socket.post(
            "/message/send",
            {
              image: this.ImageMessage["image"],
              type: "image",
              from_market_id: this.market_id,
              room_id: this.RoomData['id']
            },
            (body, JWR) => {
              this.zone.run(() => {
                if (body["status"] == "success") {
                  this.Message = "";
                  this.ImageMessage = {} as any;
                  // this.scrollto();
                  this.Messages.push(body["data"]);
                }
              });
            }
          );
        }
      })
      .catch(err => {
        // this.helper_tools.ShowBadRequestErrorAlert();
      });
  }

  // scrollto() {
  //   setTimeout(() => {
  //     this.content.scrollToBottom();
  //   }, 500);
  // }
  CalculateFromNow(date) {
    return moment(date).format("hh:mm a");
  }
  onFocus() {
    this.showEmojiPicker = false;
    // this.content.resize();
    // this.scrollto();
  }

  switchEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
    if (!this.showEmojiPicker) {
      this.messageInput.setFocus();
    }
    // this.content.resize();
    // this.scrollto();
  }

}
