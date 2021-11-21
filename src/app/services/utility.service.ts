import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/assets/util/Constants';
import { environment } from 'src/environments/environment';
import { InvoiceService } from './invoice.service';
import { StatusService } from './status.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private invS: InvoiceService, private sts: StatusService) {}

  public execute(
    commandType: Constants.CommandType,
    fileType: Constants.FileExtensions = Constants.FileExtensions.UNKNOWN,
    params: Constants.Dct = {}, obs?: Observable<any>): void {
    switch(commandType) {
      case Constants.CommandType.PRINT_POC:
        this.print(fileType, this.invS.getReport(params));
        break;
      case Constants.CommandType.PRINT_POC_GRADES:
        this.print(fileType, this.invS.getGradesReport(params));
        break;
    }
  }

  private print(fileType: Constants.FileExtensions, res: Observable<any>): void {
    this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintProcessPhases.GENERATING]);
    switch(fileType) {
      case Constants.FileExtensions.PDF:
        if (environment.electron) {
          this.sendPdfToElectron(res);
        } else {
          this.printPdfFromResponse(res);
        }
        break;
    }
  }

  private sendPdfToElectron(resData: Observable<any>): void {
    resData.subscribe(res => {
      this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintProcessPhases.PROC_RESP]);
      var blob = new Blob([res], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);

      // Read blob data as binary string
      const reader = new FileReader();
      const stS = this.sts;
      reader.onload = function() {
        try {
          const event = new CustomEvent('print-pdf', { detail: { bloburl: blobURL, buffer: this.result } });
          document.dispatchEvent(event);
          stS.pushProcessStatus(Constants.BlankProcessStatus);
        } catch (error) {
          stS.pushProcessStatus(Constants.BlankProcessStatus);
          console.error("write file error", error);
        }
      };
      reader.readAsBinaryString(blob);
      stS.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintProcessPhases.SEND_TO_PRINTER]);
    });
  }

  private printPdfFromResponse(resData: Observable<any>): void {
    resData.subscribe(res => {
      this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintProcessPhases.PROC_RESP]);
      var blob = new Blob([res], {type: 'application/pdf'});
      var blobURL = URL.createObjectURL(blob);
  
      // Load content in an iframe to print later
      let iframe =  document.createElement('iframe');
      document.body.appendChild(iframe);
  
      iframe.style.display = 'none';
      iframe.src = blobURL;

      const stS = this.sts;
      iframe.onload = () => {
        // this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintProcessPhases.SEND_TO_PRINTER]);
        // Print
        setTimeout(function() {
          iframe.focus();
          iframe.contentWindow!.print();
          stS.pushProcessStatus(Constants.BlankProcessStatus);
        }, 1);
        // Waiting 10 minute to make sure printing is done, then removing the iframe
        setTimeout(function() {
          document.body.removeChild(iframe);
        }, 600000);
      };
    });
  }
}
