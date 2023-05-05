import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiciosSemPage } from '../servicios-sem/servicios-sem';
import { ReporteActualPage } from './reporte-actual/reporte-actual';

@IonicPage()
@Component({
  selector: 'page-mis-reportes',
  templateUrl: 'mis-reportes.html',
})
export class MisReportesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
  }
  goback() {
    this.navCtrl.push(ServiciosSemPage);
  }
  reporteHoy() {
    this.navCtrl.push(ReporteActualPage);
  }

}
