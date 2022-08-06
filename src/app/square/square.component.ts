import { formatPercent } from '@angular/common';
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

  public possibilities: boolean[] = [];
  public selected: boolean = false;
  public blocked: boolean = false;
  
  public hasRight: boolean = false;
  public hasDown: boolean = false;

  public sumDownError: boolean = false;
  public sumRightError: boolean = false;

  public dupPossibility = false;

  public sumRight: string = "";

  public sumDown: string = "";

  constructor(private squaresService:SquaresService) { 
    this.row = 0;
    this.col = 0;
  }
 
  displayPossibility(value: number) {
    return this.possibilities ? this.possibilities[value] ? value : "" : "";
  }

  onePossibility():number | undefined {
    if (!this.blocked) {
      var foundOne = undefined;
      for (let i = 1; i < 10; i++) {
        if (this.possibilities && this.possibilities[i]) {
          if (!foundOne) {
            foundOne = i;
          } else {
            return undefined;
          }
        }
      }
    }
    return foundOne; 
  } 

  select() {
    this.squaresService.selectSquare(this.row, this.col);
  }

  deselect() {
    this.selected = false;
  }

  togglePossibility(keyCode: number) {
    if (!this.blocked) {
      this.possibilities[keyCode] = this.possibilities[keyCode] ? !this.possibilities[keyCode] : true;
    }
  }

  toggleBlocked() {
    this.blocked = !this.blocked; 
    if (this.blocked) {
      this.possibilities = [];
    } else {
      this.hasRight = false;
      this.hasDown = false;
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
    if (!state.blocked) {
      this.hasRight = false;
      this.hasDown = false;
    }
    this.sumRight = state.sumRight;
    this.sumDown = state.sumDown;
    this.possibilities = state.possibilities || new Set<number>()
  }

  mergePossibilities(possibilities:number[]) {
    if (!this.onePossibility()) {
      for (let i = 1; i < 10; i++) {
        if (this.possibilities[i] == undefined) {
          this.possibilities[i] = possibilities.includes(i);
        } else {
          this.possibilities[i] &&= possibilities.includes(i);
        }
      }   
    }
  }

  ngOnInit(): void {
    this.squaresService.registerSquare(this);
  }
}
