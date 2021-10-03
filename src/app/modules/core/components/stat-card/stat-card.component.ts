import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest } from '@nebular/theme';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ColDef } from 'src/assets/model/ColDef';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent implements OnInit, AfterViewInit {
  allColumns = ['Code', 'Name', 'Measure', 'Amount', 'Price', 'Value'];
  colDefs: ColDef[] = [
    { label: 'Kód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string', mask: '' },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string', mask: '' },
    { label: 'Mértékegység', objectKey: 'Measure', colKey: 'Measure', defaultValue: '', type: 'string', mask: '' },
    { label: 'Mennyiség', objectKey: 'Amount', colKey: 'Amount', defaultValue: '', type: 'string', mask: '' },
    { label: 'Ár', objectKey: 'Price', colKey: 'Price', defaultValue: '', type: 'string', mask: '' },
    { label: 'Érték', objectKey: 'Value', colKey: 'Value', defaultValue: '', type: 'string', mask: '' },
  ]
  dataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;
  data: TreeGridNode<InvoiceProduct>[];

  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private elem: ElementRef,
    private seInv: InvoiceService,
    private cdref: ChangeDetectorRef) {
    this.data = [];
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  refresh(): void {
    this.seInv.getMockData("").subscribe(d => {
      console.log(d.Products);
      this.data = d.Products.map(x => {return {data: x, uid: 0, tabIndex: 0};});
      this.dataSource = this.dataSourceBuilder.create(this.data);
      this.dataSource.setData(this.data);
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
    this.cdref.detectChanges();
    console.log(this.dataSource);
  }

  changeSort(sortRequest: NbSortRequest): void {
    this.dataSource.sort(sortRequest);
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getDirection(column: string): NbSortDirection {
    if (column === this.sortColumn) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }
}
