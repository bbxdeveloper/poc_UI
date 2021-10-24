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

  private get _map() { return this.World[this.matrixPos.Y][this.matrixPos.X]; }

  private get maxMapX() {
    return this._map[this.pos.Y].length - 1;
  }

  private get maxMapY() {
    return this._map.length - 1;
  }

  private get worldYLimit(): number {
    return this.World.length - 1;
  }

  private get isCurrentLocationValid() {
    return this.pos.X <= this.maxMapX && this.pos.Y <= this.maxMapY;
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

  // For locking map navigation
  minWorldY: number = Number.MIN_SAFE_INTEGER;
  maxWorldY: number = Number.MAX_SAFE_INTEGER;
  minWorldX: number = Number.MIN_SAFE_INTEGER;
  maxWorldX: number = Number.MAX_SAFE_INTEGER;

  constructor() { }

  /**
   * Moves up in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump Jumpst to the next map in direction.
   * @returns Tile on the current (aftermove) position.
   */
  moveUp(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedUp || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    // Kilépünk az almenüből
    if (!canJump && this.pos.Y == 1 && !!this.activeSubKey && !!NM.SubMapping[this.activeSubKey]) {
      this.activeSubKey = "";
      this.pos.Y--;
    }
    // Egy térképpel feljebb ugrunk
    else if ((canJump && this.matrixPos.Y > 0)
              || (!canJump && this.pos.Y == 0 && this.matrixPos.Y > 0)) {
      if (this.matrixPos.Y !== this.minWorldY && this.matrixPos.Y !== this.maxWorldY) {
        this.matrixPos.Y--;
        this.pos.X = 0;
        this.pos.Y = this._map.length - 1;
        return this.process(doSelect, false);
      }
    }
    // Jelenlegi térképen lépünk egyet felfelé
    else if (!canJump && this.pos.Y > 0) {
      this.pos.Y--;
      if (!!this.activeSubKey) {
        return this.process(doSelect, true);
      }
      else if(!this.isCurrentLocationValid) {
        this.pos.X = this.maxMapX;
      }
      return this.process(doSelect, false);
    }

    return this.process(doSelect);
  }

  /**
   * Moves down in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump Jumpst to the next map in direction.
   * @returns Tile on the current (aftermove) position.
   */
  moveDown(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedDown || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    var tile = this.getCurrentTile();
    
    // Almenübe lépés
    if (!canJump && this.pos.Y == 0 && !!NM.SubMapping[tile]) {
      this.activeSubKey = tile;
      this.pos.Y++;
      return this.process(doSelect, true);
    }
    // Almenüben
    else if (!!this.activeSubKey) {
      if (this.pos.Y < NM.SubMapping[tile].length - 1) {
        this.pos.Y++;
        return this.process(doSelect, true);
      } else {
        return this.process(doSelect, true);
      }
    }
    // Ugrás lejebb
    else if ((canJump && this.matrixPos.Y < this.World.length - 1)
              || (!canJump && this.pos.Y == this._map.length - 1 && this.matrixPos.Y < this.World.length - 1)) {
      if (this.matrixPos.Y !== this.minWorldY && this.matrixPos.Y !== this.maxWorldY) {
        this.matrixPos.Y++;
        this.pos.X = 0;
        this.pos.Y = 0;
      }
    }
    // Mozgás lefelé
    else if (this.pos.Y < this.World[this.matrixPos.Y][this.matrixPos.X].length - 1) {
      this.pos.Y++;
      if (!!this.activeSubKey) {
        return this.process(doSelect, true);
      }
      else if (!this.isCurrentLocationValid) {
        this.pos.X = this.maxMapX;
      }
      return this.process(doSelect, false);
    }

    return this.process(doSelect);
  }

  /**
   * Moves left in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump Jumpst to the next map in direction.
   * @returns Tile on the current (aftermove) position.
   */
  moveLeft(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedLeft || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    // Almenüben
    if (!!this.activeSubKey) {
      return this.getCurrentTile();
    }
    // Ugrás
    else if ((canJump && this.matrixPos.X > 0)
              || (!canJump && this.matrixPos.X > 0 && this.pos.X == 0)) {
      if (this.matrixPos.X !== this.minWorldX && this.matrixPos.X !== this.maxWorldX) {
        this.matrixPos.X--;
        this.pos.X = 0;
        this.pos.Y = 0;
      }
    }
    // Mozgás balra
    else if (this.pos.X > 0) {
      this.pos.X--;
      if (!!this.activeSubKey) {
        return this.getCurrentTile();
      }
      else if (!this.isCurrentLocationValid) {
        this.pos.Y = this.maxMapY;
      }
      return this.process(doSelect, false);
    }
    
    return this.process(doSelect);
  }

  /**
   * Moves right in the current matrix or submatrix.
   * @param doSelect Focusing the tile on the current (aftermove) position.
   * @param canJump Jumpst to the next map in direction.
   * @returns Tile on the current (aftermove) position.
   */
  moveRight(doSelect: boolean = true, canJump: boolean = false): string {
    if (this.lockedRight || this.isEditModeActivated) {
      return this.getCurrentTile();
    }

    // Almenüben
    if (!!this.activeSubKey) {
      return this.getCurrentTile();
    }
    // Ugrás
    else if ((canJump && this.matrixPos.X < this.World[this.matrixPos.Y].length - 1)
              || (!canJump && this.matrixPos.X < this.World[this.matrixPos.Y].length - 1 && this.pos.X == this._map[this.pos.Y].length - 1)) {
      if (this.matrixPos.Y !== this.minWorldY && this.matrixPos.Y !== this.maxWorldY) {
        this.matrixPos.Y++;
        this.pos.X = 0;
        this.pos.Y = 0;
        return this.process(doSelect, false);
      }
    }
    // Mozgás jobbra
    else if (this.pos.X < this.World[this.matrixPos.Y][this.matrixPos.X][this.pos.Y].length - 1) {
      this.pos.X++;
      if (!!this.activeSubKey) {
        return this.getCurrentTile();
      }
      else if (!this.isCurrentLocationValid) {
        this.pos.Y = this.maxMapY;
      }
      return this.process(doSelect, false);
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
   * Moves to the next formfield. One step right, if not possible then down.
   * @returns Tile on the current (aftermove) position.
   */
  moveNextInForm(): string {
    let tile = this.getCurrentTile();
    var res = "";
    //debugger;
    if (this.pos.X == this._map[this.pos.Y].length - 1) {
      res = this.moveDown(true, false);
      if (tile !== res) {
        this.pos.X = 0;
        this.selectCurrentTile();
        return this.getCurrentTile();
      }
    }

    res = this.moveRight(true, false);
    if (tile === res) {
      res = this.moveDown(true, false);
      return res;
    }

    if (this.pos.Y == this._map.length - 1) {
      return tile;
    }

    return res;
  }

  /**
   * Moves one step right if possible, if not, tries to move to the first element of the next row of the matrix.
   * @returns X position
   */
  moveNextInTable(): number {
    let tile = this.getCurrentTile();
    var res = this.moveRight(true, false);
    if (tile === res) {
      this.moveDown(true, false);
      this.pos.X = 0;
      this.selectCurrentTile();
      return this.pos.X;
    }
    return this.pos.X;
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

  selectFirstTile() {
    this.pos.X = 0;
    this.pos.Y = 0;
    this.matrixPos.X = 0;
    this.matrixPos.Y = 0;
    this.selectCurrentTile();
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

  lockMapY(minY: number, maxY: number): void {
    this.minWorldY = minY;
    this.maxWorldY = maxY;
  }
  unlockMapY(): void {
    this.minWorldY = Number.MIN_SAFE_INTEGER;
    this.maxWorldY = Number.MAX_SAFE_INTEGER;
  }

  lockMapX(minX: number, maxX: number): void {
    this.minWorldX = minX;
    this.maxWorldX = maxX;
  }
  unlockMapX(): void {
    this.minWorldX = Number.MIN_SAFE_INTEGER;
    this.maxWorldX = Number.MAX_SAFE_INTEGER;
  }

  unlockMap(): void {
    this.unlockMapX();
    this.unlockMapY();
  }

  lockDirections(up: boolean = false, right: boolean = false, down: boolean = false, left: boolean = false): void {
    this.lockedUp = up;
    this.lockedRight = right;
    this.lockedDown = down;
    this.lockedLeft = left;
  }
  unlockDirections(): void {
    this.lockedUp = false;
    this.lockedRight = false;
    this.lockedDown = false;
    this.lockedLeft = false;
  }

  attachNewMap(map: string[][], navigateThere: boolean = false, lockMap: boolean = false, savePosCache: boolean = true): void {
    if (lockMap) {
      this.lockMapY(this.worldYLimit + 1, this.worldYLimit + 1);
    }
    if (savePosCache) {
      this.posCache = [this.matrixPos.X, this.matrixPos.Y, this.pos.X, this.pos.Y];
    }
    this.World.push([map]);
    if (navigateThere) {
      this.matrixPos.Y = this.World.length - 1;
      this.matrixPos.X = 0;
      this.pos.X = 0;
      this.pos.Y = 0;
      this.selectCurrentTile();
    }
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
    this.unlockMap();
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

  setEditMode(mode: KeyboardModes): void {
    this._currentKeyboardMode = mode;
  }

  clearPosCache(): void {
    this.posCache = undefined;
  }
}
