import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalProvider } from '../../providers/global/global';
import { Storage } from '@ionic/storage';
import { MensajesProvider } from '../../providers/mensajes/mensajes';
import { HomePage } from '../home/home';

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
  ciFuncionario;
  idUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fbuilder: FormBuilder,
    private global: GlobalProvider,
    private storage: Storage,
    private msjSrv: MensajesProvider,
    // private loading: LoadingController,
  ) {
    this.ciFuncionario = this.global.sesion['ci'];
    this.idUser = this.global.sesion['id_user'];
  }
  ngOnInit() {
    this.formulario();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  formulario() {
    this.form = this.fbuilder.group({
      password: ['', Validators.required],
      ci_usuario: ['', Validators.required],
    });
  }

  changePassword() {
    console.log('me hiciste click');
  }

  goback() {
    this.navCtrl.push(HomePage);
  }

}
