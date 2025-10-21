import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Asiento, SDTViajePtoInter } from '../../interfaces/autobus';
import { LocalService } from '../../services/local.service';
import { AutobusService } from '../../services/autobus.service';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ViajesService } from '../../services/viajes.service';
import { PrecioViaje } from 'src/app/interfaces/Viajes';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopmessageComponent } from '../popmessage/popmessage.component';

@Component({
  selector: 'app-seleccionar-asientos',
  templateUrl: './seleccionar-asientos.component.html',
  styleUrls: ['./seleccionar-asientos.component.css']
})
export class SeleccionarAsientosComponent implements OnInit {
  @Output() events: EventEmitter<void> = new EventEmitter();
  @Output() ocupado: EventEmitter<void> = new EventEmitter();
  Asientos: Asiento[] = [];
  pasajes: Asiento[] = [];
  myasiento: Asiento = {
    FilaColumna: ''
  };
  precios: PrecioViaje[] = [];
  form: FormGroup = this.fb.group(
    {
      pasajeros: this.fb.array([])
    }
  );
  Nfilas: number = 0;
  misprecios: any[] = [];
  miabordaje: AbstractControl = new FormControl('');
  formabordo: FormGroup = new FormGroup({
    miabordaje: new FormControl(['', Validators.required]),
  });
  abordajes: SDTViajePtoInter[] = [];
  cantidad: number = 0;
  fechayhrfinal: string = '';
  empresa: string = '';
  modoviaje = '';
  mybandera = true;

  constructor(private fb: FormBuilder,
    public local: LocalService,
    private auto: AutobusService,
    private viaje: ViajesService,
    public dialog: MatDialog,
    private router: Router) {
    this.cantidad = local.FormViaje.Npasajeros;
    this.formabordo = this.fb.group({
      miabordaje: ['', Validators.required]
    });
    this.miabordaje = this.formabordo.controls['miabordaje'];
  }
  async ngOnInit(): Promise<void> {
    scroll(0, 0);
    if (localStorage.getItem('proceso') == '3' || localStorage.getItem('proceso') == '4' || localStorage.getItem('ultiproceso') == '2' || this.local.tipoviaje == '') {
      this.local.redirigir();
      return;
    }
    switch (this.local.miviajeida.Empresa) {
      case '1':
        this.empresa = '/assets/icon/select-erco.png'
        break;
      case '2':
        this.empresa = '/assets/icon/select-oro.png'
        break;
      case '3':
        this.empresa = '/assets/icon/select-surianos.png'
        break;
      default:
        this.empresa = '/assets/icon/select-oro.png'
        break;
    }
    window.addEventListener('beforeunload', (event) => {
      if (this.mybandera) {
        event.preventDefault();
        event.returnValue = '';
      }
    });
    await this.local.show();
    await this.auto.getEstructura(this.local.miviajeida.VehiculoAsignado).subscribe(resp => {
      this.Asientos = resp.map(item => ({ ...item, selec: false, ocupado: false, fijado: false }));
      let fila = this.Asientos[0].FilaColumna.split(',')[0];
      this.Nfilas = Number(fila);
      this.VerAsientosOcupados();
    }, async (error) => {
      await this.local.hide();
      await this.local.redirigir();
    });
  }

