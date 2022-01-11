import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LetterComponent } from './components/letter/letter.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RowComponent } from './components/row/row.component';

@NgModule({
  declarations: [AppComponent, LetterComponent, RowComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
