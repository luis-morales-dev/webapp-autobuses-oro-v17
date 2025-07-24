import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { BoletosService } from '../../services/boletos.service';
import { PasarelaService } from '../../services/pasarela.service';
import { LocalService } from '../../services/local.service';
import { PoperrorComponent } from '../poperror/poperror.component';
import { environment } from '../../../environments/environment';

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
export class VentaPagoComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  checterminos = new FormControl(false, [Validators.required]);
  matcher = new MyErrorStateMatcher();
  Mipipe = new DatePipe('en-US');
  banderfin: boolean = false;
  bandera: boolean = true;
  total: number = 0;
  modalpago: any;



  constructor(public local: LocalService,
    private boletos: BoletosService,
    public dialog: MatDialog,
    private pasarela: PasarelaService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router) { }

  async ngOnInit(): Promise<void> {
    let proce= localStorage.getItem('proceso');
    let ultimo = localStorage.getItem('ultiproceso');
    if (proce == '4' || proce != '3' || ultimo != '2') {
      this.local.redirigir();
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
    window.addEventListener('beforeunload', (event) => {
      if (this.bandera) {
        localStorage.setItem('proceso', '4');
        localStorage.setItem('ultiproceso', '4');
        event.preventDefault();
        event.returnValue = '';
      }
    });
  }
  async enviarventa(tipocard: any) {
    this.banderfin = true;
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
    this.pasarela.init(this.renderer, this.document).then(async () => {
      this.modalpago = await new PaymentCheckout.modal({
        client_app_code: key_code,
        client_app_key: key_app,
        locale: 'es',
        //env_mode: 'stg',
        env_mode: 'prod',
        onOpen: () => {
          this.banderfin = true;
        },
        onClose: () => {
          this.banderfin = false;
        },
        onResponse: (response: any) => {
          this.saveresponsehsbc(response);
        }
      });
      await this.modalpago.open({
        user_id: this.local.IdTransaccion,
        user_email: this.emailFormControl.value,
        order_description: 'Venta de Boleto(s) Oro',
        order_amount: Number(this.total.toFixed(2)),
        order_vat: 0,
        order_reference: this.local.IdTransaccion,
      });
    }).catch((error) => {
      this.poperror('Estamos teniendo problemas para procesar el pago');
    });
  }
  async saveresponsehsbc(response: any) {
     await this.modalpago.close();
    this.local.show();
    this.boletos.saveresponsehsbc(response).subscribe({
      next: () => {
        if (response['error']) {
          this.poperror(response['error']['description']);
          return;
        }
        if (response['transaction']) {
          if (response['transaction']['status_detail'] == 3 && response['transaction']['status'] == 'success' && response['transaction']['current_status'] == 'APPROVED') {
            let tipo = response['transaction']['payment_method_type'] == 0 ? '04' : '28';
            this.confirmartransaccion(tipo);
          } else {
            this.poperror(response['transaction']['message']);
          }
        }

      }, error: () => {

      }
    });
  }
  async confirmartransaccion(tipo: string) {
    // await this.local.show();
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
          this.local.total= this.total;
          this.local.email_cliente = this.emailFormControl.value||'';
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
      this.router.navigateByUrl('/');
      setTimeout(() => {
        location.reload();
      }, 2000);
    });
  }
  poperror(msj: string) {
    this.banderfin = false;
    this.dialog.open(PoperrorComponent, {
      data: { message: msj },
    });
  }
  ngOnDestroy() {
    localStorage.setItem('proceso', '4');
    localStorage.setItem('ultiproceso', '3');
  }
}
