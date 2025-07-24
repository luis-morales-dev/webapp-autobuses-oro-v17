import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ViajesService } from '../../services/viajes.service';
import { Viaje } from '../../interfaces/Viajes';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit, OnDestroy{
  style="width: 75%"
  subtasks= [
    { bus:'oro',completed: true},
    { bus:'erco',completed: true},
    { bus: 'surianos',completed: true},
  ];
  select:string[]=[];
  orden: string='0';
  option:string='0';
  allComplete: boolean = true;
  viajes: Viaje[]= [];
  pipe = new DatePipe('en-US');
  modoviaje='';
  timefor: any;

  constructor(private local: LocalService,
              private viaje: ViajesService,
              private router: Router) { 
              }
              ngAfterViewInit(){
                if(this.local.miviajevuelta.Viaje!=''){
                  this.local.miviajeida={
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
                    Horallegada: '',
                    HoraViajePtoInt: '',
                    Partida: '',
                    Precio: '',
                    EmpresaLogoURL: '',
                    TiempoLimiteVisualizacion: '',
                    TiempoLimiteConfirmacion: '',
                    TiempoLimiteVisualizacionWeb:'',
                    VehiculoAsignado: '',
                    NumAsientosDisponibles: null
                  };
                  this.local.miviajevuelta={
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
                    Horallegada: '',
                    HoraViajePtoInt: '',
                    Partida: '',
                    Precio: '',
                    EmpresaLogoURL: '',
                    TiempoLimiteVisualizacion: '',
                    TiempoLimiteConfirmacion: '',
                    TiempoLimiteVisualizacionWeb:'',
                    VehiculoAsignado: '',
                    NumAsientosDisponibles: null
                  };
                  this.ngOnInit();
                }
              }

  async ngOnInit(): Promise<void> {

    if(localStorage.getItem('proceso')=='3'|| localStorage.getItem('proceso')=='4'|| localStorage.getItem('ultiproceso')=='2' || this.local.tipoviaje==''){
      this.local.redirigir();
      return;
    }

   await this.local.show();
      let todayWithPipe = this.pipe.transform(this.local.FormViaje.fechasalida, 'yyyy-MM-dd');
     await this.viaje.getViajes(0,this.local.FormViaje.origencodigo,this.local.FormViaje.destinocodigo,
        todayWithPipe )
        .subscribe(async resp => {
          if(this.local.tipoviaje!=''){
            scroll(0, 300);
          }
          if(resp.SDTViajes.length>=1){
            if(this.local.tipoviaje=='Viaje Redondo'){
              this.modoviaje='De Ida';
            }
            this.viajes =resp.SDTViajes.sort((a, b) => new Date(a.HoraViaje).getTime() - new Date(b.HoraViaje).getTime());
            await this.local.hide();
            if(this.viajes[0].TiempoLimiteVisualizacionWeb!='0'){
              this.refreshpartidas();
              this.iniciainterval();
            }
          }else{
            await this.local.hide();
          }          
        },async (error)=> {
          await this.local.hide();
         await this.local.redirigir();
        });

  }
  async updateinfo(event:FormGroup){    
    this.local.FormViaje= event.value;
      this.local.miviajeida={
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
        Horallegada: '',
        HoraViajePtoInt: '',
        Partida: '',
        Precio: '',
        EmpresaLogoURL: '',
        TiempoLimiteVisualizacion: '',
        TiempoLimiteConfirmacion: '',
        TiempoLimiteVisualizacionWeb:'',
        VehiculoAsignado: '',
        NumAsientosDisponibles:null
      };
      this.local.miviajevuelta={
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
        Horallegada: '',
        HoraViajePtoInt: '',
        Partida: '',
        Precio: '',
        EmpresaLogoURL: '',
        TiempoLimiteVisualizacion: '',
        TiempoLimiteConfirmacion: '',
        TiempoLimiteVisualizacionWeb:'',
        VehiculoAsignado: '',
        NumAsientosDisponibles: null
      };
    this.viajes=[];
    clearInterval(this.timefor);
    this.ngOnInit();
  }
  someComplete(): boolean {
    if (this.subtasks == null) {
      return false;
    }
    return this.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }
  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.subtasks == null) {
      return;
    }
    this.subtasks.forEach(t => (t.completed = completed));
  }
  updateAllComplete() {
    this.allComplete = this.subtasks != null && this.subtasks.every(t => t.completed);
  }
 async aplicarfiltros(){
  this.select=[];
   for(let bus of this.subtasks){
      if(bus.completed){
        this.select.push(bus.bus);
      }
    }   
    this.orden= this.option; 
  }

  async verasientos(viaje:Viaje){
    let time= await this.difftiempoviaje(viaje.FechaViaje,viaje.HoraViajePtoInt);      
    if(time <= 10){
      this.local.milisegundos = time* 60000;
    }else{
      this.local.milisegundos = 600000;
    }
    if(this.local.tipoviaje=='Viaje Sencillo'){
      this.local.miviajeida=viaje;
      localStorage.setItem('proceso','2');
      localStorage.setItem('ultiproceso','1');
      this.router.navigate(['/seleccionar-asientos']);
    }else if(this.local.tipoviaje=='Viaje Redondo' && this.local.miviajeida.Viaje==''){
      this.local.miviajeida=viaje;
      this.cargarviajesregreso();
      return;
    }
    if(this.local.tipoviaje=='Viaje Redondo' && this.local.miviajeida.Viaje!=''){
      this.local.miviajevuelta=viaje;
      localStorage.setItem('proceso','2');
      localStorage.setItem('ultiproceso','1');
      this.router.navigate(['/seleccionar-asientos']);
    }

  }
  difftiempoviaje(FechaViaje: string, HoraViajePtoInt: string): number {
    let lafecha = this.pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    let horaviaje = this.pipe.transform(HoraViajePtoInt, 'HH:mm:ss');
    let fechaviajehrs = this.pipe.transform(`${FechaViaje}T${horaviaje}`,'yyyy-MM-ddTHH:mm:ss');
    let fnhora = new Date(`${lafecha}`);
    let fnhoraviaje = new Date(`${fechaviajehrs}`);
    let diferencia = (fnhoraviaje.getTime()- fnhora.getTime())/ 1000 / 60;
    return Math.abs(Math.round(diferencia));
  }
  async cargarviajesregreso() {
    this.viajes=[];
    this.modoviaje='De Regreso';
    await this.local.show();
    let todayWithPipe = this.pipe.transform(this.local.FormViaje.fecharegreso, 'yyyy-MM-dd');
   await this.viaje.getViajes(0,this.local.FormViaje.destinocodigo,this.local.FormViaje.origencodigo,
      todayWithPipe )
      .subscribe(async resp => {
        scroll(0, 300);
        if(resp.SDTViajes.length>=1){
          this.viajes =resp.SDTViajes.sort((a, b) => new Date(a.HoraViaje).getTime() - new Date(b.HoraViaje).getTime());
          await this.local.hide();
        }else{
          await this.local.hide();
        }          
      },async (error)=> {
        await this.local.hide();
       await this.local.redirigir();
      });
  }
  async iniciainterval() {
    this.timefor = await setInterval(() => {this.refreshpartidas()}, 60000);
  }
  async refreshpartidas() {
   let nuevo_array :Viaje[]=[];
   let limit: number = Number(this.viajes[0].TiempoLimiteVisualizacionWeb);
    for(let i=0; i< this.viajes.length;i++){
      let time = this.difftiempoviaje(this.viajes[i].FechaViaje,this.viajes[i].HoraViajePtoInt);            
        if(time > limit){
          nuevo_array.push(this.viajes[i]);
        }
    }
    this.viajes= nuevo_array;
  }
  ngOnDestroy(): void {
    clearInterval(this.timefor);
  }
}
