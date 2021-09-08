import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlbumJoinCancionComponent } from './album-join-cancion.component';
import { TestingModule } from '@testing/testing.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AlbumJoinCancionComponent', () => {
  let component: AlbumJoinCancionComponent;
  let fixture: ComponentFixture<AlbumJoinCancionComponent>;

  const toastrServiceSpy = jasmine.createSpyObj('AlbumJoinCancionComponent', [
    'success',
    'error'
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AlbumJoinCancionComponent],
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
    fixture = TestBed.createComponent(AlbumJoinCancionComponent);
    component = fixture.componentInstance;

    component.albumCancionForm = new FormGroup({
      tituloAlbum: new FormControl('tituloAlbum'),
      idCancion: new FormControl('idCancion'),
      tituloCancion: new FormControl('tituloCancion')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
