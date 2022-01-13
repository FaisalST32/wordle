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

  keys: LetterType[][] = generateInitialKeys();

  constructor(private wordleService: WordleService) {
    this.wordle = wordleService.generateWordle();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    const keyPressed = event.key;
    const isAlphabetKey: boolean = new RegExp(/^[a-z]$/).test(keyPressed);
    if (isAlphabetKey && this.activeColumnIndex < 5) {
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
      this.rows[this.activeRowIndex] = [...updatedRow];
      this.keys = [...this.updateKeyboard(updatedRow)];

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

  onClickKey(key: string) {
    this.onKeyUp({ key } as unknown as KeyboardEvent);
  }

  validateLetters(rowToValidate: LetterType[], wordle: string): LetterType[] {
    const wordleArray: string[] = wordle.split('');
    const updatedRow: LetterType[] = [...rowToValidate];
    for (let i = 0; i < updatedRow.length; i++) {
      if (updatedRow[i].character === wordleArray[i]) {
        updatedRow[i].state = 'valid';
        wordleArray[i] = '0';
      }
    }
    for (let i = 0; i < updatedRow.length; i++) {
      if (
        updatedRow[i].state === 'empty' &&
        wordleArray.includes(updatedRow[i].character)
      ) {
        updatedRow[i].state = 'mispositioned';
        wordleArray[wordleArray.indexOf(updatedRow[i].character)] = '0';
      }
    }
    for (let i = 0; i < updatedRow.length; i++) {
      if (updatedRow[i].state === 'empty') {
        updatedRow[i].state = 'invalid';
      }
    }
    return updatedRow;
  }

  updateKeyboard(updatedRow: LetterType[]) {
    const newKeys = [...this.keys];
    for (let i = 0; i < this.keys.length; i++) {
      for (let j = 0; j < this.keys[i].length; j++) {
        const foundLetter = updatedRow.find(
          (l) =>
            l.character.toLowerCase() === newKeys[i][j].character.toLowerCase()
        );
        if (foundLetter) {
          if (
            foundLetter.state === 'invalid' &&
            newKeys[i][j].state !== 'empty'
          ) {
            continue;
          }
          newKeys[i][j].state = foundLetter.state;
        }
      }
    }
    return newKeys;
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

const generateInitialKeys = (): LetterType[][] => {
  const keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
  ];
  return keyRows.map((row) =>
    row.map((key) => ({
      character: key,
      state: 'empty',
    }))
  );
};
