import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


// Backend URL
const host = window.location.hostname;
const backendURL = "http://"+host+":3000/";
console.log('backendURL -->',backendURL)
// Backend URL

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  constructor(private http:HttpClient) { }

  public getData(routePath:string):Observable<any>{
    var data:any = this.http.get(backendURL+routePath)
    return data;
  }

  public postData(routePath:string,details:any):Observable<any>{
    var data:any = this.http.post(backendURL+routePath,details)
    return data;
  }

}
