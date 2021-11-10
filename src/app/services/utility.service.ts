import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/assets/util/Constants';
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
        this.printPdfFromResponse(res);
        break;
    }
  }

  private printPdfFromResponse(resData: Observable<any>): void {
    resData.subscribe(res => {
      var blob = new Blob([res], {type: 'application/pdf'}); // This make the magic
      var blobURL = URL.createObjectURL(blob);
  
      let iframe =  document.createElement('iframe'); // Load content in an iframe to print later
      document.body.appendChild(iframe);
  
      iframe.style.display = 'none';
      iframe.src = blobURL;

      iframe.onload = function() {
        // Print
        setTimeout(function() {
          iframe.focus();
          iframe.contentWindow!.print();
        }, 1);
        // Waiting 1 minute to make sure printing is done, then removing the iframe
        setTimeout(function() {
          document.body.removeChild(iframe);
        }, 600000);
      };
    });
  }
}
