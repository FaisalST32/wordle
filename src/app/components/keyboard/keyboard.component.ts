import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LetterType } from '../row/row.component';

@Component({
  selector: 'app-keyboard',
  template: `
    <div class="keyboard">
      <app-letter
        [state]="key.state"
        [character]="key.character"
        [isKey]="true"
        (clicked)="onClickKey($event)"
        *ngFor="let key of keys"
      ></app-letter>
    </div>
  `,
  styles: [
    `
      .keyboard {
        display: flex;
        width: 600px;
        flex-flow: row wrap;
        gap: 10px;
        justify-content: center;
        /* margin: auto; */
        margin: 5px auto;
      }
    `,
  ],
})
export class KeyboardComponent {
  @Input() keys: LetterType[] = [];
  @Output() keyClicked: EventEmitter<string> = new EventEmitter();
  onClickKey(event: string) {
    this.keyClicked.emit(event);
  }
}
