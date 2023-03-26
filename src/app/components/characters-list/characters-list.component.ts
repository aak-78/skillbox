import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from '../../shared/cards.service';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { SearchBarComponent } from 'src/app/ui/search-bar/search-bar.component';
import { FetchErorrComponent } from '../../ui/fetch-error/fetch-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../ui/pagination/pagination.component';
import { Subscription } from 'rxjs';
import { CardInterface } from '../../shared/card.interface';

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
  cards: CardInterface[] = [];
  pages: number = 0;
  search: string = '';
  error: boolean = false;
  subs!: Subscription;

  constructor(
    private cService: CardsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //Блок подписок
    //1. На cards
    this.subs = this.cService.cardsOnCurrentPage$.subscribe(
      (value) => (this.cards = value)
    );
    //2. На поиск

    this.subs = this.cService.searchRequest$.subscribe(
      (value) => (this.search = value)
    );
    //3. На текущую страниц
    this.subs = this.cService.currentPage$.subscribe(
      (value) => (this.currentPage = value)
    );
    //4. На страниц всего
    this.subs = this.cService.pages$.subscribe((value) => (this.pages = value));
    //5. Ошибка загрузки данных
    this.subs = this.cService.fetchError$.subscribe(
      (value) => (this.error = value)
    );
  }

  onSearch(event: string) {
    // this.router.navigate(['/1'], {
    //   queryParams: { search: event },
    // });

    this.cService.onSearchButton(event);
  }
}
