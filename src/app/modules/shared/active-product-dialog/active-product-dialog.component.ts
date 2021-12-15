import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NbDialogRef, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { FooterService } from 'src/app/services/footer.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { ProductsGridNavigationService } from 'src/app/services/products-grid-navigation.service';
import { ColDef } from 'src/assets/model/ColDef';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { OnInit } from '@angular/core';

const NavMap: string[][] = [
  ['active-prod-btn-1', 'active-prod-btn-2'],
  ['active-prod-search', 'show-all', 'show-less']
];

enum SearchMode {
  Code = 0,
  Name = 1,
  NotDefined = 2
}

@Component({
  selector: 'app-active-product-dialog',
  templateUrl: './active-product-dialog.component.html',
  styleUrls: ['./active-product-dialog.component.scss']
})
export class ActiveProductDialogComponent implements AfterContentInit, OnDestroy, OnInit, AfterViewChecked {
  btnState: boolean = false;

  searchMode: SearchMode = SearchMode.NotDefined;
  searchString: string = '';

  closedManually: boolean = false;

  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;
  selectedRow: InvoiceProduct;

  allColumns = ['ProductCode', 'Name'];
  colDefs: ColDef[] = [
    { label: 'Termékkód', objectKey: 'ProductCode', colKey: 'ProductCode', defaultValue: '', type: 'string', mask: "" },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string', mask: "" }
  ];

  private uid = 0;
  private tabIndex = 10000;
  get NextTabIndex() { return this.tabIndex++; }

  private tableMap: string[][] = [];

  get isEditModeOff() {
    return this.kbS.currentKeyboardMode !== KeyboardModes.EDIT;
  }

  constructor(
    private cdref: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<ActiveProductDialogComponent>,
    private kbS: KeyboardNavigationService,
    private fS: FooterService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private seInv: InvoiceService,
    private gN: ProductsGridNavigationService,
    public gridNavHandler: ProductsGridNavigationService
  ) {
    this.productsData = [];
    this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
    this.selectedRow = { Price: 0, Amount: 0, Value: 0 } as InvoiceProduct;
    this.fS.pushEmptyList();
  }

  ngOnInit(): void {
    this.refresh();
  }
  ngAfterContentInit(): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    this.kbS.attachNewMap(NavMap, true, true, true);
  }
  ngAfterViewChecked(): void {
    this.kbS.selectCurrentTile();
  }
  ngOnDestroy(): void {
    this.kbS.setEditMode(KeyboardModes.EDIT);
    if (!this.closedManually) {
      this.kbS.detachLastMap(1, true);
      this.kbS.unlockDirections();
    }
  }

  refresh(all: boolean = false): void {
    this.seInv.getActiveProducts(all).subscribe(data => {
      this.productsData = data.Result.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
      this.productsDataSource.setData(this.productsData);
      console.log(data.Result, this.productsData, this.productsDataSource);
      this.tableMap = this.gN.generateTableMap(this.productsData, this.colDefs, [], 'ACTIVEPRODUCT');
    });
  }

  search(queryString: string, mode: SearchMode, all: boolean = false): void {
    switch (mode) {
      case SearchMode.Code:
        this.seInv.searchActiveProductsByCode(queryString, all).subscribe(data => {
          this.productsData = data.Result.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
          this.productsDataSource.setData(this.productsData);
          console.log(data.Result, this.productsData, this.productsDataSource);
          this.tableMap = this.gN.generateTableMap(this.productsData, this.colDefs, [], 'ACTIVEPRODUCT');
        });
        break;
      case SearchMode.Name:
        this.seInv.searchActiveProductsByName(queryString, all).subscribe(data => {
          this.productsData = data.Result.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
          this.productsDataSource.setData(this.productsData);
          console.log(data.Result, this.productsData, this.productsDataSource);
          this.tableMap = this.gN.generateTableMap(this.productsData, this.colDefs, [], 'ACTIVEPRODUCT');
        });
        break;
      default:
        this.refresh(all);
        break;
    }
  }

  refreshFilter(event: any): void {
    this.searchString = event.target.value;

    console.log("Search: ", this.searchString, "Mode: ", this.searchMode, "Btn state: ", this.btnState);

    if (this.searchString.length === 0) {
      this.refresh();
    } else {
      this.search(this.searchString, this.searchMode);
    }
  }

  showAll(): void {
    if (this.searchString.length === 0) {
      this.refresh(true);
    } else {
      this.search(this.searchString, this.searchMode, true);
    }
  }

  showLess(): void {
    if (this.searchString.length === 0) {
      this.refresh();
    } else {
      this.search(this.searchString, this.searchMode);
    }
  }

  handleEnter(event: any): void {
    this.kbS.toggleEdit();
  }

  selectRow(event: any, row: TreeGridNode<InvoiceProduct>): void {
    this.close(row);
  }

  private nextUid(): number {
    ++this.uid
    return this.uid;
  }

  trackRows(index: number, row: any) {
    return row.uid;
  }

  updateBtnGroupValue(first: boolean = true, mode: number): void {
    this.btnState = true;
    this.searchMode = mode;
    this.kbS.detachLastMap(1, false);
    this.kbS.attachNewMap(NavMap.concat(this.tableMap), true, true, false);
    this.cdref.markForCheck();
  }

  refreshMap(data: TreeGridNode<InvoiceProduct>[]): void {
    this.tableMap = this.gN.generateTableMap(data, this.colDefs, [], 'ACTIVEPRODUCT');
    this.kbS.detachLastMap(1, false);
    this.kbS.attachNewMap(NavMap.concat(this.tableMap), false, true, false);
  }

  close(selectedGrid?: TreeGridNode<InvoiceProduct>) {
    this.closedManually = true;
    this.kbS.detachLastMap(1, true);
    this.kbS.unlockDirections();
    this.dialogRef.close(selectedGrid);
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.exit: {
        event.preventDefault();
        // Closing dialog
        if (!this.btnState) {
          this.close(undefined);
        }
        // Stepping back to the search mode selector
        if (this.btnState) {
          this.btnState = false;
          // Resetting filter and navigation map
          this.refreshFilter("");
          this.kbS.detachLastMap(1, false);
          this.kbS.attachNewMap(NavMap.concat(this.tableMap), true, true, false);
        }
        break;
      }
      default: { }
    }
  }
}
