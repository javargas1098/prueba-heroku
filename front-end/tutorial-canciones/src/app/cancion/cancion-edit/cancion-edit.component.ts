import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';

@Component({
  selector: 'app-cancion-edit',
  templateUrl: './cancion-edit.component.html',
  styleUrls: ['./cancion-edit.component.css']
})
export class CancionEditComponent implements OnInit {
  userId: number;
  token: string;
  cancionId: number;
  cancionForm!: FormGroup;

  constructor(
    private cancionService: CancionService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routerPath: Router,
    private toastr: ToastrService
  ) {}

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
      this.cancionService
        .getCancion(this.router.snapshot.params.cancionId)
        .subscribe((cancion) => {
          this.cancionId = cancion.id;
          this.cancionForm = this.formBuilder.group({
            titulo: [
              cancion.titulo,
              [Validators.required, Validators.maxLength(128)]
            ],
            minutos: [
              cancion.minutos,
              [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
                Validators.maxLength(2)
              ]
            ],
            segundos: [
              cancion.segundos,
              [
                Validators.required,
                Validators.pattern('^[0-9]*$'),
                Validators.maxLength(2)
              ]
            ],
            interprete: [
              cancion.interprete,
              [Validators.required, Validators.maxLength(128)]
            ],
            genero: [
              cancion.genero,
              [Validators.required, Validators.maxLength(100)]
            ]
          });
        });
    }
  }

  public cancelCreate(): void {
    this.cancionForm.reset();
    this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`]);
  }

  public editarCancion(newCancion: Cancion): void {
    this.cancionForm
      .get('minutos')
      ?.setValue(parseInt(this.cancionForm.get('minutos')?.value, 10));
    this.cancionForm
      .get('segundos')
      ?.setValue(parseInt(this.cancionForm.get('segundos')?.value, 10));
    this.cancionService.editarCancion(newCancion, this.cancionId).subscribe(
      (cancion) => {
        this.showSuccess(cancion);
        this.cancionForm.reset();
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

  public showError(error: string): void {
    this.toastr.error(error, 'Error');
  }

  public showWarning(warning: string): void {
    this.toastr.warning(warning, 'Error de autenticación');
  }

  public showSuccess(cancion: Cancion): void {
    this.toastr.success(
      `La canción ${cancion.titulo} fue editada`,
      'Edición exitosa'
    );
  }
}
