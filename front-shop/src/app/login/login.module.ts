import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { ConnectionComponent } from './connection/connection.component';
import { routing } from './login.routing';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { RegistrationComponent } from './registration/registration.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    MaterialModule,
  ],

  exports: [MainWrapperComponent, ConnectionComponent, RegistrationComponent],
  providers: [],
  declarations: [
    MainWrapperComponent,
    ConnectionComponent,
    RegistrationComponent,
  ],
})
export class LoginModule {}
