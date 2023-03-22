import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../shared/characters.service';
import { CharacterCardComponent } from '../../ui/character-card/character-card.component';
import { SearchBarComponent } from 'src/app/ui/search-bar/search-bar.component';
import { FetchErorrComponent } from '../../ui/fetch-error/fetch-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../ui/pagination/pagination.component';
import { map, BehaviorSubject, Subscription } from 'rxjs';

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
  // totalPages$ = new BehaviorSubject<number>(0);
  subs!: Subscription;

  constructor(
    public cService: CharactersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // this.cService.getAllCharacters();
    // console.log(this.cService.filteredCharacters$);
    this.subs = this.route.params.subscribe(params =>
    {
      
      this.currentPage = Number(params['p'])
    
    // С снапшотом не перегружается страница при нажатии на routerLink. Надо брать Обсерваблс
    // const page = Number(this.route.snapshot.params['p']);

    if (this.currentPage > 1 && this.currentPage <= this.cService.totalPages$.value) {
      console.log('P > 1');
    } else {
      console.log('P = 1');
      this.currentPage = 1;
      this.router.navigate(['/list/1'])
    }
    })
  }

  onSearch(event: string) {
    this.cService.searchCharacter(event);
    console.log('Get event in list: ', event);
  }
}
