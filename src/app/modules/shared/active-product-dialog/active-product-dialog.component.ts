import { AfterContentInit, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { NbDialogRef, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { FooterService } from 'src/app/services/footer.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardModes, KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { ProductsGridNavigationService } from 'src/app/services/products-grid-navigation.service';
import { ColDef } from 'src/assets/model/ColDef';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { FormBuilder } from '@angular/forms';
import { OnInit } from '@angular/core';

const NavMap: string[][] = [
  ['active-prod-btn-1', 'active-prod-btn-2'],
  ['active-prod-search']
];

@Component({
  selector: 'app-active-product-dialog',
  templateUrl: './active-product-dialog.component.html',
  styleUrls: ['./active-product-dialog.component.scss']
})
export class ActiveProductDialogComponent implements AfterContentInit, OnDestroy, OnInit, AfterViewChecked {
  firstBtnGroupVal: boolean = false;
  secondBtnGroupVal: boolean = false;

  closedManually: boolean = false;

  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;
  selectedRow: InvoiceProduct;

  allColumns = ['Code', 'Name'];
  colDefs: ColDef[] = [
    { label: 'Termékkód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string', mask: "" },
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
    private elem: ElementRef,
    private seInv: InvoiceService,
    private fb: FormBuilder,
    private gN: ProductsGridNavigationService,
    public gridNavHandler: ProductsGridNavigationService
  ) {
    this.productsData = [];
    this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
    this.selectedRow = { Price: 0, Amount: 0, Value: 0 } as InvoiceProduct;
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
      this.kbS.lockDirections();
    }
  }

  refresh(): void {
    this.seInv.getActiveProducts().subscribe(data => {
      this.productsData = data.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
      this.productsDataSource.setData(this.productsData);
      this.tableMap = this.gN.generateTableMap(this.productsData, this.colDefs, [], 'ACTIVEPRODUCT');
    });
  }

  refreshFilter(event: any): void {
    const queryString: string = event.target.value;

    if (!queryString) {
      this.refreshMap(this.productsData);
    }

    // this.productsDataSource.filter(queryString);
    let filtered = this.productsData.filter(x =>
      x.data.Code?.toLowerCase().includes(queryString.toLowerCase()) || x.data.Name?.toLowerCase().includes(queryString.toLowerCase())
    );

    this.productsDataSource.setData(filtered);
    this.refreshMap(filtered);
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

  updateBtnGroupValue(first: boolean = true): void {
    if (first) {
      this.firstBtnGroupVal = true;
    } else {
      this.secondBtnGroupVal = true;
      this.kbS.detachLastMap(1, false);
      this.kbS.attachNewMap(NavMap.concat(this.tableMap), true, true, false);
    }
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
        if (!this.secondBtnGroupVal && !this.firstBtnGroupVal) {
          this.close(undefined);
        }
        if (this.secondBtnGroupVal) {
          this.secondBtnGroupVal = false;
        } else {
          this.firstBtnGroupVal = false;
        }
        break;
      }
      default: { }
    }
  }
}
