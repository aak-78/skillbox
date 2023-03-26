import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from '../../shared/cards.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  pagesArray: number[] = [];
  paramsInQuery: {} = {};
  @Input() currentPage: number = 0;
  @Input() pages: number = 0;
  @Input() search: string = '';

  constructor(public cService: CardsService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.paramsInQuery = this.search
      ? (this.paramsInQuery = { search: this.search })
      : {};
  }

  ngOnInit(): void {
    this.pagesArray = [...Array(this.pages).keys()].map((el) => el + 1);
    this.paramsInQuery = this.search
      ? (this.paramsInQuery = { search: this.search })
      : {};
  }
}
