import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarFormatoComponent } from './generar-formato';

describe('GenerarFormatoComponent', () => {
  let component: GenerarFormatoComponent;
  let fixture: ComponentFixture<GenerarFormatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarFormatoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarFormatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
