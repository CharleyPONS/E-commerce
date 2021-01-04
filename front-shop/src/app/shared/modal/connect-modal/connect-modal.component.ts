import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-connect-modal',
  templateUrl: './connect-modal.component.html',
  styleUrls: ['./connect-modal.component.scss'],
})
export class ConnectModalComponent implements OnInit {
  public isOnOrder: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ConnectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.isOnNav) {
      this.isOnOrder = false;
    }
  }

  public close() {
    this.dialogRef.close({ close: true });
  }

  public isConnected(connection: { connect: boolean }) {
    if (connection?.connect) {
      this.dialogRef.close({ connect: connection?.connect });
    }
  }
}
