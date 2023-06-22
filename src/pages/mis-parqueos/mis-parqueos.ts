import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstacionamientoProvider } from '../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../providers/global/global';
import { InicioAccessPage } from '../inicio-access/inicio-access';
import { PagoEfectivoPage } from '../mis-pagos/pago-efectivo/pago-efectivo';
import { ServiciosSemPage } from '../servicios-sem/servicios-sem';

@IonicPage()
@Component({
  selector: 'page-mis-parqueos',
  templateUrl: 'mis-parqueos.html',
})
export class MisParqueosPage {
  private form: FormGroup;
  boletas;
  searchTerm: string = '';
  ciFuncionario;
  myDate: string = new Date().toISOString();
  toDay;
  items = [];
  statusList = false;
  total;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private estacionamientoService: EstacionamientoProvider,
    private global: GlobalProvider,
    private loading: LoadingController,
    private fbuilder: FormBuilder,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
  }
  ngOnInit() {
    this.initializeTickets();
    this.formulario();
  }
  ionViewDidLoad() {
  }
  ventaEfectivos() {
    this.navCtrl.push(PagoEfectivoPage);
  }

  formulario() {
    this.form = this.fbuilder.group({
      num_placa: ['', Validators.required],
    });
  }

  initializeItems() {
    this.initializeTickets();
  }  

  initializeTickets() {
    const myForm = {
      ci_usuario: this.ciFuncionario,
      fecha: this.toDay,
    };
    let load = this.loading.create({
      content:'Cargando...',
    });
    load.present();
    this.estacionamientoService.listPagosFuncionio(myForm).subscribe(data => {
      if(data['status'] === true){
        this.items = data['response'];
        this.total = data['total'];
      }
      load.dismiss();
    });
  }

  getItems(ev: any) {
    const val = ev.value;
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
  
  getColor(value) {
    switch (value) {
      case 'LINEA':
        return '#009877';
      case 'TALONARIO':
        return '#00acd8';
      case 'TARJETA':
        return '#ae1857';
      case 'EFECTIVO':
        return 'orange';
      case 'PARQUIMETRO':
        return '#f18721';
      case ' BOLETA':
        return '#6d56a0';
    }
  }
  goback() {
    this.navCtrl.push(ServiciosSemPage);
  }
  get num_placa() { return this.form.get('num_placa'); }
}
