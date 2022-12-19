import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InicioAccessPage } from '../inicio-access/inicio-access';
import { ServiciosSemPage } from '../servicios-sem/servicios-sem';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private estadoLogueado: boolean;
  address: any;
  name: any;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private global: GlobalProvider
  ) {
  }

  ngOnInit() {
    setTimeout(() => { this.click(); }, 2000);
  }

  ionViewDidEnter(){
    this.storage.get('sesion').then((res) => {
      if (res!=null) {
        this.global.sesion = res;
        window.dispatchEvent(new CustomEvent('user:login'));
        this.estadoLogueado= true;
      }else{
        this.estadoLogueado= false;
      }
    });
  }

  click() {
    if(this.estadoLogueado) {
      this.navCtrl.push(ServiciosSemPage);
    } else {
      this.navCtrl.push(InicioAccessPage);
    }    
  }
}
