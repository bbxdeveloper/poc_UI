import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/assets/util/Constants';
import { environment } from 'src/environments/environment';
import { InvoiceService } from './invoice.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private invS: InvoiceService) {}

  public execute(
    commandType: Constants.CommandType,
    fileType: Constants.FileExtensions = Constants.FileExtensions.UNKNOWN,
    params: Constants.Dct = {}, obs?: Observable<any>): void {
    switch(commandType) {
      case Constants.CommandType.PRINT_POC:
        this.print(fileType, this.invS.getReport(params));
        break;
    }
  }

  private print(fileType: Constants.FileExtensions, res: Observable<any>): void {
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
      var blob = new Blob([res], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);

      // Read blob data as binary string
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const event = new CustomEvent('print-pdf', { detail: { bloburl: blobURL, buffer: this.result } });
          document.dispatchEvent(event);
        } catch (error) {
          console.error("write file error", error);
        }
      };
      reader.readAsBinaryString(blob);
    });
  }

  private printPdfFromResponse(resData: Observable<any>): void {
    resData.subscribe(res => {
      var blob = new Blob([res], {type: 'application/pdf'});
      var blobURL = URL.createObjectURL(blob);
  
      // Load content in an iframe to print later
      let iframe =  document.createElement('iframe');
      document.body.appendChild(iframe);
  
      iframe.style.display = 'none';
      iframe.src = blobURL;

      iframe.onload = function() {
        // Print
        setTimeout(function() {
          iframe.focus();
          iframe.contentWindow!.print();
        }, 1);
        // Waiting 10 minute to make sure printing is done, then removing the iframe
        setTimeout(function() {
          document.body.removeChild(iframe);
        }, 600000);
      };
    });
  }
}
