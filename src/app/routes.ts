import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { Page404Component } from './shared/page404.component';
import { CharacterListResolver } from './shared/characters-list.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        resolve: { CharacterListResolver },
        loadComponent: () =>
          import('./components/characters-list/characters-list.component').then(
            (mod) => mod.CharactersListComponent
          ),
      },
      {
        path: ':id/detail',
        resolve: { CharacterListResolver },
        loadComponent: () =>
          import('./components/character-info/character-info.component').then(
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
