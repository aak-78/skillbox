import { Component } from '@angular/core';

@Component({
  selector: 'app-fetcherror',
  standalone: true,
  template: `<p>Все сломали до нас... надо ждать когда починят.</p>
    <p>Приходи завтра.</p>`,
  styles: [
    '* {font-size: clamp(1rem, calc(0.5rem + 5vw), 3rem); font-weight: bold; text-align: center; padding-inline: 2rem;}',
  ],
})
export class FetchErorrComponent {}
