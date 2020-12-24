import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { ConnectionComponent } from './connection/connection.component';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  imports: [MaterialModule],

  exports: [],
  providers: [],
  declarations: [
    MainWrapperComponent,
    ConnectionComponent,
    RegistrationComponent,
  ],
})
export class SharedModule {}
