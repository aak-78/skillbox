import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../shared/characters.service';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { SearchBarComponent } from 'src/app/ui/search-bar/search-bar.component';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent, SearchBarComponent],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit {
  constructor(public cService: CharactersService) {}

  ngOnInit(): void {
    this.cService.getAllCharacters();
    console.log(this.cService.filteredCharacters$);
  }

  onSearch(event: string) {
    this.cService.searchCharacter(event);
    console.log('Get event in list: ', event);
  }
}
