import { NgModule } from '@angular/core';
import { MaterialModule } from '../shared/material.module';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { ConnectionComponent } from './connection/connection.component';
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
