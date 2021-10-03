import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
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
  @Input() title: string = "";
  @Input() col: string = "";
  @Input() data: TreeGridNode<InvoiceProduct>[];
  @Input() predicate: (a: TreeGridNode<InvoiceProduct>, b: TreeGridNode<InvoiceProduct>) => number = (a,b) => 0;

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
    this.dataSource.setData(
      this.data.sort(this.predicate).sort().slice(0, 5)
    );
  }
  
  ngAfterViewInit(): void {
    this.dataSource = this.dataSourceBuilder.create(
      this.data.sort(this.predicate).sort().slice(0, 5)
    );
    // var tmp = this.elem.nativeElement.querySelectorAll('.nb-tree-grid-header-change-sort-button');
    // for (let item of tmp) {
    //   // console.log(item);
    //   item.tabIndex = -1;
    // }
  }
  
  ngOnInit(): void {
    this.refresh();
    this.cdref.detectChanges();
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
