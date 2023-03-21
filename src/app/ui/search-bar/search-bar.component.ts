import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <input
      [(ngModel)]="searchValue"
      type="search"
      placeholder="имя персонажа"
    />
    <button type="button" (click)="onSearch()">Поиск</button>
    <p>{{ searchValue }}</p>
  `,
  styles: [
    '* {font-size: 1.25rem; margin: 1.25rem 0.25rem; padding: 1rem 0.5rem; border-radius: 0.25rem} button{cursor: pointer}',
  ],
})
export class SearchBarComponent {
  @Output() newSearch = new EventEmitter<string>();
  searchValue = '';

  onSearch() {
    this.newSearch.emit(this.searchValue);
    console.log('Search button pressed');
  }
}
