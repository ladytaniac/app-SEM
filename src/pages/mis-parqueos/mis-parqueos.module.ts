import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisParqueosPage } from './mis-parqueos';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MisParqueosPage,
  ],
  imports: [
    IonicPageModule.forChild(MisParqueosPage),
    ReactiveFormsModule,
  ],
})
export class MisParqueosPageModule {}
