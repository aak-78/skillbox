import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { CharacterInterface } from './character.interface';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  retry,
  throwError,
  Subscription,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService implements OnDestroy {
  //Точка входа в API
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';

  //Персонажы полученные с ЛокалСтердж или по API
  charactersFetched$ = new BehaviorSubject<CharacterInterface[]>([]);
  //Персонажи на текущей странице.
  characters$ = new BehaviorSubject<CharacterInterface[]>([]);
  //Ловим ошибку для отображения в шаблоне. Не стал делать спинеры в процессе загрузки, все достаточно быстро и плюс работаем в основном с локалстореджем, кроме картинок.
  fetchError$ = new BehaviorSubject<boolean>(false);
  //Карточек на странице
  cardsOnPage$ = new BehaviorSubject<number>(10);
  //Текущая страница - получаем из карт-лист
  currentPage$ = new BehaviorSubject<number>(0);
  //Текущий запрос поиска
  searchRequest$ = new BehaviorSubject<string>('');
  //Данные загружены
  dataFetched = false;
  //Всего страниц
  pages$ = new BehaviorSubject<number>(0);
  //Подписка для отписки
  subs!: Subscription;

  constructor(private http: HttpClient, private router: Router) {
    console.log('Service Constructor started');
    this.fetchError$.next(false);
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  //Ресолвер - старт страницы тут
  resolveData(currentPage: number | null) {
    this.fetchError$.next(false);

    let newCharacters: CharacterInterface[];
    let newCurrentPage: number;
    let newSearchRequest: string;

    console.log('Resolver service started - new');
    console.log('------------------------------');
    console.log('------------------------------');
    console.log('dataFetched: ', this.dataFetched);

    // currentPage ? console.log('true', currentPage)
    //   : console.log('false', currentPage);

    //Получаем текущую страницу и устанавливаем -ПРОВЕРКА?
    currentPage
      ? this.currentPage$.next(Number(currentPage))
      : this.currentPage$.next(Number(1));

    console.log(
      'charactersFetched at Resolve start ',
      this.charactersFetched$.value
    );
    console.log('characters at Resolve start ', this.characters$.value);

    if (!this.dataFetched) {
      //Получем полный список персонажей
      console.log('start fetch data');
      // newCharacters = this.fetchLocalStorage('characters', 'object');
      // console.log('newCharacters from LS', newCharacters);

      this.subs = this.fetchDataApi().subscribe((value) => {
        this.charactersFetched$.next(value);
        this.pages$.next(this.getTotalPages(value));
        this.characters$.next(this.getCardsOnCurrentPage(value));
      });

      // if (newCharacters.length) {
      //   this.charactersFetched$.next(newCharacters);
      //   this.characters$.next(newCharacters);
      //   this.pages$.next(this.getTotalPages(newCharacters));
      // } else {

      // }

      this.dataFetched = true;
    }

    // newCurrentPage = this.fetchLocalStorage('currentPage', 'number');
    // if (newCurrentPage) {
    //   this.currentPage$.next(newCurrentPage);
    // } else {
    //   this.currentPage$.next(1);
    // }

    // newSearchRequest = this.fetchLocalStorage('searchRequest', 'string');
    // if (newSearchRequest) {
    //   this.searchRequest$.next(newSearchRequest);
    // } else {
    //   this.searchRequest$.next('');
    // }

    console.log('currentPAge ', this.currentPage$.value);
    console.log('characters ', this.characters$.value.length);
    console.log(
      'charactersFethet.lenght ',
      this.charactersFetched$.value.length
    );

    if (this.characters$.value.length == 0) {
      this.subs = this.charactersFetched$.subscribe((value) =>
        this.characters$.next(this.getCardsOnCurrentPage(value))
      );
    }

    this.currentPage$.subscribe((value) =>
      this.getCardsOnCurrentPage(
        this.characters$.value,
        this.searchRequest$.value,
        value
      )
    );
    this.searchRequest$.subscribe((value) =>
      this.calculateDataForCardListComponent()
    );
    this.saveLocalStorage();
    console.log('dataFetched at the end of Resolver', this.dataFetched);
    return this.characters$;
  }

  onSearchButton(searchRequest: string) {}

  onChangePage(pageNumber: number) {
    console.log('OnChagePage ', pageNumber);
    this.currentPage$.next(pageNumber);
    this.subs = this.currentPage$.subscribe((value) =>
      this.getCardsOnCurrentPage()
    );
    // const subs =  this.currentPage$.subscribe(value => this.getCardsOnCurrentPage(this.characters$.value,this.searchRequest$.value,pageNumber, 10))
  }

  //Обновление информации на странице - цент пересчета всего
  calculateDataForCardListComponent(
    searchRequest: string = this.searchRequest$.value,
    currentPage: number = this.currentPage$.value,
    cardsOnPage: number = this.cardsOnPage$.value
  ) {
    const totalPages = this.getTotalPages(
      this.characters$.value,
      this.cardsOnPage$.value
    );
    //1 Фильтруем по поиску
    //2 Получаем число страниц после фильтрации по поиску
    //3 Карточки на текущую страницу. Проверить - текущая страница ок или нет???
  }

  //Метод отработки кнопки поиска

  //Все грузим с нуля
  fetchDataApi() {
    return this.http
      .get<CharacterInterface[]>(this.baseUrl + this.routeAll)
      .pipe(
        retry(5),
        catchError((err) => {
          this.fetchError$.next(true);
          return this.handleError(err);
        })
      );
    // catchError(this.handleError)) - В таком варианте не работает пространство имен в хендлере - хендлер не видит переменные и Объекты из Класса.
  }

  //Метод получения карточек на текущую страницу. Фильтрует по поиску и текущей странице
  getCardsOnCurrentPage(
    characters: CharacterInterface[] = this.charactersFetched$.value,
    searchRequest: string = this.searchRequest$.value,
    currentPage: number = this.currentPage$.value,
    cardsOnPage: number = this.cardsOnPage$.value
  ) {
    if (searchRequest !== '') {
      this.pages$.next(this.getTotalPages(characters));
      return this.filterCardsByCurentPage(
        this.filterCardsBuSearch(characters, searchRequest),
        currentPage,
        cardsOnPage
      );
    } else {
      this.pages$.next(this.getTotalPages(characters));
      this.getTotalPages();
      return this.filterCardsByCurentPage(characters, currentPage, cardsOnPage);
    }
  }

  //Считаем сколько страниц с учетом фильтрации
  getTotalPages(
    characters: CharacterInterface[] = this.characters$.value,
    cardsOnPage: number = this.cardsOnPage$.value
  ) {
    return Math.ceil(characters.length / cardsOnPage);
  }

  //Фильтруем данные по поиску
  filterCardsBuSearch(
    characters: CharacterInterface[],
    searchRequest: string
  ): CharacterInterface[] {
    const search = new RegExp(searchRequest.toLocaleLowerCase());
    return characters.filter((character) => {
      return search.test(character.name.toLocaleLowerCase());
    });
  }

  // Фильтруем данные по текущей странице
  filterCardsByCurentPage(
    characters: CharacterInterface[],
    currentPage: number = 1,
    cardsOnPage: number = 10
  ): CharacterInterface[] {
    return characters.slice(
      currentPage * cardsOnPage,
      currentPage * cardsOnPage + cardsOnPage
    );
  }

  //Данные песонажа в личную детальную карточку
  getCharacterDetail() {}

  //Получаем всех персонажей из ЛокалСторедж, если ничего нет - возвращаем явно false
  fetchLocalStorage(param: string, type: string) {
    const data = localStorage.getItem(param);
    if (data) {
      if (type == 'object') {
        return JSON.parse(data);
      }
      if (type == 'number') {
        return Number(data);
      }
      return data;
    }
    return false;
  }

  //Сохраняем всех персонажей в ЛокалСторедж
  saveLocalStorage(
    // characters: CharacterInterface[] = this.charactersFetched$.value,
    // currentPage: number = this.currentPage$.value,
    searchRequest: string = this.searchRequest$.value
  ) {
    // localStorage.setItem('characters', JSON.stringify(characters));
    // localStorage.setItem('currentPage', String(currentPage));
    localStorage.setItem('searchRequest', searchRequest);
  }

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
