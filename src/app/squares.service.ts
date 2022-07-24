import { Injectable } from '@angular/core';

import { SquareComponent } from './square/square.component';

@Injectable({
  providedIn: 'root'
})
export class SquaresService {

  squareComponents: SquareComponent[][] = new Array<Array<SquareComponent>>();

  selectedSquare: SquareComponent | undefined;

  constructor() {  
    for (let row = 0; row < 10; row++) {
      this.squareComponents[row] = new Array<SquareComponent>();
    }
  }

  registerSquare(square: SquareComponent) {
    this.squareComponents[square.row][square.col] = square;
  }

  selectSquare(row:number, col:number) {
    this.selectedSquare?.deselect();
    this.selectedSquare = this.squareComponents[row][col]; 
    this.selectedSquare.selected = true;
  }

  updateSums() {
    for (let rc = 0; rc < 10; rc++) {
      this.squareComponents[rc][0].blocked = true;
      this.squareComponents[0][rc].blocked = true;
    }
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.squareComponents[row][col]?.blocked) {
            this.squareComponents[row][col].hasRight = 
              (col + 1 < 9 && !this.squareComponents[row][col + 1]?.blocked);
            this.squareComponents[row][col].hasDown =  
              (row + 1 < 9 && !this.squareComponents[row + 1][col]?.blocked); 
        } 
      }
    }
  } 

  handleKey(key: KeyboardEvent) {
    if (key.target == document.body && this.selectedSquare) {
      var keyCode = key.keyCode;
      var numberKey = keyCode - 48; 
      if (numberKey >= 1 && numberKey <= 9) { 
        this.selectedSquare.togglePossibility(numberKey);
        return true;
      } else if (keyCode == 8 || keyCode == 32) {
        this.selectedSquare.toggleBlocked();
        return true;
      } else {
        var r = this.selectedSquare.row;
        var c = this.selectedSquare.col;
        if (keyCode == 37) {
          if (c > 0) {
            this.selectSquare(r, c - 1);
            return true;
          }
        } else if (keyCode == 38) {
          if (r > 0) {
            this.selectSquare(r - 1, c);
            return true;
          }
        } else if (keyCode == 39) {
          if (c < 9) {
            this.selectSquare(r, c + 1);
            return true;
          }
        } else if (keyCode == 40) {
          if (r < 9) {
            this.selectSquare(r + 1, c);
            return true;
          }
        }
      }      
    }
    return false;
  }

  persistable() {
    var squares = [];    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.squareComponents[row][col]) {
          squares.push({
            row: row,
            col: col,
            state: this.squareComponents[row][col].persistable()
          });
        }
      }
    } 
    return squares;
  }

  restore(squares:[any]) {
    for (var square of squares) {
      var squareComponent = this.squareComponents[square.row][square.col];
      squareComponent.restore(square.state);
    }
    this.updateSums();
  }
}
