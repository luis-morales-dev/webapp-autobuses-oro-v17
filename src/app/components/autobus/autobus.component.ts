import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Asiento } from '../../interfaces/autobus';

@Component({
  selector: 'app-autobus',
  templateUrl: './autobus.component.html',
  styleUrls: ['./autobus.component.css']
})
export class AutobusComponent implements OnInit {
  @Input() events: EventEmitter<void> = new EventEmitter();
  @Input() ocupado: EventEmitter<void> = new EventEmitter();
  @Output() eleccion: EventEmitter<Asiento> = new EventEmitter();
  @Input() Asientos: Asiento[] = [];
  @Input() Empresa: string='';
  @Input() Viaje: number=1;
  @Input() cantidad: number = 0;
  fila0: Asiento[] = [];
  fila1: Asiento[] = [];
  fila2: Asiento[] = [];
  fila3: Asiento[] = [];
  fila4: Asiento[] = [];
  myasiento: Asiento = {
    FilaColumna: ''
  };
  ultifila: number | undefined;
  ultiasiento!: number;
  bandera: number=0;
  constructor() { }

  ngOnInit(): void {
    this.events.subscribe(()=>{
      this.bandera++;
      this.confirmacion();
    });
    this.ocupado.subscribe(()=>{
      this.estaocupado();
    });
    for (let asiento of this.Asientos) {
      switch (asiento.FilaColumna.split(',')[0]) {
        case '0':
          this.fila0.push(asiento);
          break;
        case '1':
          this.fila1.push(asiento);
          break;
        case '2':
          this.fila2.push(asiento);
          break;
        case '3':
          this.fila3.push(asiento);
          break;
        case '4':
          this.fila4.push(asiento);
          break;
          default:
            break;
      }
    }
  }
  async mieleccion(i: any, asiento: any, item: Asiento) {
    if (item.ocupado || item.fijado || this.bandera == this.cantidad) {
      return;
    }
    await this.limpiar();
    switch (i) {
      case 0:
        this.fila0[asiento].selec = true;
        break;
      case 1:
        this.fila1[asiento].selec = true;
        break;
      case 2:
        this.fila2[asiento].selec = true;
        break;
      case 3:
        this.fila3[asiento].selec = true;
        break;
      case 4:
        this.fila4[asiento].selec = true;
        break;
      default:
        break;
    }
    this.myasiento = item;
    this.ultifila = i;
    this.ultiasiento = asiento;
  }
  limpiar() {
    switch (this.ultifila) {
      case 0:
        this.fila0[this.ultiasiento].selec = false;
        break;
      case 1:
        this.fila1[this.ultiasiento].selec = false;
        break;
      case 2:
        this.fila2[this.ultiasiento].selec = false;
        break;
      case 3:
        this.fila3[this.ultiasiento].selec = false;
        break;
      case 4:
        this.fila4[this.ultiasiento].selec = false;
        break;
      default:
        break;
    }
  }

  confirmacion() {
    switch (this.ultifila) {
      case 0:
        this.fila0[this.ultiasiento].selec = true;
        this.fila0[this.ultiasiento].fijado = true;
        break;
      case 1:
        this.fila1[this.ultiasiento].selec = true;
        this.fila1[this.ultiasiento].fijado = true;
        break;
      case 2:
        this.fila2[this.ultiasiento].selec = true;
        this.fila2[this.ultiasiento].fijado = true;
        break;
      case 3:
        this.fila3[this.ultiasiento].selec = true;
        this.fila3[this.ultiasiento].fijado = true;
        break;
      case 4:
        this.fila4[this.ultiasiento].selec = true;
        this.fila4[this.ultiasiento].fijado = true;
        break;
      default:
        break;
    }
    this.myasiento = {
      FilaColumna: ''
    };
    this.ultifila = undefined;
  }
  estaocupado(){
    switch (this.ultifila) {
      case 0:
        this.fila0[this.ultiasiento].ocupado = true;
        break;
      case 1:
        this.fila1[this.ultiasiento].ocupado = true;
        break;
      case 2:
        this.fila2[this.ultiasiento].ocupado = true;
        break;
      case 3:
        this.fila3[this.ultiasiento].ocupado = true;
        break;
      case 4:
        this.fila4[this.ultiasiento].ocupado = true;
        break;
      default:
        break;
    }
    this.ultifila=undefined;
    this.myasiento= {
      FilaColumna: ''
    };
  }
  siguiente(){
    this.eleccion.emit(this.myasiento);
  }
}