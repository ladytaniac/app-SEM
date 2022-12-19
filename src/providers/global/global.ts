import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalProvider {
  public sesion: object;
  public addressPrint: string;

  constructor(public http: HttpClient) {
    this.sesion= {};
    this.addressPrint= '';
  }

}
