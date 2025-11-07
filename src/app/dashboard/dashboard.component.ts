import { Component, OnInit } from '@angular/core';
import { ConfirmacionService } from '../confirmacion-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  confirmaciones: any[] = [];
  cargando = true;
  today = new Date();

  asistentes = 0;
  noAsistentes = 0;


  constructor(private confirmacionService: ConfirmacionService) { }

  ngOnInit(): void {
    this.confirmacionService.obtenerConfirmaciones().subscribe({
      next: (data) => {
        // Filtramos registros válidos y ordenamos por fecha
        this.confirmaciones = data
          .filter((c) => c.tipoInvitacion !== 'indefinido')
          .sort((a, b) => b.timestamp - a.timestamp);

        // ✅ Calculamos los contadores
        this.asistentes = this.confirmaciones.filter(
          (c) => c.asistira === 'sí' || c.asistira === true
        ).length;

        this.noAsistentes = this.confirmaciones.filter(
          (c) => c.asistira === 'no' || c.asistira === false
        ).length;

        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error obteniendo confirmaciones:', err);
        this.cargando = false;
      }
    });
  }

}
