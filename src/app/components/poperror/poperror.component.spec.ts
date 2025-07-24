import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoperrorComponent } from './poperror.component';

describe('PoperrorComponent', () => {
  let component: PoperrorComponent;
  let fixture: ComponentFixture<PoperrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoperrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoperrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
