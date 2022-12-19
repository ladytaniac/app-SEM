import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ModalLogueoPage } from '../modal-logueo/modal-logueo';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-inicio-access',
  templateUrl: 'inicio-access.html',
})
export class InicioAccessPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
  }

  ionViewDidLoad() {
  }

  abrirModal() {
    let modal = this.modalCtrl.create(ModalLogueoPage);
    modal.present();
    modal.onDidDismiss(()=>{
      this.navCtrl.push(HomePage);
    })
  }
}
