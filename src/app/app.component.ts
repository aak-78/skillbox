import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CharactersListComponent } from './components/characters-list/characters-list.component';
import { FetchErorrComponent } from './ui/fetch-error/fetch-error.component';
import { CharactersService } from './shared/characters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CharactersListComponent, RouterModule, FetchErorrComponent, CommonModule],
})
export class AppComponent {
  constructor(public cService: CharactersService) {}
}
