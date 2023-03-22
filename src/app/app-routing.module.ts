import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const ROUTES: Route[] = [
  {
    path: 'list',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/characters-list/characters-list.component').then(
        (mod) => mod.CharactersListComponent
      ),
  },
  {
    path: 'hero',
    loadComponent: () =>
      import('./components/character-info/character-detail.component').then(
        (mod) => mod.CharacterInfoComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/page404.component').then((mod) => mod.Page404Component),
  },
  // ...
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
