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
        this.sendPdfToElectron(res);
        break;
    }
  }

  private sendPdfToElectron(resData: Observable<any>): void {
    resData.subscribe(res => {
      var blob = new Blob([res], { type: 'application/pdf' }); // This make the magic
      var blobURL = URL.createObjectURL(blob);

      const webV = document.getElementById("pdfViewerWebView") as Electron.WebviewTag;

      const iframe = document.getElementById("pdfViewer") as HTMLIFrameElement;
      // let iframe = document.createElement('iframe'); // Load content in an iframe to print later

      //iframe.loadURL(blobURL);

      //document.body.appendChild(iframe);

      //iframe.style.display = 'none';
      webV.src = blobURL;
      webV.src = "data:text/plain, ";
      webV.src = blobURL;
      //iframe.src = blobURL;

      iframe.focus();
      //iframe.contentWindow!.print();
      // Dispatch the event.
      console.log(webV.getWebContentsId());
      // const event = new CustomEvent('print-pdf', { detail: webV.getWebContentsId() });
      // document.dispatchEvent(event);

      // save as temp.pdf
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const event = new CustomEvent('print-pdf', { detail: { id: webV.getWebContentsId(), bloburl: blobURL, buffer: this.result } });
          document.dispatchEvent(event);
        } catch (error) {
          console.error("write file error", error);
        }
      };
      reader.readAsBinaryString(blob);

      // setTimeout(function () {
      //   const event = new CustomEvent('print-pdf', { detail: { id: webV.getWebContentsId(), bloburl: blobURL, blob: blob } });
      //   document.dispatchEvent(event);
      // }, 12000);
return;
      iframe.onload = function () {
        // Print
        setTimeout(function () {
          iframe.focus();
          //iframe.contentWindow!.print();
          // Dispatch the event.
          console.log(webV.getWebContentsId);
          const event = new CustomEvent('print-pdf', { detail: webV.getWebContentsId });
          document.dispatchEvent(event);
        }, 1);
        // Waiting 1 minute to make sure printing is done, then removing the iframe
        setTimeout(function () {
          //document.body.removeChild(iframe);
          iframe.src = "";
        }, 600000);
      };
    });
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
