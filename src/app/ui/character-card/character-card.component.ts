import { CardsService } from '../../shared/cards.service';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardInterface } from '../../shared/card.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() card: CardInterface = {
    id: 0,
    name: '',
    height: 0,
    mass: 0,
    gender: '',
    homeworld: '',
    wiki: '',
    image: '',
    born: 0,
    bornLocation: '',
    died: 0,
    diedLocation: '',
    species: '',
    hairColor: '',
    eyeColor: '',
    skinColor: '',
    cybernetics: '',
    affiliations: [],
    masters: [],
    apprentices: [],
    formerAffiliations: [],
  };
  @Input() index: number = 0;
  @Input() currentPage: number = 0;
  @Input() search: string = '';

  public handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
    console.log('Image replace');
  }

  constructor(public cService: CardsService) {}
}
