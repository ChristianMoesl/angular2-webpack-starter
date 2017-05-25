import { SettingsComponent } from './settings.component';

export const routes = [
  { path: '', children: [
    { path: '', component: SettingsComponent },
  //  { path: 'child-detail', loadChildren: './+child-detail#ChildDetailModule' }
  ]},
];
