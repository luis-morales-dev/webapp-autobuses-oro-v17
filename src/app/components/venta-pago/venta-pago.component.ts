import { SocketService } from './../../services/socket.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BoletosService } from '../../services/boletos.service';
import { LocalService } from '../../services/local.service';
import { PoperrorComponent } from '../poperror/poperror.component';
import { environment } from '../../../environments/environment';
import { ModalPagoComponent } from '../modal-pago/modal-pago.component';
import { RestStatusPago } from 'src/app/interfaces/intstripe';

declare var PaymentCheckout: any;
const key_code = environment.client_app_code;
const key_app = environment.client_app_key;


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-venta-pago',
  templateUrl: './venta-pago.component.html',
  styleUrls: ['./venta-pago.component.css']
})
export class VentaPagoComponent implements OnInit, OnDestroy {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  checterminos = new FormControl(false, [Validators.required]);
  matcher = new MyErrorStateMatcher();
  Mipipe = new DatePipe('en-US');
  banderfin: boolean = false;
  bandera: boolean = true;
  total: number = 0;
  liga_pago: string = '';

  constructor(public local: LocalService,
    private boletos: BoletosService,
    public dialog: MatDialog,
    private socketService: SocketService,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    let proce = localStorage.getItem('proceso');
    let ultimo = localStorage.getItem('ultiproceso');
    if (proce == '4' || proce != '3' || ultimo != '2') {
      this.local.redirigir();
      return;
    }
    scroll(0, 0);
    this.local.pasajeros.forEach((item) => {
      this.total += item.Precio;
    });
    if (this.local.tipoviaje == 'Viaje Redondo') {
      this.local.pasajerosregreso.forEach((item) => {
        this.total += item.Precio;
      });

    }
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    this.initializeSocket();
  }
  private beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    if (this.bandera) {
      localStorage.setItem('proceso', '4');
      localStorage.setItem('ultiproceso', '4');
      event.preventDefault();
      event.returnValue = '';
    }
  };
  private initializeSocket(): void {
    this.socketService.connect().subscribe({
      next: (message) => {
        message = JSON.parse(message);
        if (message['action'] == 'payment_update' && message['payment_reference'] == this.local.IdTransaccion) {
          this.dialog.closeAll();
          this.saveresponsehsbc(message['data']);
        }
      },
      error: (error) => {
        console.error('Error en WebSocket:', error);
      },
      complete: () => {
        console.log('Conexión WebSocket cerrada');
      }
    });
  }
  async enviarventa(tipocard: any) {
    this.banderfin = true;
    if (!this.socketService.isConnected()) {
      this.modalerror();
      return;
    }
    if (this.local.fecha_99 != '') {
      this.opencheckout();
      return;
    }
    this.local.show();
    let pasajes: any[] = [];
    this.local.pasajeros.forEach((item) => {
      let dos = {
        Viaje: item.Viaje,
        Partida: item.Partida,
        FechaSalida: item.FechaSalida,
        Asiento: item.Asiento,
        Apertura: item.Apertura,
        Cliente: "",
        Estatus: "PRECONFIRMACION",
        ClienteNombre: item.ClienteNombre + ' ' + item.Apellido,
        LugarAbordaje: item.LugarAbordaje,
        Descuento: item.Descuento,
        Precio: item.Precio,
        DescuentoImporte: item.DescuentoImporte
      };
      pasajes.push(dos);
    });
    if (this.local.tipoviaje == 'Viaje Redondo') {
      this.local.pasajerosregreso.forEach((uno) => {
        let dos = {
          Viaje: uno.Viaje,
          Partida: uno.Partida,
          FechaSalida: uno.FechaSalida,
          Asiento: uno.Asiento,
          Apertura: uno.Apertura,
          Cliente: "",
          Estatus: "PRECONFIRMACION",
          ClienteNombre: uno.ClienteNombre + ' ' + uno.Apellido,
          LugarAbordaje: uno.LugarAbordaje,
          Descuento: uno.Descuento,
          Precio: uno.Precio,
          DescuentoImporte: uno.DescuentoImporte
        };
        pasajes.push(dos);
      });
    }
    let date = new Date();
    this.local.fecha_99 = this.Mipipe.transform(date, 'yyyy-MM-ddTH:mm:ss');
    localStorage.setItem('fecha99', this.local.fecha_99 || '');
    this.boletos.confirmarVenta(pasajes, [{
      IdTransaccion: this.local.IdTransaccion,
      Partida: 1,
      FormaPago: tipocard,
      Fecha: this.local.fecha_99,
      Monto: this.total
    }]).subscribe({
      next: async (resp) => {
        this.local.hide();
        if (resp.SDTVentasPagosRespuesta.Success) {
          this.opencheckout();
        } else {
          this.modalerror();
        }
      },
      error: async () => {
        this.local.hide();
        this.modalerror();
      }
    });
  }
  opencheckout() {
    if (this.liga_pago) {
      this.abrirModal(this.liga_pago);
      return;
    }
    this.local.show();
    this.boletos.generarligapago({
      IdTransaccion: this.local.IdTransaccion,
      total: this.total,
      email: this.emailFormControl.value || ''
    }).subscribe({
      next: (resp) => {
        this.local.hide();
        if (resp.code === 202) {
          this.liga_pago = resp.url_pago;
          this.socketService.sendMessage({
            action: 'subscribe',
            payment_reference: this.local.IdTransaccion,
            timestamp: new Date().toISOString()
          });
          this.abrirModal(resp.url_pago);
        }
      },
      error: () => {
        this.local.hide();
      }
    });
  }
  abrirModal(url: string): void {
    const dialogRef = this.dialog.open(ModalPagoComponent, {
      width: '600px',
      height: '700px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'responsive-modal',
      data: { url: url }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.banderfin = false;
    });
  }
  async saveresponsehsbc(response: RestStatusPago) {
    if (response.status == 'denied') {
      this.liga_pago = '';
      this.poperror(response.message || 'Transacción no aprobada por el banco emisor.');

      return;
    }
    if (response.status == 'error') {
      this.modalerror();
      return;
    }
    if (response.status == 'approved') {
      this.bandera = false;
      this.confirmartransaccion(response.card_type_code);
    } else {
      this.modalerror();
    }
  }
  async confirmartransaccion(tipo: string) {
    await this.local.show();
    this.boletos.confirmartransaccion('COM', [{
      IdTransaccion: this.local.IdTransaccion,
      Partida: 1,
      FormaPago: tipo,
      Fecha: this.local.fecha_99,
      Monto: this.total
    }]).subscribe({
      next: (resp) => {
        this.local.hide();
        if (resp.SDTVentasPagosRespuesta.Success) {
          this.local.total = this.total;
          this.local.email_cliente = this.emailFormControl.value || '';
          this.router.navigate(['/descarga-boleto']);
        } else {
          this.modalerror();
        }
      }, error: (error) => {
        this.local.hide();
        this.modalerror();
      }
    });
  }
  modalerror() {
    this.banderfin = false;
    let dialog = this.dialog.open(PoperrorComponent, {
      data: { message: 'Error al intentar confirmar la venta de asientos, no es posible completar la operación.' },
    });
    dialog.afterClosed().subscribe(async (resp) => {
      this.router.navigateByUrl('/').then(() => {
        window.location.reload();
      });
    });
  }
  poperror(msj: string) {
    this.banderfin = false;
    this.dialog.open(PoperrorComponent, {
      data: { message: msj },
    });
  }
  private removeBeforeUnloadListener(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  ngOnDestroy() {
    this.removeBeforeUnloadListener(); // Limpiar al destruir el componente
    this.socketService.disconnect();
    this.dialog.closeAll();
    //localStorage.setItem('proceso', '4');
    //localStorage.setItem('ultiproceso', '3');
  }
}
