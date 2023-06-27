import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';

@Injectable()
export class ServUserProvider {
  private readonly _SESION:string = 'sesion';
  private httpOptions: object;

  constructor(
    public http: HttpClient,
    private storage: Storage
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  }

  public logueoUser(data:object):Observable<any>{
    return this.http.post(environment.loginURL,data);
  }
  public changePassword(data:object):Observable<any>{
    return this.http.post(environment.apiSem+'sem/cambiar-password', data);
  }  
}
