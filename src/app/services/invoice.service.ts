import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Company } from 'src/assets/model/Company';
import { Invoice } from 'src/assets/model/Invoice';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly BaseUrl = environment.apiUrl + 'transaction' + environment.apiVersion;

  constructor(private http: HttpClient) { }

  getMockData(storageId: string): Observable<Invoice> {
    return of({
      Sender: {
        Name: 'Bemutató változat',
        SecondaryName: '',
        ZipCodeCity: '1111 Valahol',
        Address: 'Vala utca. 11',
        InvoiceAddress: '11111111-22222222-33333333',
        TaxNumber: '12332123-1-23',
        Note: '...'
      } as Company,
      Buyer: {
        Name: 'Partner',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
      Products: [
        {Code: 'AAA-A', Measure: 'db', Amount: 1243.0, Price: 123.20, Value: 401221.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-A', Measure: 'kg', Amount: 122.0, Price: 123.220, Value: 42421.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-X', Measure: 'db', Amount: 126.0, Price: 1235.0, Value: 421241.1, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-X', Measure: 'db', Amount: 124.0, Price: 12433.0, Value: 42421.1, Name: 'Valami4'} as InvoiceProduct,
        {Code: 'REW-B', Measure: 'db', Amount: 123.0, Price: 1213.0, Value: 42421.1, Name: 'Valami5'} as InvoiceProduct,
        {Code: 'AAA-eA', Measure: 'db', Amount: 1243.0, Price: 123.20, Value: 401221.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-Af', Measure: 'kg', Amount: 122.0, Price: 123.220, Value: 42421.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-Xwfe', Measure: 'db', Amount: 126.0, Price: 1235.0, Value: 421241.1, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-fX', Measure: 'db', Amount: 124.0, Price: 12433.0, Value: 42421.1, Name: 'Valami4'} as InvoiceProduct,
        {Code: 'REW-Bfew', Measure: 'db', Amount: 123.0, Price: 1213.0, Value: 42421.1, Name: 'Valami5'} as InvoiceProduct,
        {Code: 'AAA-wegA', Measure: 'db', Amount: 1243.0, Price: 123.20, Value: 401221.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-Agwe', Measure: 'kg', Amount: 122.0, Price: 123.220, Value: 42421.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-erwX', Measure: 'db', Amount: 126.0, Price: 1235.0, Value: 421241.1, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-Xtew', Measure: 'db', Amount: 124.0, Price: 12433.0, Value: 42421.1, Name: 'Valami4'} as InvoiceProduct,
        {Code: 'REW-Bwet', Measure: 'db', Amount: 123.0, Price: 1213.0, Value: 42421.1, Name: 'Valami5'} as InvoiceProduct,
        {Code: 'AAA-Awerw', Measure: 'db', Amount: 1243.0, Price: 123.20, Value: 401221.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-Aerw', Measure: 'kg', Amount: 122.0, Price: 123.220, Value: 42421.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-Xerw', Measure: 'db', Amount: 126.0, Price: 1235.0, Value: 421241.1, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-fewrX', Measure: 'db', Amount: 124.0, Price: 12433.0, Value: 42421.1, Name: 'Valami4'} as InvoiceProduct,
        {Code: 'REW-fweB', Measure: 'db', Amount: 123.0, Price: 1213.0, Value: 42421.1, Name: 'Valami5'} as InvoiceProduct,
        {Code: 'AAA-werwA', Measure: 'db', Amount: 1243.0, Price: 123.20, Value: 401221.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-rwerA', Measure: 'kg', Amount: 122.0, Price: 123.220, Value: 42421.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-werewX', Measure: 'db', Amount: 126.0, Price: 1235.0, Value: 421241.1, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-rwerwerX', Measure: 'db', Amount: 124.0, Price: 12433.0, Value: 42421.1, Name: 'Valami4'} as InvoiceProduct,
        {Code: 'REW-Brewre', Measure: 'db', Amount: 123.0, Price: 1213.0, Value: 42421.1, Name: 'Valami5'} as InvoiceProduct,
        {Code: 'AAA-er33A', Measure: 'db', Amount: 1243.0, Price: 123.20, Value: 401221.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-32rrA', Measure: 'kg', Amount: 122.0, Price: 123.220, Value: 42421.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-3r2rX', Measure: 'db', Amount: 126.0, Price: 1235.0, Value: 421241.1, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-3r3X', Measure: 'db', Amount: 124.0, Price: 12433.0, Value: 42421.1, Name: 'Valami4'} as InvoiceProduct,
        {Code: 'REW-r3B', Measure: 'db', Amount: 123.0, Price: 1213.0, Value: 42421.1, Name: 'Valami5'} as InvoiceProduct,
      ]
    } as Invoice);
  }
 }
