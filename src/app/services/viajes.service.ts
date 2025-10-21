import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestPago } from '../interfaces/intstripe';
import { RestPrecioViaje, RestViajes } from '../interfaces/Viajes';

const url = environment.url;
const apikey = environment.apikey;

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  constructor(private http: HttpClient) { }

  getViajes(Empresa: number, Origen: string, Destino: string, FechaViaje: any) {
    const data = {
      ApiKey: apikey,
      Empresa,
      Origen,
      Destino,
      FechaViaje,
      Tipo: "CR"
    }
    return this.http.post<RestViajes>(`${url}get-lista-viajes-ws`, data);
  }
  getPreciosViaje(Viaje: string, Origen: string, Destino: string, FechaSalida: string) {
    // http://api-oro.lerco.agency/web/api/get-precios-viaje-ws
    const data = {
      ApiKey: apikey,
      Viaje,
      Origen,
      Destino,
      FechaSalida
    };

    return this.http.post<RestPrecioViaje>(`${url}get-precios-viaje-ws`, data);
  }

  realizarPago(token_card: string, total: number) {
    // http://api-oro.lerco.agency/web/api/post-stripe-pago
    return this.http.post<RestPago>(`${url}post-stripe-pago`, { token_card, total });
  }
}
