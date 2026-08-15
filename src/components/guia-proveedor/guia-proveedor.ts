import { Component, ElementRef, HostListener, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerarFormatoComponent } from '../generar-formato/generar-formato';

@Component({
  selector: 'app-guia-proveedor',
  standalone: true,
  imports: [CommonModule, GenerarFormatoComponent],
  templateUrl: './guia-proveedor.html',
  styleUrl: './guia-proveedor.css'
})
export class GuiaProveedorComponent implements AfterViewInit {
  private el = inject(ElementRef);
  progressWidth: number = 0;
  // Estado del generador de formatos
  formatoSeleccionado: 'fisico' | 'virtual' | null = null;

  seleccionarFormato(tipo: 'fisico' | 'virtual'): void {
    this.formatoSeleccionado = tipo;
    setTimeout(() => {
      document.getElementById('divGenForRef')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  cerrarFormato(): void {
    this.formatoSeleccionado = null;
  }

  // Handler que recibirá los datos listos para el servicio del equipo de backend/generación
  ejecutarDescarga(datos: { tipo: string; ruc: string; proveedor: string; domicilio: string }): void {
    console.log('Datos listos para enviar al servicio generador de PDF/ZIP de Indecopi:', datos);
    alert(`Formulario validado para Libro ${datos.tipo.toUpperCase()}.\nListo para invocar el empaquetador .ZIP para RUC: ${datos.ruc}`);
  }

  // Escucha el evento de desplazamiento para calcular la barra de progreso
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  }

  // Configura el IntersectionObserver para las animaciones al hacer scroll
  ngAfterViewInit(): void {
    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const animatedElements = this.el.nativeElement.querySelectorAll('.animate');
    animatedElements.forEach((element: HTMLElement) => animObserver.observe(element));
  }
}