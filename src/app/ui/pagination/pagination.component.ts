import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../shared/characters.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  cardsPerPage = 10;

  constructor(private cService: CharactersService) {
    const cardsTotal = cService.filteredCharacters$.getValue().length;
  }

  

}
