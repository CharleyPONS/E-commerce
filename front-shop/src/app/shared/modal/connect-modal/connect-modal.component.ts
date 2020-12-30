import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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

  public isConnected(connection: boolean) {
    if (connection) {
      this.dialogRef.close({ close: true });
    }
  }
}
