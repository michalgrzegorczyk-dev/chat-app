import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppComponent } from './app/app.component';


/**
 * Fake ngModule for compatibility with Compodoc v1.1.X , should be fixed in V1.2.X
 */
@NgModule({
  imports: [CommonModule, AppComponent],
})
export class FakeAppModule {}

platformBrowserDynamic().bootstrapModule(FakeAppModule).catch((err) => console.error(err));


