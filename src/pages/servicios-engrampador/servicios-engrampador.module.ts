import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiciosEngrampadorPage } from './servicios-engrampador';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ServiciosEngrampadorPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiciosEngrampadorPage),
    ReactiveFormsModule,
  ],
})
export class ServiciosEngrampadorPageModule {}
