import { Injectable } from '@angular/core';
import { NM } from '../../assets/util/NavigationMatrices';

interface MatrixCoordinate {
  X: number;
  Y: number;
}

interface MatrixToSubMatrixMapping {
  key: string;
  value: string[][];
}

export enum KeyboardModes {
  NAVIGATION, EDIT
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  // X, Y coordinate pairs
  matrixPos = {X: 0, Y: 0} as MatrixCoordinate;
  pos = { X: 0, Y: 0 } as MatrixCoordinate;

  activeSubKey: string = "";

  private World: string[][][][] = [
    [NM.HeaderNavMatrix]
  ];

  private _currentKeyboardMode: KeyboardModes = KeyboardModes.NAVIGATION;
  get currentKeyboardMode() {
    return this._currentKeyboardMode;
  }
  get isEditModeActivated() {
    return this._currentKeyboardMode === KeyboardModes.EDIT;
  }

  lockedUp: boolean = false;
  lockedDown: boolean = false;
  lockedLeft: boolean = false;
  lockedRight: boolean = false;

  posCache?: number[];

  constructor() { }

  moveUp(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedUp || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    if (!canJump && this.pos.Y == 1 && !!this.activeSubKey && !!NM.SubMapping[this.activeSubKey]) {
      this.activeSubKey = "";
      this.pos.Y--;
    }
    else if (canJump && this.matrixPos.Y > 0) {
      this.matrixPos.Y--;
      this.pos.X = 0;
      this.pos.Y = 0;
    }
    else if (!canJump && this.pos.Y > 0) {
      this.pos.Y--;
      if (!!this.activeSubKey) {
        return this.process(doSelect, true);
      }
    }

    return this.process(doSelect);
  }

  moveDown(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedDown || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    var tile = this.getCurrentTile();
    
    if (!canJump && this.pos.Y == 0 && !!NM.SubMapping[tile]) {
      this.activeSubKey = tile;
      this.pos.Y++;
      return this.process(doSelect, true);
    }
    else if (!!this.activeSubKey) {
      if (this.pos.Y < NM.SubMapping[tile].length - 1) {
        this.pos.Y++;
        return this.process(doSelect, true);
      } else {
        return this.process(doSelect, true);
      }
    }
    else if (canJump && this.matrixPos.Y < this.World.length - 1) {
      this.matrixPos.Y++;
      this.pos.X = 0;
      this.pos.Y = 0;
    }
    else if (this.pos.Y < this.World[this.matrixPos.Y][this.matrixPos.X].length - 1) {
      this.pos.Y++;
    }

    return this.process(doSelect);
  }

  moveLeft(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedLeft || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    if (!!this.activeSubKey) {
      return this.getCurrentTile();
    }
    else if (this.pos.X > 0) {
      this.pos.X--;
    }
    else if (canJump && this.matrixPos.X > 0) {
      this.matrixPos.X--;
      this.pos.X = 0;
      this.pos.Y = 0;
    }
    return this.process(doSelect);
  }

  moveRight(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedRight || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    if (!!this.activeSubKey) {
      return this.getCurrentTile();
    }
    else if (this.pos.X < this.World[this.matrixPos.Y][this.matrixPos.X][this.pos.Y].length - 1) {
      this.pos.X++;
    }
    else if (canJump && this.matrixPos.X < this.World[this.matrixPos.Y].length - 1) {
      this.matrixPos.Y++;
      this.pos.X = 0;
      this.pos.Y = 0;
    }
    return this.process(doSelect);
  }

  moveTopInCurrentArea(doSelect: boolean = true): string {
    if (this.isEditModeActivated) {
      return this.getCurrentTile();
    } else {
      if (!!this.activeSubKey) {
        this.activeSubKey = "";
        this.pos.Y = 0;
        this.selectCurrentTile();
      } else {
        this.pos.Y = 0;
      }
    }
    return doSelect ? this.process(doSelect) : this.getCurrentTile();
  }

  moveNextInForm(): string {
    let tile = this.getCurrentTile();
    var res = this.moveDown(true, false);
    if (tile === res) {
      this.moveRight(true, false);
      res = this.moveTopInCurrentArea();
    }
    return res;
  }

  private process(doSelect: boolean, sub: boolean = false): string {
    console.log("Pos: ", this.matrixPos.X, ", ", this.matrixPos.Y, ", ", this.pos.X, ", ", this.pos.Y);

    var tile = "";

    if (sub) {
      tile = this.getTileFromSub(this.pos.Y, NM.SubMapping[this.activeSubKey]);
    } else {
      tile = this.getTile(this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y);
    }

    if (doSelect) {
      this.selectTile(tile);
    }

    return tile;
  }

  private getTileFromSub(y: number, sub: string[][]): string {
    return sub[y-1][0];
  }

  private getTile(mX: number, mY: number, x: number, y: number): string {
    return this.World[mY][mX][y][x];
  }

  private selectTile(tile: string) {
    var tileRef = document.getElementById(tile);
    if (!!tileRef) {
      tileRef.focus();
      // console.log(tileRef);
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

  clickCurrentTile() {
    var tile = !!this.activeSubKey ? this.getCurrentSubTile() : this.getCurrentTile();
    var tileRef = document.getElementById(tile);
    if (!!tileRef) {
      tileRef.click();
      // console.log(this.activeSubKey, tileRef);
      if (!!this.activeSubKey) {
        this.activeSubKey = "";
        this.pos.Y = 0;
        this.selectCurrentTile();
      }
    } else {
      var element = document.querySelector('[target="' + tile + '"]');
      if (!!element) {
        (element as HTMLElement).click();
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
    this.selectTile(!!this.activeSubKey ? this.activeSubKey : this.getTile(this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y));
  }

  getCurrentTile(): string {
    return !!this.activeSubKey ? this.activeSubKey : this.getTile(this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y);
  }

  selectCurrentSubTile() {
    this.selectTile(this.getTileFromSub(this.pos.Y, NM.SubMapping[this.activeSubKey]));
  }

  getCurrentSubTile(): string {
    return this.getTileFromSub(this.pos.Y, NM.SubMapping[this.activeSubKey]);
  }

  attachNewMap(map: string[][], navigateThere: boolean = false): void {
    this.posCache = [this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y];
    this.World.push([map]);
    if (navigateThere) {
      this.matrixPos.Y = this.World.length - 1;
      this.matrixPos.X = 0;
      this.pos.X = 0;
      this.pos.Y = 0;
      this.selectCurrentTile();
    }
  }

  lockDirections(up: boolean = false, right: boolean = false, down: boolean = false, left: boolean = false): void {
    this.lockedUp = up;
    this.lockedRight = right;
    this.lockedDown = down;
    this.lockedLeft = left;
  }

  detachLastMap(top: number = 1, navToPosCache: boolean = false): void {
    for (let i = 0; i < top; i++) {
      if (this.World.length > 1) {
        this.World.splice(this.World.length - 1, 1);
      }
    }
    if (navToPosCache && !!this.posCache) {
      this.matrixPos.X = this.posCache[0];
      this.matrixPos.Y = this.posCache[1];
      this.pos.X = this.posCache[2];
      this.pos.Y = this.posCache[3];
      this.clearPosCache();
    }
  }

  focusById(id: string) {
    var tileRef = document.getElementById(id);
    if (!!tileRef) {
      tileRef.focus();
    }
  }

  toggleEdit(): void {
    this._currentKeyboardMode = this._currentKeyboardMode == KeyboardModes.EDIT ? KeyboardModes.NAVIGATION : KeyboardModes.EDIT;
  }

  clearPosCache(): void {
    this.posCache = undefined;
  }
}
