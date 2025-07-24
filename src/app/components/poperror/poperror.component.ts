import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../popalert/popalert.component';

@Component({
  selector: 'app-poperror',
  templateUrl: './poperror.component.html',
  styleUrls: ['./poperror.component.css']
})
export class PoperrorComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
