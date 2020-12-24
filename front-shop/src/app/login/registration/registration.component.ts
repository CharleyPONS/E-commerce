import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
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
}
}
