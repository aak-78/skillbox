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
    private cService: CharactersService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    const character = this.cService.charactersFetched$.value[id];
    console.log('Card info: ', character);
  }
}
