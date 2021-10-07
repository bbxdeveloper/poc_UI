import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbOptionComponent, NbSortDirection, NbSortRequest, NbTable, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { ColDef } from 'src/assets/model/ColDef';
import { Company } from 'src/assets/model/Company';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';

@Component({
  selector: 'app-invoice-nav',
  templateUrl: './invoice-nav.component.html',
  styleUrls: ['./invoice-nav.component.scss']
})
export class InvoiceNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('table') table?: NbTable<any>;

  senderData: Company;
  buyerData: Company;
  buyersData: Company[] = [];

  productCreatorRow: TreeGridNode<InvoiceProduct>;
  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;
  filteredBuyerOptions$: Observable<string[]> = of([]);
  colsToIgnore: string[] = ["Value"];

  allColumns = ['Code', 'Name', 'Measure', 'Amount', 'Price', 'Value'];
  colDefs: ColDef[] = [
    { label: 'Termékkód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string', mask: "AAA-ACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC" },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string', mask: "" },
    { label: 'Mértékegység', objectKey: 'Measure', colKey: 'Measure', defaultValue: '', type: 'string', mask: "" },
    { label: 'Mennyiség', objectKey: 'Amount', colKey: 'Amount', defaultValue: '', type: 'number', mask: "" },
    { label: 'Ár', objectKey: 'Price', colKey: 'Price', defaultValue: '', type: 'number', mask: "" },
    { label: 'Érték', objectKey: 'Value', colKey: 'Value', defaultValue: '', type: 'number', mask: "" },
  ]
  customMaskPatterns = {
    A: { pattern: new RegExp('[a-zA-Z0-9]') },
    C: { pattern: new RegExp('[a-zA-Z0-9]') }
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
    ["l00", "r00"],
    ["l01", "r01"],
    ["l02", "r02"],
    ["l03", "r03"],
    ["l04", "r04"],
    ["l05", "r05"],
    ["m00", "m01", "m02", "m03", "m04"],
    ["m11"],
  ];

  get isEditModeOff() {
    return this.kbS.currentKeyboardMode !== KeyboardModes.EDIT;
  }

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private elem: ElementRef,
    private seInv: InvoiceService,
    private cdref: ChangeDetectorRef,
    private kbS: KeyboardNavigationService,
    private fb: FormBuilder
  ) {
    this.senderData = {} as Company;
    this.buyerData = {} as Company;
    
    this.productsData = [];
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

    this.filteredBuyerOptions$ = this.buyerForm.controls["name"].valueChanges
      .pipe(
        startWith(''),
        map((filterString: any) => this.filter(filterString)),
      );

    this.refresh();
  }

  refresh(): void {
    this.seInv.getMockData("").subscribe(d => {
      this.kbS.detachLastMap(2);

      // console.log(d.Products);
      
      // this.buyerData = d.Buyer;
      this.senderData = d.Sender;

      this.seInv.getMockBuyers().subscribe(b => {
        this.buyersData = b;
      });
      
      this.productCreatorRow = this.GenerateCreatorRow;
      this.productsData = d.Products.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
      this.productsData.push(this.productCreatorRow);
      
      this.productsDataSource.setData(this.productsData);

      this.exporterForm = new FormGroup({
        name: new FormControl(this.senderData.Name, []),
        zipCodeCity: new FormControl(this.senderData.ZipCodeCity, []),
        street: new FormControl(this.senderData.Address, []),
        invoiceNum: new FormControl(this.senderData.InvoiceAddress, []),
        taxNum: new FormControl(this.senderData.TaxNumber, []),
        note: new FormControl(this.senderData.Note, []),
      });
      // this.buyerForm = new FormGroup({
      //   name: new FormControl(this.buyerData.Name, []),
      //   zipCodeCity: new FormControl(this.buyerData.ZipCodeCity, []),
      //   street: new FormControl(this.buyerData.Address, []),
      //   invoiceNum: new FormControl(this.buyerData.InvoiceAddress, []),
      //   taxNum: new FormControl(this.buyerData.TaxNumber, []),
      //   note: new FormControl(this.buyerData.Note, []),
      // });

      this.resetEdit();

      this.kbS.attachNewMap(this.navigationMatrix);
      this.generateAndAttachTableMap(false, this.colsToIgnore);

      // console.log(this.productForms);

      this.table?.renderRows();
    });
  }

  private filter(value: string): string[] {
    if (this.isEditModeOff) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return [""].concat(this.buyersData.map(x => x.Name).filter(optionValue => optionValue.toLowerCase().includes(filterValue)));
  }

  private generateAndAttachTableMap(nav: boolean = false, readonlyColumns: string[] = []): void {
    let tableNavMap: string[][] = [];
    for(let y = 0; y < this.productsData.length; y++) {
      let row = [];
      for(let x = 0; x < this.colDefs.length; x++) {
        if (readonlyColumns.findIndex(a => a === this.colDefs[x].objectKey) !== -1) {
          continue;
        }
        row.push("PRODUCT-" + x + '-' + y);
      }
      tableNavMap.push(row);
    }
    // console.log(tableNavMap);
    this.kbS.attachNewMap(tableNavMap, nav);
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
    // var tmp = this.elem.nativeElement.querySelectorAll('.nb-tree-grid-header-change-sort-button');
    // for (let item of tmp) {
    //   item.tabIndex = -1;
    // }
    this.kbS.moveTopInCurrentArea();
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

  handleGridEnter(event: Event, row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string): void {
    // Switch between nav and edit mode
    this.kbS.toggleEdit();

    // Already in Edit mode
    if (!!this.editedRow) {

      // Creator row edited
      if (rowPos === this.productsData.length - 1 && col === 'Code') {
        this.productCreatorRow = this.GenerateCreatorRow;
        this.productsData.push(this.productCreatorRow);
        
        this.productsDataSource.setData(this.productsData);

        this.kbS.detachLastMap(1);
        this.generateAndAttachTableMap(false, this.colsToIgnore);
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

  handleGridDelete(event: Event, row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string): void {
    if (rowPos !== this.productsData.length - 1 && !this.kbS.isEditModeActivated) {
      this.productsData.splice(rowPos, 1);
      this.productsDataSource.setData(this.productsData);
      
      this.kbS.moveUp();
      this.kbS.detachLastMap(1);
      this.generateAndAttachTableMap();
    }

    console.log((this.productsData[rowPos].data as any)[col]);
  }

  handleFormEnter(event: Event, jumpNext: boolean = true, toggleEditMode: boolean = true): void {
    console.log("FORM HANDLING KEYBOARD ACTION");
    if (toggleEditMode) {
      this.kbS.toggleEdit();
    }
    if (jumpNext) {
      this.kbS.moveNextInForm();
    }
  }

  handleAutoCompleteSelect(event: any): void {
    if (event === "") {
      // this.buyerForm.controls["name"].setValue("");
      this.buyerForm.controls["zipCodeCity"].setValue("");
      this.buyerForm.controls["street"].setValue("");
      this.buyerForm.controls["invoiceNum"].setValue("");
      this.buyerForm.controls["taxNum"].setValue("");
      this.buyerForm.controls["note"].setValue("");
    } else {
      this.feelBuyerForm(event);
    }
    if (this.isEditModeOff) {
      this.kbS.moveNextInForm();
    }
  }

  handleAutoCompleteOptionFocused(event: any): void {
    console.log(event);
  }

  private feelBuyerForm(name: string) {
    let buyer = this.buyersData.find(b => b.Name === name);
    if (!!buyer) {
      this.buyerForm.controls["zipCodeCity"].setValue(buyer.ZipCodeCity);
      this.buyerForm.controls["street"].setValue(buyer.Address);
      this.buyerForm.controls["invoiceNum"].setValue(buyer.InvoiceAddress);
      this.buyerForm.controls["taxNum"].setValue(buyer.TaxNumber);
      this.buyerForm.controls["note"].setValue(buyer.Note);
    }
  }
}
