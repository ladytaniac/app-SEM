import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstacionamientoProvider } from '../../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../../providers/global/global';
import { PagoEfectivoPage } from '../../pago-efectivo/pago-efectivo';
import { Storage } from '@ionic/storage';

// Impresion
import { ZebraPrinter, Printer, PrinterStatus } from 'ca-cleversolutions-zebraprinter/native';
import { ActionSheetController } from 'ionic-angular';
import { MensajesProvider } from '../../../../providers/mensajes/mensajes';
interface DatoSelect {
  valor: string;
  id: number;
  monto?: number;
}
interface DatoReserva {
  id_tarifario: number,
  tiempo: string
}

@IonicPage()
@Component({
  selector: 'page-new-pago',
  templateUrl: 'new-pago.html',
})
export class NewPagoPage {
  objImprimir;

  private tiempos: DatoReserva[];
  private placas: DatoSelect[];
  private pagado: boolean;
  private form: FormGroup;
  espacios;
  miPago;
  ciFuncionario;
  myDate: String = new Date().toISOString();
  toDay;
  placasFunci;
  boletas;

  resultsAvailable: boolean = false;
  items: any;
  pdfObject: any;
  logoData = null;
  public bclables = [];

  showDatos: boolean = false;
  showTimeExt: boolean = false;

  estadoPrint: PrinterStatus;
  dispositivos: Printer[];
  address: any;
  name: any;

