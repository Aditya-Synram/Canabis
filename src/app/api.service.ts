import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
  
})
export class ApiService {

LoggedInUser :any
 
  constructor(private http: HttpClient) { }
  get_brand_by_id(data:any){
    return this.http.post(`${environment.API_URL}all_companies/get_brand_by_id`, data);
  }
}
