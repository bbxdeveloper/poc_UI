import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { InvoiceService } from 'src/app/services/invoice.service';
import { KeyboardNavigationService } from 'src/app/services/keyboard-navigation.service';
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
export class InvoiceNavComponent implements OnInit, AfterViewInit {
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

  exporterForm: FormGroup;
  metaForm: FormGroup;
  buyerForm: FormGroup;

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

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    event.preventDefault();
    switch (event.key) {
      case KeyBindings.up: {
        this.kbS.moveUp(true, event.altKey);
        break;
      }
      case KeyBindings.down: {
        this.kbS.moveDown(true, event.altKey);
        break;
      }
      case KeyBindings.left: {
        this.kbS.moveLeft(true, event.altKey);
        break;
      }
      case KeyBindings.right: {
        this.kbS.moveRight(true, event.altKey);
        break;
      }
      case KeyBindings.edit: {
        this.kbS.clickCurrentTile();
        break;
      }
      default: { }
    }
  }

}
