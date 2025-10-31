import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Restpagados } from '../interfaces/autobus';
import { Mitresponse, Respuesta, RespuestaConfirmacion, Restligapago } from '../interfaces/intstripe';

const url = environment.url;
const apikey = environment.apikey;

@Injectable({
  providedIn: 'root'
})
export class BoletosService {

  constructor(private http: HttpClient) { }

  confirmarVenta(SDTVentaConfirmacion: any[], SDTVentasPagos: any[]) {
    const data = {
      ApiKey: apikey,
      SDTVentaConfirmacion,
      SDTVentasPagos,
    };
    // http://api-oro.lerco.agency/web/api/get-confirmacion-pago-ws
    return this.http.post<RespuestaConfirmacion>(`${url}get-confirmacion-pago-ws`, data);

  }
  confirmartransaccion(Mode: string, SDTVentasPagos: any[]) {
    // confirmacion-pago-transaccion-ws
    const data = {
      ApiKey: apikey,
      Mode,
      SDTVentasPagos
    };
    return this.http.post<RespuestaConfirmacion>(`${url}confirmacion-pago-transaccion-ws`, data);
  }
  liberarAsientos(detail_compra: any[]) {
    const data = {
      detail_compra
    };
    // http://api-oro.lerco.agency/web/api/post-libera-asiento
    return this.http.post<Respuesta>(`${url}post-libera-asiento`, data);
  }
  enviaremail(total: number, email: string, IdTransaccion: string, detail_venta: any[]) {
    const data = {
      total,
      email,
      IdTransaccion,
      detail_venta
    };
    // http://api-oro.lerco.agency/web/api/post-send-mail
    return this.http.post<Respuesta>(`${url}post-send-mail`, data);
  }
  imprimirboletospagados(IdTransaccion: string,) {
    const data = {
      ApiKey: apikey,
      IdTransaccion,
      folio: "",
      Motivo: "App Web"
    };
    return this.http.post<Restpagados>(`${url}get-lista-boleto-pagados-ws`, data);
  }

  saveresponsehsbc(data: any) {
    // http://api-oro.lerco.agency/web/api/post-request-pago-ws
    return this.http.post(`${url}post-request-pago-ws`, data);
  }
  generarligapago(data: any) {
    // /api/get-genera-liga    
    return this.http.post<Restligapago>(`${url}get-genera-liga`, data);

  }
  getStatusTransaccion(IdTransaccion: string) {
    // /api/get-status-pago
    return this.http.post<Mitresponse>(`${url}get-status-pago`, { IdTransaccion });
  }
}
