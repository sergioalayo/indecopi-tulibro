import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ReclamacionesService } from '../../services/api'; // Ajusta la ruta si es necesario

// Validador personalizado para RUC de Perú
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
  templateUrl: './generar-formato.html', // Verifica que tu archivo físico se llame así y no .component.html
  styleUrl: './generar-formato.css'
})
export class GenerarFormatoComponent implements OnInit {
  
  // Recibimos la modalidad (físico o virtual) desde el componente padre
  @Input() tipo: 'fisico' | 'virtual' = 'fisico'; 
  
  // Emitimos un evento cuando el usuario hace clic en "Cancelar" o en la "X"
  @Output() cerrarModal = new EventEmitter<void>();

  formHoja!: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private reclamacionesService: ReclamacionesService
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con sus validaciones
    this.formHoja = this.fb.group({
      numeroRuc: ['', [Validators.required, Validators.maxLength(11), rucValidator]],
      proveedor: ['', [Validators.required, Validators.maxLength(500)]],
      domicilio: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  // --- MÉTODOS DE CONTROL DE INPUTS (HTML) ---

  onRucInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Forzamos a que solo se puedan escribir números
    input.value = input.value.replace(/[^0-9]/g, '');
    this.formHoja.get('numeroRuc')?.setValue(input.value, { emitEvent: false });
  }

  onTextInput(controlName: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    // Convertimos automáticamente a mayúsculas mientras escribe
    input.value = input.value.toUpperCase();
    this.formHoja.get(controlName)?.setValue(input.value, { emitEvent: false });
  }

  // --- MÉTODOS DE ACCIÓN (BOTONES) ---

  onCerrar(): void {
    this.cerrarModal.emit();
  }

  async onGenerar() {
    // Si el formulario es inválido, no avanzamos y marcamos los errores
    if (this.formHoja.invalid) {
      this.formHoja.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const valoresFormulario = this.formHoja.value;

    // Construimos el objeto dinámico con los datos reales del formulario
    const misDatos = {
      razonSocial: valoresFormulario.proveedor,
      ruc: valoresFormulario.numeroRuc,
      domicilio: valoresFormulario.domicilio,
      tipoHoja: this.tipo === 'fisico' ? 'Físico' : 'Virtual'
    };

    try {
      // 1. Llamamos al servicio
      const blob = await this.reclamacionesService.generarArchivoZip(misDatos);
      
      // 2. Lógica de descarga nativa
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Hojas_Reclamacion_${misDatos.ruc}.zip`; 
      document.body.appendChild(link);
      link.click();
      
      // 3. Limpieza
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      // Opcional: Cerrar el modal después de una descarga exitosa
      // this.onCerrar();
      
    } catch (error) {
      console.error("Error al generar el lote:", error);
      alert("No se pudo generar la hoja de reclamación. Verifique los datos o intente nuevamente.");
    } finally {
      this.cargando = false;
    }
  }
}