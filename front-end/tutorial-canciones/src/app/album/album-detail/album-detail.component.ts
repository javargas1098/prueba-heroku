import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from '../album';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  @Input() album: Album;
  @Output() deleteAlbum: EventEmitter<number> = new EventEmitter<number>();

  userId: number;
  token: string;

  constructor(private routerPath: Router, private router: ActivatedRoute) {}

  public ngOnInit(): void {
    this.userId = parseInt(this.router.snapshot.params.userId, 10);
    this.token = this.router.snapshot.params.userToken;
  }

  public goToEdit(): void {
    this.routerPath.navigate([
      `/albumes/edit/${this.album.id}/${this.userId}/${this.token}`
    ]);
  }

  public goToJoinCancion(): void {
    this.routerPath.navigate([
      `/albumes/join/${this.album.id}/${this.userId}/${this.token}`
    ]);
  }

  public compartirAlbum(): void {
    this.routerPath.navigate([
      `/albumes/share/${this.album.id}/${this.userId}/${this.token}`
    ]);
  }

  public eliminarAlbum(): void {
    this.deleteAlbum.emit(this.album.id);
  }
}
