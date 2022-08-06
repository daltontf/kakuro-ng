import { NgIf } from '@angular/common';
import { Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';

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

  private compute(result: boolean[], usedDigits: boolean[], remaining:number, digits:number) {
    if (digits == 1 ) {
      if (remaining < 10 && !usedDigits[remaining - 1]) {
          result[remaining - 1] = true;
      }
  } else {
      for (var x = 1; x < Math.min(10, remaining); x++) {
        if (!usedDigits[x - 1]) {
          var nextRemaining = remaining - x;
          usedDigits[x - 1] = true;
          this.compute(result, usedDigits, nextRemaining, digits - 1);
          usedDigits[x - 1] = false;
        }
      }
    }
  }

  private computePossibility(number: number, digits: number, exclusions:number[]):number[] {
    var arrayResult = new Array<number>;

    var possibilities = new Array<boolean>();

    var excluded = new Array<boolean>();

    for (let i = 0; i < exclusions.length; i++) {
      excluded[exclusions[i] - 1] = true;
    }

    this.compute(possibilities, excluded, number, digits);

    for (let i = 0; i < possibilities.length; i++) {
      if (possibilities[i]) {
        arrayResult.push(i + 1);
      }
    }    
    return arrayResult;
  }

  validateSums() {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        this.squareComponents[row][col].dupPossibility = false;
      }
    }
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.squareComponents[row][col].hasDown
         && this.squareComponents[row][col].sumDown) {
          var number = parseInt(this.squareComponents[row][col].sumDown);
          var sumOfPossibilities = 0;
          var used:number[] = [];
          for (let r = row + 1; r < 10 && !this.squareComponents[r][col].blocked; r++) {
            var value = this.squareComponents[r][col].onePossibility();
            if (value) {
              sumOfPossibilities += value;
              if (used.includes(value)) {
                this.squareComponents[r][col].dupPossibility = true;
              }
              used.push(value);
            } else {
              sumOfPossibilities = -1;
              break;
            }            
          } 
          this.squareComponents[row][col].sumDownError = 
            sumOfPossibilities > 0 && (number != sumOfPossibilities)
        }
        if (this.squareComponents[row][col].hasRight
          && this.squareComponents[row][col].sumRight) {
           var number = parseInt(this.squareComponents[row][col].sumRight);
           var sumOfPossibilities = 0;
           var used:number[] = [];
           for (let c = col + 1; c < 10 && !this.squareComponents[row][c].blocked; c++) {
             var value = this.squareComponents[row][c].onePossibility();
             if (value) {
               sumOfPossibilities += value;
               if (used.includes(value)) {
                 this.squareComponents[row][c].dupPossibility = true;
               }
               used.push(value);
             } else {
               sumOfPossibilities = -1;
               break;
             }            
           } 
           this.squareComponents[row][col].sumRightError = 
             sumOfPossibilities > 0 && (number != sumOfPossibilities)
         }
      }
    }        
  }

  computePossibilities() {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (this.squareComponents[row][col].hasDown
         && this.squareComponents[row][col].sumDown) {
          var digits = 0;
          var number = parseInt(this.squareComponents[row][col].sumDown);
          var used = [];
          for (let r = row + 1; r < 10 && !this.squareComponents[r][col].blocked; r++) {
            var onePossibility = this.squareComponents[r][col].onePossibility()
            if (onePossibility) {
              number -= onePossibility;
              used.push(onePossibility);
            } else {
              digits++;
            }
          }
          if (digits > 0) {
            var possibilities = this.computePossibility(number, digits, used);    
            for (let r = row + 1; r < 10 && !this.squareComponents[r][col].blocked; r++) {
              this.squareComponents[r][col].mergePossibilities(possibilities);
            }      
          } 
        }
        if (this.squareComponents[row][col].hasRight
          && this.squareComponents[row][col].sumRight) {
           var digits = 0;
           var number = parseInt(this.squareComponents[row][col].sumRight);
           var used = [];
           for (let c = col + 1; c < 10 && !this.squareComponents[row][c].blocked; c++) {
            var onePossibility = this.squareComponents[row][c].onePossibility()
            if (onePossibility) {
              number -= onePossibility;
              used.push(onePossibility);
            } else {
              digits++;
            }
           }
           if (digits > 0) {
            var possibilities = this.computePossibility(number, digits, used);    
            for (let c = col + 1; c < 10 && !this.squareComponents[row][c].blocked; c++) {
              this.squareComponents[row][c].mergePossibilities(possibilities);
            }  
          }     
         }
      }
    }
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

  clearPossibilities() {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (!this.squareComponents[row][col].blocked) {
          this.squareComponents[row][col].possibilities = [];  
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
        return false;
      } else if (keyCode == 8 || keyCode == 32) {
        this.selectedSquare.toggleBlocked();
        return false;
      } else if (keyCode == 27) {
        this.selectedSquare.possibilities = [];
      } else {
        var r = this.selectedSquare.row;
        var c = this.selectedSquare.col;
        if (keyCode == 37) {
          if (c > 0) {
            this.selectSquare(r, c - 1);
            return false;
          }
        } else if (keyCode == 38) {
          if (r > 0) {
            this.selectSquare(r - 1, c);
            return false;
          }
        } else if (keyCode == 39) {
          if (c < 9) {
            this.selectSquare(r, c + 1);
            return false;
          }
        } else if (keyCode == 40) {
          if (r < 9) {
            this.selectSquare(r + 1, c);
            return false;
          }
        }
      }      
    }
    return true;
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
