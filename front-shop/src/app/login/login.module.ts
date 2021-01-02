import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { ConnectionComponent } from './connection/connection.component';
import { routing } from './login.routing';
import { MainWrapperComponent } from './main-wrapper/main-wrapper.component';
import { RegistrationComponent } from './registration/registration.component';
import { CommonModule } from '@angular/common';
import { FacebookConnectionComponent } from './facebook-connection/facebook-connection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    MaterialModule,
    FlexLayoutModule,
  ],

  exports: [
    MainWrapperComponent,
    ConnectionComponent,
    RegistrationComponent,
    FacebookConnectionComponent,
  ],
  providers: [],
  declarations: [
    MainWrapperComponent,
    ConnectionComponent,
    RegistrationComponent,
    FacebookConnectionComponent,
  ],
})
export class LoginModule {}
