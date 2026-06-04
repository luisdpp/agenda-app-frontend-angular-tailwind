import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, Chart, registerables } from 'chart.js';

// 🔥 TRUCO VITAL EN NG2-CHARTS V6: Registramos los componentes nativos de Chart.js
// Si no hacemos este registro global al inicio, los lienzos se quedarán en blanco
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Por si deseas añadir estilos personalizados luego
})
export class DashboardComponent implements OnInit {
  // 1. INJECTIONS
  private dashboardService = inject(DashboardService);
  
  // Flag de control para mostrar un esqueleto de carga mientras responde la base de datos
  loading: boolean = true;

  // 2. CONFIGURACIÓN GRÁFICO 1: Histórico Mensual (Líneas / Line)
  public lineChartData?: ChartConfiguration<'line'>['data'];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
    }
  };

  // 3. CONFIGURACIÓN GRÁFICO 2: Distribución por Categoría (Donas / Doughnut)
  public doughnutChartData?: ChartConfiguration<'doughnut'>['data'];
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'bottom', 
        labels: { color: '#94a3b8', font: { size: 11 } } 
      } 
    }
  };

  // 4. CONFIGURACIÓN GRÁFICO 3: Horarios Pico (Barras / Bar)
  public barChartData?: ChartConfiguration<'bar'>['data'];
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', stepSize: 1 } }
    }
  };

  // 5. LIFECYCLE HOOKS
  ngOnInit() {
    this.cargarMetricasAnaliticas();
  }

  // 6. INTERNAL DATA FETCHING METHODS
  cargarMetricasAnaliticas() {
    this.dashboardService.getMetrics().subscribe({
      next: (response) => {
        console.log('📊 Respuesta cruda de Express:', response);

        // EXTRAEDOR ESTRICTO: Apuntamos directamente a la propiedad que viste en tu Postman
        const metrics = response.data;

        if (metrics) {
          console.log('🎯 Métricas extraídas con éxito:', metrics);

          // 1. Mapeo Histórico Mensual (Líneas)
          this.lineChartData = {
            labels: metrics.historicoMensual.map((m: any) => m.mes),
            datasets: [{
              data: metrics.historicoMensual.map((m: any) => m.total),
              label: 'Citas Registradas',
              borderColor: '#10b981', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.3
            }]
          };

          // 2. Mapeo Participación (Dona)
          this.doughnutChartData = {
            labels: metrics.distribucionCategorias.map((c: any) => c.categoria),
            datasets: [{
              data: metrics.distribucionCategorias.map((c: any) => c.citas),
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444']
            }]
          };

          // 3. Mapeo Horarios Pico (Barras)
          this.barChartData = {
            labels: metrics.horariosPico.map((h: any) => h.horario),
            datasets: [{
              data: metrics.horariosPico.map((h: any) => h.totalCitas),
              backgroundColor: '#3b82f6', 
              borderRadius: 6
            }]
          };
        } else {
          console.error('⚠️ La propiedad .data llegó vacía desde el servidor');
        }

        // Apagamos el esqueleto de carga para obligar a ng2-charts a dibujar los lienzos
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error HTTP al consultar el endpoint analítico:', err);
        this.loading = false;
      }
    });
  }
}