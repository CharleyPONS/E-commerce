import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {
  public form: FormGroup;
  public hide: boolean;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.hide = true;
    this.form = this._formBuilder.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.min(6)],
    });
  }

  public async save() {
    const user: User = new User({
      email: this.form.get('email').value,
      password: this.form.get('password').value,
    });
  }
}
