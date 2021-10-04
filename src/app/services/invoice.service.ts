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
        {Code: 'AAA-A', Measure: 'db', Amount: 2341.0, Price: 232.20, Value: 6234.1, Name: 'Valami'} as InvoiceProduct,
        {Code: 'BFS-A', Measure: 'kg', Amount: 623.0, Price: 32.220, Value: 623.1, Name: 'Valami2'} as InvoiceProduct,
        {Code: 'WER-X', Measure: 'db', Amount: 42.0, Price: 132235.0, Value: 2343.41, Name: 'Valami3'} as InvoiceProduct,
        {Code: 'RXE-X', Measure: 'db', Amount: 623.0, Price: 1224433.0, Value: 6234.21, Name: 'Valami4'} as InvoiceProduct,
        // {Code: 'REW-B', Measure: 'db', Amount: 623.0, Price: 32.0, Value: 4234.1, Name: 'Valami5'} as InvoiceProduct,
        // {Code: 'AAA-eA', Measure: 'db', Amount: 432.0, Price: 2.20, Value: 623.1, Name: 'Valami'} as InvoiceProduct,
        // {Code: 'BFS-Af', Measure: 'kg', Amount: 754.0, Price: 123.220, Value: 5234.1, Name: 'Valami2'} as InvoiceProduct,
        // {Code: 'WER-Xwfe', Measure: 'db', Amount: 345.0, Price: 53.0, Value: 63242.31, Name: 'Valami3'} as InvoiceProduct,
        // {Code: 'RXE-fX', Measure: 'db', Amount: 345.0, Price: 64.0, Value: 234.1, Name: 'Valami4'} as InvoiceProduct,
        // {Code: 'REW-Bfew', Measure: 'db', Amount: 745.0, Price: 345.30, Value: 2324.1, Name: 'Valami5'} as InvoiceProduct,
        // {Code: 'AAA-wegA', Measure: 'db', Amount: 234.0, Price: 63.20, Value: 5234.1, Name: 'Valami'} as InvoiceProduct,
        // {Code: 'BFS-Agwe', Measure: 'kg', Amount: 634.0, Price: 456.220, Value: 234.1, Name: 'Valami2'} as InvoiceProduct,
        // {Code: 'WER-erwX', Measure: 'db', Amount: 235.0, Price: 754.0, Value: 5234.1, Name: 'Valami3'} as InvoiceProduct,
        // {Code: 'RXE-Xtew', Measure: 'db', Amount: 346.0, Price: 865.0, Value: 5234.1, Name: 'Valami4'} as InvoiceProduct,
        // {Code: 'REW-Bwet', Measure: 'db', Amount: 123463.0, Price: 567.05, Value: 23.1, Name: 'Valami5'} as InvoiceProduct,
        // {Code: 'AAA-Awerw', Measure: 'db', Amount: 234.0, Price: 567.20, Value: 5234.1, Name: 'Valami'} as InvoiceProduct,
        // {Code: 'BFS-Aerw', Measure: 'kg', Amount: 243.5, Price: 856.220, Value: 52342.21, Name: 'Valami2'} as InvoiceProduct,
        // {Code: 'WER-Xerw', Measure: 'db', Amount: 634.0, Price: 956.0, Value: 24.1, Name: 'Valami3'} as InvoiceProduct,
        // {Code: 'RXE-fewrX', Measure: 'db', Amount: 63.0, Price: 234.0, Value: 5235.1, Name: 'Valami4'} as InvoiceProduct,
        // {Code: 'REW-fweB', Measure: 'db', Amount: 2434.0, Price: 634.0, Value: 4234.41, Name: 'Valami5'} as InvoiceProduct,
        // {Code: 'AAA-werwA', Measure: 'db', Amount: 2234.0, Price: 643.20, Value: 5235.1, Name: 'Valami'} as InvoiceProduct,
        // {Code: 'BFS-rwerA', Measure: 'kg', Amount: 23.0, Price: 63.220, Value: 252.1, Name: 'Valami2'} as InvoiceProduct,
        // {Code: 'WER-werewX', Measure: 'db', Amount: 0.0, Price: 121.0, Value: 5345.1, Name: 'Valami3'} as InvoiceProduct,
        // {Code: 'RXE-rwerwerX', Measure: 'db', Amount: 23.0, Price: 6345.0, Value: 5235.11, Name: 'Valami4'} as InvoiceProduct,
        // {Code: 'REW-Brewre', Measure: 'db', Amount: 63.0, Price: 2632.0, Value: 5435.1, Name: 'Valami5'} as InvoiceProduct,
        // {Code: 'AAA-er33A', Measure: 'db', Amount: 53.0, Price: 64363.20, Value: 64364.1, Name: 'Valami'} as InvoiceProduct,
        // {Code: 'BFS-32rrA', Measure: 'kg', Amount: 643.0, Price: 53454.220, Value: 5235.1, Name: 'Valami2'} as InvoiceProduct,
        // {Code: 'WER-3r2rX', Measure: 'db', Amount: 45.0, Price: 50.0, Value: 5235.1, Name: 'Valami3'} as InvoiceProduct,
        // {Code: 'RXE-3r3X', Measure: 'db', Amount: 54.0, Price: 6436.0, Value: 532.51, Name: 'Valami4'} as InvoiceProduct,
        // {Code: 'REW-r3B', Measure: 'db', Amount: 3.0, Price: 23.5, Value: 42342.1, Name: 'Valami5'} as InvoiceProduct,
      ]
    } as Invoice);
  }

  getMockBuyers(): Observable<Company[]> {
    return of([
      {
        Name: 'ABC',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
      {
        Name: 'Teszt',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
      {
        Name: 'Co',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
      {
        Name: 'Partner 1',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
      {
        Name: 'Partner 2',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
      {
        Name: 'Teszt Partner',
        SecondaryName: 'Kiegészítő Megnevezés',
        ZipCodeCity: '2222 Valahol',
        Address: 'Vala utca. 22',
        InvoiceAddress: '444444-22222222-33333333',
        TaxNumber: '12332123-2-34',
        Note: 'Semmi.'
      } as Company,
    ]);
  }
 }