  async VerAsientosOcupados() {
    let hora = this.local.miviajeida.HoraViaje.split('T');
    this.fechayhrfinal = this.local.miviajeida.FechaViaje + 'T' + hora[1];
    await this.auto.getAsientosOcupados(this.local.miviajeida.Viaje, this.fechayhrfinal, this.local.miviajeida.Origen, this.local.miviajeida.Destino)
      .subscribe(resp => {
        for (let a = 0; a < this.Asientos.length; a++) {
          let si = false;
          for (let o = 0; o < resp.length; o++) {
            if (this.Asientos[a].Asiento == resp[o].Asiento) {
              si = true;
            }
          }
          if (si) {
            this.Asientos[a].ocupado = true;
          }
        }
        this.puntodeabordo();
      }, async (error) => {
        await this.local.hide();
        await this.local.redirigir();
      });
  }
  puntodeabordo() {
    this.auto.getpuntodeabordo(Number(this.local.miviajeida.Viaje), this.local.miviajeida.Origen, this.local.miviajeida.Destino)
      .subscribe(resp => {
        this.abordajes = resp.SDTViajePtoInter;
        this.mostrarFilas();
      }, async (error) => {
        await this.local.hide();
        await this.local.redirigir();
      });
  }
  async mostrarFilas() {
    if (this.local.timer == false) {
      await this.local.Temporizador(this.local.milisegundos);
    }
    this.getpreciosviaje();
  }
  getpreciosviaje() {
    this.viaje.getPreciosViaje(this.local.miviajeida.Viaje, this.local.miviajeida.Origen, this.local.miviajeida.Destino, this.fechayhrfinal)
      .subscribe(resp => {
        this.local.hide();
        this.modoviaje = this.local.tipoviaje == 'Viaje Redondo' ? "de Ida" : ""
        this.precios = resp.SDTPreciosViaje;
      }, async (error) => {
        await this.local.hide();
        await this.local.redirigir();
      });
  }
  async siguiente(event: Asiento) {
    if (this.formabordo.invalid) {
      return Object.values(this.formabordo.controls).forEach(control => {
        control.markAllAsTouched();
      });
    }
    this.myasiento = event;
    await this.local.show();
    if (this.local.IdTransaccion == '') {
      this.local.IdTransaccion = await window.crypto.randomUUID();
      await localStorage.setItem('IdTransaccion', this.local.IdTransaccion);
    }
    await this.auto.ventaAsiento(Number(this.local.miviajeida.Viaje), Number(this.local.miviajeida.Partida), this.fechayhrfinal, Number(this.myasiento.Asiento), 'INS', this.local.IdTransaccion, this.abordajes[Number(this.miabordaje.value)].Destino, this.local.miviajeida.Origen, 'D0')
      .subscribe(async resp => {
        if (resp.SDTVentaAsiento.Success == false && resp.SDTVentaAsiento.Estatus == 'VIAJEEXPIRADO') {
          let dialogo = await this.dialog.open(PopmessageComponent, {
            data: { message: resp.SDTVentaAsiento.SuccessMsg },
          });
          await this.local.hide();
          await dialogo.afterClosed().subscribe(async resp => {
            this.router.navigateByUrl('/').then(() => {
              window.location.reload();
            });
          });
          return;
        }
        if (resp.SDTVentaAsiento.Success) {
          this.pasajes.push(this.myasiento);
          let pasa = this.fb.group(
            {
              Viaje: [Number(this.local.miviajeida.Viaje), Validators.required],
              Partida: [Number(this.local.miviajeida.Partida), Validators.required],
              FechaSalida: [this.fechayhrfinal, Validators.required],
              Asiento: [Number(this.myasiento.Asiento), Validators.required],
              Apertura: [resp.SDTVentaAsiento.Apertura, Validators.required],
              //ClienteNombre: ['', [Validators.required,Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)]],
              ClienteNombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s*[a-zA-Z]*)*[a-zA-Z]+$/)]],
              Apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s*[a-zA-Z]*)*[a-zA-Z]+$/)]],
              Descuento: [this.precios[0].Descuento, Validators.required],
              LugarAbordaje: [this.abordajes[Number(this.miabordaje.value)].Destino, Validators.required],
              Precio: [Number(this.precios[0].Precio), Validators.required],
              Preciounitario: [this.precios[0].PrecioUnitario, Validators.required],
              myindex: [0],
              IdTransaccion: [resp.SDTVentaAsiento.IdTransaccion],
              DescuentoImporte: [this.precios[0].DescuentoImporte, Validators.required]
            }
          );
          this.pasajeros.push(pasa);
          this.misprecios.push({ precio: this.precios[0].PrecioUnitario, tipo: this.precios[0].Descuento });
          this.events.emit();
          this.local.pasajeros = this.pasajeros.value;
          let array = JSON.stringify(this.pasajeros.value)
          localStorage.setItem('pasajeros', array);
          await this.local.hide();
        } else {
          this.ocupado.emit();
          this.dialog.open(PopmessageComponent, {
            data: { message: 'El Asiento ya se encuentra ocupado, por favor slecciona otro asiento de los disponibles' },
          });
          await this.local.hide();
        }
      }, async (error) => {
        await this.local.hide();
        await this.local.redirigir();
      });
  }
  get pasajeros() {
    return this.form.get("pasajeros") as FormArray;
  }
  async precioselect(event: any, i: number) {
    const info = this.pasajeros.controls[i].value;
    await this.local.show();
    await this.auto.ventaAsiento(Number(this.local.miviajeida.Viaje), Number(this.local.miviajeida.Partida), this.fechayhrfinal, info['Asiento'], 'UPDDTO', this.local.IdTransaccion, this.abordajes[Number(this.miabordaje.value)].Destino, this.local.miviajeida.Origen, this.precios[event.value].Descuento)
      .subscribe(async resp => {
        await this.local.hide();
        if (resp.SDTVentaAsiento.Success && resp.SDTVentaAsiento.AsientoXDescuento > -1) {
          info['Descuento'] = this.precios[event.value].Descuento;
          info['Precio'] = Number(this.precios[event.value].Precio),
            info['Preciounitario'] = Number(this.precios[event.value].PrecioUnitario),
            info['DescuentoImporte'] = Number(this.precios[event.value].DescuentoImporte);
          this.pasajeros.controls[i].reset(info);
          this.misprecios[i]['precio'] = this.precios[event.value].Precio;
          this.misprecios[i]['tipo'] = this.precios[event.value].DescuentoDsc;
        } else {
          this.dialog.open(PopmessageComponent, {
            data: { message: 'Lo sentimos no hay más boletos disponibles de este tipo, selecciona otra opción' },
          });
          info['myindex'] = null;
          info['Descuento'] = null;
          info['Precio'] = null;
          info['Preciounitario'] = null;
          info['DescuentoImporte'] = null;
          this.pasajeros.controls[i].reset(info);
          this.misprecios[i]['precio'] = '0.00';
          this.misprecios[i]['tipo'] = '';
        }
      }, async (error) => {
        await this.local.hide();
        await this.local.redirigir();
      });
  }
  continuar() {
    this.mybandera = false;
    localStorage.setItem('proceso', '3');
    localStorage.setItem('ultiproceso', '2');
    let array = JSON.stringify(this.pasajeros.value)
    localStorage.setItem('pasajeros', array);
    this.local.pasajeros = this.pasajeros.value;
    if (this.local.tipoviaje == 'Viaje Sencillo') {
      this.router.navigate(['/venta-pago']);
      return;
    }
    this.router.navigate(['/asientos-regreso']);
  }
}
