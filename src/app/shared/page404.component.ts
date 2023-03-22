import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page404',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>404 erorr... page not found</p>`,
  styles: [
    'p  {font-size: clamp(1rem, calc(0.5rem + 10vw), 4rem); font-weight: bold; text-align: center; padding-top: 20%}',
  ],
})
export class Page404Component {}
