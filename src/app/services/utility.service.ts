import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/assets/util/Constants';
import { environment } from 'src/environments/environment';
import { InvoiceService } from './invoice.service';
import { StatusService } from './status.service';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private invS: InvoiceService, private sts: StatusService, private toastrService: NbToastrService) {}

  public execute(
    commandType: Constants.CommandType,
    fileType: Constants.FileExtensions = Constants.FileExtensions.UNKNOWN,
    params: Constants.Dct = {}, obs?: Observable<any>): void {
    switch(commandType) {
      case Constants.CommandType.POC_REPORT:
        switch (params['data_operation'] as Constants.DataOperation) {
          case Constants.DataOperation.PRINT_BLOB:
            this.print(fileType, this.invS.getReport(params));
            break;
          case Constants.DataOperation.DOWNLOAD_BLOB:
            this.download(this.invS.getReport(params));
            break;
        }
        break;
      case Constants.CommandType.PRINT_POC_GRADES:
        switch (params['data_operation'] as Constants.DataOperation) {
          case Constants.DataOperation.PRINT_BLOB:
            this.print(fileType, this.invS.getGradesReport(params));
            break;
          case Constants.DataOperation.DOWNLOAD_BLOB:
            this.download(this.invS.getGradesReport(params));
            break;
        }
        break;
    }
  }

  private print(fileType: Constants.FileExtensions, res: Observable<any>): void {
    this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintReportProcessPhases.GENERATING]);
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
      this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintReportProcessPhases.PROC_RESP]);
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
      stS.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintReportProcessPhases.SEND_TO_PRINTER]);
    }, error => {
      this.sts.pushProcessStatus(Constants.BlankProcessStatus);
      this.toastrService.show(
        error.statusText, `Hiba`,
        { preventDuplicates: true, duration: 1000, status: 'danger', position: NbGlobalPhysicalPosition.BOTTOM_LEFT }
      );
    });
  }

  private printPdfFromResponse(resData: Observable<any>): void {
    resData.subscribe(res => {
      this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintReportProcessPhases.PROC_RESP]);
      var blob = new Blob([res], {type: 'application/pdf'});
      var blobURL = URL.createObjectURL(blob);
  
      // Load content in an iframe to print later
      let iframe =  document.createElement('iframe');
      document.body.appendChild(iframe);
  
      iframe.style.display = 'none';
      iframe.src = blobURL;

      const stS = this.sts;
      iframe.onload = () => {
        this.sts.pushProcessStatus(Constants.PrintReportStatuses[Constants.PrintReportProcessPhases.SEND_TO_PRINTER]);
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
    }, error => {
      this.sts.pushProcessStatus(Constants.BlankProcessStatus);
      this.toastrService.show(
        error.statusText, `Hiba`,
        { preventDuplicates: true, duration: 1000, status: 'danger', position: NbGlobalPhysicalPosition.BOTTOM_LEFT }
      );
    });
  }

  private download(resData: Observable<any>): void {
    this.sts.pushProcessStatus(Constants.DownloadReportStatuses[Constants.DownloadReportProcessPhases.GENERATING]);
    this.downloadBlobFromResponse(resData);
  }

  private downloadBlobFromResponse(resData: Observable<any>): void {
    resData.subscribe(res => {
      this.sts.pushProcessStatus(Constants.DownloadReportStatuses[Constants.DownloadReportProcessPhases.PROC_RESP]);
      var blob = new Blob([res], { type: 'application/pdf' });
      var blobURL = URL.createObjectURL(blob);

      let a = document.createElement('a');
      
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = blobURL;
      a.download = res.filename;
      
      a.click();
      
      URL.revokeObjectURL(blobURL);
      a.remove();
      this.sts.pushProcessStatus(Constants.BlankProcessStatus);
    }, error => {
      this.sts.pushProcessStatus(Constants.BlankProcessStatus);
      this.toastrService.show(
        error.statusText, `Hiba`,
        { preventDuplicates: true, duration: 1000, status: 'danger', position: NbGlobalPhysicalPosition.BOTTOM_LEFT }
      );
    });
  }
}
