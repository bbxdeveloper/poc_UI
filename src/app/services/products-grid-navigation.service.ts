import { ChangeDetectorRef, Injectable } from '@angular/core';
import { InvoiceProduct } from 'src/assets/model/InvoiceProduct';
import { KeyboardModes, KeyboardNavigationService } from './keyboard-navigation.service';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ColDef } from 'src/assets/model/ColDef';
import { FormControl, FormGroup } from '@angular/forms';
import { TreeGridNode } from 'src/assets/model/TreeGridNode';

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

  private cdref?: ChangeDetectorRef;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<TreeGridNode<InvoiceProduct>>,
    private kbS: KeyboardNavigationService
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
  }

  generateAndAttachTableMap(nav: boolean = false, readonlyColumns: string[] = []): void {
    this.tableNavMap = [];
    for (let y = 0; y < this.productsData.length; y++) {
      let row = [];
      for (let x = 0; x < this.colDefs.length; x++) {
        if (readonlyColumns.findIndex(a => a === this.colDefs[x].objectKey) !== -1) {
          continue;
        }
        row.push("PRODUCT-" + x + '-' + y);
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
