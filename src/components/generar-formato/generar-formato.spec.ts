import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarFormato } from './generar-formato';

describe('GenerarFormato', () => {
  let component: GenerarFormato;
  let fixture: ComponentFixture<GenerarFormato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarFormato],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerarFormato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
