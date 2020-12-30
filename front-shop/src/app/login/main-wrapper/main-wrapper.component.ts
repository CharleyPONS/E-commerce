import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  styleUrls: ['./main-wrapper.component.scss'],
})
export class MainWrapperComponent implements OnInit {
  @Input() isOrder: boolean = false;
  public isConnected: boolean = false;
  constructor(private _userService: UserService, private _router: Router) {}

  async ngOnInit(): Promise<any> {
    this.isConnected = this._userService.isLoggedIn();
    if (this.isConnected) {
      await this._router.navigateByUrl('/');
    }
  }
}
//todo idée si on est connecté il faut que ce lien affiche une page mon compte je sais c'est un peu long a faire cette page et chiant mais pas le choix
