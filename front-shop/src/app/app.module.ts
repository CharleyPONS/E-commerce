import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShoppingCartModule } from 'ng-shopping-cart';
import { PpBreadcrumbsModule } from 'pp-breadcrumbs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { RequestInterceptor } from './core/interceptors/request.interceptor';
import { CartItemCustom } from './core/models/cartItemCustom.model';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    CommonModule,
    FormsModule,
    LoginModule,
    ReactiveFormsModule,
    PpBreadcrumbsModule,
    ShoppingCartModule.forRoot({
      itemType: CartItemCustom,
      serviceType: 'localStorage',
      serviceOptions: {
        storageKey: 'cbd-cart',
        clearOnError: true,
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
