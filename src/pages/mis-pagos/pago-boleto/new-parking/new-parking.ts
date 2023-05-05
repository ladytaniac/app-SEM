import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EstacionamientoProvider } from '../../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../../providers/global/global';
// import { PagoBoletoPage } from '../pago-boleto';
import { MensajesProvider } from '../../../../providers/mensajes/mensajes'

interface DatoReserva {
  id_tarifario: number,
  tiempo: string
}
interface DatoSelect {
  valor: string;
  id: number;
  monto?: number;
}
interface DatosTalonario {
  id_talonario: string,
  numero: number
}

@IonicPage()
@Component({
  selector: 'page-new-parking',
  templateUrl: 'new-parking.html',
})
export class NewParkingPage {
  private tiempos: DatoReserva[];
  private placas: DatoSelect[];
  private pagado: boolean;
  private form: FormGroup;
  espacios;
  miPago;
  ciFuncionario;
  idFuncionario;
  myDate: String = new Date().toISOString();
  toDay;
  placasFunci;
  boletas;
  lstTalonario;
  rangoBoleta;
  resultsAvailable: boolean = false;
  items: any;
  formSave: boolean = false;

  showDatos: boolean = false;
  showTimeExt: boolean = false;

  manzanos = [];
  idUser;
  micuadra = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fbuilder: FormBuilder,
    private estacionamientoServ: EstacionamientoProvider,
    private global: GlobalProvider,
    private msjSrv: MensajesProvider,
    private loading: LoadingController,
  ) {
    this.pagado = false;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
    this.idFuncionario = this.global.sesion['id_user'];
    this.idUser = this.global.sesion['id_user'];
  }
  ngOnInit() {
    this.formulario();
    this.misTiempos();
    this.misEspacios();
    this.initializeTickets();
    this.miTalonario();
    this.misManzanosByUser();
  }

  ionViewDidLoad() {
  }
  formulario() {
    this.form = this.fbuilder.group({
      cod_manzano: ['', Validators.required],
      // cod_espacio: ['', Validators.required],
      tiempo_select: ['', Validators.required],
      talonario_select: ['', Validators.required],
      placa: ['', Validators.required],
      monto: ['', Validators.required],
      cant_boletos: ['', Validators.required],
      hr_inicio: ['', Validators.required],
      hr_fin: ['', Validators.required],
      t_alargue: ['']
    });
  }
  /*misManzanos() {
    this.estacionamientoServ.getManzanos().subscribe(data => {
      console.log(data);
      if(data['status'] == true) {
        this.manzanos = data['response'];
      }
    })
  } */

  misManzanosByUser() {
    const myForm = {
      id_responsable: this.idUser,
    };
    this.estacionamientoServ.getManzanosUser(myForm).subscribe(data => {
      if(data['status'] == true) {
        this.manzanos = data['response'];
      }
    });
  }
  selectCuadra() {
    const codManzano = this.form.get('cod_manzano').value;
    if(codManzano != '') {
      const selecionado = this.manzanos.filter(x => x.id_manzano === codManzano);
      this.micuadra = selecionado[0].concat;
    } else {
      this.micuadra = '';
    }
  }
  miTalonario() {
    this.estacionamientoServ.listTalonario(this.idFuncionario).subscribe(data => {
      if(data['status'] == true) {
        this.lstTalonario = data['response'];
      }
    });
   }
  misEspacios() {
    this.estacionamientoServ.getSitios(this.ciFuncionario).subscribe(data => {
      this.espacios = data['response'];
    });
  }
  misTiempos() {
    this.estacionamientoServ.getTarifarios().subscribe(data => {
      this.tiempos = data['response'];
    });
  }
  initializeTickets() {
    const myForm = {
      ci_usuario: this.ciFuncionario,
      fecha: this.toDay,
    };
    this.estacionamientoServ.listActualParquing(myForm).subscribe(data => {
      this.boletas = data;
    });
  }
  changeInput($event) {
    const value = $event.value;
    if (value.length <= 0) {
      this.items = [];
      this.resultsAvailable = false;
      this.showDatos = false;
    } else {
      this.estacionamientoServ.listEstacionamiento(value).subscribe(data => {
        this.items = data;
        if (this.items.length > 0) {
          this.resultsAvailable = true;
          this.showDatos = true;
          this.datosComplementarios();
        }
      });
    }
  }
  selected(item) {
    this.form.get('placa').setValue(item.placa);
    this.items = [];
    this.resultsAvailable = false;
    const codManzano = this.form.get('cod_manzano').value;
    const tiempoSelect = this.form.get('tiempo_select').value;
    const placa = this.form.get('placa').value;

    if (codManzano !== null && tiempoSelect !== '' && placa !== '') {
      this.showDatos = true;
      // const idManz = this.form.get('cod_manzano').value.id_manzano;
      const idManz = this.form.get('cod_manzano').value;
      const idTiempo = this.form.get('tiempo_select').value.id_tarifario;
      const idTalonario = this.form.get('talonario_select').value.id_talonario;
      const myForm = {
        cod_manzano: idManz,
        id_tarifario: idTiempo,
        id_talonario: idTalonario
      };
      this.estacionamientoServ.getPriceManazano(myForm).subscribe(data => {
        var motoSelect = data['total_bs'];
        this.form.get('monto').setValue(motoSelect);
        this.miPago = motoSelect + ' Bs.';
        this.rangoBoleta = data['inf_boleta'];
        this.form.get('cant_boletos').setValue(this.rangoBoleta);
        this.form.get('hr_inicio').setValue(data['hora_inicio']);
        this.form.get('hr_fin').setValue(data['hora_fin']);
        if(data['extencion'] != null) {
          this.showTimeExt = true;
          this.form.get('t_alargue').setValue(data['extencion']);
        } else {
          this.showTimeExt = false;
          this.form.get('t_alargue').setValue('');
        }
      })
    }else {
      this.showDatos = false;
    }
  }
  datosComplementarios() {
    const codManzano = this.form.get('cod_manzano').value;
    const tiempoSelect = this.form.get('tiempo_select').value;
    const placa = this.form.get('placa').value;

    if (codManzano !== null && tiempoSelect !== '' && placa !== '') {
      this.showDatos = true;
      // const idManz = this.form.get('cod_manzano').value.id_manzano;
      const idManz = this.form.get('cod_manzano').value;
      const idTiempo = this.form.get('tiempo_select').value.id_tarifario;
      const idTalonario = this.form.get('talonario_select').value.id_talonario;
      const myForm = {
        cod_manzano: idManz,
        id_tarifario: idTiempo,
        id_talonario: idTalonario
      };
      this.estacionamientoServ.getPriceManazano(myForm).subscribe(data => {
        var motoSelect = data['total_bs'];
        this.form.get('monto').setValue(motoSelect);
        this.miPago = motoSelect + ' Bs.';
        this.rangoBoleta = data['inf_boleta'];
        this.form.get('cant_boletos').setValue(this.rangoBoleta);
        this.form.get('hr_inicio').setValue(data['hora_inicio']);
        this.form.get('hr_fin').setValue(data['hora_fin']);
        if(data['extencion'] != null) {
          this.showTimeExt = true;
          this.form.get('t_alargue').setValue(data['extencion']);
        } else {
          this.showTimeExt = false;
          this.form.get('t_alargue').setValue('');
        }
      })
    }else {
      this.showDatos = false;
    }
  }
  generarPago() {
    if (this.form.valid) {
      const myForm = {
        id_tarifario: this.form.get('tiempo_select').value.id_tarifario,
        // codigo_manzano: this.form.get('cod_manzano').value.id_manzano,
        codigo_manzano: this.form.get('cod_manzano').value,
        placa: this.form.get('placa').value,
        ci_usuario: this.ciFuncionario,
        id_talonario: this.form.get('talonario_select').value.id_talonario,
        num_talonario: this.rangoBoleta
      };
      let loading = this.loading.create({
        content: 'Cargando...'
      });
      loading.present();
      this.estacionamientoServ.saveParkingManzano(myForm).subscribe(data => {
        if (data['status'] === false) {
          this.msjSrv.mostrarAlerta('Verificación', 'Usted no puede realizar esta transacción. '+ data['status'].message);
          loading.dismiss();
        } else {
          this.msjSrv.mostrarAlerta('Confirmación', 'Su pago se realizado satisfactoriamente.');
          this.form.get('cod_manzano').setValue('');
          this.form.get('tiempo_select').setValue('');
          this.form.get('talonario_select').setValue('');
          this.form.get('placa').setValue('');
          this.form.get('monto').setValue('');
          this.form.get('cant_boletos').setValue('');
          this.form.get('hr_inicio').setValue('');
          this.form.get('hr_fin').setValue('');
          this.rangoBoleta = '';
          this.miPago = '';
          this.micuadra = ''
          this.formSave = true;
          loading.dismiss();
        }
      });
    }
  }
  private buscarTexto(event){
    const buscar= event.value;
    if(buscar !== ''){
      this.datosComplementarios();
    } else {
      this.showDatos = false;
    }    
  }
  /*
  goback(){
    this.navCtrl.push(PagoBoletoPage);
  }*/
  private compareIds(o1: DatoSelect, o2: DatoSelect): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
  private compareIdTiempo(o1: DatoReserva, o2: DatoReserva): boolean {
    return o1 && o2 ? o1.id_tarifario === o2.id_tarifario : o1 === o2;
  }
  private compareIdTalonario(o1: DatosTalonario, o2: DatosTalonario): boolean {
    return o1 && o2 ? o1.id_talonario === o2.id_talonario : o1 === o2;
  }
  get cod_manzano() { return this.form.get('cod_espacio'); }
  get cod_espacio() { return this.form.get('cod_espacio'); }
  get tiempo_select() { return this.form.get('tiempo_select'); }
  get talonario_select() { return this.form.get('talonario_select'); }
  get placa() { return this.form.get('placa'); }
  get hr_inicio() { return this.form.get('hr_inicio'); }
  get hr_fin() { return this.form.get('hr_fin'); }
  get monto() { return this.form.get('monto'); }
  get t_alargue() { return this.form.get('t_alargue'); }
  get cant_boletos() {return this.form.get('cant_boletos'); }
}
