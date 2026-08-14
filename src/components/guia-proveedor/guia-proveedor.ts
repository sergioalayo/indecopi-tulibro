import { Component, ElementRef, HostListener, AfterViewInit, inject } from '@angular/core';

@Component({
  selector: 'app-guia-proveedor',
  standalone: true,
  imports: [],
  templateUrl: './guia-proveedor.html',
  styleUrl: './guia-proveedor.css'
})
export class GuiaProveedorComponent implements AfterViewInit {
  private el = inject(ElementRef);
  progressWidth: number = 0;

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