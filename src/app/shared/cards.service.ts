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
  of,
  multicast,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService implements OnDestroy {
  //Точка входа в API
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';

  //Данные приватные
  //Персонажы полученные по API исходные
  //Все карточки
  private _cardsOriginal: CardInterface[] = [];
  //Офильтрованные по поиску
  private cardsFiltered: CardInterface[] = [];
  // Карты на текущей странице
  private _cardsonPage: CardInterface[] = [];

  //Страницы
  //Текущая
  private currentPage: number = 1;
  //Всего с учетом фильтрации - для пагинации
  private pages: number = 1;

  //Сервсиные переменные
  //Данные загружены
  private _dataFetched = false;
  //Карточек на странице
  private _cardsPerPage: number = 10;
  //Поисковый запрос
  private searchRequest: string = '';
  //ID карточки для детального просмотра
  private _detailCardId: number = 0;

  public id$ = new BehaviorSubject<number>(0)

  //Данные
  //Подписка для отписки
  private _subs!: Subscription;
  //Текущий запрос поиска
  public searchRequest$ = new BehaviorSubject<string>('');
  //Персонажы полученные по API и фильтруемые
  public cardsFiltered$ = new BehaviorSubject<CardInterface[]>([]);
  //Персонажи на текущей странице.
  public cardsOnCurrentPage$ = new BehaviorSubject<CardInterface[]>([]);
  //Ловим ошибку для отображения в шаблоне. Не стал делать спинеры в процессе загрузки, все достаточно быстро и плюс работаем в основном с локалстореджем, кроме картинок.
  public fetchError$ = new BehaviorSubject<boolean>(false);
  //Текущая страница - получаем из карт-лист
  public currentPage$ = new BehaviorSubject<number>(0);
  //Всего страниц
  public pages$ = new BehaviorSubject<number>(0);
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
  public card$ = new BehaviorSubject<CardInterface>(this.card);

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private http: HttpClient, private router: Router) {
    this.fetchError$.next(false);
  }

  // ------------------------------------------------------------------------------------------------------------------------

  resolverDetailCard(paramMap: ParamMap, queryParamMap: ParamMap) {
    //Получаем данные из URL
    const id = Number(paramMap.get('id'));
    //Очень веселая история - мы получаем Объект, он null. После его конвертации в STRING мы получаем строку "null" и фиг сравнишь с "" или null чистым, дает false!
    //С Number норм отрабатывает, а со стринг фигня получается
    // const search = String(queryParamMap.get('search'));
    const currentPage = Number(queryParamMap.get('page'))
      ? Number(queryParamMap.get('page'))
      : 1;
    this.searchRequest = queryParamMap.get('search')
      ? String(queryParamMap.get('search'))
      : '';

    if (!this._dataFetched) {
      // Данные не получены
      this._subs = this.fetchDataApi().subscribe((value) => {
        this._cardsOriginal = value;
        this.card$.next(this._cardsOriginal[id]);
      });
      this._dataFetched = true;
    }

    // this._dataFetched = true;
    
    this.currentPage$.next(currentPage);
    this.searchRequest$.next(this.searchRequest);
    this.id$.next(id)
    this.card$.next(this._cardsOriginal[id])
    console.log(this._cardsOriginal)
    return this._cardsOriginal;
  }

  resolverCardList(paramMap: ParamMap, queryParamMap: ParamMap) {
    //Получаем данные из URL
    const currentPage = Number(paramMap.get('p'));
    //Очень веселая история - мы получаем Объект, он null. После его конвертации в STRING мы получаем строку "null" и фиг сравнишь с "" или null чистым, дает false!
    //С Number норм отрабатывает, а со стринг фигня получается
    // const search = String(queryParamMap.get('search'));
    this.searchRequest = queryParamMap.get('search')
      ? String(queryParamMap.get('search'))
      : '';
    const id = Number(paramMap.get('id'));
    const search = this.searchRequest;

    if (!currentPage) {
      //Нет текущей страницы или она была введена некоретно
      if (search) {
        //Если поле поиска не пусто - то
        this.currentPage = 1;
        this.router.navigate(['/1'], { queryParams: { search: search } });
      } else {
        //Поле поиска пусто
        this.currentPage = 1;
        this.router.navigate(['/1']);
      }
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
      const newFilteredCards = search
        ? this.filterCardsBuSearch(search, this._cardsOriginal)
        : this._cardsOriginal;
      this.cardsFiltered$.next(newFilteredCards);
      this.cardsOnCurrentPage$.next(
        this.filterCardsByCurentPage(newFilteredCards, currentPage)
      );
      this.pages$.next(this.getTotalPages(newFilteredCards));

      this.cardsOnCurrentPage$.next(
        this.filterCardsByCurentPage(this.cardsFiltered$.value, currentPage)
      );
    } else {
      // Данные не получены
      this._subs = this.fetchDataApi()
        .pipe(
          map((value) => {
            this._cardsOriginal = value;
            if (search) {
              return this.filterCardsBuSearch(search, value);
            }
            return value;
          })
        )
        .subscribe((value) => {
          this.cardsFiltered$.next(value);
          this.cardsOnCurrentPage$.next(
            this.filterCardsByCurentPage(value, currentPage)
          );
          this.pages$.next(this.getTotalPages(value));
          // this.pages$.next(this.getTotalPages(value));
        });
      this._dataFetched = true;
    }

    // this._dataFetched = true;
    this.currentPage$.next(currentPage);
    this.searchRequest$.next(search);
    return this.cardsFiltered$;
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

  //Считаем сколько страниц с учетом фильтрации
  getTotalPages(
    cards: CardInterface[] = this.cardsFiltered$.value,
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

  onSearchButton(searchRequest: string) {
    let data;
    data = this.filterCardsBuSearch(searchRequest);

    this.searchRequest$.next(searchRequest);
    this.cardsFiltered$.next(data);
    this.cardsOnCurrentPage$.next(this.filterCardsByCurentPage(data, 1));
    this.pages$.next(this.getTotalPages(data));
    this.currentPage$.next(1);

    if (searchRequest) {
      this.router.navigate(['/1'], {
        queryParams: { search: searchRequest },
      });
    } else {
      this.router.navigate(['/1']);
    }
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
