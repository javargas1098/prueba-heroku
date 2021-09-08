import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionListComponent } from './cancion-list/cancion-list.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { CancionDetailComponent } from './cancion-detail/cancion-detail.component';
import { CancionCreateComponent } from './cancion-create/cancion-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CancionEditComponent } from './cancion-edit/cancion-edit.component';
import { CancionShareComponent } from './cancion-share/cancion-share.component';
import { CancionUserFilterPipe } from './cancion-share/pipes/cancion-user-filter.pipe';

@NgModule({
  declarations: [
    CancionListComponent,
    CancionDetailComponent,
    CancionCreateComponent,
    CancionEditComponent,
    CancionShareComponent,
    CancionUserFilterPipe
  ],
  imports: [CommonModule, AppHeaderModule, ReactiveFormsModule, FormsModule],
  exports: [
    CancionListComponent,
    CancionDetailComponent,
    CancionCreateComponent,
    CancionEditComponent
  ]
})
export class CancionModule {}
