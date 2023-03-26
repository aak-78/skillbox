import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" #searchBar>
      <input
        [(ngModel)]="searchValue"
        type="search"
        placeholder="имя персонажа"
        name="searchInput"
        name="initialValue"
      />
      <button type="submit">Поиск</button>
    </form>
  `,
  styles: [
    '* {font-size: 1.25rem; margin: 1.25rem 0.25rem; padding: 1rem 0.5rem; border-radius: 0.25rem; cursor: pointer;} button{background: var(--body-accent); padding-inline: 1rem}',
  ],
})
export class SearchBarComponent {
  @Input() searchValue: string = '';
  @Output() newSearch = new EventEmitter<string>();

  onSubmit() {
    this.newSearch.emit(this.searchValue);
    console.log('Search button pressed');
  }
}
