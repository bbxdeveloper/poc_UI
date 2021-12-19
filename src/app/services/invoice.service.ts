import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Company } from 'src/assets/model/Company';
import { Invoice } from 'src/assets/model/Invoice';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { InvoiceProductResponse } from 'src/assets/model/InvoiceProductResponse';
import { PaymentData } from 'src/assets/model/PaymentData';
import { PaymentMethod } from 'src/assets/model/PaymentMethod';
import { Constants } from 'src/assets/util/Constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private readonly BaseUrl = environment.apiUrl + environment.apiVersion;

  constructor(private http: HttpClient) { }

  getReport(params: Constants.Dct): Observable<any> {
    let options = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("charset", "utf8")
      .set("accept", "application/pdf");
    return this.http.post(
      `${environment.apiUrl}report${environment.apiVersion}render/${params['section']}/${params['fileType']}`,
      JSON.stringify(params['report_params']),
      { responseType: 'blob', headers: options}
    );
  }

  getGradesReport(params: Constants.Dct): Observable<any> {
    let options = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("charset", "utf8")
      .set("accept", "application/pdf");
    return this.http.post(
      `${environment.apiUrl}report${environment.apiVersion}render/grades/${params['section']}/${params['fileType']}`,
      JSON.stringify(params['report_params']),
      { responseType: 'blob', headers: options }
    );
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return of([
      { Key: 'Készpénz', Value: "Készpénz" } as PaymentMethod,
      { Key: 'Átutalás', Value: "Átutalás" } as PaymentMethod,
    ]);
  }

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
      Payment: {
        InvoiceNumber: "K-0000001/21"
      } as PaymentData,
      Products: [
        { ProductCode: 'AAA-A', Measure: 'db', Amount: 2341.0, Price: 232.20, Value: 6234.1, Name: 'Valami' } as InvoiceProduct,
        { ProductCode: 'BFS-A', Measure: 'kg', Amount: 623.0, Price: 32.220, Value: 623.1, Name: 'Valami2' } as InvoiceProduct,
        { ProductCode: 'WER-X', Measure: 'db', Amount: 42.0, Price: 132235.0, Value: 2343.41, Name: 'Valami3' } as InvoiceProduct,
        { ProductCode: 'RXE-X', Measure: 'db', Amount: 623.0, Price: 1224433.0, Value: 6234.21, Name: 'Valami4' } as InvoiceProduct
      ]
    } as Invoice);
  }

  getActiveProducts(all: boolean = false, topCount?: number): Observable<InvoiceProductResponse> {
    let options = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("charset", "utf8")
      .set("accept", "application/json");

    let _url: string;
    if (all) {
      _url = `${environment.apiUrl}product${environment.apiVersion}list/all`;
    } else {
      if (topCount !== undefined && topCount !== null) {
        _url = `${environment.apiUrl}product${environment.apiVersion}list/some/${topCount}`;
      } else {
        _url = `${environment.apiUrl}product${environment.apiVersion}list/some`;
      }
    }

    return this.http.get<InvoiceProductResponse>(_url,{ headers: options });
  }

  searchActiveProducts(searchQuery: string, all: boolean = false): Observable<InvoiceProductResponse> {
    let options = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("charset", "utf8")
      .set("accept", "application/json");
    return this.http.get<InvoiceProductResponse>(
      `${environment.apiUrl}product${environment.apiVersion}search/${searchQuery}`,
      { headers: options }
    );
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
