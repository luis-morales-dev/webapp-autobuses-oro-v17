import { Injectable } from '@angular/core';
import { Viaje } from '../interfaces/Viajes';
import { Router } from '@angular/router';
import { InfoPasajero } from '../interfaces/autobus';
import { BoletosService } from './boletos.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  isloader: boolean = false;
  timer: boolean = false;
  milisegundos: number = 600000;
  fecha_99: string | null = '';
  contador: any;
  segundos: any;
  minutos: any;
  inte: any;
  FormViaje = {
    origencodigo: '',
    destinocodigo: '',
    origen: '',
    destino: '',
    fechasalida: '',
    fecharegreso: '',
    Npasajeros: 1
  };
  tipoviaje: string = '';

  miviajeida: Viaje = {
    Viaje: '',
    Origen: '',
    OrigenNombre: '',
    Destino: '',
    DestinoNombre: '',
    Empresa: '',
    EmpresaNombre: '',
    PuntoVenta: '',
    Ruta: '',
    Servicio: '',
    Nombre: '',
    FechaViaje: '',
    HoraViaje: '',
    HoraSistema: '',
    Partida: '',
    Precio: '',
    EmpresaLogoURL: '',
    TiempoLimiteVisualizacion: '',
    TiempoLimiteConfirmacion: '',
    VehiculoAsignado: '',
    Horallegada: '',
    HoraViajePtoInt: '',
    NumAsientosDisponibles: null,
    TiempoLimiteVisualizacionWeb: ''
  };
  miviajevuelta: Viaje = {
    Viaje: '',
    Origen: '',
    OrigenNombre: '',
    Destino: '',
    DestinoNombre: '',
    Empresa: '',
    EmpresaNombre: '',
    PuntoVenta: '',
    Ruta: '',
    Servicio: '',
    Nombre: '',
    FechaViaje: '',
    HoraViaje: '',
    HoraSistema: '',
    Partida: '',
    Precio: '',
    EmpresaLogoURL: '',
    TiempoLimiteVisualizacion: '',
    TiempoLimiteConfirmacion: '',
    VehiculoAsignado: '',
    Horallegada: '',
    HoraViajePtoInt: '',
    NumAsientosDisponibles: null,
    TiempoLimiteVisualizacionWeb: ''
  };
  pasajeros: InfoPasajero[] = [];
  pasajerosregreso: InfoPasajero[] = [];
  IdTransaccion: string = '';
  email_cliente: string = '';
  total: number = 0;

  constructor(private router: Router,
    private boletos: BoletosService) { }

  Temporizador(time: number) {
    this.timer = true;
    this.milisegundos = time;
    this.inte = setInterval(() => {
      this.milisegundos = this.milisegundos - 1000;
      this.segundos = Math.floor(this.milisegundos / 1000);
      this.minutos = Math.floor(this.segundos / 60);
      this.minutos %= 60;
      this.segundos %= 60;
      this.minutos = this.minutos < 10 ? '0' + this.minutos : this.minutos;
      this.segundos = this.segundos < 10 ? '0' + this.segundos : this.segundos;
      if (this.milisegundos == 0) {
        clearInterval(this.inte);
        this.redirigir();
      }
    }, 1000);
  }

  show(): void {
    this.isloader = true;
  }
  hide(): void {
    this.isloader = false;
  }
  async closetimer() {
    await clearInterval(this.inte);
  }
  GenerarIdTransaccion() {
    this.IdTransaccion = Math.random().toString(20).toUpperCase().slice(5) + Math.random().toString(20).toUpperCase().slice(5);
  }
  async redirigir() {
    this.timer = false;
    this.milisegundos = 0;
    this.contador = 0;
    this.segundos = 0;
    this.minutos = 0;
    clearInterval(this.inte);
    const pasajes: any[] = [];
    if (this.pasajeros.length >= 1) {
      for (let uno of this.pasajeros) {
        let asiento = {
          Viaje: uno.Viaje,
          Partida: uno.Partida,
          LugarAbordaje: uno.LugarAbordaje,
          FechaSalida: uno.FechaSalida,
          Asiento: uno.Asiento,
          IdTransaccion: uno.IdTransaccion
        };
        pasajes.push(asiento);
      }
      if (this.pasajerosregreso.length >= 1) {
        this.pasajeros.push(...this.pasajerosregreso);
      }
      this.boletos.liberarAsientos(pasajes).subscribe(async resp => {
        if (resp.code == 202) {
          this.pasajeros = [];
          this.pasajerosregreso = [];
          await localStorage.clear();
          this.router.navigateByUrl('/').then(() => {
            window.location.reload();
          });
        }
      });
    } else {
      this.router.navigateByUrl('/').then(() => {
        window.location.reload();
      });
    }
  }
  async liberar() {
    this.timer = false;
    this.milisegundos = 0;
    this.contador = 0;
    this.segundos = 0;
    this.minutos = 0;
    clearInterval(this.inte);
    let boletos: any = null;
    let pasajes: any[] = [];
    // @ts-ignore
    boletos = JSON.parse(localStorage.getItem('pasajeros')) ?? [];
    if (boletos != null && boletos.length == 0) {
      return;
    }
    for (let uno of boletos) {
      let asiento = {
        Viaje: uno.Viaje,
        Partida: uno.Partida,
        LugarAbordaje: uno.LugarAbordaje,
        FechaSalida: uno.FechaSalida,
        Asiento: uno.Asiento,
        IdTransaccion: uno.IdTransaccion
      };
      pasajes.push(asiento);
    }
    this.boletos.liberarAsientos(pasajes).subscribe(async resp => {
      await localStorage.clear();
      this.pasajeros = [];
      this.pasajerosregreso = [];
      this.IdTransaccion = '';
    });
  }
}
