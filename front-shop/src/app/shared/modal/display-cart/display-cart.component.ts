import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-display-cart',
  templateUrl: './display-cart.component.html',
  styleUrls: ['./display-cart.component.scss'],
})
export class DisplayCartComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DisplayCartComponent>) {}

  ngOnInit(): void {}

  public close() {
    this.dialogRef.close({ close: true });
  }
}
