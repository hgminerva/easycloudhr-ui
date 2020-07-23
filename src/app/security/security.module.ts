// Angular Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Router Modules
import { SecurityRoutingModule } from './security-routing.module';
import { SecurityRoutingActivate } from './security-routing.activate';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Components
import { SecurityComponent } from './security.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    SecurityComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SecurityRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    FlexLayoutModule
  ],
  providers: [
    SecurityRoutingActivate
  ]
})
export class SecurityModule { }
