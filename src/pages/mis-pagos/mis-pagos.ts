import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiciosSemPage } from '../servicios-sem/servicios-sem';
import { PagoEfectivoPage } from './pago-efectivo/pago-efectivo';
import { PagoBoletoPage } from './pago-boleto/pago-boleto';

@IonicPage()
@Component({
  selector: 'page-mis-pagos',
  templateUrl: 'mis-pagos.html',
})
export class MisPagosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  goback() {
    this.navCtrl.push(ServiciosSemPage);
  }

  pagoBoleto() {
    this.navCtrl.push(PagoBoletoPage);
  }
  pagoEfectivo() {
    this.navCtrl.push(PagoEfectivoPage);
  }

}
