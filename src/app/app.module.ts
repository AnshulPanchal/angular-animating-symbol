import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { AnimatingSymbolComponent } from './animating-symbol/animating-symbol.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, AnimatingSymbolComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
