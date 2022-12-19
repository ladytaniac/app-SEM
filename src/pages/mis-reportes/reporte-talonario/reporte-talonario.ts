import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { EstacionamientoProvider } from '../../../providers/estacionamiento/estacionamiento';
import { GlobalProvider } from '../../../providers/global/global';
import { VerDetallePage } from './ver-detalle/ver-detalle';
import { MisReportesPage } from '../mis-reportes';

@IonicPage()
@Component({
  selector: 'page-reporte-talonario',
  templateUrl: 'reporte-talonario.html',
})
export class ReporteTalonarioPage {
  idUser;
  nombreFuncionario;
  toDay;
  parquimetroFunc;
  misTalonarios;
  verOpciones = false;
  logoData = null;
  pdfObject: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private estacionamientoServ: EstacionamientoProvider,
    private global: GlobalProvider,
    public modalCtrl: ModalController,
    private loading: LoadingController,
  ) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.toDay = localISOTime.split('T')[0];
    this.idUser = this.global.sesion['id_user'];
    this.nombreFuncionario = this.global.sesion['nombres'];
  }
  ngOnInit() {
    this.miInformacion();
  }

  ionViewDidLoad() {
  }
  miInformacion() {
    const myForm = {
      id_responsable: this.idUser,
      fecha: this.toDay,
    };
    let loading = this.loading.create({
      content: 'Cargando...'
    });
    loading.present();
    this.estacionamientoServ.reporteTalonario(myForm).subscribe((data) => {
      if (data['status'] === true) {
        this.misTalonarios = data['response'];
        if (this.misTalonarios[0].ventas !== 0) {
          this.verOpciones = true;
        } else {
          if (this.misTalonarios[1].ventas !== 0) {
            this.verOpciones = true;
          } else {
            if (this.misTalonarios[2].ventas !== 0) {
              this.verOpciones = true;
            } else {
              this.verOpciones = false;
            }
          }
        }
      }
      loading.dismiss();
    });
  }
  buildTableBody(data, columns) {
    var body = [];
    body.push(columns);
    data.forEach(function (row) {
      var dataRow = [];
      columns.forEach(function (column) {
        dataRow.push(row[column].toString());
      });
      body.push(dataRow);
    });
    return body;
  }
  table(data, columns) {
    return {
        table: {
            headerRows: 1,
            body: this.buildTableBody(data, columns)
        }
    };
  }
  verDetalle() {
    let modal = this.modalCtrl.create(VerDetallePage, { ltsTalonarios: this.misTalonarios });
    modal.present();
  }

  goback(){
    this.navCtrl.push(MisReportesPage);
  }

}
