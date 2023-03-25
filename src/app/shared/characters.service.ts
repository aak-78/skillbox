import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { CardInterface } from './card.interface';
import { ParamMap, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  retry,
  throwError,
  Subscription,
  map,
  combineLatest,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService implements OnDestroy {
  //Точка входа в API
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';

  //Данные
  //Персонажы полученные по API исходные
  private _cardsOriginal: CardInterface[] = [];
  //Карточек на странице
  private _cardsPerPage: number = 10;
  //Данные загружены
  private _dataFetched = false;
  //Подписка для отписки
  private _subs!: Subscription;
  //Текущий запрос поиска
  private _searchRequest = new BehaviorSubject<string>('');
  public searchRequest$ = this._searchRequest.asObservable();
  //Персонажы полученные по API и фильтруемые
  private _cardsFiltered = new BehaviorSubject<CardInterface[]>([]);
  public cardsFiltered$ = this._cardsFiltered.asObservable();
  //Персонажи на текущей странице.
  private _cardsOnCurrentPage = new BehaviorSubject<CardInterface[]>([]);
  public cardsOnCurrentPage$ = this._cardsOnCurrentPage.asObservable();
  observableWithValue = of(null).pipe(
    map(() => this._cardsOnCurrentPage.value)
  );
  //Ловим ошибку для отображения в шаблоне. Не стал делать спинеры в процессе загрузки, все достаточно быстро и плюс работаем в основном с локалстореджем, кроме картинок.
  public fetchError$ = new BehaviorSubject<boolean>(false);
  //Текущая страница - получаем из карт-лист
  private _currentPage = new BehaviorSubject<number>(0);
  public currentPage$ = this._currentPage.asObservable();
  //Всего страниц
  private _pages = new BehaviorSubject<number>(0);
  public pages$ = this._pages.asObservable();
  //ID карточки
  card: CardInterface = {
    id: 0,
    name: '',
    height: 0,
    mass: 0,
    gender: '',
    homeworld: '',
    wiki: '',
    image: '',
    born: 0,
    bornLocation: '',
    died: 0,
    diedLocation: '',
    species: '',
    hairColor: '',
    eyeColor: '',
    skinColor: '',
    cybernetics: '',
    affiliations: [],
    masters: [],
    apprentices: [],
    formerAffiliations: [],
  };
  private _card = new BehaviorSubject<CardInterface>(this.card);
  public card$ = this._card.asObservable();

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private http: HttpClient, private router: Router) {
    this.fetchError$.next(false);
  }

  // ------------------------------------------------------------------------------------------------------------------------
  resolver(paramMap: ParamMap, queryParamMap: ParamMap) {
    //Получаем данные из URL
    const currentPage = Number(paramMap.get('p'));
    const search = String(queryParamMap.get('search'));
    const id = Number(paramMap.get('id'));

    if (!currentPage) {
      //Нет текущей страницы или она была введена некоретно
      this.router.navigate(['/1'], { queryParams: { search: search } });
    }

    // if (!id) {
    //   this.router.navigate([
    //     '/1'],
    //     { replaceUrl: true, queryParams: { search: search ? search : null } },
    //   );
    // }

    //Проверка есть ли данные - страница была только что загружена или уже есть данные
    if (this._dataFetched) {
      //Данные получены
      this.getCardsOnCurrentPage(search, currentPage, this._cardsOriginal);
    } else {
      // Данные не получены
      this._subs = this.fetchDataApi().subscribe((value) => {
        this.getCardsOnCurrentPage(search, currentPage, value);
        this._cardsFiltered.next(value);
        this._cardsOriginal = value;
        // this._pages.next(this.getTotalPages(value));
      });
      this._dataFetched = true;
    }

    this._dataFetched = true;
    this._currentPage.next(currentPage);
    this._searchRequest.next(search);
    return this._cardsFiltered;
  }
  // ------------------------------------------------------------------------------------------------------------------------

  //Все грузим с нуля
  fetchDataApi() {
    return this.http.get<CardInterface[]>(this.baseUrl + this.routeAll).pipe(
      retry(5),
      catchError((err) => {
        this.fetchError$.next(true);
        return this.handleError(err);
      }),
      // Перестраиваем ID что бы было по порядку 100%
      map((v) => {
        v.map((v, i) => {
          v.id = i;
          return v;
        });
        return v;
      })
    );
    // catchError(this.handleError)) - В таком варианте не работает пространство имен в хендлере - хендлер не видит переменные и Объекты из Класса.
  }

  //Метод получения карточек на текущую страницу. Фильтрует по поиску и текущей странице
  getCardsOnCurrentPage(
    searchRequest: string = this._searchRequest.value,
    currentPage: number = this._currentPage.value,
    cards: CardInterface[] = this._cardsOriginal,
    cardsPerPage: number = this._cardsPerPage
  ) {
    let filteredCards;
    let pages;
    let cardsOnPag;
    if (!searchRequest) {
      filteredCards = this.filterCardsBuSearch(searchRequest, cards);
    } else {
      filteredCards = cards;
    }

    pages = this.getTotalPages(cards, cardsPerPage);
    cardsOnPag = this.filterCardsByCurentPage(
      filteredCards,
      currentPage,
      cardsPerPage
    );

    this._cardsFiltered.next(filteredCards);
    this._pages.next(pages);
    this._cardsOnCurrentPage.next(cardsOnPag);
  }

  //Считаем сколько страниц с учетом фильтрации
  getTotalPages(
    cards: CardInterface[] = this._cardsFiltered.value,
    cardsOnPage: number = this._cardsPerPage
  ) {
    return Math.ceil(cards.length / cardsOnPage);
  }

  //Фильтруем данные по поиску
  filterCardsBuSearch(
    searchRequest: string,
    cards: CardInterface[] = this._cardsOriginal
  ): CardInterface[] {
    const search = new RegExp(searchRequest.toLocaleLowerCase());
    return cards.filter((cards) => {
      return search.test(cards.name.toLocaleLowerCase());
    });
  }

  // Фильтруем данные по текущей странице
  filterCardsByCurentPage(
    cards: CardInterface[],
    currentPage: number,
    cardsOnPage: number = 10
  ): CardInterface[] {
    return cards.slice(
      currentPage * cardsOnPage - 10,
      currentPage * cardsOnPage + cardsOnPage - 10
    );
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  onSearchButton(_searchRequest: string) {
    this._searchRequest.next(_searchRequest);
    let data;

    data = this.filterCardsBuSearch(_searchRequest);
    this._cardsFiltered.next(data);
    this.getCardsOnCurrentPage(_searchRequest, 1);

    // this._cardsFiltered.next(this.getCardsOnCurrentPage(_searchRequest))
    this.router.navigate(['/1'], {
      queryParams: { search: this._searchRequest.value },
    });
  }

  //Данные песонажа в личную детальную карточку
  getCharacterDetail() {}

  //Ловим ошибки по API обычный хендлер плюс ставим ошибку в ФетчЭррор
  private handleError(error: HttpErrorResponse) {
    console.log('ERROR');
    this.fetchError$.next(true);

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
// ------------------------------------------------------------------------------------------------------------------------
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
