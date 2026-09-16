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


  // Escucha el evento de desplazamiento para calcular la barra de progreso
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  }

    abrirAviso(tipo: string) {
    let url = '';

    if (tipo === 'fisico') {
      url = 'https://consumidor.gob.pe/wp-content/uploads/2020/07/AvisoFisico_Fisico.pdf';
    } else if (tipo === 'fisico-virtual') {
      url = 'https://consumidor.gob.pe/wp-content/uploads/2020/07/AvisoFisico_Virtual.pdf';
    } else if (tipo === 'virtual') {
      url = 'https://consumidor.gob.pe/wp-content/uploads/2020/07/AvisoVirtual.pdf';
    }

    // Esto hace la misma función que el target="_blank"
    window.open(url, '_blank');
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