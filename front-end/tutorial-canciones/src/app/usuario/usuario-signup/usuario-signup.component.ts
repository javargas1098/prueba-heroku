import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-usuario-signup',
  templateUrl: './usuario-signup.component.html',
  styleUrls: ['./usuario-signup.component.css']
})
export class UsuarioSignupComponent implements OnInit {
  helper: JwtHelperService = new JwtHelperService();
  usuarioForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      password: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.minLength(4)]
      ],
      confirmPassword: [
        '',
        [Validators.required, Validators.maxLength(50), Validators.minLength(4)]
      ]
    });
  }

  public registrarUsuario(): void {
    this.usuarioService
      .userSignUp(
        this.usuarioForm.get('nombre')?.value,
        this.usuarioForm.get('password')?.value
      )
      .subscribe(
        (res) => {
          const decodedToken = this.helper.decodeToken(res.token);
          this.router.navigate([`/albumes/${decodedToken.sub}/${res.token}`]);
          this.showSuccess();
        },
        (error) => {
          this.showError(`Ha ocurrido un error: ${error.message}`);
        }
      );
  }

  public showError(error: string): void {
    this.toastr.error(error, 'Error');
  }

  public showSuccess(): void {
    this.toastr.success(`Se ha registrado exitosamente`, 'Registro exitoso');
  }
}
