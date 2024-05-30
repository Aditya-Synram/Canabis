import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  API_URL = environment.API_URL;

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService
  ) { }

  login(email: String, password: String, brand_name: String,ip?,device_information?,location_details?) {
    let data:any = {
      email: email,
      password: password,
      brand_name: brand_name,
      allowed_roles: ["customer","employee","applicant"],
    }

    if(ip && ip != "Not found"){data.ip_address = ip;}
    if(device_information && Object.keys(device_information).length > 0){ data.device_information = device_information;}
    if(location_details && Object.keys(location_details).length > 0) { data.location_details = location_details; }

    return this.http.post(`${this.API_URL}login`, data)
  }

  logout(token_to_expire?){
    let user_info = JSON.parse(localStorage.getItem("currentUser"));
    let data = {
      user_id: user_info._id,
      token_to_expire: token_to_expire || localStorage.getItem("token")
    }
    return this.http.post(`${this.API_URL}login/logout`,data);
  }

  checkEmail(email: String) {
    let data = {
      email: email,
    }

    return this.http.post(`${this.API_URL}checkEmail`, data)
  }

  checkPhone(contactno: String, email: String) {
    let data = {
      email: email,
      contactno: contactno,
    }

    return this.http.post(`${this.API_URL}checkPhone`, data)
  }

  sendLinkForgotPassword(email: String) {
    let data = {
      email: email,
    }

    return this.http.post(`${this.API_URL}sendLinkForgotPassword`, data)
  }


  send_reset_password_email(email){
    let data = {
      brand_id: environment.brand_id,
      email: email,
    }
    return this.http.post(`${this.API_URL}sendLinkForgotPassword/hrtech_reset_password`, data);
  }

  public isAuthenticated(): boolean {
    const token:any = localStorage.getItem('token');

    return !this.jwtHelper.isTokenExpired(token);

  }
}
