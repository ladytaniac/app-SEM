import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalProvider } from '../../providers/global/global';
import { EstacionamientoProvider } from '../../providers/estacionamiento/estacionamiento';
import { ServiciosSemPage } from '../servicios-sem/servicios-sem';
import { MensajesProvider } from '../../providers/mensajes/mensajes'

@IonicPage()
@Component({
  selector: 'page-servicios-engrampador',
  templateUrl: 'servicios-engrampador.html',
})
export class ServiciosEngrampadorPage {
  toDay;
  ciFuncionario;
  items = [];
  tipoFuncionario: string = '';
  private form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private global: GlobalProvider,
    private loading: LoadingController,
    private estacionamientoService: EstacionamientoProvider,
    private fbuilder: FormBuilder,
    private msjSrv: MensajesProvider,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);

    var dayEn = localISOTime.split('T')[0];
    this.toDay= dayEn.split('-')[2]+'-'+dayEn.split('-')[1]+'-'+dayEn.split('-')[0];
    this.ciFuncionario = this.global.sesion['ci'];
  }
  ngOnInit() {
    this.formulario();
    this.tipoFuncionario = this.global.sesion['tipo_user'];
  }

  ionViewDidLoad() {
  }
  formulario() {
    this.form = this.fbuilder.group({
      num_placa: ['', Validators.required],
    });
  }
  
  bucarPlaca() {
    if (this.form.valid) {
      const placa = this.form.get('num_placa').value;
      let loading = this.loading.create({
        content: 'Cargando...'
      });
      loading.present();

      this.estacionamientoService.buscarPlaca(placa).subscribe(data => {
        if(data['status'] == true) {
          this.items = data['response'];
          loading.dismiss();
        } else {
          this.msjSrv.mostrarAlerta('Verificación', data['message']);
          this.form.reset();
          this.items = [];
          loading.dismiss();
        }
      })
    } else {
      console.log('Falta validar el campo');
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
  initializeItems() {

  }
  goback() {
    this.navCtrl.push(ServiciosSemPage);
  }

  get num_placa() { return this.form.get('num_placa'); }
}
