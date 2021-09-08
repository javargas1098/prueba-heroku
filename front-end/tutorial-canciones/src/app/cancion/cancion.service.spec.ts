import { TestBed } from '@angular/core/testing';
import { CancionService } from './cancion.service';
import { Cancion } from '@app/cancion/cancion';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

export const mockCancion: Cancion = {
  id: 100,
  titulo: 'Buscando América',
  minutos: 123,
  segundos: 102,
  interprete: 'Metallica',
  genero: 'Rock',
  albumes: []
};

describe('Service: Cancion', () => {
  let service: CancionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CancionService]
    });
    service = TestBed.inject(CancionService);
    // tslint:disable-next-line: deprecation
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide getCancionesAlbum', () => {
    const idAlbum = 100;
    const backUrl = 'http://localhost:5000';
    const token = 'token';
    const url = `${backUrl}/album/${idAlbum}/canciones`;
    // tslint:disable-next-line: deprecation
    service
      .getCancionesAlbum(idAlbum, token)
      .subscribe((canciones: Cancion[]) => {
        expect(canciones).not.toBeNaN();
      });
    const req = httpMock.expectOne(url);

    req.flush(mockCancion);
    expect(req.request.method).toBe('GET');
  });
});
