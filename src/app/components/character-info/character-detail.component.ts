import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CharactersService } from '../../shared/characters.service';
import { CharacterInterface } from '../../shared/character.interface';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
})
export class CharacterInfoComponent implements OnInit {
  id = 0;
  character: CharacterInterface = {
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
    formerAffiliations: []
  };

  constructor(
    private route: ActivatedRoute,
    public cService: CharactersService
  ) {}

  ngOnInit(): void {
    // this.cService.getAllCharacters()
    // const id = Number(this.route.snapshot.params['id']);
    // const character = this.cService.charactersFetched$.value
    // console.log('Card info: ', id,  character);
    this.id = this.route.snapshot.params['id'];
    this.character = this.cService.filteredCharacters$.value[this.id]
    console.log(this.id);
  }
}
