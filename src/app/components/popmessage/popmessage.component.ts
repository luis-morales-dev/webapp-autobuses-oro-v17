import { Component, Inject, OnInit } from '@angular/core';
import { DialogData } from '../popalert/popalert.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popmessage',
  templateUrl: './popmessage.component.html',
  styleUrls: ['./popmessage.component.css']
})
export class PopmessageComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  

}
