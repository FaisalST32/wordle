import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-letter',
  template: ` <div [class]="state">{{ character }}</div> `,
  styles: [
    `
      div {
        height: 50px;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: white;
        font-family: sans-serif;
        font-weight: bold;
      }
    `,
    `
      .valid {
        background-color: green;
      }
    `,
    `
      .invalid {
        background-color: gray;
      }
    `,
    `
      .mispositioned {
        background-color: #b59f3b;
      }
    `,
    `
      .empty {
        background-color: #000;
      }
    `,
  ],
})
export class LetterComponent {
  @Input('state') state: 'valid' | 'invalid' | 'mispositioned' | 'empty' =
    'valid';
  @Input('character') character: string = '';
}
