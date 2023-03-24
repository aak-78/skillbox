import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page404',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` <h1>404 erorr... page not found</h1>
    <p>Поворачивай назад, выход <a routerLink="/list/1">тут</a></p>`,
  styles: [
    '*  {font-size: clamp(1rem, calc(0.5rem + 10vw), 3rem); font-weight: bold; text-align: center; padding: 10%} a {color: red; cursor: pointer; padding: 0}',
  ],
})
export class Page404Component {}
