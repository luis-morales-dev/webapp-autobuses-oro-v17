import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuerpomodalComponent } from './cuerpomodal.component';

describe('CuerpomodalComponent', () => {
  let component: CuerpomodalComponent;
  let fixture: ComponentFixture<CuerpomodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuerpomodalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuerpomodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
