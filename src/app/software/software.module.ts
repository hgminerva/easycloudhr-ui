// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing Module
import { SoftwareRoutingModule } from './software-routing.module';

// Components
import { SoftwareComponent } from './software.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';

// Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    SoftwareComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SoftwareRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    FlexLayoutModule
  ]
})
export class SoftwareModule { }
