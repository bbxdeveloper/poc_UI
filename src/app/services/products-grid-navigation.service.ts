import { ChangeDetectorRef, Injectable } from '@angular/core';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { KeyboardModes, KeyboardNavigationService } from './keyboard-navigation.service';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ColDef } from 'src/assets/model/ColDef';
import { FormControl, FormGroup } from '@angular/forms';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';
import { FooterCommandInfo } from 'src/assets/model/FooterCommandInfo';
import { FooterService } from './footer.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsGridNavigationService {
  productsData: TreeGridNode<InvoiceProduct>[];
  productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>;

  isUnfinishedRowDeletable: boolean = false;

  productForm: FormGroup;
  editedRow?: TreeGridNode<InvoiceProduct>;
  editedProperty?: string;
  editedRowPos?: number;

  tableNavMap: string[][] = [];
  
  allColumns: string[];
  colDefs: ColDef[];
  colsToIgnore: string[];

  productCreatorRow: TreeGridNode<InvoiceProduct>;

  get GenerateCreatorRow(): TreeGridNode<InvoiceProduct> {
    return {
      data: { Code: undefined, Measure: undefined, Amount: undefined, Price: undefined, Value: 0, Name: undefined } as InvoiceProduct
    };
  }

  readonly commandsOnTable: FooterCommandInfo[] = [
    { key: 'F1', value: 'Súgó', disabled: false },
    { key: 'F2', value: '', disabled: false },
    { key: 'F3', value: 'Megr. ->', disabled: false },
    { key: 'F4', value: 'Számolás', disabled: false },
    { key: 'F5', value: 'TkInf.', disabled: false },
    { key: 'F6', value: 'Szml.', disabled: false },
    { key: 'F7', value: 'Árkal.', disabled: false },
    { key: 'F8', value: 'Töröl', disabled: false },
    { key: 'F9', value: 'Új Sor', disabled: false },
    { key: 'F10', value: 'Ügynk.', disabled: false },
  ];
  readonly commandsOnTableEditMode: FooterCommandInfo[] = [
    { key: 'F1', value: 'Súgó', disabled: false },
    { key: 'F2', value: 'AktívT', disabled: false },
    { key: 'F3', value: 'Rend. ->', disabled: false },
    { key: 'F4', value: 'KAktíT', disabled: false },
    { key: 'F5', value: 'TkInf.', disabled: false },
    { key: 'F6', value: 'ÖsszTk.', disabled: false },
    { key: 'F7', value: '', disabled: false },
    { key: 'F8', value: '', disabled: false },
    { key: 'F9', value: '', disabled: false },
    { key: 'F10', value: 'Ügynk.', disabled: false },
  ];

  private cdref?: ChangeDetectorRef;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private kbS: KeyboardNavigationService,
    private fS: FooterService
  ) {
    this.productsData = [];
    this.productsDataSource = this.dataSourceBuilder.create(this.productsData);
    this.allColumns = [];
    this.colDefs = [];
    this.colsToIgnore = [];
    this.productForm = new FormGroup({});
    this.productCreatorRow = this.GenerateCreatorRow;
  }

  setUp(productsData: TreeGridNode<InvoiceProduct>[], productsDataSource: NbTreeGridDataSource<TreeGridNode<InvoiceProduct>>,
    allColumns: string[], colDefs: ColDef[], cdref: ChangeDetectorRef, colsToIgnore: string[] = [], editedRow?: TreeGridNode<InvoiceProduct>
  ): void {
    // Set
    this.productsData = productsData;
    this.productsDataSource = productsDataSource;
    this.allColumns = allColumns;
    this.colDefs = colDefs;
    this.colsToIgnore = colsToIgnore;
    this.editedRow = editedRow;
    this.cdref = cdref;
    // Init
    this.productForm = new FormGroup({});

    this.productCreatorRow = this.GenerateCreatorRow;
    this.productsData.push(this.productCreatorRow);

    this.productsDataSource.setData(this.productsData);

    this.resetEdit();

    this.generateAndAttachTableMap(false, this.colsToIgnore);
  }

  pushFooterCommandList(): void {
    if (this.kbS.isEditModeActivated) {
      this.fS.pushCommands(this.commandsOnTableEditMode);
    } else {
      this.fS.pushCommands(this.commandsOnTable);
    }
  }

  fillCurrentlyEditedRow(newRowData: TreeGridNode<InvoiceProduct>): void {
    if (!!newRowData && !!this.editedRow) {
      this.editedRow.data.Code = newRowData.data.Code;
      this.editedRow.data.Name = newRowData.data.Name;
      this.editedRow.data.Amount = newRowData.data.Amount;
      this.editedRow.data.Measure = newRowData.data.Measure;
      this.editedRow.data.Price = newRowData.data.Price;
      this.editedRow.data.Value = newRowData.data.Value;
    }
  }

  resetEdit(): void {
    this.productForm = new FormGroup({});
    this.editedProperty = undefined;
    this.editedRow = undefined;
    this.editedRowPos = undefined;
  }

  edit(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string) {
    this.productForm = new FormGroup({
      edited: new FormControl((row.data as any)[col])
    });
    this.editedProperty = col;
    this.editedRow = row;
    this.editedRowPos = rowPos;
  }

  handleGridEscape(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string, colPos: number): void {
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
    this.resetEdit();
    this.cdref!.detectChanges();
    this.kbS.selectCurrentTile();
    this.pushFooterCommandList();
  }

  generateTableMap(pData: TreeGridNode<InvoiceProduct>[], cDefs: ColDef[], readonlyColumns: string[] = [], idPrefix: string = 'PRODUCT'): string[][] {
    let tableMap = [];
    for (let y = 0; y < pData.length; y++) {
      let row = [];
      for (let x = 0; x < cDefs.length; x++) {
        if (readonlyColumns.findIndex(a => a === cDefs[x].objectKey) !== -1) {
          continue;
        }
        row.push(idPrefix + "-" + x + '-' + y);
      }
      tableMap.push(row);
    }
    return tableMap;
  }

  generateAndAttachTableMap(nav: boolean = false, readonlyColumns: string[] = [], idPrefix: string = 'PRODUCT'): void {
    this.tableNavMap = [];
    for (let y = 0; y < this.productsData.length; y++) {
      let row = [];
      for (let x = 0; x < this.colDefs.length; x++) {
        if (readonlyColumns.findIndex(a => a === this.colDefs[x].objectKey) !== -1) {
          continue;
        }
        row.push(idPrefix + "-" + x + '-' + y);
      }
      this.tableNavMap.push(row);
    }
    this.kbS.attachNewMap(this.tableNavMap, nav);
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

  handleGridEnter(row: TreeGridNode<InvoiceProduct>, rowPos: number, col: string, colPos: number, inputId: string = "PRODUCT-EDIT"): void {
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
      this.cdref!.detectChanges();

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
      this.cdref!.detectChanges();
      this.kbS.focusById(inputId);
      const _input = document.getElementById(inputId) as HTMLInputElement;
      if (!!_input && _input.type === "text") {
        window.setTimeout(function () {
          const txtVal = ((row.data as any)[col] as string);
          console.log(txtVal);
          if (!!txtVal) {
            _input.setSelectionRange(txtVal.length, txtVal.length);
          } else {
            _input.setSelectionRange(0, 0);
          }
        }, 0);
      }
    }

    this.pushFooterCommandList();

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

  isEditingCell(rowIndex: number, col: string): boolean {
    return this.kbS.isEditModeActivated && !!this.editedRow && this.editedRowPos == rowIndex && this.editedProperty == col;
  }

  clearEdit(): void {
    this.editedRow = undefined;
    this.editedProperty = undefined;
    this.kbS.setEditMode(KeyboardModes.NAVIGATION);
  }
}
