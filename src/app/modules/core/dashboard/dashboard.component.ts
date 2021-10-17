import { AfterViewInit, HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ArcElement, CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PieController, PointElement, SubTitle, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChatService } from 'src/app/services/chat.service';
import { FooterService } from 'src/app/services/footer.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { FooterCommandInfo } from 'src/assets/model/FooterCommandInfo';
import { KeyBindings } from 'src/assets/util/KeyBindings';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  isReady: boolean = false;

  messages: any[];

  readonly commands: FooterCommandInfo[] = [
    { key: 'F1', value: 'Súgó', disabled: false },
    { key: 'F2', value: '', disabled: false },
    { key: 'F3', value: '', disabled: false },
    { key: 'F4', value: 'Számolás', disabled: false },
    { key: 'F5', value: '', disabled: false },
    { key: 'F6', value: '', disabled: false },
    { key: 'F7', value: '', disabled: false },
    { key: 'F8', value: '', disabled: false },
    { key: 'F9', value: '', disabled: false },
    { key: 'F10', value: '', disabled: false },
  ];

  constructor(
    private kbS: KeyboardNavigationService,
    private fS: FooterService,
    protected chatShowcaseService: ChatService,
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
    this.fS.pushCommands(this.commands);
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



  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.F1: {
        event.preventDefault();
        break;
      }
      case KeyBindings.F4: {
        event.preventDefault();
        break;
      }
      default: { }
    }
  }

}