  manzanos = [];
  idUser;
  micuadra = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fbuilder: FormBuilder,
    private estacionamientoServ: EstacionamientoProvider,
    private global: GlobalProvider,
    protected zebraPrinter: ZebraPrinter,
    public actionCtrl: ActionSheetController,
    private storage: Storage,
    private msjSrv: MensajesProvider,
    private loading: LoadingController,
    private http: HttpClient
  ) {
    this.pagado = false;
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.toDay = localISOTime.split('T')[0];
    this.ciFuncionario = this.global.sesion['ci'];
    this.idUser = this.global.sesion['id_user'];
    this.discover();
  }
  ngOnInit() {
    this.formulario();
    this.misTiempos();
    this.misEspacios();
    this.initializeTickets();
    // this.misManzanos();
    this.misManzanosByUser();
  }

  ionViewDidLoad() {
  }

  formulario() {
    this.form = this.fbuilder.group({
      cod_manzano: ['', Validators.required],
      // cod_espacio: ['', Validators.required],
      tiempo_select: ['', Validators.required],
      placa: ['', Validators.required],
      monto: ['', Validators.required],
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
  }*/

  misManzanosByUser() {
    const myForm = {
      id_responsable: this.idUser,
    };
    this.estacionamientoServ.getManzanosUser(myForm).subscribe(data => {
      // console.log('datossss=', data);
      if(data['status'] == true) {
        this.manzanos = data['response'];
      }
    });
  }
  selectCuadra() {
    const codManzano = this.form.get('cod_manzano').value;
    if(codManzano != null) {
      const selecionado = this.manzanos.filter(x => x.id_manzano === codManzano);
      this.micuadra = selecionado[0].concat;
    } else {
      this.micuadra = '';
    }
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
  
  /*changeInput2($event) {
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
  }*/
  selected(item) {
    this.form.get('placa').setValue(item.placa);
    this.items = [];
    this.resultsAvailable = false;
    const codManzano = this.form.get('cod_manzano').value;
    const tiempoSelect = this.form.get('tiempo_select').value;
    const placa = this.form.get('placa').value;

    if (codManzano !== null && tiempoSelect !== '' && placa !== '') {
      this.showDatos = true;
      const idManz = this.form.get('cod_manzano').value.id_manzano;
      const idTiempo = this.form.get('tiempo_select').value.id_tarifario;
      const myForm = {
        cod_manzano: idManz,
        id_tarifario: idTiempo
      };
      this.estacionamientoServ.getPriceManazano(myForm).subscribe(data => {
        var motoSelect = data['total_bs'];
        this.form.get('monto').setValue(motoSelect);
        this.miPago = motoSelect + ' Bs.';
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
  /*selected2(item) {
    this.form.get('placa').setValue(item.placa);
    this.items = [];
    this.resultsAvailable = false;

    const codEspacio = this.form.get('cod_espacio').value;
    const tiempoSelect = this.form.get('tiempo_select').value;
    const placa = this.form.get('placa').value;

    if (codEspacio !== null && tiempoSelect !== '' && placa !== '') {
      this.showDatos = true;
      const idSitio = this.form.get('cod_espacio').value.id_sitio;
      const idTiempo = this.form.get('tiempo_select').value.id_tarifario;
      const myForm = {
        id_sitio: idSitio,
        id_tarifario: idTiempo,
        placa: placa
      };
      
      this.estacionamientoServ.getPrecio(myForm).subscribe(data => {
        var motoSelect = data['total_bs'];
        this.form.get('monto').setValue(motoSelect);
        this.miPago = motoSelect + ' Bs.';
        this.form.get('hr_inicio').setValue(data['hora_inicio']);
        this.form.get('hr_fin').setValue(data['hora_fin']);
        if(data['extencion'] != null) {
          this.showTimeExt = true;
          this.form.get('t_alargue').setValue(data['extencion']);
        } else {
          this.showTimeExt = false;
          this.form.get('t_alargue').setValue('');
        }
      });      
    } else {
      this.showDatos = false;
    }
  }*/
  private buscarTexto(event){
    const buscar= event.value;
    if(buscar !== ''){
      this.datosComplementarios();
    } else {
      this.showDatos = false;
    }
  }
  /*private buscarTexto2(event){
    const buscar= event.value;
    if(buscar !== ''){
      this.datosComplementarios();
    } else {
      this.showDatos = false;
    }
  }*/
  datosComplementarios() {
    const codManzano = this.form.get('cod_manzano').value;
    const tiempoSelect = this.form.get('tiempo_select').value;
    const placa = this.form.get('placa').value;

    if (codManzano !== null && tiempoSelect !== '' && placa !== '') {
      this.showDatos = true;
      // const idManz = this.form.get('cod_manzano').value.id_manzano;
      const idManz = this.form.get('cod_manzano').value
      const idTiempo = this.form.get('tiempo_select').value.id_tarifario;
      const myForm = {
        cod_manzano: idManz,
        id_tarifario: idTiempo
      };
      this.estacionamientoServ.getPriceManazano(myForm).subscribe(data => {
        var motoSelect = data['total_bs'];
        this.form.get('monto').setValue(motoSelect);
        this.miPago = motoSelect + ' Bs.';
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
  generarPago(){
    if (this.form.valid) {
      const myForm = {
        id_tarifario: this.form.get('tiempo_select').value.id_tarifario,
        // codigo_manzano: this.form.get('cod_manzano').value.id_manzano,
        codigo_manzano: this.form.get('cod_manzano').value,
        placa: this.form.get('placa').value,
        ci_usuario: this.ciFuncionario
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
          var hinicio = data["response"].hora_inicial.split(':')[0] + ':' + data["response"].hora_inicial.split(':')[1];
          var hfin = data["response"].hora_final.split(':')[0] + ':' + data["response"].hora_final.split(':')[1];
          this.objImprimir = {
            nameFunc: this.global.sesion["nombres"],
            placa: this.form.get('placa').value,
            codReser: this.form.get('cod_manzano').value.id_manzano,
            costo: data["response"].monto,
            hraReser: hinicio + ' - ' + hfin,
            fecha: this.toDay,
            numBoleta: data["response"].num_boleta,
            t_extendido: this.form.get('t_alargue').value
          };
          console.log('datos a imprimir=', this.objImprimir);
          console.log('recupe impri=', this.objImprimir.numBoleta);
          this.micuadra = '';
        }
        this.micuadra = '';
        this.form.reset();
        this.miPago = '';
        
        loading.dismiss();
        
      }, (error) => {
        console.log(error.error);
        this.msjSrv.mostrarAlerta('Verificación', 'Usted no esta autentificado.');
        loading.dismiss();
      })
    }
  }



  generarPago2() {
    if (this.form.valid) {
      const myForm = {
        id_sitio: this.form.get('cod_espacio').value.id_sitio,
        id_tarifario: this.form.get('tiempo_select').value.id_tarifario,
        placa: this.form.get('placa').value,
        ci_usuario: this.ciFuncionario
      };
      let loading = this.loading.create({
        content: 'Cargando...'
      });
      loading.present();
      
      this.estacionamientoServ.saveParking(myForm).subscribe(data => {
        if (data['status'] === false) {
          this.msjSrv.mostrarAlerta('Verificación', 'Usted no puede realizar esta transacción. '+ data['status'].message);
          loading.dismiss();
        } else {
          this.msjSrv.mostrarAlerta('Confirmación', 'Su pago se realizado satisfactoriamente.');
          var hinicio = data["response"].hora_inicial.split(':')[0] + ':' + data["response"].hora_inicial.split(':')[1];
          var hfin = data["response"].hora_final.split(':')[0] + ':' + data["response"].hora_final.split(':')[1];

          this.objImprimir = {
            nameFunc: this.global.sesion["nombres"],
            placa: this.form.get('placa').value,
            codReser: this.form.get('cod_espacio').value.codigo_sitio,
            costo: data["response"].monto,
            hraReser: hinicio + ' - ' + hfin,
            fecha: this.toDay,
            numBoleta: data["response"].num_boleta,
            t_extendido: this.form.get('t_alargue').value
          };
          console.log('datos a imprimir=', this.objImprimir);
          console.log('recupe impri=', this.objImprimir.numBoleta);
        }
        this.form.reset();
          this.miPago = '';
          this.micuadra = '';
          loading.dismiss();
      }, (error) => {
        console.log(error.error);
        this.msjSrv.mostrarAlerta('Verificación', 'Usted no esta autentificado.');
        loading.dismiss();
      });
    } 
  }
  /** Impresora **/
  discover() {
    this.zebraPrinter.discover().then(result => {
      this.address = result[0].address;
      this.name = result[0].name;
      console.log(result);
    }).catch(err => {
      console.log(err);

    });
  }

  conectingToPrinter() {
    this.zebraPrinter.connect(this.address).then(result => {
      console.log("connceting:" + result);
    }).catch(err => {
      console.log(err);

    })
  }

  printBoleta() {
    this.zebraPrinter.printerStatus().then((result) => {
      console.log("estado de conexión: ", result);
      this.estadoPrint = <PrinterStatus>result;
      console.log("conectado?: ", this.estadoPrint.connected);
      if (this.estadoPrint.connected) {
        console.log("permiso para imprimir");
        this.storage.get('printAddress').then((res) => {
          console.log('printAddress', res);
          this.conectar(res); // impresion automatica
          console.log('Termineeeeee');
        })
      } else {
        this.seleccionarImpresora();
      }
    }).catch(error => {
      console.error("falló: ", error);
    })
  }

  seleccionarImpresora() {
		this.zebraPrinter.discover().then(result => {
			this.dispositivos = <Printer[]>result;
			this.mostrarDispositivos();
		}).catch(err => {
			console.error(err);
		});
	}
  
  mostrarDispositivos() {
		const actionSheet = this.actionCtrl.create({
			title: "Seleccione la impresora",
			buttons: []
		});
		this.dispositivos.forEach(item => {
			console.log(item.name);
			actionSheet.addButton(
				{ text: item.name, handler: () => { this.conectar(item.address) } }
			);
			actionSheet.addButton({ text: "Cancelar", role: 'cancel' });
		});
		actionSheet.present();
	}
	protected conectar(address) {
		// this.zebraPrinter.connect('AC:3F:A4:55:F0:3C').then(result => {
    console.log('address impresora: ',address);
    var storagePrint =this.storage.set('printAddress', address);
   
		this.zebraPrinter.connect(address).then(result => {
			console.log("conectado: ", result);
      console.log("Datos que debo imprimir", this.objImprimir);
      let receipt = '';
      receipt += '^XA';
      receipt += '^FX Top section with logo, name and address.';
      receipt += '^FO50,30^GFA,12702,12702,87,,::::jY07,jX01FC,jX07FF,jX0IFC,jW01IFE,jW03IFE,jW03JF,jW07JF,hN0JFhK07JF8,hL01LF8hI07JF8,hL0NFhI07JF8,hK03NFEhH07JF8,hJ01PF8hG07JF8,hJ07PFEhG07JF8,hJ0RFhG07JF8,hI03RFCh07JF8,hI07RFEh07JF8,hH01TF8gY07JF8,hH03TFCgY07JF8,hH07TFEgY07JF8,hH0VFgY07JF8,hG01VF8gX07JF8,hG03VFCgX07JF8,hG07VFEgX07JF8,hG0XFgX07JF8,h01XFgX07JF8,h03XF8gW07JF8,h03XFCgW07JF8,h07MFE007MFCgW07JF8,h0MFEJ07LFEgW07JF8,h0MF8J01MFgW07JF8,gY01LFEL07LFO07EV03FN07JF807CU01F8,gY01LF8L01LF8L01JF8S07IFCL07JF9JFS07IFE,gY03LFN0LF8L0LFR07KF8K07OFEQ03KFC,gY03KFEN07KF8K07LFCP01MFK07PF8P0MF8,gY07KFCN03KF8J01NFP07MFCJ07PFEO03MFE,gY07KF8N01KFCJ03NFCN01OFJ07QF8N0OF,gY0LFP0KF8J0OFEN03OF8I07QFCM01OFC,gY0KFEP07JF8I01PF8M0PFEI07RFM07OFE,gY0KFCP03JF8I03PFCL01QFI07RF8L0QF8,gX01KFCP03JF8I0QFEL03QF8007RFCK01QFC,gX01KF8P01JFI01RFL07QFC007RFEK03QFE,gX01KFR0IFEI03RF8K0RFE007SFK07RF,gX03KFR07FFCI03RFCJ01SF007SF8J0SF8,gX03JFER03FF8I07RFEJ03SF807SF8I01SF8,gX03JFES0FEJ0TFJ03SFC07SFCI03SFC,gX03JFEX01TFJ07SFC07SFEI03SFE,gX03JFCX01TF8I0TFE07SFEI07TF,gX07JFCX03TFCI0UF07TFI0UF,gX07JFCX07TFC001UF07TFI0UF8,gX07JFCX07TFE001UF07TF801UF8,gX07JF8X0MF83LFE003MF1MF87LFE7LF801UFC,gX07JF8X0LFC003LF003LF001LF87KFE007KF803LF801LFC,gX07JF8X0LFJ0LF007KFCI07KF87KFC003KFC03KFEI07KFE,gX07JF8W01KFEJ07KF007KFJ03KF87KFI01KFC07KFCI01KFE,gX07JF8W01KF8J03KF80KFEK0KF87JFEJ0KFC07KFK0KFE,gX07JF8W01KF8J01KF80KFCK07JF87JFEJ07JFC07JFEK07KF,gX07JF8W03KFL0KF80KFCK07JF07JFCJ03JFE07JFEK03KF,gX07JFCW03JFEL0KF80KF8K03JF07JFCJ03JFE0KFCK01KF,gX07JFCW03JFEL07JFC1KFL01IFE07JF8J01JFE0KF8K01KF,gX07JFCW03JFCL07JFC1KFM0IFC07JF8J01JFE0KF8L0KF8,gX03JFCW03JFCL03JFC1KFM07FF807JF8J01JFE0KFM0KF8,gX03JFEW07JF8L03JFC1JFEM03FF007JF8J01JFE0KFM0KF8,gX03JFEW07JF8L03JFC1JFEN07C007JF8J01JFE0KFM07JF8,gX03JFES0F8007JF8L03JFC1JFER07JF8J01JFE0KFM07JF8,gX03KFR07FE007JF8L03JFC1JFER07JF8J01JFE0KFM07JF8,gX01KFR0IF007JF8L01JFC1JFER07JF8J01JFE0KFM07JF8,gX01KF8P01IFC07JF8L03JFC1JFER07JF8J01JFE0KFM07JF8,gX01KF8P03IFE07JF8L03JFC1JFER07JF8J01JFE0KFM07JF8,gX01KFCP03IFE07JF8L03JFC1JFER07JF8J01JFE0KFM07JF8,gY0KFEP07JF07JFCL03JFC1JFEM03FC007JF8J01JFE0KFM0KF8,gY0LFP0KF03JFCL03JFC1KFM07FF007JF8J01JFE0KF8L0KF8,gY07KFO01KF83JFCL07JFC1KFL01IF807JF8J01JFE0KF8K01KF8,gY07KF8N03KF83JFEL07JFC0KF8K03IFC07JF8J01JFE0KFCK01KF8,gY03KFEN07KF83JFEL0KF80KF8K03IFE07JF8J01JFE0KFCK03KF8,gY03LFN0LF83KFK01KF80KFCK07IFE07JF8J01JFE07JFEK03KF8,gY01LF8L01LF01KF8J01KF80KFEK0KF07JF8J01JFE07KFK07KF8,gY01LFEL07LF01KFCJ07KF807KFJ01KF07JF8J01JFE07KF8J0LF8,h0MF8J01MF01KFEJ0LF007KF8I03KF07JF8J01JFE03KFCI03LF8,h0NFJ0MFE00LF8001LF007KFEI0LF07JF8J01JFE03LFI0MF8,h07NF00NFC00LFE00LFE003LFC03LF07JF8J01JFE03LFE03MF8,h03XFC007TFE003UF07JF8J01JFE01VF8,h03XF8007TFC001UF07JF8J01JFE01VF8,h01XFI03TFC001UF07JF8J01JFE00VF8,hG0WFEI03TF8I0TFE07JF8J01JFE007UF8,hG07VFCI01TF8I07SFE07JF8J01JFE007UF8,hG03VFCJ0TFJ07SFC07JF8J01JFE003UF8,hG01VF8J0SFEJ03SF807JF8J01JFE001UF8,hH0VFK07RFCJ01SF007JF8J01JFE001UF8,hH07TFEK03RFCK0RFE007JF8J01JFEI0UF8,hH03TF8K01RF8K07QFE007JF8J01JFEI07TF8,hH01TFM0RFL03QFC007JF8J01JFEI03TF8,hI07RFEM07PFEL01QFI07JF8J01JFEI01TF8,hI03RF8M03PF8M0PFEI07JF8J01JFEJ07SF8,hJ0RFN01PFN07OFCI07JFL0JFCJ03SF8,hJ03PFCO07NFEN01OFJ03JFL0JFCJ01SF,hK0PFP01NF8O0NFEJ03IFEL07IF8K07RF,hK03NFCQ0MFEP03MF8J01IFEL07IF8K01MFCIFE,hL0MFER01LF8Q0LFEL0IFCL03IFM07LF07FFC,hM0LFT07JFCR01KFM07FFM01FFCN0KF803FF8,hN0JFV07FFCT01IFN01FCN07FP0IF8I0FE,,:::::::jJ06gT03J03,jJ0F8gS078I07,jJ0F8gS0F8001E,jJ07gT07I07C,lI0F,lI0C,,hT0FJ0FI041F0078I03EI03E,hS07FE007FE00E7FC1FFI0FF800FF8I07071FE01E3F8003FE03C00780FF1C00FF007003FC00E3F8,hS0IF00IF80EFFE3FF803FFE01FFCI07073FF01EFFE00IF01C00703FF9C03FFC0700IF00E7FE,hR01E0F01F07C0FC1F707C07C1F03C1EI070770F81CE3E01IF81E00707FFDC07FFE0701IF80EE3F,hR01C0783C03C0F80FE03C0F0078380FI0707C03C1F80F01E03C0E00F0780FC0F01F0703C03C0F80F,hR01C0383801E0F007C01E0E00783807I0707C03C1F00703C01E0E00E0F007C0E00F0703801C0F0078,hR01CI07800E0F003801E1E003C38K0707801C1E00787800E0F01E0E003C1E0078707801E0E0078,hR01EI07I0F0E003800E1C001C3CK0707801E1E00387800F0701C1E001C1C0038707I0E0E0038,hS0F8007I070E003800E1C001C1FK0707001E1E00387I070781C1C001C1CJ070FI0E0E0038,hS07F807I070E003800E1C001C0FFJ0707001E1E00387I070383C1C001C3CJ070FI0F0E0038,hS01FE07I070E003800E1C001C07FCI0707001E1E00387I07038381C001C3CJ070FI0F0E0038,hT03F07I070E003800E1C001C00FEI0707001E1E00387I0703C381C001C3CJ070FI0F0E0038,hU0787I0F0E003800E1C001C001FI0707001E1E00387I0701C701C001C1CJ070FI0E0E0038,hU0387I0E0E003800E1E003CI07I0707001E1E00387800F01C701E001C1C0038707I0E0E0038,hR03C0387801E0E003800E0E00387807I0707001E1E00387800E00E700E003C1E0078707801E0E0038,hR01C0383C01C0E003800E0F00787807I0707001E1E00383C01E00EE00F007C0E0070707801C0E0038,hR01E0781E07C0E003800E0781F03C0FI0707001E1E00381E03C00FE00780FC0F01F0703C07C0E0038,hS0IF01IF80E003800E03FFE01FFEI0707001E1E00381FDF8007E007F7DC07E7E0701IF80E0038,hS07FE007FF00E003800E01FFC00FFCI0707001E1E00380IFI07C003FF9C03FFC0700IF00E003C,hS01FC001FC00E003800E007FI07FJ0707001E1E003803FEI07CI0FF1C00FF007003FC00E0038,hT07J06S01CJ0CJ0203I0C0C003800F8I038I07C0C007E003001F800C0038,,:::^FS';
      receipt += '^FO50,200^GB700,3,3^FS';
      receipt += '^FX Second section with recipient address and permit information.';
      receipt += '^CFA,30';
      receipt += '^FO260,210^FDComprobante S.E.M^FS';
      receipt += '^FO50,280^FDNro. Boleta: ' + this.objImprimir.numBoleta + '^FS';
      receipt += '^FO30,320^FH_^FD_ Fecha Impresi_A2n: ' + this.objImprimir.fecha + '^FS';
      receipt += '^FO50,360^FDPlaca: ' + this.objImprimir.placa + '^FS';
      receipt += '^FO50,460^FDCosto: ' + this.objImprimir.costo + ' Bs. ^FS';
      receipt += '^FO50,440^FDCod del manzano: ' + this.objImprimir.codReser + '^FS';
      receipt += '^FO50,480^FDHora: ' + this.objImprimir.hraReser + '^FS';
      receipt += '^FO50,540^GB750,3,3^FS';
      receipt += '^FO50,570^FDFuncionario:^FS';
      receipt += '^FO50,600^FD' + this.objImprimir.nameFunc + '^FS';
      receipt += '^XZ';

      this.zebraPrinter.print(receipt).then(result => {
        console.log("impresion: ", result);
        this.goback();
      });
    }).catch(error => {
			console.error("falló: ", error);
		});
  }
  /** End impresora **/

  goback() {
    this.navCtrl.push(PagoEfectivoPage);
  }

  private compareIds(o1: DatoSelect, o2: DatoSelect): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
  private compareIdTiempo(o1: DatoReserva, o2: DatoReserva): boolean {
    return o1 && o2 ? o1.id_tarifario === o2.id_tarifario : o1 === o2;
  }
  get cod_manzano() { return this.form.get('cod_espacio'); }
  get cod_espacio() { return this.form.get('cod_espacio'); }
  get tiempo_select() { return this.form.get('tiempo_select'); }
  get placa() { return this.form.get('placa'); }
  get hr_inicio() { return this.form.get('hr_inicio'); }
  get hr_fin() { return this.form.get('hr_fin'); }

  //t_alargue
  get t_alargue() { return this.form.get('t_alargue'); }
  get monto() { return this.form.get('monto'); }

}
