import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaProveedorComponent } from './guia-proveedor';

describe('GuiaProveedor', () => {
  let component: GuiaProveedorComponent;
  let fixture: ComponentFixture<GuiaProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaProveedorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GuiaProveedorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
