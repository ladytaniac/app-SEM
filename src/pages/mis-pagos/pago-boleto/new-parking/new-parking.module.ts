import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewParkingPage } from './new-parking';

@NgModule({
  declarations: [
    NewParkingPage,
  ],
  imports: [
    IonicPageModule.forChild(NewParkingPage),
  ],
})
export class NewParkingPageModule {}
