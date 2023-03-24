import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../shared/characters.service';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { SearchBarComponent } from 'src/app/ui/search-bar/search-bar.component';
import { FetchErorrComponent } from '../../ui/fetch-error/fetch-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../ui/pagination/pagination.component';
import { map, BehaviorSubject, Subscription } from 'rxjs';
import { CssSelector } from '@angular/compiler';
import { CharacterInterface } from '../../shared/character.interface';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    CommonModule,
    CharacterCardComponent,
    SearchBarComponent,
    FetchErorrComponent,
    PaginationComponent,
  ],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit {
  // cardsTotal$ = new BehaviorSubject<number>(0);
  // cardsOnPage: number = 10;
  currentPage: number = 1;
  characters: CharacterInterface[] = [];
  pages: number = 0;
  // totalPages$ = new BehaviorSubject<number>(0);
  subs!: Subscription;

  constructor(
    public cService: CharactersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.cService.getAllCharacters();
    // console.log(this.cService.filteredCharacters$);
    console.log('Character-lists STARTED!: ');
    // this.subs = this.route.params.subscribe((params) =>
    //   this.cService.onChangePage(Number(params['p']))
    // );

    // С снапшотом не перегружается страница при нажатии на routerLink. Надо брать Обсерваблс
    // const page = Number(this.route.snapshot.params['p']);
    console.log('characters', this.cService.characters$.value);

    this.cService.pages$.subscribe((v) => console.log('pages', v));
    this.cService.currentPage$.subscribe((v) => console.log('currentPage', v));

    this.subs = this.cService.characters$.subscribe((value) => {
      this.characters = value;
      console.log(value);
    });
    // this.subs = this.cService.currentPage$.subscribe(value => this.currentPage = value)
    // this.subs = this.cService.pages$.subscribe(value => this.pages = value)
  }

  onSearch(event: string) {
    this.cService.onSearchButton(event);
    console.log('Search button: ', event);
  }
}
