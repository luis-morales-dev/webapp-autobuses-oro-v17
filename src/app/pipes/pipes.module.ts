import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { OrdenPipe } from './orden.pipe';



@NgModule({
  declarations: [
    FiltroPipe,
    OrdenPipe,
  ],
  exports:[
    FiltroPipe,
    OrdenPipe,
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
