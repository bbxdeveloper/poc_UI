import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ArcElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PieController, PointElement, SubTitle, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChatService } from 'src/app/services/chat.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  isReady: boolean = false;
  // products: TreeGridNode<InvoiceProduct>[] = [];

  messages: any[];

  // productGratestValue: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => b.data.Value - a.data.Value;
  // productGratestPrice: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => b.data.Price - a.data.Price;
  // productGratestAmount: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => b.data.Amount - a.data.Amount;
  // productSmallestValue: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => a.data.Value - b.data.Value;
  // productSmallestPrice: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => a.data.Price - b.data.Price;
  // productSmallestAmount: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a, b) => a.data.Amount - b.data.Amount;

  constructor(protected chatShowcaseService: ChatService,
    private seInv: InvoiceService) {
    Chart.register(
      PieController, LineController,
      LineElement, ArcElement,
      CategoryScale, LinearScale,
      PointElement,
      Legend, Title, SubTitle,
      ChartDataLabels
    );
    this.messages = this.chatShowcaseService.loadMessages();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnInit(): void {
    this.isReady = true;
  }

  sendMessage(event: any) {
    const files = !event.files ? [] : event.files.map((file: { src: any; type: any; }) => {
      return {
        url: file.src,
        type: file.type,
        icon: 'file-text-outline',
      };
    });

    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      user: {
        name: 'Jonh Doe',
        avatar: 'https://i.gifer.com/no.gif',
      },
    });
    const botReply = this.chatShowcaseService.reply(event.message);
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply) }, 500);
    }
  }

  initCharts(): void {
    let pieCharRef = document.getElementById('myPieChart');
    let lineCharRef = document.getElementById('myLineChart');

    if (document !== null && pieCharRef !== null && lineCharRef !== null) {
      let cPie = (<HTMLCanvasElement>pieCharRef).getContext('2d');
      let cLine = (<HTMLCanvasElement>lineCharRef).getContext('2d');

      if (cPie !== null) {
        const dataPie = {
          labels: [
            'Első Kft.',
            'Otthon Co.',
            'Zrínyi Zrt.'
          ],
          datasets: [{
            label: 'Átlagolt Eladások Kategóriánként',
            data: [13, 42, 37],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        };
        let myPieChart = new Chart(cPie, {
          type: 'pie',
          data: dataPie,
          options: {
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: 'rgb(255, 99, 132)',
                  font: {
                    size: 20
                  }
                }
              },
              datalabels: {
                color: '#ffd5dd',
                backgroundColor: '#0000aa',
                borderRadius: 25,
                borderColor: '#ffffff',
                borderWidth: 2,
                formatter: (valueText: string) => valueText + ' %',
                font: {
                  size: 20
                }
              }
            }
          }
        });
      }

      if (cLine !== null) {
        const labels = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
        const dataLine = {
          labels: labels,
          datasets: [{
            label: 'Összesített eladások',
            data: [65, 59, 80, 81, 56, 55, 40, 232, 123, 43, 234, 43],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };
        let myLineChart = new Chart(cLine, {
          type: 'line',
          data: dataLine,
          options: {
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: 'rgb(255, 99, 132)',
                  font: {
                    size : 20
                  }
                }
              },
              datalabels: {
                color: '#ffd5dd',
                backgroundColor: '#0000aa',
                borderRadius: 25,
                borderColor: '#ffffff',
                borderWidth: 2,
                font: {
                  size: 20
                }
              }
            }
          }
        });
      }
    }
  }

}
