import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  private form: FormGroup;
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
    private fbuilder: FormBuilder,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
    this.idFuncionario = this.global.sesion['id_user'];
  }
  ngOnInit() {
    this.initializeTickets();
    this.formulario();
  }

  ionViewDidLoad() {
    this.initializeTickets();
  }
  formulario() {
    this.form = this.fbuilder.group({
      num_placa: ['', [Validators.required, Validators.minLength(5)]],
    });
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
  bucarPlaca() {
    const placa = this.form.get('num_placa').value;
    let itemsAux = this.items;
    if (placa && placa.trim() !== '') {
      itemsAux = itemsAux.filter((item) => {
        return (item.placa.toLowerCase().indexOf(placa.toLowerCase()) > -1);
      });
      this.items = itemsAux;
    } else {
      this.initializeTickets();
    }
  }

  /*bucarPlaca2() {
    const placa = this.form.get('num_placa').value;
    const myForm = {
      search: placa,
      fecha: this.toDay
    };
    this.estacionamientoService.searchPlaca(myForm).subscribe(data => {
      if(Object.keys(data).length > 0) {
        this.showplaca = true;
        this.mensaje = '';
      } else {
        this.showplaca = false;
        this.mensaje = 'Lo siento la placa: '+ placa + ' que busco no se encuentra en los registros.';
      }
      this.placas = data;
    });
  }*/
  goback() {
    
    this.navCtrl.push(MisPagosPage);
  }
  newParquing() {
    const myForm = {
      id_responsable: this.idFuncionario,
    };
    this.estacionamientoService.habilitadoCobro(myForm).subscribe(data => {
      // console.log('data pagos=', data);
      if(data['status'] == true) {
        this.navCtrl.push(NewPagoPage);
      } else {
        this.msjSrv.mostrarAlerta('Verificación', data['message']);
      }
    });
  }
  get num_placa() { return this.form.get('num_placa'); }
}
