import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancionCreateComponent } from './cancion-create.component';
import { TestingModule } from '@testing/testing.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CancionCreateComponent', () => {
  let component: CancionCreateComponent;
  let fixture: ComponentFixture<CancionCreateComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('CancionCreateComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CancionCreateComponent],
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
    fixture = TestBed.createComponent(CancionCreateComponent);
    component = fixture.componentInstance;

    component.cancionForm = new FormGroup({
      titulo: new FormControl('titulo'),
      minutos: new FormControl('minutos'),
      segundos: new FormControl('segundos'),
      interprete: new FormControl('interprete'),
      genero: new FormControl('genero')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
