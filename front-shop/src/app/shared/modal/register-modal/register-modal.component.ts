import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<RegisterModalComponent>) {}

  ngOnInit(): void {}

  public close() {
    this.dialogRef.close({ close: true });
  }

  public isConnected(connection: { connect: boolean; user: User }) {
    if (connection?.connect) {
      this.dialogRef.close({ user: connection?.user });
    }
  }
}
