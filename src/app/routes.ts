import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { Page404Component } from './shared/page404.component';
import { CardListResolver } from './shared/card-list.resolver';
import { CardDetailResolver } from './shared/card-detail.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full',
      },
      {
        path: ':p',
        resolve: { CardListResolver },
        loadComponent: () =>
          import('./components/characters-list/characters-list.component').then(
            (mod) => mod.CharactersListComponent
          ),
      },
      {
        path: 'detail/:id',
        resolve: { CardDetailResolver },
        loadComponent: () =>
          import('./components/character-info/character-detail.component').then(
            (mod) => mod.CharacterInfoComponent
          ),
      },
    ],
  },
  {
    path: '**',
    component: Page404Component,
  },
  // ...
];
