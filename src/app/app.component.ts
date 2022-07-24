import { Component, HostListener, AfterViewInit} from '@angular/core';

import { SquaresService } from './squares.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Kakuro';

  constructor(private squaresService:SquaresService) {  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    return this.squaresService.handleKey(event);
  } 

  ngAfterViewInit() {    
    this.squaresService.updateSums();
  }

  persist() {
    localStorage.setItem("puzzle", JSON.stringify(this.squaresService.persistable()))
  }

  restore() {
    var persisted = localStorage.getItem("puzzle");
    if (persisted) {
      this.squaresService.restore(JSON.parse(persisted));
    }
  }
}
