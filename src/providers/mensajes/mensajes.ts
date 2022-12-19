import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';

@Injectable()
export class MensajesProvider {
  private isLoading:boolean;
  constructor(
    public http: HttpClient,
    private alerta: AlertController,
    private cargando: LoadingController
  ) {
  }
  ocultarToast(){
  }
  async mostrarAlerta(titulo:string, mensaje:string){
    const msjAlerta=await this.alerta.create({
      title: titulo,
      message: mensaje,
      buttons: [{text:'Aceptar', cssClass: 'exit-button'}],
      cssClass: 'buttonCss'
    });
    await msjAlerta.present();
  }
}
