import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './settings.routes';
import { SettingsComponent } from './settings.component';

console.log('`Detail` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class SettingsModule {
  public static routes = routes;
}
