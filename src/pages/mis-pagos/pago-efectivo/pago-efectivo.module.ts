import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagoEfectivoPage } from './pago-efectivo';

@NgModule({
  declarations: [
    PagoEfectivoPage,
  ],
  imports: [
    IonicPageModule.forChild(PagoEfectivoPage),
  ],
})
export class PagoEfectivoPageModule {}
