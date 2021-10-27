import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogService, NbSortDirection, NbSortRequest, NbTable, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FooterService } from 'src/app/services/footer.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { ProductsGridNavigationService } from 'src/app/services/products-grid-navigation.service';
import { ColDef } from 'src/assets/model/ColDef';
import { Company } from 'src/assets/model/Company';
import { FooterCommandInfo } from 'src/assets/model/FooterCommandInfo';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { PaymentData } from 'src/assets/model/PaymentData';
import { PaymentMethod } from 'src/assets/model/PaymentMethod';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { ActiveProductDialogComponent } from '../../shared/active-product-dialog/active-product-dialog.component';

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

  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;

  filteredBuyerOptions$: Observable<string[]> = of([]);
  paymentMethodOptions$: Observable<string[]> = of([]);
  
  colsToIgnore: string[] = ["Value"];
  allColumns = ['Code', 'Name', 'Measure', 'Amount', 'Price', 'Value'];
  colDefs: ColDef[] = [
    { label: 'Termékkód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string', mask: "AAA-ACCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC", colWidth: "20%", textAlign: "left" },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string', mask: "", colWidth: "30%", textAlign: "left" },
    { label: 'Mértékegység', objectKey: 'Measure', colKey: 'Measure', defaultValue: '', type: 'string', mask: "", colWidth: "5%", textAlign: "left" },
    { label: 'Mennyiség', objectKey: 'Amount', colKey: 'Amount', defaultValue: '', type: 'number', mask: "", colWidth: "15%", textAlign: "right" },
    { label: 'Ár', objectKey: 'Price', colKey: 'Price', defaultValue: '', type: 'number', mask: "", colWidth: "15%", textAlign: "right" },
    { label: 'Érték', objectKey: 'Value', colKey: 'Value', defaultValue: '', type: 'number', mask: "", colWidth: "15%", textAlign: "right" },
  ]
  customMaskPatterns = {
    A: { pattern: new RegExp('[a-zA-Z0-9]') },
    C: { pattern: new RegExp('[a-zA-Z0-9]') }
  };

  readonly commands: FooterCommandInfo[] = [
    { key: 'F1', value: 'Súgó', disabled: false },
    { key: 'F2', value: 'Keresés', disabled: false },
    { key: 'F3', value: 'Új Partner', disabled: false },
    { key: 'F4', value: 'Számolás', disabled: false },
    { key: 'F5', value: 'Adóalany', disabled: false },
    { key: 'F6', value: 'Módosítás', disabled: false },
    { key: 'F7', value: 'GdprNy', disabled: false },
    { key: 'F8', value: 'GdprAd', disabled: false },
    { key: 'F9', value: '', disabled: false },
    { key: 'F10', value: '', disabled: false },
  ];

  tableIsFocused: boolean = false;

  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  exporterForm: FormGroup;
  metaForm: FormGroup;
  buyerForm: FormGroup;

  private uid = 0;
  private tabIndex = 10000;
  get NextTabIndex() { return this.tabIndex++; }

  readonly navigationMatrix: string[][] = [
    ["r00"],
    ["m00", "m01", "m02", "m03"],
    ["m11"],
  ];

  get isEditModeOff() {
    return this.kbS.currentKeyboardMode !== KeyboardModes.EDIT;
  }

  isReady: boolean = false;

  constructor(
    @Optional() private dialogService: NbDialogService,
    private fS: FooterService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private seInv: InvoiceService,
    private cdref: ChangeDetectorRef,
    private kbS: KeyboardNavigationService,
    public gridNavHandler: ProductsGridNavigationService
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
      
      // this.buyerData = d.Buyer;

      this.senderData = d.Sender;
      this.exporterForm = new FormGroup({
        name: new FormControl(this.senderData.Name, []),
        zipCodeCity: new FormControl(this.senderData.ZipCodeCity, []),
        street: new FormControl(this.senderData.Address, []),
        invoiceNum: new FormControl(this.senderData.InvoiceAddress, []),
        taxNum: new FormControl(this.senderData.TaxNumber, []),
        note: new FormControl(this.senderData.Note, []),
      });

      this.seInv.getMockBuyers().subscribe(b => {
        this.buyersData = b;
      });
      
      this.productsData = d.Products.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
      
      this.productsDataSource.setData(this.productsData);
      
      this.paymentMethodOptions$ = this.seInv.getPaymentMethods().pipe(map(data => data.map(d => d.Key)));
      
      this.kbS.attachNewMap(this.navigationMatrix);
      
      this.table?.renderRows();
      this.gridNavHandler.setUp(
        this.productsData, this.productsDataSource,
        this.allColumns, this.colDefs,
        this.cdref,
        this.colsToIgnore
      );

      this.isReady = true;
    });
  }

  private filter(value: string): string[] {
    if (this.isEditModeOff) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return [""].concat(this.buyersData.map(x => x.Name).filter(optionValue => optionValue.toLowerCase().includes(filterValue)));
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

  ngOnInit(): void {
    this.fS.pushCommands(this.commands);
  }
  ngAfterViewInit(): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    this.kbS.selectFirstTile();
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

  handleFormEnter(event: Event, jumpNext: boolean = true, toggleEditMode: boolean = true): void {
    console.log("FORM HANDLING KEYBOARD ACTION");
    if (toggleEditMode) {
      this.kbS.toggleEdit();
    }
    if (jumpNext) {
      let oldMy = this.kbS.matrixPos.Y;
      this.kbS.moveNextInForm();
      // TODO: navigációs mátrixhoz típust rendelni, pl. "táblázat"
      if (oldMy < this.kbS.matrixPos.Y) {
        console.log(this.kbS.getCurrentTile());
        this.kbS.setEditMode(KeyboardModes.NAVIGATION);
        this.gridNavHandler.handleGridEnter(this.productsData[0], 0, this.colDefs[0].objectKey, 0);
      } else {
        this.kbS.clickCurrentTile();
        if (this.isEditModeOff) {
          this.kbS.toggleEdit();
        }
      }
    }
  }

  handleFormEscape(): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    this.cdref.detectChanges();
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
      let oldMy = this.kbS.matrixPos.Y;
      this.kbS.moveNextInForm();
      // TODO: navigációs mátrixhoz típust rendelni, pl. "táblázat"
      if (oldMy < this.kbS.matrixPos.Y) {
        console.log(this.kbS.getCurrentTile());
        this.kbS.setEditMode(KeyboardModes.NAVIGATION);
        this.gridNavHandler.handleGridEnter(this.productsData[0], 0, this.colDefs[0].objectKey, 0);
      } else {
        this.kbS.clickCurrentTile();
        this.kbS.toggleEdit();
      }
    }
  }

  focusOnTable(focusIn: boolean): void {
    this.tableIsFocused = focusIn;
    if (focusIn) {
      this.gridNavHandler.pushFooterCommandList();
    } else {
      this.fS.pushCommands(this.commands);
    }
  }

  // F KEYS
  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.F1: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F2: {
        event.preventDefault();
        this.handleActiveProductModalSelection();
        break;
      }
      case KeyBindings.F3: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F4: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F5: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F6: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F7: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F8: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F9: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      case KeyBindings.F10: {
        event.preventDefault();
        if (this.kbS.isEditModeActivated) {

        }
        break;
      }
      default: { }
    }
  }

  handleActiveProductModalSelection(): void {
    if (this.tableIsFocused && !this.isEditModeOff) {
      const dialogRef = this.dialogService.open(ActiveProductDialogComponent, { closeOnEsc: false });
      dialogRef.onClose.subscribe(res => {
        if (res) {
          console.log(res);
          this.gridNavHandler.fillCurrentlyEditedRow(res);
        }
        const row = this.gridNavHandler.editedRow;
        const rowPos = this.gridNavHandler.editedRowPos;
        const cel = this.gridNavHandler.editedProperty;
        this.gridNavHandler.clearEdit();
        if (!!row && rowPos !== undefined && cel !== undefined) {
          this.gridNavHandler.handleGridEnter(row, rowPos, cel, this.colDefs.findIndex(x => x.objectKey === cel));
        } else {
          this.kbS.selectCurrentTile();
        }
        this.gridNavHandler.pushFooterCommandList();
      });
    }
  }
}
