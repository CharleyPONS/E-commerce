import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialAuthService } from 'angularx-social-login';
import { CartService, CartItem } from 'ng-shopping-cart';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { CartItemCustom } from '../../core/models/cartItemCustom.model';
import { Config } from '../../core/models/config.model';
import { ConfigPromotion } from '../../core/models/configPromotion.model';
import { ConfigService } from '../../core/services/config.service';
import { UserService } from '../../core/services/user.service';
import { environment } from '../../../environments/environment';
import { ConnectModalComponent } from '../modal/connect-modal/connect-modal.component';
import { RegisterModalComponent } from '../modal/register-modal/register-modal.component';

export interface wrapperPromotion {
  isPromotion: boolean;
  promotion: number;
  codePromotion: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnDestroy, OnInit {
  public isConnected: boolean = false;
  public config: Config;
  public promotion: ConfigPromotion;
  private _onDestroy$ = new Subject();

  constructor(
    private cartService: CartService<CartItemCustom>,
    private _userService: UserService,
    private _configService: ConfigService,
    private _snackBar: MatSnackBar,
    private readonly _matDialog: MatDialog,
    private authService: SocialAuthService
  ) {}

  async ngOnInit(): Promise<any> {
    this.isConnected = this._userService.isLoggedIn();
    this.config = await this._configService.getConfig();
    this.promotion = this.config?.promotion?.find(
      (v) => v.codePromotion === environment.activePromotion
    );
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
  }

  public logout() {
    const logout: boolean = this._userService.logout();
    this.authService.authState.subscribe(
      async (user): Promise<any> => {
        if (user) {
          await this.authService.signOut(true);
        }
      }
    );
    if (logout) {
      this.isConnected = false;
      this._snackBar.open('Vous êtes déconnecté', 'Succès', {
        duration: 2000,
        panelClass: 'success-dialog',
      });
    }
  }

  public onConnectModal() {
    this._matDialog
      .open(ConnectModalComponent, {
        data: {
          isOnNav: true,
        },
      })
      .afterClosed()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        async (res: any): Promise<any> => {
          if (res?.connect) {
            this.isConnected = true;
            return;
          } else if (this._userService.isLoggedIn()) {
            this.isConnected = true;
          }
          return;
        }
      );
  }

  public onRegisterModal() {
    this._matDialog
      .open(RegisterModalComponent)
      .afterClosed()
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(
        async (res: any): Promise<any> => {
          if (res?.user) {
            this.isConnected = true;
            return;
          } else if (this._userService.isLoggedIn()) {
            this.isConnected = true;
          }
          return;
        }
      );
  }
}
