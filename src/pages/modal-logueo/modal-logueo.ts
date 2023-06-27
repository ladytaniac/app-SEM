import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ServUserProvider } from '../../providers/serv-user/serv-user';
import { MensajesProvider } from '../../providers/mensajes/mensajes';
import { InicioAccessPage } from '../inicio-access/inicio-access';

 interface LogueoDatos {
  mail:Datos,
  pass:Datos
}
interface Datos {
  valor?: string,
  validez?: string
}

@IonicPage()
@Component({
  selector: 'page-modal-logueo',
  templateUrl: 'modal-logueo.html',
})
export class ModalLogueoPage {
  readonly ROOT_URL= environment.loginURL;
  private httpOptions: object;
  private submitted: boolean;
  private logueo: LogueoDatos;
  private readonly _R_EMAIL: RegExp=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    private httpClient: HttpClient,
    public srvUser: ServUserProvider,
    private msjSrv: MensajesProvider,
  ) {
    this.logueo= {mail:{valor:"",validez:""},pass:{valor:"",validez:""}};
    this.submitted= false;
  }
  ngOnInit() {
  }

  ionViewDidLoad() {
  }

  cerrar() {
    let result = "Se cerró";
    this.viewCtrl.dismiss({result: result});
  }
  ingresar(form:NgForm) {
    this.submitted=true;
    if (form.valid) {
      this.logueo.mail.validez=(this._R_EMAIL.test(this.logueo.mail.valor)?"":"* correo no válido.");
      if (this.logueo.mail.validez=="" && this.logueo.pass.validez=="") {
        let params={
          "username": this.logueo.mail.valor,
          "password": this.logueo.pass.valor
        }
        this.srvUser.logueoUser(params).subscribe((data:object)=> {
          console.log('data=', data);
          if(data['status'] == false) {
            this.msjSrv.mostrarAlerta('Error de acceso', "Acceso no autorizado");
          } else {
            var accessToken = data["access_token"];
            this.httpOptions = {
              headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'Bearer ' + accessToken
              })
            };
            this.httpClient.get(environment.apiDatosFuncionario, this.httpOptions).subscribe(info => {
              console.log('info=', info);
              if(info['status'] == true) {
                if(info['response'].user.tipo === 'PARQUIMETRO') {
                  this.msjSrv.mostrarAlerta('Verificación', 'Usted no puede acceder a la información, porque tiene el rol de PARQUIMETRO.');
                } else {
                  let infoFunc = {
                    "access_token": data["access_token"],
                    "email": this.logueo.mail.valor,
                    "ci": info['response'].user.dni,
                    "id_user": info['response'].user.id_responsable,
                    "nombres": info['response'].user.nombre_completo,
                    "unidad": info['response'].user.unidad,
                    "tipo_user": info['response'].user.tipo,
                    "continuo": data["data_gestion"].continuo,
                    "puede_cobrar": data["data_user"].puede_cobrar,
                  };
                  this.storage.set('sesion', infoFunc);
                  this.viewCtrl.dismiss();
                }
              } else {
                this.msjSrv.mostrarAlerta('Verificación', 'El correo o la contraseña son incorrectos.');
              }
            });
          }
        });
      }
    }
  }
  goback() {
    this.navCtrl.push(InicioAccessPage);
  }
}
