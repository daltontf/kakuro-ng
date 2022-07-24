import { Component, OnInit, Input, BootstrapOptions } from '@angular/core';

import { SquaresService } from '../squares.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input() public row: number;
  @Input() public col: number;

  public possibilities: Array<boolean> = this.emptyPossibilities();
  public selected: boolean = false;
  public blocked: boolean = false;
  
  public hasRight: boolean = false;
  public hasDown: boolean = false;

  public sumRight: string = "";

  public sumDown: string = "";

  constructor(private squaresService:SquaresService) { 
    this.row = 0;
    this.col = 0;
  }

  emptyPossibilities():Array<boolean> {
    return [false, false, false, false, false, false, false, false, false, false];
  }

  displayPossibility(value: number) {
    return this.possibilities[value] ? value : "";
  }

  onlyOnePossibility() {
    if (!this.blocked) {
      var foundOne = false;
      for (let i = 0; i < 10; i++) {
        if (this.possibilities[i]) {
          if (foundOne) {
            return false;
          }
          foundOne = true;
        }
      }
      return foundOne;
    }
    return false; 
  } 

  select() {
    this.squaresService.selectSquare(this.row, this.col);
  }

  deselect() {
    this.selected = false;
  }

  togglePossibility(keyCode: number) {
    if (!this.blocked) {
      this.possibilities[keyCode] = !this.possibilities[keyCode];
    }
  }

  toggleBlocked() {
    this.blocked = !this.blocked; 
    if (this.blocked) {
      this.possibilities = [];
    } else {
      this.hasRight = false;
      this.hasDown = false;
      this.possibilities = this.emptyPossibilities();
    }  
    this.squaresService.updateSums();
  }

  persistable() {
    return {
      blocked: this.blocked,
      sumRight: this.sumRight,
      sumDown: this.sumDown,
      possibilities: this.possibilities
    }
  }

  restore(state:any) {
    this.blocked = state.blocked;
    this.sumRight = state.sumRight;
    this.sumDown = state.sumDown;
    this.possibilities = state.possibilities || new Set<number>()
  }

  ngOnInit(): void {
    this.squaresService.registerSquare(this);
  }
}
