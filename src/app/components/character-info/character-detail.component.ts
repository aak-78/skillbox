import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CharactersService } from '../../shared/characters.service';
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

  constructor(
    private route: ActivatedRoute,
    public cService: CharactersService
  ) {}

  ngOnInit(): void {
    this.subs = this.cService.card$.subscribe((value) => (this.card = value));
    this.subs = this.cService.currentPage$.subscribe(
      (value) => (this.currentPage = value)
    );
    this.subs = this.cService.currentPage$.subscribe(
      (value) => (this.currentPage = value)
    );
    this.subs = this.cService.currentPage$.subscribe(
      (value) => (this.currentPage = value)
    );
    this.subs = this.cService.currentPage$.subscribe(
      (value) => (this.currentPage = value)
    );


  }
}
