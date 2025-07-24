import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {map } from 'rxjs/operators'
import { RestAsientos, RestAsientoOcupado, RestVentaAsiento, RESTAbordaje } from '../interfaces/autobus';
const url= environment.url;
const apikey= environment.apikey;

@Injectable({
  providedIn: 'root'
})
export class AutobusService {

  constructor(private http: HttpClient) { }

  getEstructura(Vehiculo: string){
    //http://api-oro.lerco.agency/web/api/get-vehiculo-estructura-ws
    http://api-oro.lercomx.com/web/api/get-vehiculo-estructura-ws
   return this.http.post<RestAsientos>(`${url}get-vehiculo-estructura-ws`,{ApiKey: apikey, Vehiculo})
    .pipe(map(data =>{
    return  data.SDTVehiculoAsientos;
    }));
  }
  getAsientosOcupados(Viaje: string, FechaSalida:string,Origen: string, Destino:string){
   const data= {   
      ApiKey:apikey,
      Viaje,
      Origen,
      Destino,
      FechaSalida,
    }    
   // console.log('obener asientos ocupados', data);
    
   return this.http.post<RestAsientoOcupado>(`${url}get-lista-viaje-ocupacion-actual-ws`,data)
   .pipe(map(data =>{
    return  data.SDTVentaListaDD;
    }));
  }

  ventaAsiento(Viaje:number,Partida: number,FechaSalida: string,Asiento:number,Modo: string,IdTransaccion: string,LugarAbordaje:string,Origen: string,DescuentoCod: string){
   // http://api-oro.lerco.agency/web/api/post-venta-asiento-ws
   const data= {   
    ApiKey:apikey,
    Modo,  // INS ---- DLT
    Viaje,
    Partida,
    LugarAbordaje,
    FechaSalida,
    Asiento,
    IdTransaccion,
    Origen,
    DescuentoCod,
};
return this.http.post<RestVentaAsiento>(`${url}post-venta-asiento-ws`,data);
}
// punto de abordaje
getpuntodeabordo(Viaje:number,Origen: string, Destino:string){
  // HTTPS://EOS.AZURE-API.NET/EOSAPIWEB/WWWAPI/LISTAVIAJEPTOINTERMEDIOSWS
  const data={
    ApiKey:apikey,
    Viaje,
    Origen,
    Destino

  };  
  return this.http.post<RESTAbordaje>(`${url}get-lista-viajepto-intermedios-ws`,data);
  }
}
