import { TestBed } from '@angular/core/testing';
import { AlbumService } from './album.service';
import { Album } from '@app/album/album';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

export const mockAlbum: Album = {
  id: 100,
  titulo: 'Buscando América',
  anio: 1923,
  descripcion: 'Descriptionn',
  medio: { llave: 'key', valor: 183 },
  genero: 'Pop',
  usuario: 19283,
  interpretes: [],
  canciones: []
};

describe('Service: Album', () => {
  let service: AlbumService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlbumService]
    });
    service = TestBed.inject(AlbumService);
    // tslint:disable-next-line: deprecation
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide getAlbumes', () => {
    const usuario = 124123;
    const backUrl = 'http://localhost:5000';
    const token = 'token';
    const url = `${backUrl}/usuario/${usuario}/albumes`;
    // tslint:disable-next-line: deprecation
    service.getAlbumes(usuario, token).subscribe((albumes: Album[]) => {
      expect(albumes).not.toBeNaN();
    });
    const req = httpMock.expectOne(url);

    req.flush(mockAlbum);
    expect(req.request.method).toBe('GET');
  });
});
