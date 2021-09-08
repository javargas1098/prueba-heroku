import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { AlbumJoinCancionComponent } from './album-join-cancion/album-join-cancion.component';
import { AlbumShareComponent } from './album-share/album-share.component';
import { AlbumUserFilterPipe } from './album-share/pipes/album-user-filter.pipe';

@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumDetailComponent,
    AlbumCreateComponent,
    AlbumEditComponent,
    AlbumJoinCancionComponent,
    AlbumShareComponent,
    AlbumUserFilterPipe
  ],
  imports: [CommonModule, ReactiveFormsModule, AppHeaderModule, FormsModule],
  exports: [
    AlbumListComponent,
    AlbumDetailComponent,
    AlbumCreateComponent,
    AlbumEditComponent,
    AlbumJoinCancionComponent
  ]
})
export class AlbumModule {}
