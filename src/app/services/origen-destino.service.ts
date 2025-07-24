import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RestOrigen, RestDestino } from '../interfaces/origen-destino';
const url= environment.url;
const apikey= environment.apikey;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  constructor(private http: HttpClient) { }

  getOrigen(){
   return this.http.post<RestOrigen>(`${url}get-lista-origen-ws`,{ApiKey: apikey, origen:''});
  }
  getDestino(){
    return this.http.post<RestDestino>(`${url}get-lista-destino-ws`,{ApiKey: apikey, destino:''});
  }

}
