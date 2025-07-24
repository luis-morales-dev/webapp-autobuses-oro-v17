import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Asiento, InfoPasajero, SDTViajePtoInter } from '../../interfaces/autobus';
import { LocalService } from '../../services/local.service';
import { AutobusService } from '../../services/autobus.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ViajesService } from '../../services/viajes.service';
import { PrecioViaje } from 'src/app/interfaces/Viajes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asientos-regreso',
  templateUrl: './asientos-regreso.component.html',
  styleUrls: ['./asientos-regreso.component.css']
})
export class AsientosRegresoComponent implements OnInit {
  @Output() events: EventEmitter<void> = new EventEmitter();
  @Output() ocupado: EventEmitter<void> = new EventEmitter();
  Asientos: Asiento[] = [];
  pasajeros:InfoPasajero[]=[];
  precios: PrecioViaje[] = [];
  miabordaje: AbstractControl = new FormControl('');
  formabordo: FormGroup = new FormGroup({
    miabordaje: new FormControl(''),
  });  
  Nfilas: number =0;
  abordajes:SDTViajePtoInter[]=[];
  cantidad: number = 0;
  bandera=0;
  fechayhrfinal: string = '';
  empresa: string = '';
  modoviaje='';
  mybandera = true;


  constructor(private fb: FormBuilder,
    public local: LocalService,
    private auto: AutobusService,
    private viaje: ViajesService,
    private router: Router) {
   this.cantidad = local.FormViaje.Npasajeros;
    this.formabordo = this.fb.group({
      miabordaje:['', Validators.required]
    });
    this.miabordaje= this.formabordo.controls['miabordaje'];
  }
  async ngOnInit(): Promise<void> {
    scroll(0,0);    
    if(localStorage.getItem('proceso')=='4' || this.local.tipoviaje==''){
     await this.local.redirigir();
    }
    switch(this.local.miviajevuelta.Empresa){
      case '1':
        this.empresa='/assets/icon/select-erco.png'
        break;
      case '2':
        this.empresa='/assets/icon/select-oro.png'
        break;
      case '3':
        this.empresa='/assets/icon/select-surianos.png'
        break;
        default:
          this.empresa='/assets/icon/select-oro.png'
          break;
    }
    window.addEventListener('beforeunload', (event) => {
      if(this.mybandera){
      localStorage.setItem('proceso','4');
    localStorage.setItem('ultiproceso','4');
      event.preventDefault();
      event.returnValue ='';
      }
    });
    await this.local.show();
    await this.auto.getEstructura(this.local.miviajevuelta.VehiculoAsignado).subscribe(resp => {      
      this.Asientos = resp.map(item => ({ ...item, selec: false, ocupado: false, fijado: false }));
      let fila= this.Asientos[0].FilaColumna.split(',')[0];
        this.Nfilas =Number(fila);
      this.VerAsientosOcupados();
    },(error)=>{
      this.local.hide();
      this.local.redirigir();
    });
  }
  async VerAsientosOcupados() {
    let hora = this.local.miviajevuelta.HoraViaje.split('T');
    this.fechayhrfinal = this.local.miviajevuelta.FechaViaje + 'T' + hora[1];
    await this.auto.getAsientosOcupados(this.local.miviajevuelta.Viaje,this.fechayhrfinal, this.local.miviajevuelta.Origen,this.local.miviajevuelta.Destino)
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
      },(error)=>{
        this.local.hide();
        this.local.redirigir();
      });
  }
  puntodeabordo() {
    this.auto.getpuntodeabordo(Number(this.local.miviajevuelta.Viaje),this.local.miviajevuelta.Origen,this.local.miviajevuelta.Destino)
    .subscribe(resp => {
      this.abordajes= resp.SDTViajePtoInter;
      this.getpreciosviaje();
    },(error)=>{
      this.local.hide();
      this.local.redirigir();
    });
  }
  getpreciosviaje() {
    this.viaje.getPreciosViaje(this.local.miviajevuelta.Viaje,this.local.miviajevuelta.Origen,this.local.miviajevuelta.Destino,this.fechayhrfinal)
      .subscribe(resp => {
        this.local.hide();
        this.modoviaje= this.local.tipoviaje == 'Viaje Redondo' ? "de Regreso" : ""
        this.precios = resp.SDTPreciosViaje;
        this.cargarpasajeros();
      },(error)=>{
        this.local.hide();
        this.local.redirigir();
      });
  }
  cargarpasajeros() {
    for(let uno of this.local.pasajeros){
      let data:InfoPasajero = {
      Viaje: Number(this.local.miviajevuelta.Viaje),
      Partida:Number(this.local.miviajevuelta.Partida),
      FechaSalida:this.fechayhrfinal,
      Asiento:0,
      Apertura:'',
      ClienteNombre:uno.ClienteNombre,
      Apellido: uno.Apellido,
      Descuento:'',
      LugarAbordaje:'',
      Precio:0,
      Preciounitario:0,
      myindex:uno.myindex,
      IdTransaccion: uno.IdTransaccion,
      DescuentoImporte:0
      };
      this.pasajeros.push(data);
    }
    this.preciofijo();
  }
  preciofijo() {    
    for(let i=0;i<this.local.pasajeros.length;i++){      
      let algo = this.precios.find(item=>item.Descuento == this.local.pasajeros[i].Descuento);
      if(algo!=undefined){
        this.pasajeros[i].Descuento=algo.Descuento;
        this.pasajeros[i].Precio=Number(algo.Precio);
        this.pasajeros[i].Preciounitario=Number(algo.PrecioUnitario);
        this.pasajeros[i].DescuentoImporte=Number(algo.DescuentoImporte);
      }
    }    
  }

  async siguiente(event:Asiento) {
    if(this.formabordo.invalid){
      return Object.values(this.formabordo.controls).forEach(control =>{
        control.markAllAsTouched();
      });
    }
  await this.local.show();
    await this.auto.ventaAsiento(Number(this.local.miviajevuelta.Viaje), Number(this.local.miviajevuelta.Partida), this.fechayhrfinal, Number(event.Asiento), 'INS', this.local.IdTransaccion,this.abordajes[Number(this.miabordaje.value)].Destino,this.local.miviajevuelta.Origen,this.pasajeros[this.bandera].Descuento+'')
      .subscribe(async resp => {
        if (resp.SDTVentaAsiento.Success) {
          this.pasajeros[this.bandera].Asiento=Number(resp.SDTVentaAsiento.Asiento);
          this.pasajeros[this.bandera].Apertura=resp.SDTVentaAsiento.Apertura;
          this.pasajeros[this.bandera].LugarAbordaje=this.abordajes[Number(this.miabordaje.value)].Destino;
          this.events.emit();
          this.local.pasajerosregreso = this.pasajeros;
          await this.local.hide();
          this.bandera++;
          let data = [];
          data.push(...this.local.pasajeros);
          data.push(...this.local.pasajerosregreso);
          let  array = JSON.stringify(data);
          localStorage.setItem('pasajeros',array);
        } else {
          this.ocupado.emit();
          // alerta de compra ganada por otro usuario
          await this.local.hide();
        }
      },async (error)=> {
        await this.local.hide();
       await this.local.redirigir();
      });
  }
  continuar() {
    this.mybandera=false;
    this.router.navigate(['/venta-pago']);
  }
}
