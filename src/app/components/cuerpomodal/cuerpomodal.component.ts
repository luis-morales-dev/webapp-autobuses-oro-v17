import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cuerpomodal',
  templateUrl: './cuerpomodal.component.html',
  styleUrls: ['./cuerpomodal.component.css']
})
export class CuerpomodalComponent implements OnInit {

  constructor(private dialog: MatDialogRef<CuerpomodalComponent>) { }

  ngOnInit(): void {
  }

  cerrarDialogo(): void {
    this.dialog.close()
  }

}
