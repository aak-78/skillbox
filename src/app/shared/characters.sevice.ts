import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CharacterInterface } from './character.interface';
import { BehaviorSubject, Subject, Subscriber, catchError, filter, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  baseUrl = 'https://akabab.github.io/starwars-api/api';
  routeAll = '/all.json';
  routeId = '/id';
  characters$ = new BehaviorSubject<CharacterInterface[]>([]);

  constructor(private http: HttpClient) {}

  getAllCharacters() {
    const req = this.http
      .get<CharacterInterface[]>(this.baseUrl + this.routeAll)
      .pipe(retry(5), catchError(this.handleError))
      .subscribe((data) => this.characters$.next(data));
  }

  searchCharacter(data: string) {
    console.log('Search in Service: ', data);
    const subscription$ = this.characters$.pipe(
      filter((el, i) => el[i].name === data)
    );
    subscription$.subscribe(data => this.characters$.next(data))
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
