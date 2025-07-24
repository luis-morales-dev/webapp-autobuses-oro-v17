import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SDTListaBoletoPagado } from '../../interfaces/autobus';

export interface DialogData {
  pasajeros:SDTListaBoletoPagado[];
  total:number;
  message:string;
}
@Component({
  selector: 'app-popalert',
  templateUrl: './popalert.component.html',
  styleUrls: ['./popalert.component.css']
})
export class PopalertComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
