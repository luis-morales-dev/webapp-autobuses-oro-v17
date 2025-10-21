import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalService } from '../../services/local.service';
import { MatDialog } from '@angular/material/dialog';
import { CuerpomodalComponent } from '../cuerpomodal/cuerpomodal.component';
import { ModalPagoComponent } from '../modal-pago/modal-pago.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router,

    private local: LocalService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.abrirModal();
  }

  buscarCorrida(event: FormGroup) {
    this.local.FormViaje = event.value;
    this.router.navigate(['resultados']);
  }
  abrirModal(): void {
    this.dialog.open(CuerpomodalComponent, {
      width: '950px',
      maxHeight: '90vh',
    });
  }
}