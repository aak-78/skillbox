import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { CharacterInterface } from './character.interface';
import {
  BehaviorSubject,
  catchError,
  retry,
  throwError,
  map,
  Subject,
  Subscription,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService implements OnDestroy {
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';

  //Персонажы полученные с ЛокалСтердж или по API
  charactersFetched$ = new BehaviorSubject<CharacterInterface[]>([]);

  //Персонажи для рендеринга после фильтрации. Позволяет при сбросе фильтрации снова показать всех персонажей.
  filteredCharacters$ = new BehaviorSubject<CharacterInterface[]>([]);

  //Ловим ошибку для отображения в шаблоне. Не стал делать спинеры в процессе загрузки, все достаточно быстро и плюс работаем в основном с локалстореджем, кроме картинок.
  fetchError$ = new BehaviorSubject<boolean>(false);
  cardsOnPage = 10;
  totalCards = 0;
  totalPages$ = new BehaviorSubject<number>(0);
  subs: Subscription;

  constructor(private http: HttpClient) {
    this.fetchError$.next(false);
    this.subs = this.filteredCharacters$.subscribe((value) =>
      this.totalPages$.next(Math.ceil(value.length / this.cardsOnPage))
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Функция для получения данных. Изначально проверяет ЛокалСторедж, если пусто лезет в API
  // При получении данных через API сохраняем в ЛокалСторедж
  getAllCharacters() {
    const localStorageData = this.fetchCharactersLocal();
    this.fetchError$.next(false);
    if (localStorageData) {
      this.charactersFetched$.next(localStorageData);
      this.filteredCharacters$.next(localStorageData);
    } else {
      const req = this.http
        .get<CharacterInterface[]>(this.baseUrl + this.routeAll)
        .pipe(
          retry(5),
          catchError((err) => {
            return this.handleError(err);
          })
        )
        // catchError(this.handleError)) - В таком варианте не работает пространство имен в хендлере - хендлер не видит переменные и Объекты из Класса.
        .subscribe((data) => {
          this.charactersFetched$.next(data);
          this.filteredCharacters$.next(data);
          this.saveCharactersLocal(data);
        });
    }
    return this.charactersFetched$;
  }

  //Сохраняем всех персонажей в ЛокалСторедж
  saveCharactersLocal(value: CharacterInterface[]) {
    localStorage.setItem('characters', JSON.stringify(value));
  }

  //Получаем всех персонажей из ЛокалСторедж, если ничего нет - возвращаем явно false
  fetchCharactersLocal() {
    const charLocal = localStorage.getItem('characters');
    if (charLocal) {
      return JSON.parse(charLocal);
    }
    return false;
  }

  //Функция поиска по базе персонажей по введенной строке. Поиск идет по каждому слову и по части слова. Плюс перед проверкой все приводится к ЛоверКейс для более качественного поиска.
  searchCharacter(data: string) {
    if (data === '') {
      this.filteredCharacters$.next(this.charactersFetched$.value);
      console.log('Empty string');
      return;
    }
    const searchValue = new RegExp(data.toLocaleLowerCase());
    console.log('Search in Service: ', data);
    const subs = this.charactersFetched$
      .pipe(
        map((characters) =>
          characters.filter((character) => {
            return searchValue.test(character.name.toLocaleLowerCase());
          })
        )
      )
      .subscribe((value) => this.filteredCharacters$.next(value));
    subs.unsubscribe();
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
