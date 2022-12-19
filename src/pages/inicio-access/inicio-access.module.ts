import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioAccessPage } from './inicio-access';

@NgModule({
  declarations: [
    InicioAccessPage,
  ],
  imports: [
    IonicPageModule.forChild(InicioAccessPage),
  ],
})
export class InicioAccessPageModule {}
