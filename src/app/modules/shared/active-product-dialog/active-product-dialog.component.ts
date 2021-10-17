import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NbDialogRef, NbTable, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { FooterService } from 'src/app/services/footer.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
import { ProductsGridNavigationService } from 'src/app/services/products-grid-navigation.service';
import { ColDef } from 'src/assets/model/ColDef';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';
import { KeyBindings } from 'src/assets/util/KeyBindings';
import { FormBuilder } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-active-product-dialog',
  templateUrl: './active-product-dialog.component.html',
  styleUrls: ['./active-product-dialog.component.scss']
})
export class ActiveProductDialogComponent implements AfterContentInit, OnDestroy, OnInit {
  firstBtnGroupVal: string[] = [];
  secondBtnGroupVal: string[] = [];

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

  constructor(
    private cdref: ChangeDetectorRef,
    protected dialogRef: NbDialogRef<ActiveProductDialogComponent>,
    private kBs: KeyboardNavigationService,
    private fS: FooterService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private elem: ElementRef,
    private seInv: InvoiceService,
    private fb: FormBuilder,
    public gridNavHandler: ProductsGridNavigationService
  ) {
    this.productsData = [];
    this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
    this.selectedRow = {Price: 0, Amount: 0, Value: 0} as InvoiceProduct;
  }

  ngOnInit(): void {
    this.refresh();
  }
  ngAfterContentInit(): void {
    this.kBs.attachNewMap([["confirm-dialog-button-yes", "confirm-dialog-button-no"]], true);
    this.kBs.lockDirections(true, false, true, false);
  }
  ngOnDestroy(): void {
    if (!this.closedManually) {
      this.kBs.detachLastMap(1, true);
      this.kBs.lockDirections();
    }
  }

  refresh(): void {
    this.seInv.getActiveProducts().subscribe(data => {
      this.productsData = data.map(x => { return { data: x, uid: this.nextUid(), tabIndex: this.NextTabIndex }; });
      this.productsDataSource.setData(this.productsData);
    });
  }

  private nextUid(): number {
    ++this.uid
    return this.uid;
  }

  trackRows(index: number, row: any) {
    return row.uid;
  }

  updateBtnGroupValue(value: string[], first: boolean = true): void {
    if (first) {
      this.firstBtnGroupVal = value;
    } else {
      this.secondBtnGroupVal = value;
    }
    this.cdref.markForCheck();
  }

  close(answer: boolean) {
    this.closedManually = true;
    this.kBs.detachLastMap(1, true);
    this.kBs.lockDirections();
    this.dialogRef.close(answer);
  }

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Tab') {
      event.preventDefault();
    }
    switch (event.key) {
      case KeyBindings.exit: {
        event.preventDefault();
        if (this.secondBtnGroupVal.length == 0 && this.firstBtnGroupVal.length == 0) {
          this.close(true);
        }
        if (this.secondBtnGroupVal.length > 0) {
          this.secondBtnGroupVal = [];
        } else {
          this.firstBtnGroupVal = [];
        }
        break;
      }
      default: { }
    }
  }
}
