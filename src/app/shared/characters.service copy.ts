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
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService implements OnDestroy {
  //Точка входа в API
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';

  //Персонажы полученные по API исходные
  cardsOriginal: CardInterface[] = [];
  //Карточек на странице
  cardsPerPage: number = 10;
  //Данные загружены
  dataFetched = false;
  //Текущий запрос поиска
  searchRequest: string = '';
  //Подписка для отписки
  subs!: Subscription;

  //Персонажы полученные по API и фильтруемые
  cards$ = new BehaviorSubject<CardInterface[]>([]);
  //Персонажи на текущей странице.
  cardsOnCurrentPage$ = new BehaviorSubject<CardInterface[]>([]);
  //Ловим ошибку для отображения в шаблоне. Не стал делать спинеры в процессе загрузки, все достаточно быстро и плюс работаем в основном с локалстореджем, кроме картинок.
  fetchError$ = new BehaviorSubject<boolean>(false);
  //Текущая страница - получаем из карт-лист
  currentPage$ = new BehaviorSubject<number>(0);
  //Всего страниц
  pages$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private router: Router) {
    this.fetchError$.next(false);
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  resolveCardDetail(id: number) {
    if (!this.dataFetched) {
      //Данных нет
      this.subs = this.fetchDataApi().subscribe((value) => {});
    } else {
      //Данные есть
    }

    return id ? true : false;
  }

  //Ресолвер - старт страницы тут
  resolveCardsList(paramMap: ParamMap, queryParamMap: ParamMap) {
    this.fetchError$.next(false);

    // let newCharacters: CardInterface[];
    // let newCurrentPage: number;
    // let newSearchRequest: string;

    const currentPage = Number(paramMap.get('p'));
    const search = (this.searchRequest = String(queryParamMap.get('search')));
    console.log(Number(currentPage), currentPage ? true : false);
    console.log(String(search));

    //Блок загрузки данные и вычисления значений для страницы с карточками card-lists

    //Получаем текущую страницу и устанавливаем
    // currentPage
    //   ? this.currentPage$.next(currentPage)
    //   : this.currentPage$.next(1);

    //---------------Проверяем загружены ли данные
    if (!this.dataFetched) {
      // Если данные не загружены - получем полный список персонажей
      this.subs = this.fetchDataApi().subscribe((value) => {
        this.cards$.next(value);
        this.cardsOriginal = value;
        this.pages$.next(this.getTotalPages(value));

        if (currentPage && currentPage <= this.getTotalPages(value)) {
          this.currentPage$.next(currentPage);
          this.cardsOnCurrentPage$.next(
            this.getCardsOnCurrentPage('', currentPage, value)
          );
        } else {
          this.currentPage$.next(1);
          this.cardsOnCurrentPage$.next(this.getCardsOnCurrentPage());
        }
      });

      this.dataFetched = true;
    } // ----------------

    //Блок вычислений если данные загружены
    else {
      currentPage && currentPage <= this.pages$.value
        ? this.currentPage$.next(currentPage)
        : this.currentPage$.next(1);

      const data = this.getTotalPages();
      this.pages$.next(data);
      this.cardsOnCurrentPage$.next(this.getCardsOnCurrentPage());
      this.getTotalPages();
    }
    // ---
    //---------------Проверяем загружены ли данные ---- конец

    //Log section
    // console.log('currentPage: ', this.currentPage$.value);
    // console.log('searchRequest: ', this.searchRequest);
    // console.log('cardsOriginal: ', this.cardsOriginal.length);
    // console.log('cardsFiltered: ', this.cards$.value.length);
    // console.log('cardsOnCurrentPage: ', this.cardsOnCurrentPage$.value.length);
    // console.log('totalPages: ', this.pages$.value);
    // console.log(
    //   'charactersFetched at Resolve start ',
    //   this.cards$.value
    // );

    this.saveLocalStorage();
    return this.cardsOnCurrentPage$;
  }

  onSearchButton(searchRequest: string) {
    this.searchRequest = searchRequest;
    let data;
    // if (searchRequest !== '') {
    //   //Если есть значение поиска
    //   // - фильтруем Оригинал массив
    //   this.cards$.next(
    //     this.filterCardsBuSearch(searchRequest, this.cardsOriginal)
    //   );
    //   this.cardsOnCurrentPage$.next()
    //   // - нужна ли переадресация??? посмотреть
    //   //
    // } else {
    //   //Если значение поиска отсутствует - обнулили поиск
    //   // - присвоить charactersFetched исходный массив Ориджинал
    //   this.cards$.next(this.cardsOriginal)
    //   // - переадресация?
    //   //
    //   //
    //   //
    //   //
    // }
    data = this.filterCardsBuSearch(searchRequest);
    this.cards$.next(data);
    this.getCardsOnCurrentPage(searchRequest, 1);

    // this.cards$.next(this.getCardsOnCurrentPage(searchRequest))
    this.router.navigate(['/1'], {
      queryParams: { search: this.searchRequest },
    });
  }

  //Все грузим с нуля
  fetchDataApi() {
    return this.http.get<CardInterface[]>(this.baseUrl + this.routeAll).pipe(
      retry(5),
      catchError((err) => {
        this.fetchError$.next(true);
        return this.handleError(err);
      }),
      // Перестраиваем ID что бы было по порядку 100%
      map((v, i) => {
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
    searchRequest: string = this.searchRequest,
    currentPage: number = this.currentPage$.value,
    characters: CardInterface[] = this.cardsOriginal,
    cardsOnPage: number = this.cardsPerPage
  ) {
    if (searchRequest !== '') {
      this.pages$.next(this.getTotalPages());
      return this.filterCardsByCurentPage(
        characters,
        currentPage - 1,
        cardsOnPage
      );
      return this.filterCardsByCurentPage(
        this.filterCardsBuSearch(searchRequest, characters),
        currentPage - 1,
        cardsOnPage
      );
    } else {
      this.pages$.next(this.getTotalPages());
      return this.filterCardsByCurentPage(
        characters,
        currentPage - 1,
        cardsOnPage
      );
    }
  }

  //Считаем сколько страниц с учетом фильтрации
  getTotalPages(
    characters: CardInterface[] = this.cards$.value,
    cardsOnPage: number = this.cardsPerPage
  ) {
    return Math.ceil(characters.length / cardsOnPage);
  }

  //Фильтруем данные по поиску
  filterCardsBuSearch(
    searchRequest: string,
    characters: CardInterface[] = this.cardsOriginal
  ): CardInterface[] {
    const search = new RegExp(searchRequest.toLocaleLowerCase());
    return characters.filter((character) => {
      return search.test(character.name.toLocaleLowerCase());
    });
  }

  // Фильтруем данные по текущей странице
  filterCardsByCurentPage(
    characters: CardInterface[],
    currentPage: number = 1,
    cardsOnPage: number = 10
  ): CardInterface[] {
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
    // characters: CardInterface[] = this.charactersFetched$.value,
    // currentPage: number = this.currentPage$.value,
    searchRequest: string = this.searchRequest
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
