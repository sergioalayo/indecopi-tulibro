import { Component } from '@angular/core';
import { GuiaProveedorComponent } from '../components/guia-proveedor/guia-proveedor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GuiaProveedorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'TuLibro';
}