import { Pipe, PipeTransform } from '@angular/core';
import { Viaje } from '../interfaces/Viajes';

@Pipe({
  name: 'orden'
})
export class OrdenPipe implements PipeTransform {

  transform(viajes: Viaje[], nombre: string): Viaje[] {    
    if(nombre =='0'){
      return viajes;
    }else{
     return viajes.reverse();
    }
  }
}
