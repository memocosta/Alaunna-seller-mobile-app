import { Injectable } from '@angular/core';
import { SharedClass } from '../Shared';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public http: HttpClient) {
    console.log('Hello ChatControllerProvider Provider');
  }

  LoadAllRooms(UserData) {
    let URL = `${SharedClass.BASE_URL}/room?market_id=${UserData.market_id}&offset=${UserData.offset}&search_word=${UserData.search_word}`;
    return this.http.get(URL);
  }

  getUnreadMessages(UserData) {
    let URL = `${SharedClass.BASE_URL}/room/unreadmessages?market_id=${UserData.market_id}&offset=${UserData.offset}&search_word=${UserData.search_word}`;
    return this.http.get(URL);
  }

  getmessagescount(UserData) {
    let URL = `${SharedClass.BASE_URL}/room/getmessagescount?market_id=${UserData.market_id}`;
    return this.http.get(URL);
  }

  LoadAllMessages(Data) {
    let URL = `${SharedClass.BASE_URL}/messages?offset=${Data.offset}&room_id=${Data.ID}&user_id=${Data.user_id}&market_id=${Data.market_id}`;
    return this.http.get(URL);
  }
  removeRoom(room_id) {
    let URL = `${SharedClass.BASE_URL}/room/remove`;
    return this.http.post(URL, { id: room_id })
  }
  
}
