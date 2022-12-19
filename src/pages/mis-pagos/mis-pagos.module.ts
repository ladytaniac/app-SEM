import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisPagosPage } from './mis-pagos';

@NgModule({
  declarations: [
    MisPagosPage,
  ],
  imports: [
    IonicPageModule.forChild(MisPagosPage),
  ],
})
export class MisPagosPageModule {}
