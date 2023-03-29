import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardsService } from '../../shared/cards.service';
import { CardInterface } from '../../shared/card.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterInfoComponent implements OnInit {
  subs!: Subscription;
  currentPage: number = 0;
  search: string = '';
  id: number = 0;
  cards: CardInterface[] = [];

  card: CardInterface = {
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

  constructor(public cService: CardsService) {}

  ngOnInit(): void {
    this.subs = this.cService.card$.subscribe((value) => (this.card = value));
    this.subs = this.cService.currentPage$.subscribe((value) => {
      this.currentPage = value;
    });
    this.subs = this.cService.searchRequest$.subscribe(
      (value) => (this.search = value)
    );
    // this.subs = this.cService.id$.subscribe(
    //   (value) => {
    //     this.id = value;
    //   this.card = this.cards[this.id]}
    // );
  }
}
