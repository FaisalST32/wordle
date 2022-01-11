import { Component, HostListener } from '@angular/core';
import { LetterType } from './components/row/row.component';
import { WordleService } from './services/wordle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private wordle: string = '';
  activeRowIndex: number = 0;
  activeColumnIndex: number = 0;
  rows: LetterType[][] = [
    generateEmptyRow(),
    generateEmptyRow(),
    generateEmptyRow(),
    generateEmptyRow(),
    generateEmptyRow(),
    generateEmptyRow(),
  ];

  constructor(private wordleService: WordleService) {
    this.wordle = wordleService.generateWordle();
    console.log(this.wordle);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    console.log(event);
    const keyPressed = event.key;
    const isAlphabetKey: boolean = new RegExp(/^[a-z]$/).test(keyPressed);
    if (isAlphabetKey) {
      this.rows[this.activeRowIndex][this.activeColumnIndex].character =
        event.key.toUpperCase();
      this.activeColumnIndex++;
      return;
    }
    const isEnterKey = keyPressed.toLowerCase() === 'enter';
    if (isEnterKey) {
      const currentRow = this.rows[this.activeRowIndex];
      const isCurrentRowFilled = this.rows[this.activeRowIndex].every(
        (letter) => letter.character !== ''
      );
      if (!isCurrentRowFilled) {
        return;
      }

      const updatedRow = this.validateLetters(currentRow, this.wordle);
      if (updatedRow.every((letter) => letter.state === 'valid')) {
        alert('Yay! You have won');
      }
      this.rows[this.activeRowIndex] = updatedRow;
      this.activeRowIndex++;
      this.activeColumnIndex = 0;
      return;
    }

    const isBackspaceKey = keyPressed.toLowerCase() === 'backspace';
    if (isBackspaceKey) {
      if (this.activeColumnIndex === 0) {
        return;
      }
      this.activeColumnIndex--;
      this.rows[this.activeRowIndex][this.activeColumnIndex].character = '';
      return;
    }
  }

  validateLetters(rowToValidate: LetterType[], wordle: string): LetterType[] {
    const wordleArray: string[] = wordle.split('');
    const updatedRow: LetterType[] = [...rowToValidate];
    for (let i = 0; i < updatedRow.length; i++) {
      if (updatedRow[i].character === wordleArray[i]) {
        updatedRow[i].state = 'valid';
        wordleArray[i] = '0';
      } else if (wordleArray.includes(updatedRow[i].character)) {
        updatedRow[i].state = 'mispositioned';
        wordleArray[wordleArray.indexOf(updatedRow[i].character)] = '0';
      } else {
        updatedRow[i].state = 'invalid';
      }
    }
    return updatedRow;
  }
}

const generateEmptyRow = (): LetterType[] => [
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
  {
    character: '',
    state: 'empty',
  },
];
