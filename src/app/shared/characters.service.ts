import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CharacterInterface } from './character.interface';
import { BehaviorSubject, catchError, retry, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';
  charactersFetched$ = new BehaviorSubject<CharacterInterface[]>([]);
  filteredCharacters$ = new BehaviorSubject<CharacterInterface[]>([]);

  constructor(private http: HttpClient) {}

  getAllCharacters() {
    const req = this.http
      .get<CharacterInterface[]>(this.baseUrl + this.routeAll)
      .pipe(retry(5), catchError(this.handleError))
      .subscribe((data) => {
        this.charactersFetched$.next(data);
        this.filteredCharacters$.next(data);
      });
  }

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

  private handleError(error: HttpErrorResponse) {
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
