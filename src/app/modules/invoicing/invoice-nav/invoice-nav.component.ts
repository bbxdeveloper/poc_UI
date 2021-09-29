import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { ColDef } from 'src/assets/model/ColDef';
import { Company } from 'src/assets/model/Company';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';
import { KeyBindings } from 'src/assets/util/KeyBindings';

@Component({
  selector: 'app-invoice-nav',
  templateUrl: './invoice-nav.component.html',
  styleUrls: ['./invoice-nav.component.scss']
})
export class InvoiceNavComponent implements OnInit, AfterViewInit, OnDestroy {
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

  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  exporterForm: FormGroup;
  metaForm: FormGroup;
  buyerForm: FormGroup;

  readonly navigationMatrix: string[][] = [
    ["l00", "m00", "r00"],
    ["l01", "m01", "r01"],
    ["l02", "m02", "r02"],
    ["l03", "m03", "r03"],
    ["l04", "m04", "r04"],
    ["l05", "m05", "r05"],
  ];

  get isEditModeOff() {
    return this.kbS.currentKeyboardMode != KeyboardModes.EDIT;
  }

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private elem: ElementRef,
    private seInv: InvoiceService,
    private cdref: ChangeDetectorRef,
    private kbS: KeyboardNavigationService
  ) {
    this.productsData = [];
    this.senderData = {} as Company;
    this.buyerData = {} as Company;

    this.productsDataSource = this.dataSourceBuilder.create(this.productsData);

    this.exporterForm = new FormGroup({
      name: new FormControl('', []),
      zipCodeCity: new FormControl('', []),
      street: new FormControl('', []),
      invoiceNum: new FormControl('', []),
      taxNum: new FormControl('', []),
      note: new FormControl('', []),
    });
    this.metaForm = new FormGroup({
      paymentMethod: new FormControl('', []),
      finishTimeStamp: new FormControl('', []),
      invoiceCreation: new FormControl('', []),
      paymentDeadline: new FormControl('', []),
      invoiceOrdinal: new FormControl('', []),
      misc: new FormControl('', []),
    });
    this.buyerForm = new FormGroup({
      name: new FormControl('', []),
      zipCodeCity: new FormControl('', []),
      street: new FormControl('', []),
      invoiceNum: new FormControl('', []),
      taxNum: new FormControl('', []),
      note: new FormControl('', []),
    });

    this.kbS.attachNewMap(this.navigationMatrix);
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

  changeSort(sortRequest: NbSortRequest): void {
    this.productsDataSource.sort(sortRequest);
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getDirection(column: string): NbSortDirection {
    if (column === this.sortColumn) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
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

  ngOnDestroy(): void {
    console.log("Detach");
    this.kbS.detachLastMap();
  }

}
