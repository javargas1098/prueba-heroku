import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../usuario/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CancionService } from '../cancion.service';
import { Cancion } from '../cancion';

@Component({
  selector: 'app-cancion-share',
  templateUrl: './cancion-share.component.html',
  styleUrls: ['./cancion-share.component.css']
})
export class CancionShareComponent implements OnInit {
  userId: number;
  token: string;
  cancionId: number;
  usuarios: Usuario[] = [];
  userSearch: string;

  constructor(
    private cancionService: CancionService,
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
      this.cancionId = parseInt(this.router.snapshot.params.cancionId, 10);
      this.token = this.router.snapshot.params.userToken;

      const usuarios = await this.cancionService
        .getUsuariosDisponibles(this.cancionId)
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

  public showSuccess(cancion: Cancion): void {
    this.toastr.success(
      `La canción ${cancion.titulo} fue compartida`,
      'Compartida exitosamente'
    );
  }

  public cancelShare(): void {
    this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`]);
  }

  public compartirAlbum(usuarioDestinoId: number): void {
    this.cancionService
      .compartirCancion(
        this.userId,
        this.token,
        this.router.snapshot.params.cancionId,
        usuarioDestinoId
      )
      .subscribe(
        (cancion) => {
          this.showSuccess(cancion);
          this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`]);
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
