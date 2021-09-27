import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ColDef } from 'src/assets/model/ColDef';
import { Company } from 'src/assets/model/Company';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';

@Component({
  selector: 'app-invoice-nav',
  templateUrl: './invoice-nav.component.html',
  styleUrls: ['./invoice-nav.component.scss']
})
export class InvoiceNavComponent implements OnInit, AfterViewInit {
  senderData: Company;
  buyerData: Company;

  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;

  allColumns = ['Code', 'Name', 'Measure', 'Amount', 'Price', 'Value'];
  colDefs: ColDef[] = [
    { label: 'Kód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string' },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string' },
    { label: 'Mértékegység', objectKey: 'Measure', colKey: 'Measure', defaultValue: '', type: 'string' },
    { label: 'Mennyiség', objectKey: 'Amount', colKey: 'Amount', defaultValue: '', type: 'string' },
    { label: 'Ár', objectKey: 'Price', colKey: 'Price', defaultValue: '', type: 'string' },
    { label: 'Érték', objectKey: 'Value', colKey: 'Value', defaultValue: '', type: 'string' },
  ]

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private elem: ElementRef,
    private seInv: InvoiceService,
    private cdref: ChangeDetectorRef
  ) {
    this.productsData = [];
    this.senderData = {} as Company;
    this.buyerData = {} as Company;
    this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
  }

  refresh(): void {
    this.seInv.getMockData("").subscribe(d => {
      console.log(d.Products);
      this.buyerData = d.Buyer;
      this.senderData = d.Sender;
      this.productsData = d.Products.map(x => { return { data: x }; });
      this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
      this.productsDataSource.setData(this.productsData);
    });
  }

  ngAfterViewInit(): void {
    var tmp = this.elem.nativeElement.querySelectorAll('.nb-tree-grid-header-change-sort-button');
    for (let item of tmp) {
      // console.log(item);
      item.tabIndex = -1;
    }
  }

  ngOnInit(): void {
    this.refresh();
    // this.cdref.detectChanges();
  }

}
