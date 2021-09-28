import { Injectable } from '@angular/core';

const HeaderNavMatrix = [
  [ "header-home", "header-user", "header-sett", "header-prod", "header-invo", "header-orde", "header-info", "header-list", "header-serv", "header-shut" ]
];
const headerInvoSub = [
  ["invoicing-sub-1"],
];

const World: string[][][][] = [
  [HeaderNavMatrix]
];

const SubMapping: { [id: string]: string[][]; } = {};
SubMapping["header-invo"] = headerInvoSub;

interface MatrixCoordinate {
  X: number;
  Y: number;
}

interface MatrixToSubMatrixMapping {
  key: string;
  value: string[][];
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  // X, Y coordinate pairs
  matrixPos = {X: 0, Y: 0} as MatrixCoordinate;
  pos = { X: 0, Y: 0 } as MatrixCoordinate;

  constructor() { }

  moveUp(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.pos.Y > 0) {
      this.pos.Y--;
    }
    else if (canJump && this.matrixPos.Y > 0) {
      this.matrixPos.Y--;
    }
    return this.process(doSelect);
  }

  moveDown(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.pos.Y < World[this.matrixPos.Y][this.matrixPos.X].length - 1) {
      this.pos.Y++;
    }
    else if (canJump && this.matrixPos.Y < World.length - 1) {
      this.matrixPos.Y++;
    }
    return this.process(doSelect);
  }

  moveLeft(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.pos.X > 0) {
      this.pos.X--;
    }
    else if (canJump && this.matrixPos.X > 0) {
      this.matrixPos.X--;
    }
    return this.process(doSelect);
  }

  moveRight(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.pos.X < World[this.matrixPos.Y][this.matrixPos.X][this.pos.Y].length - 1) {
      this.pos.X++;
    }
    else if (canJump && this.matrixPos.X < World[this.matrixPos.Y].length - 1) {
      this.matrixPos.Y++;
    }
    return this.process(doSelect);
  }

  private process(doSelect: boolean): string {
    var tile = this.getTile(this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y);
    if (doSelect) {
      this.selectTile(tile);
    }
    return tile;
  }

  private getTile(mX: number, mY: number, x: number, y: number): string {
    return World[mY][mX][y][x];
  }

  private selectTile(tile: string) {
    var tileRef = document.getElementById(tile);
    if (!!tileRef) {
      tileRef.focus();
    } else {
      var element = document.querySelector('[target="' + tile + '"]');
      if (!!element) {
        (element as HTMLElement).focus();
      } else {
        var tmp = document.getElementsByClassName(tile);
        if (!!tmp && tmp.length > 0) {
          tileRef = tmp[0] as HTMLElement;
          tileRef.focus();
        }
      }
    }
  }

  selectCurrentTile() {
    this.selectTile(this.getTile(this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y));
  }
}
