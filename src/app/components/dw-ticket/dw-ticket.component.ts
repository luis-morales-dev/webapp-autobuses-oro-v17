import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../services/local.service';
import { SDTListaBoletoPagado } from '../../interfaces/autobus';
import { BoletosService } from '../../services/boletos.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Router } from '@angular/router';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
const logooro = environment.logooro;



@Component({
  selector: 'app-dw-ticket',
  templateUrl: './dw-ticket.component.html',
  styleUrl: './dw-ticket.component.css'
})
export class DwTicketComponent implements OnInit {
  Mipipe = new DatePipe('en-US');
  pasajeros: SDTListaBoletoPagado[] = [];
  total_boleto: number = 0;
  finales: any[] = [];
  pdfObject: any;
  misestilos: any = {
    header: {
      fontSize: 9,
    },
    subtotales: {
      fontSize: 10,
    },
    subheader: {
      fontSize: 11,
      bold: true
    },
  }


  constructor(public local: LocalService,
    private boletos: BoletosService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.local.IdTransaccion == '') {
      this.local.redirigir();
      return;
    }
    this.local.show();
    this.boletos.imprimirboletospagados(this.local.IdTransaccion).subscribe({
      next: async (resp) => {
        this.pasajeros = resp.SDTListaBoletoPagado;
        await this.local.closetimer();
        await this.enviaremail();
      },
      error: async () => {
        await this.local.hide();
      }
    });
  }
  enviaremail() {
    let midata: any[] = [];
    this.pasajeros.forEach((uno) => {
      let data = {
        cliente: uno.Cliente,
        asiento: uno.Asiento,
        folio: uno.Folio,
        fecha_salida: this.Mipipe.transform(uno.FechaSalida, 'dd/MM/yyyy'),
        origen_destino: `${uno.Origen} - ${uno.Destino}`
      };
      midata.push(data);
    });
    this.boletos.enviaremail(this.local.total, this.local.email_cliente, this.local.IdTransaccion, midata)
      .subscribe({
        next: async (resp) => {
          await this.local.hide();
          this.generarpdf();
          if (navigator.userAgent.match(/Android/i) || window.innerWidth <= 780) {
            //@ts-ignore
            let url = encodeURIComponent(resp.boleto_pdf);
            setTimeout(() => {
              let win = window.open('https://docs.google.com/viewer?url=' + url, '_blank');
            }, 2000);
            //@ts-ignore
            win.focus();
            return;
          }
          /* let win = window.open(resp.boleto_pdf, '_blank');
          //@ts-ignore
          win.focus();*/
        }, error: async () => {
          await this.local.hide();
          this.generarpdf();
        }
      });
  }

  async generarpdf() {
    this.pasajeros.forEach((uno) => {
      this.total_boleto = Number(uno.Subtotal) + Number(uno.IVA);
      let boleto = {
        table: {
          widths: [74, 74, 74],
          body: [
            [{
              colSpan: 3,
              alignment: 'center',
              // margin: [left, top, right, bottom]
              margin: [0, 0, 0, 30],
              image: logooro,
              width: 70
            }, {}, {}],
            [{
              stack: [
                'Origen :',
                { text: uno.Origen, style: 'subheader' },
              ],
              style: 'header'
            }, {}, {
              stack: [
                'Destino :',
                { text: uno.Destino, style: 'subheader' },
              ],
              alignment: 'right',
              style: 'header'
            }],
            [{
              stack: [
                'Servicio :',
                { text: uno.TipoDeServicio, style: 'subheader' },
              ],
              alignment: 'center',
              style: 'header', colSpan: 3
            }, {}, {}],
            [{
              stack: [
                'Cliente :',
                { text: uno.Cliente, style: 'subheader' },
              ],
              style: 'header', colSpan: 3
            }, {}, {}],

            [{
              stack: [
                'Fecha salida :',

                { text: this.Mipipe.transform(uno.FechaSalida, 'dd/MM/yyyy'), style: 'subheader' },
              ],
              style: 'header'
            }, {}, {
              stack: [
                'Hora salida :',
                { text: this.Mipipe.transform(uno.FechaSalida, 'H:mm'), style: 'subheader' },
              ],
              alignment: 'right',
              style: 'header'
            }],
            [{
              stack: [
                'Lugar abordaje :',
                { text: uno.LugarAbordaje, style: 'subheader' },
              ],
              style: 'header'
            }, {}, {
              stack: [
                'Hora aproximada de abordaje :',
                { text: this.Mipipe.transform(uno.FechaSalidaPtoInt, 'H:mm'), style: 'subheader' },
              ],
              alignment: 'right',
              style: 'header'
            }],
            [{
              stack: [
                'Asiento :',
                { text: uno.Asiento, style: 'subheader', margin: [12, 0, 0, 0], },
              ],
              style: 'header'
            }, {}, {
              stack: [
                'Tipo :',
                { text: uno.Descuento, style: 'subheader' },
              ],
              alignment: 'right',
              style: 'header'
            }],
            [
              {
                stack: [
                  'Folio :',
                  { text: uno.Folio, style: 'subheader', margin: [5, 0, 0, 0], },
                ],
                style: 'header'
              },
              {
                stack: [
                  'CVC :',
                  { text: uno.CVC, style: 'subheader' },
                ],
                alignment: 'center',
                style: 'header'
              }, {
                stack: [
                  'Pago :',
                  { text: uno.TipoPago, style: 'subheader' },
                ],
                alignment: 'right',
                style: 'header'
              }],
            [{ qr: uno.FolioAsiento, fit: 116, rowSpan: 4 }, {}, {}],
            ['', { text: 'Subtotal :', alignment: 'right', margin: [0, 55, 0, 0], style: 'subtotales' }, { text: uno.Subtotal, alignment: 'right', style: 'subtotales', margin: [0, 55, 0, 0] }],
            ['', { text: 'iva :', alignment: 'right', style: 'subtotales' }, { text: uno.IVA, alignment: 'right', style: 'subtotales' }],
            ['', { text: 'Total :', alignment: 'right', style: 'subtotales' }, { text: this.total_boleto.toFixed(2), alignment: 'right', style: 'subtotales' }],
            [{}, {}, {}],
            [{ text: 'www.autobusesoro.com.mx', alignment: 'center', bold: true, colSpan: 3, margin: [0, 10, 0, 0] }, {}, {}],
            [{
              stack: [
                { text: 'Este boleto cubre su seguro de viajero', alignment: 'center', bold: true, colSpan: 3, fontSize: 11, margin: [0, 5, 0, 5] },
                { text: 'Régimen fiscal: 624 - Régimen de los Coordinados. Av. del Bosque 6104-2 Col. Bugambilias Puebla,Puebla CP.72580', fontSize: 8 },
              ], colSpan: 3, alignment: 'center', fontSize: 10
            }, {}, {}],
            [{
              stack: [
                { text: 'FACTURACIÓN', alignment: 'center' },
                { text: 'Para facturar su boleto acuda directamente a su terminal más cercana. Para mayor información, comuniquese al teléfono (222) 249 7419 ext. 343', fontSize: 7.5, bold: false, margin: [0, 0, 0, 0] },
              ], colSpan: 3, alignment: 'justify', fontSize: 9, bold: true, margin: [0, 5, 0, 0]
            }, {}, {}],
            [{
              stack: [
                { text: 'LÍNEA DIRECTA Y EQUIPAJE' },
                { text: 'Para dudas, quejas y sugerencias comuníquese al 222 249 7419 o WhatsApp 222 450 66 05 Equipaje hasta 35 kg de equipaje sin costo. La empresa no se hace responsable por objetos dañados, perdidos u olvidados en nuestros puntos de Venta y/o autobuses (incluyen: objetos o equipos de valor frágiles, electrónicos etc). En servicio economico todo el equipaje viaja bajo responsabilidad total del pasajero. Para mayor información sobre nuestras políticas de viaje, visite www.autobusesoro.com.mx/politicas', fontSize: 7.5, bold: false, alignment: 'justify' },
              ], colSpan: 3, alignment: 'center', fontSize: 9, bold: true, margin: [0, 5, 0, 0]
            }, {}, {}],
            [{
              stack: [
                { text: 'AVISO DE PRIVACIDAD' },
                { text: 'La empresa es responsable del tratamiento de sus datos personales, con domicilio en Avenida del Bosque, número 6104, interior 2, Colonia Bugambilias, Puebla, Puebla, código postal 72580, es responsable de recabar sus datos personales con la finalidad que da origen y son necesarias para la existencia, mantenimiento y cumplimiento de la relaón jurídica entre el usuario o pasajero y la empresa, brindarle el servicio que nos solicita, para fines de seguimiento, actualización y confirmación en cuanto a productos y servicios contratados. Para mayor información acerca del tratamiento y de los derechos que puede hacer valer, usted puede acceder al aviso de privacidad completo a través de página www.autobusesoro.com.mx, para su consulta.', fontSize: 7.5, bold: false, alignment: 'justify' },
              ], colSpan: 3, alignment: 'center', fontSize: 9, bold: true, margin: [0, 0, 0, 5]
            }, {}, {}],
            [
              [
                {
                  table: {
                    body: [
                      [{
                        image: 'data:image/png;base64,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',
                        width: 10, alignment: 'right'
                      }, { text: '@AutobusesORO', fontSize: 7.5 }]
                    ]
                  }, layout: 'noBorders'
                }
              ],
              [
                {
                  table: {
                    body: [
                      [{
                        image: 'data:image/png;base64,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',
                        width: 10
                      }, { text: '@OroAutobuses', fontSize: 7.5 }]
                    ]
                  }, layout: 'noBorders'
                }
              ],
              [
                {
                  table: {
                    body: [
                      [{
                        image: 'data:image/png;base64,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',
                        width: 10
                      }, { text: '@AutobusesORO', fontSize: 7.5 }]
                    ]
                  }, layout: 'noBorders'
                }
              ]
            ],
            [{
              stack: [
                { text: 'Le recomendamos llegar, al menos 30 minutos antes del horario marcado en el boleto' },
              ], colSpan: 3, alignment: 'center', fontSize: 9, bold: true, margin: [0, 0, 0, 5]
            }, {}, {}
            ]

          ]
        }, layout: 'noBorders'
      }
      this.finales.push(boleto);
    });
    let docDefinition: any = {
      pageSize: {
        width: 260,
        height: 830,
      },
      pageMargins: [10, 30, 10, 10],
      content: this.finales,
      styles: this.misestilos,
    };
    this.pdfObject = await pdfMake.createPdf(docDefinition);
    this.local.isloader = false;
    this.local.timer = false;
    this.local.FormViaje = {
      origencodigo: '',
      destinocodigo: '',
      origen: '',
      destino: '',
      fechasalida: '',
      fecharegreso: '',
      Npasajeros: 1
    };
    this.local.tipoviaje = '';
    this.local.miviajeida = {
      Viaje: '',
      Origen: '',
      OrigenNombre: '',
      Destino: '',
      DestinoNombre: '',
      Empresa: '',
      EmpresaNombre: '',
      PuntoVenta: '',
      Ruta: '',
      Servicio: '',
      Nombre: '',
      FechaViaje: '',
      HoraViaje: '',
      HoraSistema: '',
      Horallegada: '',
      HoraViajePtoInt: '',
      Partida: '',
      Precio: '',
      EmpresaLogoURL: '',
      TiempoLimiteVisualizacion: '',
      TiempoLimiteConfirmacion: '',
      TiempoLimiteVisualizacionWeb: '',
      VehiculoAsignado: '',
      NumAsientosDisponibles: null
    };
    this.local.miviajevuelta = {
      Viaje: '',
      Origen: '',
      OrigenNombre: '',
      Destino: '',
      DestinoNombre: '',
      Empresa: '',
      EmpresaNombre: '',
      PuntoVenta: '',
      Ruta: '',
      Servicio: '',
      Nombre: '',
      FechaViaje: '',
      HoraViaje: '',
      HoraSistema: '',
      Horallegada: '',
      HoraViajePtoInt: '',
      Partida: '',
      Precio: '',
      EmpresaLogoURL: '',
      TiempoLimiteVisualizacion: '',
      TiempoLimiteConfirmacion: '',
      TiempoLimiteVisualizacionWeb: '',
      VehiculoAsignado: '',
      NumAsientosDisponibles: null
    };
    this.local.pasajeros = [];
    this.local.pasajerosregreso = [];
    localStorage.removeItem('proceso');
    localStorage.removeItem('ultiproceso');
  }
  async descargarBoletos() {
    this.local.IdTransaccion = '';
    this.local.email_cliente = '';
    this.local.total = 0;
    await this.pdfObject.download('Boletos ORO-' + this.pasajeros[0].Folio);
    this.router.navigateByUrl('/');
    setTimeout(() => {
      location.reload();
    }, 5000);
  }

}
