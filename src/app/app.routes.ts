import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [


  { path: '', component: LoginComponent },
  { path: 'dashboard', component: MainLayoutComponent },
];
