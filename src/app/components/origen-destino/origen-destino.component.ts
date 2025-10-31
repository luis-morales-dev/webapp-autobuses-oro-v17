import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { LocalService } from '../../services/local.service';
import { PostService } from '../../services/origen-destino.service';
import { Origen, Destino } from '../../interfaces/origen-destino';
import { map, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';


@Component({
  selector: 'app-origen-destino',
  templateUrl: './origen-destino.component.html',
  styleUrls: ['./origen-destino.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  ],
})
export class OrigenDestinoComponent implements OnInit {
  @Input() viajes: boolean = false;
  @Output() buscarviaje = new EventEmitter<FormGroup>();
  date: Date = new Date();
  minimo: Date = new Date();
  fecha_final: Date = new Date('2025-12-01');
  elemento2: any;
  activeLink: string = 'Viaje Sencillo';
  activeindex: number = 0;
  origenes: Origen[] = [];
  destinos: Destino[] = [];
  FormViaje: FormGroup = new FormGroup({
    origen: new FormControl(' '),
    origencodigo: new FormControl(''),
    destinocodigo: new FormControl(''),
    destino: new FormControl(''),
    fechasalida: new FormControl(''),
    fecharegreso: new FormControl(''),
    Npasajeros: new FormControl(1)
  });
  origenesOptions: Observable<Origen[]> = new Observable();
  destinosOptions: Observable<Destino[]> = new Observable();

  constructor(private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private fb: FormBuilder,
    private local: LocalService,
    private post: PostService) {
    this._adapter.setLocale(this._locale);
    this.cargarformulario();
  }
  cargarformulario() {
    this.FormViaje = this.fb.group({
      origen: [' ', Validators.required],
      origencodigo: ['', Validators.required],
      destino: [' ', Validators.required],
      destinocodigo: ['', Validators.required],
      fechasalida: ['', Validators.required],
      fecharegreso: ['', Validators.nullValidator],
      Npasajeros: [1, Validators.required]
    });
  }

  async ngOnInit() {
    // this.fecha_final.setDate(this.date.getDate() + 90);
    this.origenesOptions = this.FormViaje.controls['origen'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.destinosOptions = this.FormViaje.controls['destino'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value || '')),
    );
    this._adapter.setLocale(this._locale);
    // this.elemento2 = document.getElementById('btn-refres');
    if (this.viajes == false) {
      await this.local.show();
    } else {
      this.activeindex = this.local.tipoviaje == 'Viaje Redondo' ? 1 : 0;
      this.activeLink = this.local.tipoviaje;
    }
    this.cargarorigenes();
  }
  tabviaje(event: any) {
    let link = event['tab']['textLabel'];
    this.activeLink = link;
    if (link == 'Viaje Redondo') {
      this.FormViaje.controls['fecharegreso'].setValidators([Validators.required]);
      this.FormViaje.controls['fecharegreso'].updateValueAndValidity();
    } else {
      this.FormViaje.controls['fecharegreso'].setValidators([Validators.nullValidator]);
      this.FormViaje.controls['fecharegreso'].updateValueAndValidity();
    }
  }
  private _filter(value: string): Origen[] {
    const filterValue = value.toLowerCase();
    return this.origenes.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }
  private _filter2(value: string): Destino[] {
    const filterValue = value.toLowerCase();
    return this.destinos.filter(option => option.Nombre.toLowerCase().includes(filterValue));
  }
  async cargarorigenes() {
    await this.post.getOrigen().subscribe(resp => {
      this.origenes = resp.SDTOrigen;
      this.cargardestinos();
    });
  }
  async cargardestinos() {
    await this.post.getDestino().subscribe(resp => {
      this.destinos = resp.SDTDestino;
      setTimeout(async () => {
        //  this.elemento2.click();
        if (this.viajes == false) {
          this.FormViaje.controls['origen'].setValue(' ');
          this.FormViaje.controls['origen'].setValue('');
          this.FormViaje.controls['destino'].setValue(' ');
          this.FormViaje.controls['destino'].setValue('');
          await this.local.hide();
        }
        if (this.viajes) {
          this.FormViaje.controls['origen'].setValue(' ');
          this.FormViaje.controls['origen'].setValue('');
          this.FormViaje.controls['destino'].setValue(' ');
          this.FormViaje.controls['destino'].setValue('');
          this.FormViaje.setValue(this.local.FormViaje);
        }
      }, 600);
    });
  }
  selecfechaSalida() {
    this.FormViaje.controls['fecharegreso'].setValue('');
    this.minimo = new Date(this.FormViaje.controls.fechasalida.value);
  }
  buscarCorida() {
    this.local.tipoviaje = this.activeLink;
    this.buscarviaje.emit(this.FormViaje);
  }
  origenselec() {
    for (let ori of this.origenes) {
      if (this.FormViaje.controls['origen'].value == ori.Nombre) {
        this.FormViaje.controls['origencodigo'].setValue(ori.Origen);
      }
    }
  }
  destinoselec() {
    for (let ori of this.destinos) {
      if (this.FormViaje.controls['destino'].value == ori.Nombre) {
        this.FormViaje.controls['destinocodigo'].setValue(ori.Destino);
      }
    }
  }
}
