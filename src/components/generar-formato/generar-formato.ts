import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Validador personalizado para RUC de Perú (11 dígitos que inicien con 10, 15, 20 o 90)
export function rucValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const validPattern = /^(10|15|20|90)\d{9}$/;
  return validPattern.test(value) ? null : { invalidRuc: true };
}

@Component({
  selector: 'app-generar-formato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generar-formato.html',
  styleUrl: './generar-formato.css'
})
export class GenerarFormatoComponent implements OnInit {
  @Input({ required: true }) tipo: 'fisico' | 'virtual' = 'fisico';
  @Output() cerrar = new EventEmitter<void>();
  @Output() descargar = new EventEmitter<{ tipo: string; ruc: string; proveedor: string; domicilio: string }>();

  formHoja!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formHoja = this.fb.group({
      numeroRuc: ['', [Validators.required, Validators.maxLength(11), rucValidator]],
      proveedor: ['', [Validators.required, Validators.maxLength(500)]],
      domicilio: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  // Sanitización de entradas
  onRucInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.formHoja.get('numeroRuc')?.setValue(input.value);
  }

  onTextInput(controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.formHoja.get(controlName)?.setValue(input.value);
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onGenerar(): void {
    if (this.formHoja.valid) {
      this.descargar.emit({
        tipo: this.tipo,
        ...this.formHoja.value
      });
    }
  }
}