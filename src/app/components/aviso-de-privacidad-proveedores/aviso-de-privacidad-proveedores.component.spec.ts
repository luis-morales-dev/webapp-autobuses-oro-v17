import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoDePrivacidadProveedoresComponent } from './aviso-de-privacidad-proveedores.component';

describe('AvisoDePrivacidadProveedoresComponent', () => {
  let component: AvisoDePrivacidadProveedoresComponent;
  let fixture: ComponentFixture<AvisoDePrivacidadProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvisoDePrivacidadProveedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisoDePrivacidadProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
