import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BBX';

  constructor(private es: ElectronService) {}

  ngOnInit() {
    this.es.isElectronApp ?
      this.title += " (desktop)" : this.title += " (web)";
  }
}
