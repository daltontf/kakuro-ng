import { Component, HostListener, AfterViewInit} from '@angular/core';

import { SquaresService } from './squares.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Kakuro';

  puzzleNames: string[] = [];

  currentPuzzleName: string = "";

  constructor(public squaresService:SquaresService) {  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    return this.squaresService.handleKey(event);
  } 

  ngAfterViewInit() {    
    this.squaresService.updateSums();   
    this.puzzleNames = JSON.parse(localStorage.getItem("puzzleNames") ?? "[]");
  }

  persist() {
    if (confirm("Save '" + this.currentPuzzleName + "' ?")) {
      if (!this.puzzleNames.includes(this.currentPuzzleName)) {
        this.puzzleNames.push(this.currentPuzzleName);
      }
      localStorage.setItem("puzzleNames",  JSON.stringify(this.puzzleNames));
      localStorage.setItem(this.currentPuzzleName, JSON.stringify(this.squaresService.persistable()));
    }
  }

  restore() {
    var persisted = localStorage.getItem(this.currentPuzzleName);
    if (persisted) {
      this.squaresService.restore(JSON.parse(persisted));
    }
  }
}
