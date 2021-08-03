import { Injectable } from '@angular/core';
import { SharedClass } from '../Shared';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  SellerData;
  MarketsData;
  UserIsLogiend = false;
  io;
  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
  }
  Login(LoginData) {
    let URL = `${SharedClass.BASE_URL}/auth/loginSellerApp`;
    return this.http.post(URL, LoginData);
  }
  sellerLoginSocial(LoginData) {
    let URL = `${SharedClass.BASE_URL}/auth/sellerLoginSocial`;
    return this.http.post(URL, LoginData);
  }
  LoginTest(phone, password) {
    var httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      })
    };
    let body = "phone=" + phone + "&password=" + password;
    return this.http.post("//malexs.net/playstation_admin/public/api/login", body, httpOptions);
  }
  register(RegisterData) {
    let URL = `${SharedClass.BASE_URL}/auth/signup`;
    return this.http.post(URL, RegisterData);
  }
  sellerRegisterSocial(RegisterData) {
    let URL = `${SharedClass.BASE_URL}/auth/sellerRegisterSocial`;
    return this.http.post(URL, RegisterData);
  }
  sendPhoneCode(data) {
    console.log(data);
    let URL = `${SharedClass.BASE_URL}/auth/sendPhoneCode`;
    return this.http.post(URL, data);
  }
  verifyPhoneCode(data) {
    let URL = `${SharedClass.BASE_URL}/auth/verifyPhoneCode`;
    return this.http.post(URL, data);
  }
  forgetPassword(data) {
    let URL = `${SharedClass.BASE_URL}/auth/forgetPassword`;
    return this.http.post(URL, data);
  }
  varifyToken(UserToken) {
    let URL = `${SharedClass.BASE_URL}/auth/varify`;
    return this.http.post(URL, { token: UserToken });
  }

  phoneVarified(user_id) {
    let URL = `${SharedClass.BASE_URL}/auth/phone`;
    return this.http.post(URL, { id: user_id });
  }

  sendPasswordMail(email) {
    let URL = `${SharedClass.BASE_URL}/auth/password/mail`;
    return this.http.post(URL, { email: email });
  }
  changePassword(token, password) {
    let URL = `${SharedClass.BASE_URL}/auth/password/reset`;
    return this.http.post(URL, { token: token, password: password });
  }

  EditUserProfile(UserData) {
    const URL = `${SharedClass.BASE_URL}/auth/edit`;
    return this.http.post(URL, UserData);
  }

  editMarket(marketData) {
    let URL = `${SharedClass.BASE_URL}/market/edit`;
    return this.http.post(URL, marketData);
  }


  createNotification(NotificationData) {
    let URL = `${SharedClass.BASE_URL}/notification/create`;
    return this.http.post(URL, NotificationData);
  }

  getNotifications(offset, user_id) {
    let URL = `${SharedClass.BASE_URL}/notification`;
    return this.http.get(URL, { params: { offset, user_id } });
  }
  removeAllNotification(user_id) {
    let URL = `${SharedClass.BASE_URL}/notification/remove/all`;
    return this.http.post(URL, { user_id });
  }

  getFollowers(market_id) {
    let URL = `${SharedClass.BASE_URL}/favorite?market_id=${market_id}`;
    return this.http.get(URL);
  }

  getAllNotificationsCounts(user_id) {
    let URL = `${SharedClass.BASE_URL}/customerNotifications/countForSeller`;
    return this.http.post(URL, {  user_id: user_id  });
  }
}
