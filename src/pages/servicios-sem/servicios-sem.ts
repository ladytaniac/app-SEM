import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MisPagosPage } from '../mis-pagos/mis-pagos';
import { MisParqueosPage } from '../mis-parqueos/mis-parqueos';
import { MisFuncionariosPage } from '../mis-funcionarios/mis-funcionarios';
import { MisReportesPage } from '../mis-reportes/mis-reportes';
import { GlobalProvider } from '../../providers/global/global';
import { ServiciosEngrampadorPage } from '../servicios-engrampador/servicios-engrampador';

@IonicPage()
@Component({
  selector: 'page-servicios-sem',
  templateUrl: 'servicios-sem.html',
})
export class ServiciosSemPage {
  tipoFuncionario: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider,) {
  }
  ngOnInit() {
    this.tipoFuncionario = this.global.sesion['tipo_user'];
  }

  ionViewDidLoad() {
  }

  showPagos() {
    this.navCtrl.push(MisPagosPage);
  }
  reportes() {
    this.navCtrl.push(MisReportesPage);
  }
  mostrarParqueos() {
    this.navCtrl.push(MisParqueosPage);
  }
  mostrarFuncionarios() {
    this.navCtrl.push(MisFuncionariosPage);
  }
  mostrarPlaca() {
    this.navCtrl.push(ServiciosEngrampadorPage);
  }
}
