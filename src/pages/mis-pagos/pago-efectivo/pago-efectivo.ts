import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { EstacionamientoProvider } from '../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../providers/global/global';
import { MensajesProvider } from '../../../providers/mensajes/mensajes';
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
  idFuncionario;
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
    private msjSrv: MensajesProvider,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
    this.idFuncionario = this.global.sesion['id_user'];
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
    const myForm = {
      id_responsable: this.idFuncionario,
    };
    this.estacionamientoService.habilitadoCobro(myForm).subscribe(data => {
      console.log('data pagos=', data);
      if(data['status'] == true) {
        this.navCtrl.push(NewPagoPage);
      } else {
        this.msjSrv.mostrarAlerta('Verificación', data['message']);
      }
    });
  }
}
