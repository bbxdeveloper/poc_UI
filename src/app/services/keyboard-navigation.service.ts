import { Injectable } from '@angular/core';
import { NM } from '../../assets/util/NavigationMatrices';

interface MatrixCoordinate {
  X: number;
  Y: number;
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

  /** Active submap key, if there is a focused submap tile. */
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

  /** UP direction is locked and not usable. */
  lockedUp: boolean = false;
  /** DOWN direction is locked and not usable. */
  lockedDown: boolean = false;
  /** LEFT direction is locked and not usable. */
  lockedLeft: boolean = false;
  /** RIGHT direction is locked and not usable. */
  lockedRight: boolean = false;

  /** Cache for position, order: World X, World Y, Matrix X, Matrix Y. */
  posCache?: number[];

  constructor() { }

  /**
   * Moves up in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump If reached the edge of the matrix already but there is another map, it jumps onto it.
   * @returns Tile on the current (aftermove) position.
   */
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

  /**
   * Moves down in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump If reached the edge of the matrix already but there is another map, it jumps onto it.
   * @returns Tile on the current (aftermove) position.
   */
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

  /**
   * Moves left in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump If reached the edge of the matrix already but there is another map, it jumps onto it.
   * @returns Tile on the current (aftermove) position.
   */
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

  /**
   * Moves right in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump If reached the edge of the matrix already but there is another map, it jumps onto it.
   * @returns Tile on the current (aftermove) position.
   */
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

  /**
   * Moves to the top edge of the current matrix.
   * If the pos is in a submatrix, then escapes it.
   * @param doSelect Selects the tile under the new position.
   * @returns Tile on the current (aftermove) position.
   */
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

  /**
   * Moves one step down if possible, if not, tries to move one step right then to the top edge of the matrix.
   * @returns Tile on the current (aftermove) position.
   */
  moveNextInForm(): string {
    let tile = this.getCurrentTile();
    var res = this.moveDown(true, false);
    if (tile === res) {
      this.moveRight(true, false);
      res = this.moveTopInCurrentArea();
    }
    return res;
  }

  /**
   * Called at the and of the basic 4 move methods. Returns the new tile and selects it depending on the parameters.
   * @param doSelect Select tile on new position.
   * @param sub Submatrix movement.
   * @returns Tile on the current (aftermove) position.
   */
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

  /**
   * Gets tile from the given submatrix on the given Y coordinate (X is zero).
   * @param y 
   * @param sub 
   * @returns 
   */
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
