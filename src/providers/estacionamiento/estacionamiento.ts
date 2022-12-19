import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class EstacionamientoProvider {
  private httpOptions: object;

  constructor(
    public httpClient: HttpClient
  ) {
    this.httpOptions= {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }
  public getTarifarios() {
    return this.httpClient.get(environment.apiSem + 'sem/get-tarifarios', this.httpOptions);
  }
  public getSitios(cifunc) {
    return this.httpClient.get(environment.apiSem + 'sem/get-sitios/'+cifunc, this.httpOptions);
  }
  public getPrecio(data:object):Observable<object>{
    return this.httpClient.post<object>(environment.apiSem + 'sem/get-price', data, this.httpOptions);
  }
  public saveParking(data:object):Observable<object>{
    return this.httpClient.post<object>(environment.apiSem + 'sem/register-rent', data, this.httpOptions);
  }
  public listActualParquing(data:object):Observable<object>{
    return this.httpClient.post<object>(environment.apiSem + 'sem/get-all-charges', data, this.httpOptions);
  }
  public listEstacionamiento(search) {
    return this.httpClient.get(environment.apiSem + 'sem/search-placa/'+search, this.httpOptions);
  }
  public listTalonario(id){
    return this.httpClient.get(environment.apiSem + 'sem/get-book/'+id, this.httpOptions);
  }
  public listPagosFuncionio(data:object):Observable<object>{
    return this.httpClient.post<object>(environment.apiSem + 'sem/get-all-rent', data, this.httpOptions);
  }
  public lstFuncionarios(){
    return this.httpClient.get(environment.apiSem + 'sem/get-person/get-all', this.httpOptions);
  }
  /*Reportes */
  public reporteHoy(data:object):Observable<object> {
    return this.httpClient.post<object>(environment.apiSem+'sem/get-person/report', data, this.httpOptions);
  }
  public reporteTalonario(data:object):Observable<object> {
    return this.httpClient.post<object>(environment.apiSem+'sem/get-person/report-talonario', data, this.httpOptions);
  }

  /*Grampero*/
  public buscarPlaca(placa) {
    return this.httpClient.get(environment.apiSem + 'sem/get-placa/'+placa, this.httpOptions);
  }

  /** Nuevos servicios **/
  public getManzanos() {
    return this.httpClient.get(environment.apiSem + 'sem/get-manzanos', this.httpOptions);
  }
  public getPriceManazano(data:object):Observable<object>{
    return this.httpClient.post<object>(environment.apiSem + 'sem/get-price-manzano', data, this.httpOptions);
  }
  public saveParkingManzano(data:object):Observable<object>{
    return this.httpClient.post<object>(environment.apiSem + 'sem/register-rent-man', data, this.httpOptions);
  }
  public listParguingManzano(data:object):Observable<object> {
    return this.httpClient.post<object>(environment.apiSem + 'sem/get-all-tiporegistro', data, this.httpOptions);
  }
  public getManzanosUser(data:object):Observable<object> {
    return this.httpClient.post<object>(environment.apiSem + 'sem/get-manzanos-user', data, this.httpOptions);
  }
}
