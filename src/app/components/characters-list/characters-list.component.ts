import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../shared/characters.service';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { SearchBarComponent } from 'src/app/ui/search-bar/search-bar.component';
import { FetchErorrComponent } from '../../ui/fetch-error/fetch-error.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
    SearchBarComponent,
    FetchErorrComponent,
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit {
  idStart: number = 0;
  idEnd: number = 9;

  constructor(
    public cService: CharactersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.cService.getAllCharacters();
    console.log(this.cService.filteredCharacters$);
    this.idStart;
  }

  onSearch(event: string) {
    this.cService.searchCharacter(event);
    console.log('Get event in list: ', event);
  }
}
