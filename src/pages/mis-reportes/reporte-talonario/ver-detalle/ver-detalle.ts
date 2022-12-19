import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { EstacionamientoProvider } from '../../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-ver-detalle',
  templateUrl: 'ver-detalle.html',
})
export class VerDetallePage {
  nombreFuncionario;
  toDay;
  suma;
  miLista = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private estacionamientoServ: EstacionamientoProvider,
    private global: GlobalProvider,
    public viewCtrl: ViewController,
  ) {
    this.miLista = navParams.get('ltsTalonarios');
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.toDay = localISOTime.split('T')[0];
    this.nombreFuncionario = this.global.sesion['nombres'];
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.misDatos();
  }
  misDatos() {
    this.suma = this.miLista.reduce((sum, value) => ( sum + value.ventas ), 0);
  }
  cantidadTickets(tini, tfin) {
    const canti = tfin - tini;
    return canti;
  }

  salir() {
    let result = "Se cerró";
    this.viewCtrl.dismiss({result: result});
  }

}
