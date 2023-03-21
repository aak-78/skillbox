import { Component } from '@angular/core';

import { CharactersService } from './shared/characters.sevice';
import { CharactersListComponent } from './components/characters-list/characters-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CharactersListComponent]
})
export class AppComponent {
  title = 'skillbox';

  constructor(private cService: CharactersService) {}

  click() {
    this.cService.getAllCharacters();
    console.log(this.cService.characters$);
  }
}
