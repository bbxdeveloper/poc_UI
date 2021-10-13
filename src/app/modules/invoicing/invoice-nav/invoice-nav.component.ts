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
import { PaymentData } from 'src/assets/model/PaymentData';
import { PaymentMethod } from 'src/assets/model/PaymentMethod';
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
  metaData: PaymentData;

  buyersData: Company[] = [];
  paymentMethods: PaymentMethod[] = [];

  productCreatorRow: TreeGridNode<InvoiceProduct>;
  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;
  filteredBuyerOptions$: Observable<string[]> = of([]);
  paymentMethodOptions$: Observable<string[]> = of([]);
  colsToIgnore: string[] = ["Value"];

  isUnfinishedRowDeletable = false;

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
      data: { Code: undefined, Measure: undefined, Amount: undefined, Price: undefined, Value: 0, Name: undefined } as InvoiceProduct
    };
  }

  readonly navigationMatrix: string[][] = [
    ["r00"],
    // ["r01"],
    // ["r02"],
    // ["r03"],
    // ["r04"],
    // ["r05"],
    ["m00", "m01", "m02", "m03"],
    ["m11"],
  ];
  tableNavMap: string[][] = [];

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
    this.metaData = {} as PaymentData;
    
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
      invoiceOrdinal: new FormControl('K-0000001/21', []),
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

      this.paymentMethodOptions$ = this.seInv.getPaymentMethods().pipe(map(data => data.map(d => d.Key)));

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
    this.tableNavMap = [];
    for(let y = 0; y < this.productsData.length; y++) {
      let row = [];
      for(let x = 0; x < this.colDefs.length; x++) {
        if (readonlyColumns.findIndex(a => a === this.colDefs[x].objectKey) !== -1) {
          continue;
        }
        row.push("PRODUCT-" + x + '-' + y);
      }
      this.tableNavMap.push(row);
    }
    // console.log(tableNavMap);
    this.kbS.attachNewMap(this.tableNavMap, nav);
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

  edit(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string) {
    this.productForm = new FormGroup({
      edited: new FormControl((row.data as any)[col])
    });
    this.editedProperty = col;
    this.editedRow = row;
    this.editedRowPos = rowPos;
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

  resetEdit(): void {
    this.productForm = new FormGroup({});
    this.editedProperty = undefined;
    this.editedRow = undefined;
    this.editedRowPos = undefined;
  }

  handleGridEscape(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string, colPos: number): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    this.resetEdit();
    this.cdref.detectChanges();
    this.kbS.selectCurrentTile();
  }

  handleGridMovement(event: KeyboardEvent, row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string, colPos: number, upward: boolean): void {
    // Új sorokat generáló sort nem dobhatjuk el.
    if (rowPos !== this.productsData.length - 1) {
      // Csak befejezetlen sort dobhatunk el, amikor nincs szerkesztésmód.
      let _data = row.data;
      let rowIsUnfinished =
        _data.Value == undefined || _data.Price == undefined || _data.Name == undefined ||
        _data.Measure == undefined || _data.Code == undefined || _data.Amount == undefined;
      if (rowIsUnfinished && !this.kbS.isEditModeActivated) {
        switch (event.key) {
          case "ArrowUp":
            if (!this.isUnfinishedRowDeletable) {
              return;
            }
            this.isUnfinishedRowDeletable = false;

            this.productsData.splice(rowPos, 1);
            this.productsDataSource.setData(this.productsData);
            
            // Ha felfelé navigálunk, akkor egyet kell lefelé navigálnunk, hogy korrigáljuk a mozgást.
            this.kbS.moveDown();
            this.kbS.detachLastMap(1);
            this.generateAndAttachTableMap();
            break;
          case "ArrowDown":
            if (!this.isUnfinishedRowDeletable) {
              return;
            }
            this.isUnfinishedRowDeletable = false;

            this.productsData.splice(rowPos, 1);
            this.productsDataSource.setData(this.productsData);

            // Ha lefelé navigálunk, akkor egyet kell felfelé navigálnunk, hogy korrigáljuk a mozgást.
            this.kbS.moveUp();
            this.kbS.detachLastMap(1);
            this.generateAndAttachTableMap();
            break;
        }
      }
    }
  }

  handleGridEnter(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string, colPos: number): void {
    // Switch between nav and edit mode
    let wasEditActivatedPreviously = this.kbS.isEditModeActivated;
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

        this.isUnfinishedRowDeletable = true;
      }

      // this.kbS.toggleEdit();
      this.resetEdit();
      this.cdref.detectChanges();

      let newX = this.kbS.moveNextInTable();
      if (wasEditActivatedPreviously) {
        if (newX < colPos) {
          this.isUnfinishedRowDeletable = false;
        }
        let nextRowPost = newX < colPos ? rowPos + 1 : rowPos;
        let nextRow = newX < colPos ? this.productsData[nextRowPost] : row;
        this.handleGridEnter(nextRow, nextRowPost, this.colDefs[newX].objectKey, newX);
      }
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
      
      if (rowPos !== 0) {
        this.kbS.moveUp();
      }
      this.kbS.detachLastMap(1);
      this.generateAndAttachTableMap();
    }

    console.log((this.productsData[rowPos].data as any)[col]);
  }
}
