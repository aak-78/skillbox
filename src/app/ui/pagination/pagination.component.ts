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
export class PaginationComponent implements OnInit {
  pagesArray: number[] = [];
  paramsInQuery: {} = {}
  @Input() currentPage: number = 0;
  @Input() pages: number = 0;
  @Input() search: string = '';

  constructor(public cService: CharactersService) {}

  ngOnInit(): void {
    this.pagesArray = [...Array(this.pages).keys()].map((el) => el + 1);
    console.log("search: ", this.search)
    this.search ? this.paramsInQuery = { 'search': this.search } : null
  }
}
