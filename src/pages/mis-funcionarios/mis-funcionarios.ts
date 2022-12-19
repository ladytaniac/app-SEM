import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstacionamientoProvider } from '../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../providers/global/global';
import { ServiciosSemPage } from '../servicios-sem/servicios-sem';

@IonicPage()
@Component({
  selector: 'page-mis-funcionarios',
  templateUrl: 'mis-funcionarios.html',
})
export class MisFuncionariosPage {
  boletas;
  searchTerm: string = '';
  ciFuncionario;
  myDate: string = new Date().toISOString();
  toDay;
  items = [];
  lstFuncionarios = [];
  statusList = false;
  total;
  dniFuncionario = '';
  nombreFuncionario = '';
  private form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fbuilder: FormBuilder,
    private estacionamientoServ: EstacionamientoProvider,
    private global: GlobalProvider,
    private loading: LoadingController,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
  }
  ngOnInit() {
    this.formulario();
    this.misFuncionarios();
  }

  ionViewDidLoad() {
  }

  misFuncionarios() {
    this.estacionamientoServ.lstFuncionarios().subscribe(data => {
      if(data['status'] === true) {
        this.lstFuncionarios =  data['response'];
      }
    });
  }

  formulario() {
    this.form = this.fbuilder.group({
      funcionario: ['', Validators.required],
    });
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
  datosPagosFuncionario() {
    const codFuncionario = this.form.get('funcionario').value;
    this.dniFuncionario = codFuncionario['dni'];
    const myForm = {
      ci_usuario: this.dniFuncionario,
      fecha:  this.toDay,
    };
    let loading = this.loading.create({
      content: 'Cargando...'
    });
    loading.present();

    this.estacionamientoServ.listPagosFuncionio(myForm).subscribe(data => {
      if(data['status'] === true){
        var misboletas = data['response'];
        this.total = data['total'];
        this.items = misboletas;
        this.nombreFuncionario = codFuncionario['nombre_completo'];
      } else {
      }
      loading.dismiss();
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
      this.datosPagosFuncionario();
    }
  }
  goback(){
    this.navCtrl.push(ServiciosSemPage);
  }
  get funcionario() { return this.form.get('funcionario'); }
}
