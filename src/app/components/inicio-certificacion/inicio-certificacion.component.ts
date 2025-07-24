import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CuerpomodalComponent } from '../cuerpomodal/cuerpomodal.component';

@Component({
  selector: 'app-inicio-certificacion',
  templateUrl: './inicio-certificacion.component.html',
  styleUrls: ['./inicio-certificacion.component.css']
})
export class InicioCertificacionComponent implements OnInit {

  constructor(private router: Router,

    private local: LocalService,
    private dialog: MatDialog) { }

ngOnInit(): void {
this.abrirModal();
}

buscarCorrida(event:FormGroup){
this.local.FormViaje= event.value;
this.router.navigate(['resultados']);
}
abrirModal():void {
this.dialog.open(CuerpomodalComponent, {
width: '950px',
maxHeight: '90vh',
});
}

}
