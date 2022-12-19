import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstacionamientoProvider } from '../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../providers/global/global';
import { MisReportesPage } from '../mis-reportes';

@IonicPage()
@Component({
  selector: 'page-reporte-actual',
  templateUrl: 'reporte-actual.html',
})
export class ReporteActualPage {
  idUser;
  toDay;
  totalFunc;
  boletaFunc;
  talonarioFunc;
  lineaFunc;
  parquimetroFunc;
  verOpciones = false;
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
    this.idUser = this.global.sesion['id_user'];
  }

  ngOnInit() {
    this.formulario();
    this.miInformacion();
  }

  ionViewDidLoad() {
  }
  formulario() {
    this.form = this.fbuilder.group({
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
    });
  }
  miInformacion() {
    const myForm = {
      id_responsable: this.idUser,
      fecha:  this.toDay,
    };
    let loading = this.loading.create({
      content: 'Cargando...'
    });
    loading.present();
    this.estacionamientoServ.reporteHoy(myForm).subscribe(data => {
      if(data['status'] === true) {
        this.totalFunc = data['total'];
        this.boletaFunc = data['response'].boleta;
        this.talonarioFunc = data['response'].talonario;
        this.lineaFunc = data['response'].linea;
        this.parquimetroFunc = data['response'].parquimetro;
        if(this.totalFunc !== 0 && this.talonarioFunc !== 0) {
          this.verOpciones = true;
        } else {
          this.verOpciones = false;
        }
      }
      loading.dismiss();
    });
  }
  goback(){
    this.navCtrl.push(MisReportesPage);
  }
  get fecha_inicio() { return this.form.get('fecha_inicio'); }
  get fecha_fin() { return this.form.get('fecha_fin'); }
}
