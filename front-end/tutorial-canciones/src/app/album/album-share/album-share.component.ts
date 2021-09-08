import { Component, OnInit } from '@angular/core';
import { Album } from '../album';
import { AlbumService } from '../album.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '@app/usuario/usuario';

@Component({
  selector: 'app-album-share',
  templateUrl: './album-share.component.html',
  styleUrls: ['./album-share.component.css']
})
export class AlbumShareComponent implements OnInit {
  userId: number;
  token: string;
  albumId: number;
  usuarios: Usuario[] = [];
  userSearch: string;

  constructor(
    private albumService: AlbumService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (
      !parseInt(this.router.snapshot.params.userId, 10) ||
      this.router.snapshot.params.userToken === ' '
    ) {
      this.showError(
        'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
      );
    } else {
      this.userId = parseInt(this.router.snapshot.params.userId, 10);
      this.albumId = parseInt(this.router.snapshot.params.albumId, 10);
      this.token = this.router.snapshot.params.userToken;

      const usuarios = await this.albumService
        .getUsuariosDisponibles(this.albumId)
        .toPromise();

      this.usuarios = usuarios.filter((item: any) => item.id !== this.userId);
    }
  }

  public showError(error: string): void {
    this.toastr.error(error, 'Error');
  }

  public showWarning(warning: string): void {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  public showSuccess(album: Album): void {
    this.toastr.success(
      `El album ${album.titulo} fue compartido`,
      'Compartido exitosamente'
    );
  }

  public cancelShare(): void {
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`]);
  }

  public compartirAlbum(usuarioDestinoId: number): void {
    this.albumService
      .compartirAlbum(
        this.userId,
        this.token,
        this.router.snapshot.params.albumId,
        usuarioDestinoId
      )
      .subscribe(
        (album) => {
          this.showSuccess(album);
          this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`]);
        },
        (error) => {
          if (error.statusText === 'UNAUTHORIZED') {
            this.showWarning(
              'Su sesión ha caducado, por favor vuelva a iniciar sesión.'
            );
          } else if (error.statusText === 'UNPROCESSABLE ENTITY') {
            this.showError(
              'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
            );
          } else {
            this.showError('Ha ocurrido un error. ' + error.message);
          }
        }
      );
  }
}
