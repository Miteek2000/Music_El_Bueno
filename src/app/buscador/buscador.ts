import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.html',
    styleUrls: ['./buscador.css']
})
export class Buscador {
  searchTerm: string = '';

  constructor(private router: Router) {}

  goSearch(): void {
    const q = this.searchTerm?.trim();
    if (!q) return;
    this.router.navigate(['/resultados-busqueda'], { queryParams: { q } });
  }
}
