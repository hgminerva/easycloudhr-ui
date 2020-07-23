// Angular Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Router
import { SecurityRoutingActivate } from './security-routing.activate';

// Components
import { SecurityComponent } from './security.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', canActivate: [SecurityRoutingActivate], component: SecurityComponent,
    children: [
      { path: '', canActivate: [SecurityRoutingActivate], component: SecurityComponent },
      { path: 'login', canActivate: [SecurityRoutingActivate], component: LoginComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
