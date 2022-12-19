import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewPagoPage } from './new-pago';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    NewPagoPage,
  ],
  imports: [
    IonicPageModule.forChild(NewPagoPage),
    ReactiveFormsModule,
    IonicSelectableModule
  ],
})
export class NewPagoPageModule {}
