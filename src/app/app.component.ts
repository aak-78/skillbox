import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CharactersListComponent } from './components/characters-list/characters-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CharactersListComponent, RouterModule],
})
export class AppComponent {}
