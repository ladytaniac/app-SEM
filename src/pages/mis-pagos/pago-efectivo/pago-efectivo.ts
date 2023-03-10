import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { EstacionamientoProvider } from '../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../providers/global/global';
import { MisPagosPage } from '../mis-pagos';
import { NewPagoPage } from './new-pago/new-pago';

@IonicPage()
@Component({
  selector: 'page-pago-efectivo',
  templateUrl: 'pago-efectivo.html',
})
export class PagoEfectivoPage {
  boletas;
  searchTerm: string = '';
  ciFuncionario;
  myDate: string = new Date().toISOString();
  toDay;
  items = [];
  miVenta;
  funcionarioCi;
  isItemAvailable = false;
  itemss = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private estacionamientoService: EstacionamientoProvider,
    private global: GlobalProvider,
    private loading: LoadingController,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
  }
  ngOnInit() {
    this.initializeTickets();
  }

  ionViewDidLoad() {
    this.initializeTickets();
  }
  initializeTickets() {
    const myForm = {
      ci_usuario: this.ciFuncionario,
      fecha: this.toDay,
      tipo_boleta: 'BOLETA'
    };
    let load = this.loading.create({
      content:'Cargando...',
    });
    load.present();
    this.estacionamientoService.listParguingManzano(myForm).subscribe(data => {
      if(data['status'] === true){
        this.items = data['response'];
        this.miVenta = data['total'];
      }
      load.dismiss();
    })
  }
  getItems(ev: any) {
    const val = ev.value
    let itemsAux = this.items;   
    if (val && val.trim() !== '') {
      itemsAux = itemsAux.filter((item) => {
        return (item.placa.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.items = itemsAux;
    } else {
      this.initializeTickets();
    }
  }
  goback() {
    this.navCtrl.push(MisPagosPage);
  }
  newParquing() {
    this.navCtrl.push(NewPagoPage);
  }
}
