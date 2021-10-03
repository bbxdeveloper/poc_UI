import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbSortDirection, NbSortRequest, NbTable, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { TouchBarScrubber } from 'electron';
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

  @ViewChild('table') table?: NbTable<any>;

  productCreatorRow: TreeGridNode<InvoiceProduct>;
  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;

  allColumns = ['Code', 'Name', 'Measure', 'Amount', 'Price', 'Value'];
  colDefs: ColDef[] = [
    { label: 'Kód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string', mask: "AAA-ACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC" },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string', mask: "" },
    { label: 'Mértékegység', objectKey: 'Measure', colKey: 'Measure', defaultValue: '', type: 'string', mask: "" },
    { label: 'Mennyiség', objectKey: 'Amount', colKey: 'Amount', defaultValue: '', type: 'string', mask: "" },
    { label: 'Ár', objectKey: 'Price', colKey: 'Price', defaultValue: '', type: 'number', mask: "" },
    { label: 'Érték', objectKey: 'Value', colKey: 'Value', defaultValue: '', type: 'number', mask: "" },
  ]
  customMaskPatterns = {
    A: {
      pattern: new RegExp('[a-zA-Z0-9]'), symbol: 'X'
    },
    C: {
      pattern: new RegExp('[a-zA-Z0-9]'), optional: true, symbol: 'X'
    }
  };

  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  exporterForm: FormGroup;
  metaForm: FormGroup;
  buyerForm: FormGroup;

  productForm: FormGroup;
  editedRow?: TreeGridNode<InvoiceProduct>;
  editedProperty?: string;
  editedRowPos?: number;

  private uid = 0;
  private tabIndex = 10000;
  get NextTabIndex() { return this.tabIndex++; }
  get GenerateCreatorRow(): TreeGridNode<InvoiceProduct> {
    return {
      data: { Code: '', Measure: '', Amount: 0, Price: 0, Value: 0, Name: '' } as InvoiceProduct
    };
  }

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
    private kbS: KeyboardNavigationService,
    private fb: FormBuilder
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

    this.productForm = new FormGroup({});
    this.productCreatorRow = this.GenerateCreatorRow;

    this.refresh();
  }

  refresh(): void {
    this.seInv.getMockData("").subscribe(d => {
      this.kbS.detachLastMap(2);

      // console.log(d.Products);
      
      this.buyerData = d.Buyer;
      this.senderData = d.Sender;
      
      this.productCreatorRow = this.GenerateCreatorRow;
      this.productsData = [this.productCreatorRow].concat(d.Products.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; }));
      
      this.productsDataSource.setData(this.productsData);

      this.exporterForm = new FormGroup({
        name: new FormControl(this.senderData.Name, []),
        zipCodeCity: new FormControl(this.senderData.ZipCodeCity, []),
        street: new FormControl(this.senderData.Address, []),
        invoiceNum: new FormControl(this.senderData.InvoiceAddress, []),
        taxNum: new FormControl(this.senderData.TaxNumber, []),
        note: new FormControl(this.senderData.Note, []),
      });
      this.buyerForm = new FormGroup({
        name: new FormControl(this.buyerData.Name, []),
        zipCodeCity: new FormControl(this.buyerData.ZipCodeCity, []),
        street: new FormControl(this.buyerData.Address, []),
        invoiceNum: new FormControl(this.buyerData.InvoiceAddress, []),
        taxNum: new FormControl(this.buyerData.TaxNumber, []),
        note: new FormControl(this.buyerData.Note, []),
      });

      this.resetEdit();

      this.kbS.attachNewMap(this.navigationMatrix);
      this.generateAndAttachTableMap();

      // console.log(this.productForms);

      this.table?.renderRows();
    });
  }

  private generateAndAttachTableMap(): void {
    let tableNavMap: string[][] = [];
    for(let y = 0; y < this.productsData.length; y++) {
      let row = [];
      for(let x = 0; x < this.colDefs.length; x++) {
        row.push("PRODUCT-" + x + '-' + y);
      }
      tableNavMap.push(row);
    }
    // console.log(tableNavMap);
    this.kbS.attachNewMap(tableNavMap);
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

  private nextUid() {
    ++this.uid
    return this.uid;
  }

  trackRows(index: number, row: any) {
    return row.uid;
  }

  ngAfterViewInit(): void {
    var tmp = this.elem.nativeElement.querySelectorAll('.nb-tree-grid-header-change-sort-button');
    for (let item of tmp) {
      // console.log(item);
      item.tabIndex = -1;
    }
  }

  ngOnInit(): void {
    // this.refresh();
    // this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    console.log("Detach");
    this.kbS.detachLastMap(2);
  }

  edit(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string) {
    this.productForm = new FormGroup({
      edited: new FormControl((row.data as any)[col])
    });
    this.editedProperty = col;
    this.editedRow = row;
    this.editedRowPos = rowPos;
  }

  resetEdit(): void {
    this.productForm = new FormGroup({});
    this.editedProperty = undefined;
    this.editedRow = undefined;
    this.editedRowPos = undefined;
  }

  handleEnter(event: Event, row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string): void {
    // Switch between nav and edit mode
    this.kbS.toggleEdit();

    // Already in Edit mode
    if (!!this.editedRow) {

      // Creator row edited
      if (rowPos === 0 && col === 'Code') {
        this.productCreatorRow = this.GenerateCreatorRow;
        this.productsData = [this.productCreatorRow].concat(this.productsData);
        
        this.productsDataSource.setData(this.productsData);
        
        this.kbS.moveDown();

        this.kbS.detachLastMap(1);
        this.generateAndAttachTableMap();
      }

      // Close edit mode
      this.resetEdit();
      this.kbS.moveRight();
      this.cdref.detectChanges();
      
    } else {
      // Entering edit mode
      this.edit(row, rowPos, col);
      this.cdref.detectChanges();
      this.kbS.focusById("PRODUCT-EDIT");
    }

    console.log((this.productsData[rowPos].data as any)[col]);
  }

  handleDelete(event: Event, row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string): void {
    if (rowPos !== 0 && !this.kbS.isEditModeActivated) {
      this.productsData.splice(rowPos, 1);
      this.productsDataSource.setData(this.productsData);
      
      this.kbS.moveUp();
      this.kbS.detachLastMap(1);
      this.generateAndAttachTableMap();
    }

    console.log((this.productsData[rowPos].data as any)[col]);
  }

}
