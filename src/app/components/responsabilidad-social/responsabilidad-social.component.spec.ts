import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsabilidadSocialComponent } from './responsabilidad-social.component';

describe('ResponsabilidadSocialComponent', () => {
  let component: ResponsabilidadSocialComponent;
  let fixture: ComponentFixture<ResponsabilidadSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsabilidadSocialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsabilidadSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
