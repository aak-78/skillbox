import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../shared/characters.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  pagesArray: number[] = [];
  subs: Subscription;

  constructor(public cService: CharactersService) {
    this.subs = cService.totalPages$.subscribe((value) => {
      this.pagesArray = [...Array(value).keys()].map((el) => el + 1);
    });
  }

  ngOnInit(): void {
    // this.totalPages = Math.ceil(
    //     this.cardsTotal / this.cardsOnPage
    //   );
    this.pagesArray = [...Array(this.cService.totalPages$.value).keys()].map(
      (el) => el + 1
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes['totalPages'].currentValue);
  }
}
