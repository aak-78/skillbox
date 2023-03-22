import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const ROUTES: Route[] = [
  {
    path: '**',
    loadComponent: () =>
      import('./shared/page404.component').then((mod) => mod.Page404Component),
  },
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/characters-list/characters-list.component').then(
            (mod) => mod.CharactersListComponent
          ),
      },
      {
        path: '/:id',
        loadComponent: () =>
          import('./components/character-info/character-info.component').then(
            (mod) => mod.CharacterInfoComponent
          ),
      },
    ],
  },
  // ...
];
