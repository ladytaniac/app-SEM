import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagoEfectivoPage } from './pago-efectivo';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PagoEfectivoPage,
  ],
  imports: [
    IonicPageModule.forChild(PagoEfectivoPage),
    ReactiveFormsModule,
  ],
})
export class PagoEfectivoPageModule {}
