import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisFuncionariosPage } from './mis-funcionarios';

@NgModule({
  declarations: [
    MisFuncionariosPage,
  ],
  imports: [
    IonicPageModule.forChild(MisFuncionariosPage),
  ],
})
export class MisFuncionariosPageModule {}
