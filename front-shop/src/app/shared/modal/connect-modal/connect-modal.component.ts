import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-connect-modal',
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss'],
})
export class ConnectModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConnectModalComponent>) {}

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
