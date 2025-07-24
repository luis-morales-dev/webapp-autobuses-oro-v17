import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecorreCuernavacaComponent } from './recorre-cuernavaca.component';

describe('RecorreCuernavacaComponent', () => {
  let component: RecorreCuernavacaComponent;
  let fixture: ComponentFixture<RecorreCuernavacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecorreCuernavacaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecorreCuernavacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
