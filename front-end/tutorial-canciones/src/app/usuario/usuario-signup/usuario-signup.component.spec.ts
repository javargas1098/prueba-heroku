import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsuarioSignupComponent } from './usuario-signup.component';
import { TestingModule } from '@testing/testing.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UsuarioSignupComponent', () => {
  let component: UsuarioSignupComponent;
  let fixture: ComponentFixture<UsuarioSignupComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('UsuarioSignupComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UsuarioSignupComponent],
        imports: [TestingModule, FormsModule, ReactiveFormsModule],
        providers: [
          {
            provide: ToastrService,
            useValue: toastrServiceSpy
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioSignupComponent);
    component = fixture.componentInstance;

    component.usuarioForm = new FormGroup({
      nombre: new FormControl('nombre'),
      password: new FormControl('password'),
      confirmPassword: new FormControl('confirmPassword')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
