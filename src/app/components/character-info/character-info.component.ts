import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from '../../shared/characters.service';

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-info.component.html',
  styleUrls: ['./character-info.component.scss'],
})
export class CharacterInfoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    public cService: CharactersService
  ) {}

  ngOnInit(): void {
    // this.cService.getAllCharacters()
    // const id = Number(this.route.snapshot.params['id']);
    // const character = this.cService.charactersFetched$.value
    // console.log('Card info: ', id,  character);
  }
}
