import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    { label: 'Kód', objectKey: 'Code', colKey: 'Code', defaultValue: '', type: 'string', mask: "000-0*" },
    { label: 'Megnevezés', objectKey: 'Name', colKey: 'Name', defaultValue: '', type: 'string', mask: "" },
    { label: 'Mértékegység', objectKey: 'Measure', colKey: 'Measure', defaultValue: '', type: 'string', mask: "" },
    { label: 'Mennyiség', objectKey: 'Amount', colKey: 'Amount', defaultValue: '', type: 'string', mask: "" },
    { label: 'Ár', objectKey: 'Price', colKey: 'Price', defaultValue: '', type: 'number', mask: "" },
    { label: 'Érték', objectKey: 'Value', colKey: 'Value', defaultValue: '', type: 'number', mask: "" },
  ]

  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  exporterForm: FormGroup;
  metaForm: FormGroup;
  buyerForm: FormGroup;

  productForms: FormGroup;
  private uid = 0;

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

  get productControlArray() {
    return this.productForms.get('products') as FormArray;
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

    this.productForms = this.fb.group({
      products: this.fb.array([]),
    });

    this.refresh();

    //this.generateProductFormFields();
    //this.kbS.attachNewMap(this.navigationMatrix);
  }

  private generateProductFormFields(): void {
    const rows = this.productControlArray;

    // Generate new product form
    let newProductForm = new FormGroup({});
    this.colDefs.forEach(col => {
      let ctrl = new FormControl('', []);
      newProductForm.addControl(col.objectKey + '0', ctrl);
    });

    rows.push(this.fb.group(newProductForm));

    // Generate filled product forms
    for (let i = 0; i < this.productsData.length; i++) {
      let _form = new FormGroup({});
      this.colDefs.forEach(col => {
        let val = (this.productsData[i].data as any)[col.objectKey];
        let ctrl = new FormControl(val, []);
        _form.addControl(col.objectKey + (i + 1), ctrl);
        console.log(col.objectKey + (i + 1));
      });
      rows.push(this.fb.group({}));
    }
/*
 // Generate new product form
    rows.push(this.fb.group({
      Code: new FormControl('', []),
      Name: new FormControl('', []),
      Measure: new FormControl('', []),
      Amount: new FormControl('', []),
      Price: new FormControl('', []),
      Value: new FormControl('', [])
    }));

      // Generate filled product forms
      this.productsData.forEach((p, index) => {
        rows.push(this.fb.group({
          Code: new FormControl(p.data.Code, []),
          Name: new FormControl(p.data.Name, []),
          Measure: new FormControl(p.data.Measure, []),
          Amount: new FormControl(p.data.Amount, []),
          Price: new FormControl(p.data.Price, []),
          Value: new FormControl(p.data.Value, [])
        }));
      });
      */
  }

  refresh(): void {
    this.seInv.getMockData("").subscribe(d => {
      this.kbS.detachLastMap(2);

      console.log(d.Products);
      
      this.buyerData = d.Buyer;
      this.senderData = d.Sender;
      
      this.productsData = d.Products.map(x => { return { data: x, uid: this.nextUid() }; });
      
      this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
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

      this.generateProductFormFields();
      this.kbS.attachNewMap(this.navigationMatrix);
      this.generateAndAttachTableMap();
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
    console.log(tableNavMap);
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

}
