import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlbumEditComponent } from './album-edit.component';
import { TestingModule } from '@testing/testing.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AlbumEditComponent', () => {
  let component: AlbumEditComponent;
  let fixture: ComponentFixture<AlbumEditComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('AlbumEditComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AlbumEditComponent],
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
    fixture = TestBed.createComponent(AlbumEditComponent);
    component = fixture.componentInstance;

    component.albumForm = new FormGroup({
      titulo: new FormControl('titulo'),
      anio: new FormControl('anio'),
      descripcion: new FormControl('descripcion'),
      medio: new FormControl('medio'),
      genero: new FormControl('genero')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
