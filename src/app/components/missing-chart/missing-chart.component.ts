import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js/auto'




@Component({
  selector: 'app-missing-chart',
  templateUrl: './missing-chart.component.html',
  styleUrls: ['./missing-chart.component.scss']
})
export class MissingChartComponent implements OnInit {

  public chart: any;


  @Input() dataArrayInput: any;
  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'doughnut',
      data: this.dataArrayInput,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Doughnut Chart'
          }
        }
      },

    });
  }
}
