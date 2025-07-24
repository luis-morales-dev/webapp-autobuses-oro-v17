import { Pipe, PipeTransform } from '@angular/core';
import { Viaje } from '../interfaces/Viajes';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {
segundo:Viaje[]=[];
  transform(viajes: Viaje[], nombres: string[]): Viaje[] {
    if(nombres.length==0){
      return viajes;
    }
    this.segundo=[];
    for (let i = 0; i <= viajes.length - 1; i++){
      let si = false;
      for(let ii = 0; ii <= nombres.length - 1; ii++){
        if (viajes[i].EmpresaNombre.toLowerCase() ==nombres[ii]){
          si = true;
        }
      }
      if (si){
        this.segundo.push(viajes[i]);
      }
    }  
  return this.segundo;
  }
}
