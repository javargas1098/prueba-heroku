import { Component, OnInit } from '@angular/core';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.css']
})
export class CancionListComponent implements OnInit {
  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  userId: number;
  token: string;
  canciones: Array<Cancion>;
  mostrarCanciones: Array<Cancion>;
  cancionSeleccionada: Cancion;
  indiceSeleccionado: number = 0;

  ngOnInit(): void {
    if (
      !parseInt(this.router.snapshot.params.userId, 10) ||
      this.router.snapshot.params.userToken === ' '
    ) {
      this.showError(
        'No hemos podido identificarlo, por favor vuelva a iniciar sesión.'
      );
    } else {
      this.userId = parseInt(this.router.snapshot.params.userId, 10);
      this.token = this.router.snapshot.params.userToken;
      this.getCanciones();
    }
  }

  getCanciones(): void {
    this.cancionService.getCanciones(this.userId).subscribe((canciones) => {
      this.canciones = canciones;
      this.mostrarCanciones = canciones;
      if (canciones.length > 0) {
        this.onSelect(this.mostrarCanciones[0], 0);
      }
    });
  }

  public onSelect(cancion: Cancion, indice: number): void {
    this.indiceSeleccionado = indice;
    this.cancionSeleccionada = cancion;
    this.cancionService.getAlbumesCancion(cancion.id).subscribe(
      (albumes) => {
        this.cancionSeleccionada.albumes = albumes;
      },
      (error) => {
        this.showError(`Ha ocurrido un error: ${error.message}`);
      }
    );
  }

  public buscarCancion(busqueda: string): void {
    const cancionesBusqueda: Array<Cancion> = [];
    this.canciones.map((cancion) => {
      if (
        cancion.titulo
          .toLocaleLowerCase()
          .includes(busqueda.toLocaleLowerCase())
      ) {
        cancionesBusqueda.push(cancion);
      }
    });
    this.mostrarCanciones = cancionesBusqueda;
  }

  public eliminarCancion(): void {
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id).subscribe(
      (cancion) => {
        this.ngOnInit();
        this.showSuccess();
      },
      (error) => {
        this.showError('Ha ocurrido un error. ' + error.message);
      }
    );
  }

  public irCrearCancion(): void {
    this.routerPath.navigate([
      `/canciones/create/${this.userId}/${this.token}`
    ]);
  }

  public showError(error: string): void {
    this.toastr.error(error, 'Error de autenticación');
  }

  public showSuccess(): void {
    this.toastr.success(`La canción fue eliminada`, 'Eliminada exitosamente');
  }
}
