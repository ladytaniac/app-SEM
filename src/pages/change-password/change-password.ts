import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalProvider } from '../../providers/global/global';
import { Storage } from '@ionic/storage';
import { MensajesProvider } from '../../providers/mensajes/mensajes';
import { HomePage } from '../home/home';
import { ServUserProvider } from '../../providers/serv-user/serv-user';
import { environment } from '../../environments/environment'; 

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  private form: FormGroup;
  private httpOptions: object;
  readonly ROOT_URL= environment.apiCloseSession;
  private iniLogin: boolean;
  ciFuncionario;
  idUser;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fbuilder: FormBuilder,
    private global: GlobalProvider,
    private storage: Storage,
    private msjSrv: MensajesProvider,
    public alertCtrl: AlertController,
    private userSrv: ServUserProvider,
    private httpClient: HttpClient,
  ) {
    this.ciFuncionario = this.global.sesion['ci'];
    this.idUser = this.global.sesion['id_user'];
  }
  ngOnInit() {
    this.formulario();
  }

  ionViewDidLoad() {
  }

  formulario() {
    this.form = this.fbuilder.group({
      password: ['', Validators.required],
      ci_usuario: [this.ciFuncionario, Validators.required],
    });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  changePassword() {
    if (this.form.valid) {
      this.userSrv.changePassword(this.form.value).subscribe(data => {
        console.log('data', data);
        if(data['status'] == true) {
          this.msjSrv.mostrarAlerta('Confirmación', data['message']);
          const confirm = this.alertCtrl.create({
            title: 'Atención',
            message: 'Desea cerrar sesión',
            buttons: [
              /*{
                text: 'Cancelar',
                cssClass: 'cancel-button',
                handler: () => {
                  console.log('Agree clicked');
                }
              },*/
              {
                text: 'Cerrar sesión',
                cssClass: 'exit-button',
                handler: () => {
                  var acceso = this.global.sesion['access_token'];
                  this.httpOptions = {
                    headers: new HttpHeaders({
                      'Content-Type':  'application/json',
                      'Authorization': 'Bearer ' + acceso
                    })
                  };
                  this.storage.remove('sesion');
                  this.storage.remove('printAddress');
                  console.log('cerrar');
                  this.httpClient.get(this.ROOT_URL, this.httpOptions).subscribe(info => {
                    console.log('mi info=', info);
                    this.iniLogin = false;
                    this.global.sesion= {};
                    this.navCtrl.push(HomePage);
                  }, error => {
                    console.log('error2=', error);
                    console.log('error3=', error.error);
                    this.iniLogin = false;
                    this.global.sesion= {};
                    this.navCtrl.push(HomePage);
                  });
                }
              }        
            ],
            cssClass: 'buttonCss'
          });
          confirm.present()
        } else {
          this.msjSrv.mostrarAlerta('Verificación', 'La contraseña no fue modificada.');
        }
      });
    }
  }
  goback() {
    this.navCtrl.push(HomePage);
  }
}
