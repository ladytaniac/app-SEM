import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HomePage } from '../pages/home/home';
import { MisPagosPage } from '../pages/mis-pagos/mis-pagos';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { MisReportesPage } from '../pages/mis-reportes/mis-reportes';
import { MisFuncionariosPage } from '../pages/mis-funcionarios/mis-funcionarios';
import { ServiciosEngrampadorPage } from '../pages/servicios-engrampador/servicios-engrampador';
import { GlobalProvider } from '../providers/global/global';
import { Storage } from '@ionic/storage';
import { environment } from '../environments/environment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  text: string = '';
  rootPage:any = HomePage;
  pages: Array<{title: string, component: any, icon: string}>;
  private httpOptions: object;
  readonly ROOT_URL= environment.apiCloseSession;
  version = environment.version;

  tipoFuncionario;
  private menuSelect: string;
  private iniLogin: boolean;
  private nombreCompleto: string;
  private unidad: string;
  private avatar: string;

  constructor(
    public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private global: GlobalProvider,
    private storage: Storage,
    public alertCtrl: AlertController,
    private httpClient: HttpClient,
  ) {
    this.iniLogin = false;
    this.avatar = 'assets/imgs/principales/user.jpg';
    this.initializeApp();
  }
  ngOnInit() {
    this.inicioDeEventos();
  }
  ionViewDidLoad() {
    // this.inicioDeEventos();
  }

  private inicioDeEventos(): void {
    window.addEventListener('user:logout', () => {
      this.logout();
    });
    window.addEventListener('user:login', () => {
      this.iniLogin = true;
      this.nombreCompleto = this.global.sesion['nombres'];
      this.unidad = this.global.sesion['unidad'];
      this.tipoFuncionario = this.global.sesion['tipo_user'];
      console.log('Tipo funcionario=', this.tipoFuncionario);
      console.log('global session=', this.global);
      this.avatar = 'assets/imgs/icons/icon-funcionario.png';
      if(this.tipoFuncionario === 'TICKEADOR') {
        this.pages = [
          { title: 'Inicio', component: HomePage, icon: 'home' },
          { title: 'Cambiar contraseña', component: ChangePasswordPage, icon: 'person' },
          { title: 'Mis ventas', component: MisPagosPage, icon: 'appstore' },
          { title: 'Mis reportes', component: MisReportesPage, icon: 'pie' },
        ];
      } else if (this.tipoFuncionario === 'SUPERVISOR') {
        this.pages = [
          { title: 'Inicio', component: HomePage, icon: 'home' },
          { title: 'Cambiar contraseña', component: ChangePasswordPage, icon: 'person' },
          { title: 'Mis funcionarios', component: MisFuncionariosPage, icon: 'people' },
        ];
      } else if (this.tipoFuncionario === 'GRAMPERO') {
        this.pages = [
          { title: 'Inicio', component: HomePage, icon: 'home' },
          { title: 'Cambiar contraseña', component: ChangePasswordPage, icon: 'person' },
          { title: 'Verificar placa', component: ServiciosEngrampadorPage, icon: 'car' },
        ];
      } else {
        this.pages = [
          { title: 'Inicio', component: HomePage, icon: 'home' },
        ]
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  openPage(page) {
    this.nav.setRoot(page.component);
  }
  rightMenuClick(text) {
    this.text = text;
  }

  logout() {
    console.log('cerrar session');
    const confirm = this.alertCtrl.create({
      title: 'Atención',
      message: 'Desea cerrar sesión',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'cancel-button',
          handler: () => {
            console.log('Agree clicked');
          }
        },
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
              this.iniLogin = false;
              this.global.sesion= {};
              this.nav.setRoot(this.rootPage);
            });
          }
        }        
      ],
      cssClass: 'buttonCss'
    });
    confirm.present();
  }  
}

