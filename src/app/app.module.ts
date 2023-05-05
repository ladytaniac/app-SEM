import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { IonicSelectableModule } from 'ionic-selectable';

import { ZebraPrinter } from 'ca-cleversolutions-zebraprinter/native';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NavController } from 'ionic-angular';
import { InicioAccessPage } from '../pages/inicio-access/inicio-access';
import { ServiciosSemPage } from '../pages/servicios-sem/servicios-sem';
import { ModalLogueoPage } from '../pages/modal-logueo/modal-logueo';
import { MisPagosPage } from '../pages/mis-pagos/mis-pagos';
import { MensajesProvider } from '../providers/mensajes/mensajes';
import { ServUserProvider } from '../providers/serv-user/serv-user';
import { GlobalProvider } from '../providers/global/global';
// import { PagoBoletoPage } from '../pages/mis-pagos/pago-boleto/pago-boleto';
import { PagoEfectivoPage } from '../pages/mis-pagos/pago-efectivo/pago-efectivo';
import { NewPagoPage } from '../pages/mis-pagos/pago-efectivo/new-pago/new-pago';
// import { NewParkingPage } from '../pages/mis-pagos/pago-boleto1/new-parking/new-parking';
import { EstacionamientoProvider } from '../providers/estacionamiento/estacionamiento';
import { MisReportesPage } from '../pages/mis-reportes/mis-reportes';
import { ReporteActualPage } from '../pages/mis-reportes/reporte-actual/reporte-actual';
import { ReporteFechaPage } from '../pages/mis-reportes/reporte-fecha/reporte-fecha';
// import { ReporteTalonarioPage } from '../pages/mis-reportes/reporte-talonario/reporte-talonario';
// import { VerDetallePage } from '../pages/mis-reportes/reporte-talonario/ver-detalle/ver-detalle';
import { MisParqueosPage } from '../pages/mis-parqueos/mis-parqueos';
import { MisFuncionariosPage } from '../pages/mis-funcionarios/mis-funcionarios';
import { ServiciosEngrampadorPage } from '../pages/servicios-engrampador/servicios-engrampador';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    InicioAccessPage,
    ServiciosSemPage,
    MisPagosPage,
    // PagoBoletoPage,
    PagoEfectivoPage,
    NewPagoPage,
    // NewParkingPage,
    ModalLogueoPage,
    MisReportesPage,
    ReporteActualPage,
    ReporteFechaPage,
    // ReporteTalonarioPage,
    // VerDetallePage,
    MisParqueosPage,
    MisFuncionariosPage,
    ServiciosEngrampadorPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    IonicSelectableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    InicioAccessPage,
    MisPagosPage,
    // PagoBoletoPage,
    PagoEfectivoPage,
    NewPagoPage,
    // NewParkingPage,
    ServiciosSemPage,
    ModalLogueoPage,
    MisReportesPage,
    ReporteActualPage,
    ReporteFechaPage,
    // ReporteTalonarioPage,
    // VerDetallePage,
    MisParqueosPage,
    MisFuncionariosPage,
    ServiciosEngrampadorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ZebraPrinter,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MensajesProvider,
    ServUserProvider,
    GlobalProvider,
    EstacionamientoProvider
  ]
})
export class AppModule {}
